/**
 * Specification Document Generator
 * Creates professional CSI MasterFormat-compliant specification documents
 */

import { Product } from './products-data'
import { ProjectCompliance, getComplianceSummary } from './compliance-checker'

export interface SpecificationSection {
  number: string
  title: string
  content: string[]
}

export interface ProjectSpecification {
  projectName: string
  projectType: 'residential' | 'commercial' | 'hotel' | 'institutional'
  location: string
  date: string
  preparedBy: string
  sections: SpecificationSection[]
  products: Product[]
  compliance?: ProjectCompliance
}

/**
 * Generate CSI Division 10 specification sections for selected products
 */
export function generateProductSpecifications(products: Product[]): SpecificationSection[] {
  const sections: SpecificationSection[] = []

  // Group products by CSI division
  const kohlerProducts = products.filter(p => ['KOHLER', 'Kallista'].includes(p.brand))
  const doorProducts = products.filter(p => p.category === 'Puertas')
  const flooringProducts = products.filter(p => ['Pisos', 'Alfombras'].includes(p.category))
  const lockProducts = products.filter(p => p.category === 'Cerraduras')
  const windowProducts = products.filter(p => p.category === 'Persianas')

  // Division 08 - Openings (Doors, Hardware, Windows)
  if (doorProducts.length > 0 || lockProducts.length > 0 || windowProducts.length > 0) {
    sections.push({
      number: '08 00 00',
      title: 'ABERTURAS (DOORS, HARDWARE & WINDOWS)',
      content: generateOpeningsSection(doorProducts, lockProducts, windowProducts)
    })
  }

  // Division 09 - Finishes (Flooring, Ceiling)
  if (flooringProducts.length > 0) {
    sections.push({
      number: '09 00 00',
      title: 'ACABADOS (FINISHES)',
      content: generateFinishesSection(flooringProducts)
    })
  }

  // Division 10 - Specialties (Plumbing Fixtures, Accessories)
  if (kohlerProducts.length > 0) {
    sections.push({
      number: '10 00 00',
      title: 'ESPECIALIDADES - APARATOS SANITARIOS (PLUMBING FIXTURES)',
      content: generatePlumbingSection(kohlerProducts)
    })
  }

  return sections
}

function generateOpeningsSection(
  doors: Product[],
  locks: Product[],
  windows: Product[]
): string[] {
  const content: string[] = []

  content.push('1. PARTE 1 - GENERAL')
  content.push('')
  content.push('1.1 RESUMEN')
  content.push('   A. Sección incluye:')

  if (doors.length > 0) {
    content.push('      1. Puertas comerciales de acero')
    content.push('      2. Marcos y herrajes')
  }
  if (locks.length > 0) {
    content.push('      3. Cerraduras y herrajes de seguridad')
  }
  if (windows.length > 0) {
    content.push('      4. Tratamientos de ventana y sistemas de control')
  }

  content.push('')
  content.push('1.2 REFERENCIAS')
  content.push('   A. NFPA 80 - Standard for Fire Doors and Other Opening Protectives')
  content.push('   B. ANSI/BHMA - Builders Hardware Manufacturers Association')
  content.push('   C. CFIA - Código de Instalaciones de Costa Rica')
  content.push('')

  if (doors.length > 0) {
    content.push('1.3 PUERTAS DE ACERO COMERCIALES')
    doors.forEach(door => {
      content.push(`   A. Fabricante: ${door.brand}`)
      content.push(`   B. Modelo: ${door.sku} - ${door.nameEs || door.name}`)
      content.push(`   C. Descripción: ${door.descriptionEs || door.description}`)
      if (door.specifications.fireRating) {
        content.push(`   D. Resistencia al Fuego: ${door.specifications.fireRating}`)
      }
      if (door.specifications.certifications) {
        content.push(`   E. Certificaciones: ${door.specifications.certifications.join(', ')}`)
      }
      content.push('')
    })
  }

  if (locks.length > 0) {
    content.push('1.4 CERRADURAS Y HERRAJES')
    locks.forEach(lock => {
      content.push(`   A. Fabricante: ${lock.brand}`)
      content.push(`   B. Modelo: ${lock.sku} - ${lock.nameEs || lock.name}`)
      content.push(`   C. Acabado: ${lock.finish || 'Especificar'}`)
      if (lock.specifications.certifications) {
        content.push(`   D. Grado: ${lock.specifications.certifications.join(', ')}`)
      }
      content.push('')
    })
  }

  if (windows.length > 0) {
    content.push('1.5 TRATAMIENTOS DE VENTANA')
    windows.forEach(window => {
      content.push(`   A. Fabricante: ${window.brand}`)
      content.push(`   B. Producto: ${window.nameEs || window.name}`)
      content.push(`   C. Descripción: ${window.descriptionEs || window.description}`)
      content.push('')
    })
  }

  content.push('')
  content.push('2. PARTE 2 - PRODUCTOS')
  content.push('')
  content.push('2.1 REQUISITOS DE DESEMPEÑO')
  content.push('   A. Cumplir con Código Sísmico de Costa Rica')
  content.push('   B. Resistencia a corrosión para ambiente tropical')
  content.push('   C. Garantías según especificado por fabricante')

  return content
}

