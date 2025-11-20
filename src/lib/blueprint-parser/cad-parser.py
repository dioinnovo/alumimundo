#!/usr/bin/env python3
"""
CAD Parser Library for Alumimundo
Uses ezdxf to parse DWG/DXF files and extract door entities

Installation:
    pip install ezdxf

Usage:
    python cad-parser.py <file.dxf> [--output json]
"""

import sys
import json
import re
from typing import List, Dict, Any, Optional, Tuple
from pathlib import Path

try:
    import ezdxf
    from ezdxf.document import Drawing
    from ezdxf.entities import Insert, Text, MText, Line, Arc, Circle
except ImportError:
    print("Error: ezdxf not installed. Run: pip install ezdxf", file=sys.stderr)
    sys.exit(1)


class DoorEntity:
    """Represents a detected door from CAD drawing"""

    def __init__(self):
        self.mark: Optional[str] = None
        self.door_type: Optional[str] = None
        self.floor: Optional[str] = None
        self.area: Optional[str] = None
        self.width_cm: Optional[float] = None
        self.height_cm: Optional[float] = None
        self.x: Optional[float] = None
        self.y: Optional[float] = None
        self.rotation: Optional[float] = None
        self.layer: Optional[str] = None
        self.block_name: Optional[str] = None
        self.confidence: float = 0.5

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON output"""
        return {
            "mark": self.mark,
            "doorType": self.door_type,
            "floor": self.floor,
            "area": self.area,
            "fullLocation": f"{self.floor or 'F1'} - {self.area or 'Unknown'} - {self.mark or 'DOOR-X'}",
            "width": f"{self.width_cm}cm" if self.width_cm else None,
            "height": f"{self.height_cm}cm" if self.height_cm else None,
            "drawingX": self.x,
            "drawingY": self.y,
            "rotation": self.rotation,
            "layer": self.layer,
            "blockName": self.block_name,
            "confidence": self.confidence
        }


class CADParser:
    """Parser for DXF/DWG architectural drawings"""

    # Common door block names in AutoCAD/Revit
    DOOR_BLOCK_PATTERNS = [
        r".*door.*",
        r".*puerta.*",
        r".*dr.*",
        r".*pt.*",
        r"A-DOOR.*",
        r"DOOR-.*"
    ]

    # Common door layer names
    DOOR_LAYER_PATTERNS = [
        r".*door.*",
        r".*puerta.*",
        r"A-DOOR.*",
        r"ARCH-DOOR.*"
    ]

    def __init__(self, dxf_path: str):
        """Initialize parser with DXF file path"""
        self.dxf_path = Path(dxf_path)

        if not self.dxf_path.exists():
            raise FileNotFoundError(f"File not found: {dxf_path}")

        # Load DXF document
        try:
            self.doc: Drawing = ezdxf.readfile(str(self.dxf_path))
            self.modelspace = self.doc.modelspace()
        except Exception as e:
            raise RuntimeError(f"Failed to parse DXF file: {e}")

    def parse(self) -> List[DoorEntity]:
        """Parse DXF and extract all door entities"""
        doors: List[DoorEntity] = []

        # Strategy 1: Find door blocks (INSERT entities)
        doors.extend(self._find_door_blocks())

        # Strategy 2: Find door symbols by geometry (arc + line patterns)
        doors.extend(self._find_door_symbols())

        # Strategy 3: Find door annotations (text near door marks)
        self._enrich_with_annotations(doors)

        return doors

    def _find_door_blocks(self) -> List[DoorEntity]:
        """Find doors by detecting block inserts with door-like names"""
        doors: List[DoorEntity] = []

        for insert in self.modelspace.query("INSERT"):
            block_name = insert.dxf.name

            # Check if block name matches door patterns
            if self._is_door_block(block_name):
                door = DoorEntity()
                door.block_name = block_name
                door.layer = insert.dxf.layer
                door.x = insert.dxf.insert.x
                door.y = insert.dxf.insert.y
                door.rotation = insert.dxf.rotation if hasattr(insert.dxf, "rotation") else None
                door.confidence = 0.8  # High confidence for named blocks

                # Try to extract dimensions from block attributes
                self._extract_block_attributes(insert, door)

                # Classify door type from block name
                door.door_type = self._classify_door_type(block_name, door.layer)

                doors.append(door)

        return doors

    def _find_door_symbols(self) -> List[DoorEntity]:
        """Find doors by detecting geometric patterns (arc + line = door swing)"""
        doors: List[DoorEntity] = []

        # Get all arcs (door swings are typically 90-degree arcs)
        arcs = self.modelspace.query("ARC")

        for arc in arcs:
            # Check if arc looks like a door swing (90 degrees, reasonable radius)
            start_angle = arc.dxf.start_angle
            end_angle = arc.dxf.end_angle
            angle_span = (end_angle - start_angle) % 360

            # Door swings are typically 90 degrees
            if 80 <= angle_span <= 100:
                radius = arc.dxf.radius

                # Reasonable door width: 60cm - 180cm (23.6" - 70.8")
                if 60 <= radius <= 180:
                    door = DoorEntity()
                    door.x = arc.dxf.center.x
                    door.y = arc.dxf.center.y
                    door.layer = arc.dxf.layer
                    door.width_cm = radius  # Arc radius = door width
                    door.confidence = 0.6  # Medium confidence for geometric detection

                    # Try to find associated line (door frame)
                    # Lines near arc center likely represent door frame
                    door.door_type = self._classify_door_type("", door.layer)

                    doors.append(door)

        return doors

    def _enrich_with_annotations(self, doors: List[DoorEntity]):
        """Find text annotations near doors and extract marks, floor, area"""
        texts = list(self.modelspace.query("TEXT")) + list(self.modelspace.query("MTEXT"))

        for door in doors:
            if door.x is None or door.y is None:
                continue

            # Find text within 200 units of door
            nearby_texts = []
            for text in texts:
                text_pos = text.dxf.insert if hasattr(text.dxf, "insert") else None
                if text_pos:
                    distance = ((text_pos.x - door.x) ** 2 + (text_pos.y - door.y) ** 2) ** 0.5
                    if distance < 200:
                        nearby_texts.append(text)

            # Extract mark, floor, area from nearby text
            for text in nearby_texts:
                text_content = text.dxf.text if hasattr(text.dxf, "text") else str(text)

                # Extract door mark patterns
                mark_match = re.search(r"(P-\d+-F\d+|DOOR-\d+|D-\d+|PT-\d+)", text_content, re.IGNORECASE)
                if mark_match:
                    door.mark = mark_match.group(1)

                # Extract floor
                floor_match = re.search(r"F(\d+)|FLOOR\s*(\d+)|PISO\s*(\d+)", text_content, re.IGNORECASE)
                if floor_match:
                    floor_num = floor_match.group(1) or floor_match.group(2) or floor_match.group(3)
                    door.floor = f"F{floor_num}"

                # Extract area/room name
                area_match = re.search(r"(COCINA|HABITACI[OÓ]N|BA[NÑ]O|SALA|COMEDOR|KITCHEN|BEDROOM|BATHROOM|LIVING)",
                                     text_content, re.IGNORECASE)
                if area_match:
                    door.area = area_match.group(1).title()

                # Extract dimensions
                dim_match = re.search(r"(\d+(?:\.\d+)?)\s*[xX×]\s*(\d+(?:\.\d+)?)\s*(cm|mm|m)?", text_content)
                if dim_match:
                    width = float(dim_match.group(1))
                    height = float(dim_match.group(2))
                    unit = dim_match.group(3) or "cm"

                    # Convert to cm
                    if unit == "mm":
                        width /= 10
                        height /= 10
                    elif unit == "m":
                        width *= 100
                        height *= 100

                    door.width_cm = width
                    door.height_cm = height

    def _extract_block_attributes(self, insert: Insert, door: DoorEntity):
        """Extract attributes from block (dimensions, mark, etc.)"""
        if not hasattr(insert, "attribs"):
            return

        for attrib in insert.attribs:
            tag = attrib.dxf.tag.upper()
            value = attrib.dxf.text

            if tag in ["MARK", "TAG", "NUMBER"]:
                door.mark = value
            elif tag in ["WIDTH", "ANCHO"]:
                try:
                    door.width_cm = float(value)
                except ValueError:
                    pass
            elif tag in ["HEIGHT", "ALTO"]:
                try:
                    door.height_cm = float(value)
                except ValueError:
                    pass
            elif tag in ["TYPE", "TIPO"]:
                door.door_type = value

    def _is_door_block(self, block_name: str) -> bool:
        """Check if block name matches door patterns"""
        block_name_lower = block_name.lower()

        for pattern in self.DOOR_BLOCK_PATTERNS:
            if re.match(pattern, block_name_lower):
                return True

        return False

    def _classify_door_type(self, block_name: str, layer: str) -> str:
        """Classify door type from block name or layer"""
        text = (block_name + " " + layer).lower()

        if "exterior" in text or "entrance" in text or "entrada" in text:
            return "EXTERIOR_SINGLE"
        elif "fire" in text or "fuego" in text or "cortafuego" in text:
            return "FIRE_RATED_60MIN"
        elif "double" in text or "doble" in text:
            return "INTERIOR_DOUBLE"
        elif "sliding" in text or "corredera" in text:
            return "SLIDING"
        elif "bifold" in text:
            return "BIFOLD"
        else:
            return "INTERIOR_SINGLE"  # Default

    def get_metadata(self) -> Dict[str, Any]:
        """Extract drawing metadata"""
        header = self.doc.header

        return {
            "filename": self.dxf_path.name,
            "units": header.get("$INSUNITS", "Unknown"),
            "scale": header.get("$DIMSCALE", None),
            "createdWith": header.get("$ACADVER", "Unknown"),
            "layers": [layer.dxf.name for layer in self.doc.layers],
            "blocks": [block.name for block in self.doc.blocks if not block.name.startswith("*")]
        }


def main():
    """CLI entry point"""
    if len(sys.argv) < 2:
        print("Usage: python cad-parser.py <file.dxf> [--output json]")
        sys.exit(1)

    dxf_file = sys.argv[1]
    output_format = "json"  # Default

    if "--output" in sys.argv:
        idx = sys.argv.index("--output")
        if idx + 1 < len(sys.argv):
            output_format = sys.argv[idx + 1]

    try:
        parser = CADParser(dxf_file)

        # Get metadata
        metadata = parser.get_metadata()

        # Parse doors
        doors = parser.parse()

        # Output results
        result = {
            "metadata": metadata,
            "doors": [door.to_dict() for door in doors],
            "totalDoors": len(doors)
        }

        if output_format == "json":
            print(json.dumps(result, indent=2))
        else:
            print(f"Found {len(doors)} doors in {dxf_file}")
            for door in doors:
                print(f"  - {door.mark or 'DOOR-X'}: {door.door_type} at ({door.x}, {door.y})")

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
