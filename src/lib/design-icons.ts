import {
  ChefHat,
  Bath,
  Bed,
  Sofa,
  Utensils,
  Home,
  DoorOpen,
  Tv,
  Laptop,
  Shirt,
  Trees,
  Car,
  Paintbrush,
  LucideIcon
} from 'lucide-react'

export type AreaType =
  | 'KITCHEN'
  | 'BATHROOM'
  | 'MASTER_BATHROOM'
  | 'GUEST_BATHROOM'
  | 'LIVING_ROOM'
  | 'DINING_ROOM'
  | 'BEDROOM'
  | 'MASTER_BEDROOM'
  | 'ENTRANCE'
  | 'HALLWAY'
  | 'OFFICE'
  | 'LAUNDRY'
  | 'OUTDOOR'
  | 'PATIO'
  | 'GARAGE'
  | 'OTHER'

export interface AreaIconInfo {
  icon: LucideIcon
  color: string
  bgColor: string
  label: string
  labelEs: string
  description: string
}

export const DESIGN_AREA_ICONS: Record<AreaType, AreaIconInfo> = {
  KITCHEN: {
    icon: ChefHat,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    label: 'Kitchen',
    labelEs: 'Cocina',
    description: 'Grifería, fregaderos, superficies'
  },
  BATHROOM: {
    icon: Bath,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'Bathroom',
    labelEs: 'Baño',
    description: 'Grifería, lavamanos, inodoros, duchas'
  },
  MASTER_BATHROOM: {
    icon: Bath,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    label: 'Master Bathroom',
    labelEs: 'Baño Principal',
    description: 'Grifería premium, tina, doble lavamanos'
  },
  GUEST_BATHROOM: {
    icon: Bath,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    label: 'Guest Bathroom',
    labelEs: 'Baño de Visitas',
    description: 'Grifería, lavamanos, inodoro'
  },
  LIVING_ROOM: {
    icon: Sofa,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    label: 'Living Room',
    labelEs: 'Sala',
    description: 'Pisos, iluminación, herrajes'
  },
  DINING_ROOM: {
    icon: Utensils,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    label: 'Dining Room',
    labelEs: 'Comedor',
    description: 'Pisos, iluminación'
  },
  BEDROOM: {
    icon: Bed,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    label: 'Bedroom',
    labelEs: 'Habitación',
    description: 'Pisos, cerraduras, herrajes'
  },
  MASTER_BEDROOM: {
    icon: Bed,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    label: 'Master Bedroom',
    labelEs: 'Habitación Principal',
    description: 'Pisos premium, cerraduras, herrajes'
  },
  ENTRANCE: {
    icon: DoorOpen,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    label: 'Entrance',
    labelEs: 'Entrada',
    description: 'Puertas, cerraduras, herrajes'
  },
  HALLWAY: {
    icon: Home,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    label: 'Hallway',
    labelEs: 'Pasillo',
    description: 'Pisos, iluminación'
  },
  OFFICE: {
    icon: Laptop,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    label: 'Office',
    labelEs: 'Oficina',
    description: 'Pisos, cerraduras, iluminación'
  },
  LAUNDRY: {
    icon: Shirt,
    color: 'text-sky-600',
    bgColor: 'bg-sky-100',
    label: 'Laundry',
    labelEs: 'Lavandería',
    description: 'Grifería, pisos resistentes'
  },
  OUTDOOR: {
    icon: Trees,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Outdoor',
    labelEs: 'Exterior',
    description: 'Herrajes exteriores, iluminación'
  },
  PATIO: {
    icon: Trees,
    color: 'text-lime-600',
    bgColor: 'bg-lime-100',
    label: 'Patio',
    labelEs: 'Patio',
    description: 'Pisos exteriores, iluminación'
  },
  GARAGE: {
    icon: Car,
    color: 'text-zinc-600',
    bgColor: 'bg-zinc-100',
    label: 'Garage',
    labelEs: 'Garaje',
    description: 'Puertas, cerraduras, pisos'
  },
  OTHER: {
    icon: Paintbrush,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    label: 'Other',
    labelEs: 'Otro',
    description: 'Área personalizada'
  }
}

export function getAreaIcon(areaType: AreaType): AreaIconInfo {
  return DESIGN_AREA_ICONS[areaType] || DESIGN_AREA_ICONS.OTHER
}

export function getAreaColor(areaType: AreaType): string {
  return getAreaIcon(areaType).color
}

export function getAreaBgColor(areaType: AreaType): string {
  return getAreaIcon(areaType).bgColor
}

export function getAreaLabel(areaType: AreaType, language: 'en' | 'es' = 'es'): string {
  const info = getAreaIcon(areaType)
  return language === 'es' ? info.labelEs : info.label
}

export type AreaStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'SPECIFICATION_COMPLETE'
  | 'REVIEWED'
  | 'APPROVED'
  | 'SKIPPED'

export interface StatusInfo {
  label: string
  color: string
  bgColor: string
  textColor: string
}

export const AREA_STATUS_INFO: Record<AreaStatus, StatusInfo> = {
  NOT_STARTED: {
    label: 'No Iniciado',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700'
  },
  IN_PROGRESS: {
    label: 'En Progreso',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700'
  },
  SPECIFICATION_COMPLETE: {
    label: 'Especificación Completa',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700'
  },
  REVIEWED: {
    label: 'Revisado',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700'
  },
  APPROVED: {
    label: 'Aprobado',
    color: 'emerald',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700'
  },
  SKIPPED: {
    label: 'Omitido',
    color: 'orange',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700'
  }
}

export function getStatusInfo(status: AreaStatus): StatusInfo {
  return AREA_STATUS_INFO[status] || AREA_STATUS_INFO.NOT_STARTED
}