function generateFinishesSection(flooring: Product[]): string[] {
  const content: string[] = []

  content.push('1. PARTE 1 - GENERAL')
  content.push('')
  content.push('1.1 RESUMEN')
  content.push('   A. Sección incluye acabados de piso para el proyecto')
  content.push('')
  content.push('1.2 REFERENCIAS')
  content.push('   A. ASTM F2913 - Slip Resistance')
  content.push('   B. FloorScore - Indoor Air Quality Certification')
  content.push('   C. GREENGUARD Gold - Low Chemical Emissions')
  content.push('')

  content.push('1.3 PRODUCTOS DE PISO')
  flooring.forEach(floor => {
    content.push(`   A. Fabricante: ${floor.brand}`)
    content.push(`   B. Producto: ${floor.sku} - ${floor.nameEs || floor.name}`)
    content.push(`   C. Descripción: ${floor.descriptionEs || floor.description}`)

    if (floor.specifications.material) {
      content.push(`   D. Material: ${floor.specifications.material}`)
    }
    if (floor.specifications.dimensions) {
      content.push(`   E. Dimensiones: ${floor.specifications.dimensions}`)
    }
    if (floor.specifications.warranty) {
      content.push(`   F. Garantía: ${floor.specifications.warranty}`)
    }
    if (floor.specifications.certifications) {
      content.push(`   G. Certificaciones: ${floor.specifications.certifications.join(', ')}`)
    }
    content.push('')
  })

  content.push('')
  content.push('2. PARTE 2 - EJECUCIÓN')
  content.push('')
  content.push('2.1 INSTALACIÓN')
  content.push('   A. Seguir instrucciones del fabricante')
  content.push('   B. Aclimatar materiales 48 horas antes de instalación')
  content.push('   C. Preparar substrato según especificaciones')
  content.push('   D. Temperatura ambiente: 18-27°C durante instalación')

  return content
}

function generatePlumbingSection(fixtures: Product[]): string[] {
  const content: string[] = []

  content.push('1. PARTE 1 - GENERAL')
  content.push('')
  content.push('1.1 RESUMEN')
  content.push('   A. Sección incluye aparatos sanitarios y grifería')
  content.push('')
  content.push('1.2 REFERENCIAS')
  content.push('   A. CFIA - Código de Instalaciones Hidráulicas y Sanitarias CR')
  content.push('   B. NSF/ANSI 61 - Drinking Water System Components')
  content.push('   C. WaterSense - EPA Water Efficiency Standard')
  content.push('   D. ADA - Americans with Disabilities Act')
  content.push('')
  content.push('1.3 REQUISITOS DE CUMPLIMIENTO')
  content.push('   A. Todos los productos deben cumplir con CFIA vigente')
  content.push('   B. Certificación WaterSense obligatoria')
  content.push('   C. ADA Compliant para instalaciones públicas')
  content.push('   D. Garantía mínima 10 años residencial')
  content.push('')

  // Group by category
  const faucets = fixtures.filter(f => f.category === 'Grifería')
  const sinks = fixtures.filter(f => f.category === 'Lavamanos')
  const toilets = fixtures.filter(f => f.category === 'Inodoros')
  const showers = fixtures.filter(f => f.category === 'Duchas')

  if (faucets.length > 0) {
    content.push('1.4 GRIFERÍA')
    faucets.forEach(faucet => {
      content.push(`   A. Fabricante: ${faucet.brand}`)
      content.push(`   B. Modelo: ${faucet.sku} - ${faucet.nameEs || faucet.name}`)
      content.push(`   C. Acabado: ${faucet.finish || 'Especificar'}`)
      content.push(`   D. Garantía: ${faucet.specifications.warranty || '10 años'}`)
      if (faucet.specifications.certifications) {
        content.push(`   E. Certificaciones: ${faucet.specifications.certifications.join(', ')}`)
      }
      content.push('')
    })
  }

  if (sinks.length > 0) {
    content.push('1.5 LAVAMANOS')
    sinks.forEach(sink => {
      content.push(`   A. Fabricante: ${sink.brand}`)
      content.push(`   B. Modelo: ${sink.sku} - ${sink.nameEs || sink.name}`)
      content.push(`   C. Material: ${sink.specifications.material || 'Vitreous China'}`)
      content.push(`   D. Color: ${sink.color || 'White'}`)
      if (sink.specifications.dimensions) {
        content.push(`   E. Dimensiones: ${sink.specifications.dimensions}`)
      }
      content.push('')
    })
  }

  if (toilets.length > 0) {
    content.push('1.6 INODOROS')
    toilets.forEach(toilet => {
      content.push(`   A. Fabricante: ${toilet.brand}`)
      content.push(`   B. Modelo: ${toilet.sku} - ${toilet.nameEs || toilet.name}`)
      content.push(`   C. Tipo: ${toilet.specifications.features?.includes('Elongated') ? 'Elongado' : 'Redondo'}`)
      content.push(`   D. Tecnología de descarga: ${toilet.specifications.features?.find(f => f.includes('Class Five')) || 'High efficiency'}`)
      if (toilet.specifications.certifications) {
        content.push(`   E. Certificaciones: ${toilet.specifications.certifications.join(', ')}`)
      }
      content.push('')
    })
  }

  if (showers.length > 0) {
    content.push('1.7 SISTEMAS DE DUCHA')
    showers.forEach(shower => {
      content.push(`   A. Fabricante: ${shower.brand}`)
      content.push(`   B. Sistema: ${shower.sku} - ${shower.nameEs || shower.name}`)
      content.push(`   C. Acabado: ${shower.finish || 'Especificar'}`)
      if (shower.specifications.certifications) {
        content.push(`   D. Certificaciones: ${shower.specifications.certifications.join(', ')}`)
      }
      content.push('')
    })
  }

  content.push('')
  content.push('2. PARTE 2 - INSTALACIÓN')
  content.push('')
  content.push('2.1 REQUISITOS DE INSTALACIÓN')
  content.push('   A. Instalación por plomero certificado')
  content.push('   B. Seguir especificaciones del fabricante')
  content.push('   C. Verificar compatibilidad con presión de agua local')
  content.push('   D. Pruebas de presión según CFIA')
  content.push('   E. Documentar instalación para garantía')

  return content
}

/**
 * Generate markdown specification document
 */
export function generateMarkdownSpec(spec: ProjectSpecification): string {
  const lines: string[] = []

  // Title Page
  lines.push(`# ESPECIFICACIÓN TÉCNICA`)
  lines.push(`# ${spec.projectName.toUpperCase()}`)
  lines.push('')
  lines.push(`---`)
  lines.push('')
  lines.push(`**Tipo de Proyecto:** ${spec.projectType.charAt(0).toUpperCase() + spec.projectType.slice(1)}`)
  lines.push(`**Ubicación:** ${spec.location}`)
  lines.push(`**Fecha:** ${spec.date}`)
  lines.push(`**Preparado por:** ${spec.preparedBy}`)
  lines.push('')
  lines.push(`---`)
  lines.push('')

  // Executive Summary
  lines.push(`## RESUMEN EJECUTIVO`)
  lines.push('')
  lines.push(`Este documento contiene las especificaciones técnicas para productos de construcción `)
  lines.push(`seleccionados del catálogo Alumimundo para el proyecto ${spec.projectName}.`)
  lines.push('')
  lines.push(`**Productos Especificados:** ${spec.products.length}`)
  lines.push(`**Marcas Incluidas:** ${[...new Set(spec.products.map(p => p.brand))].join(', ')}`)
  lines.push('')

  // Compliance Summary
  if (spec.compliance) {
    const summary = getComplianceSummary(spec.compliance)
    lines.push(`## CUMPLIMIENTO DE CÓDIGOS`)
    lines.push('')
    lines.push(`**Estado General:** ${spec.compliance.overallStatus === 'compliant' ? '✅ Cumple' : spec.compliance.overallStatus === 'needs-attention' ? '⚠️ Requiere Atención' : '❌ No Cumple'}`)
    lines.push(`**Tasa de Cumplimiento:** ${summary.complianceRate}%`)
    lines.push('')
    lines.push(`| Métrica | Cantidad |`)
    lines.push(`|---------|----------|`)
    lines.push(`| Requisitos Evaluados | ${summary.total} |`)
    lines.push(`| ✅ Cumple | ${summary.compliant} |`)
    lines.push(`| ⚠️ Parcial | ${summary.partial} |`)
    lines.push(`| ❌ No Cumple | ${summary.nonCompliant} |`)
    lines.push('')

    if (spec.compliance.recommendations.length > 0) {
      lines.push(`### Recomendaciones Importantes`)
      lines.push('')
      spec.compliance.recommendations.forEach(rec => {
        lines.push(`- ${rec}`)
      })
      lines.push('')
    }
  }

  // Product Specifications
  lines.push(`## ESPECIFICACIONES POR DIVISIÓN CSI`)
  lines.push('')

  spec.sections.forEach(section => {
    lines.push(`### ${section.number} - ${section.title}`)
    lines.push('')
    section.content.forEach(line => {
      lines.push(line)
    })
    lines.push('')
  })

  // Product Summary Table
  lines.push(`## RESUMEN DE PRODUCTOS`)
  lines.push('')
  lines.push(`| SKU | Producto | Marca | Categoría | Precio (CRC) |`)
  lines.push(`|-----|----------|-------|-----------|--------------|`)
  spec.products.forEach(product => {
    const price = product.price
      ? `₡${product.price.toLocaleString()}`
      : product.priceRange
      ? `₡${product.priceRange.min.toLocaleString()} - ₡${product.priceRange.max.toLocaleString()}`
      : 'Consultar'

    lines.push(`| ${product.sku} | ${product.nameEs || product.name} | ${product.brand} | ${product.category} | ${price} |`)
  })
  lines.push('')

  // Footer
  lines.push(`---`)
  lines.push('')
  lines.push(`## NOTAS IMPORTANTES`)
  lines.push('')
  lines.push(`1. Todos los productos están sujetos a disponibilidad`)
  lines.push(`2. Precios en colones costarricenses (CRC) - sujetos a cambio sin previo aviso`)
  lines.push(`3. Se requiere verificación de tiempos de entrega antes de orden`)
  lines.push(`4. Instalación debe ser realizada por profesionales certificados`)
  lines.push(`5. Garantías válidas solo con instalación correcta y comprobantes`)
  lines.push('')
  lines.push(`---`)
  lines.push('')
  lines.push(`**Distribuido por:**`)
  lines.push('')
  lines.push(`**ALUMIMUNDO S.A.**`)
  lines.push(`40 años liderando la industria de acabados arquitectónicos en Costa Rica`)
  lines.push('')
  lines.push(`Documento generado por Catálogo IA - Asistente Inteligente de Especificación`)

  return lines.join('\n')
}

/**
 * Generate HTML specification document for PDF conversion
 */
export function generateHTMLSpec(spec: ProjectSpecification): string {
  const markdown = generateMarkdownSpec(spec)

  // Convert markdown to basic HTML (for simplicity, we'll use basic formatting)
  let html = markdown
    .replace(/^# (.*)/gm, '<h1>$1</h1>')
    .replace(/^## (.*)/gm, '<h2>$1</h2>')
    .replace(/^### (.*)/gm, '<h3>$1</h3>')
    .replace(/^\*\*(.*)\*\*/gm, '<strong>$1</strong>')
    .replace(/^---$/gm, '<hr>')
    .replace(/^\| (.*) \|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim())
      return '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>'
    })
    .replace(/\n\n/g, '<br><br>')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Especificación - ${spec.projectName}</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1 {
      color: #00a19a;
      border-bottom: 3px solid #00a19a;
      padding-bottom: 10px;
    }
    h2 {
      color: #1a237e;
      margin-top: 30px;
    }
    h3 {
      color: #455a64;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #00a19a;
      color: white;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    hr {
      border: none;
      border-top: 2px solid #00a19a;
      margin: 30px 0;
    }
    .footer {
      text-align: center;
      margin-top: 50px;
      color: #666;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>
  `
}
