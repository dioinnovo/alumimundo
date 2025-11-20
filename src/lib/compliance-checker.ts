/**
 * Costa Rica Building Code Compliance Checker
 * Validates products against CFIA, NFPA, ADA, and other CR regulations
 */

export interface ComplianceRequirement {
  code: string
  name: string
  description: string
  mandatory: boolean
  applicableCategories?: string[]
}

export interface ComplianceCheck {
  requirement: ComplianceRequirement
  status: 'compliant' | 'non-compliant' | 'partial' | 'not-applicable'
  details: string
  certifications?: string[]
}

export interface ProjectCompliance {
  projectType: 'residential' | 'commercial' | 'hotel' | 'institutional'
  location: 'coastal' | 'urban' | 'seismic-zone-3' | 'seismic-zone-4'
  checks: ComplianceCheck[]
  overallStatus: 'compliant' | 'needs-attention' | 'non-compliant'
  recommendations: string[]
}

/**
 * Costa Rica Building Code Requirements
 */
export const CR_COMPLIANCE_REQUIREMENTS: ComplianceRequirement[] = [
  {
    code: 'CFIA-2024',
    name: 'Código de Instalaciones Hidráulicas y Sanitarias',
    description: 'Costa Rica plumbing and sanitary installations code',
    mandatory: true,
    applicableCategories: ['Grifería', 'Lavamanos', 'Inodoros', 'Duchas', 'Plomería Comercial']
  },
  {
    code: 'WATERSENSE',
    name: 'WaterSense Certification',
    description: 'EPA WaterSense water efficiency standard',
    mandatory: true,
    applicableCategories: ['Grifería', 'Inodoros', 'Duchas']
  },
  {
    code: 'ADA-2010',
    name: 'ADA Accessibility Standards',
    description: 'Americans with Disabilities Act compliance (required for public buildings)',
    mandatory: false, // Mandatory for commercial/public, optional for residential
    applicableCategories: ['Grifería', 'Lavamanos', 'Inodoros', 'Cerraduras']
  },
  {
    code: 'NFPA-80',
    name: 'NFPA 80 Fire Door Standard',
    description: 'Fire door and opening protective standard',
    mandatory: true,
    applicableCategories: ['Puertas']
  },
  {
    code: 'SEISMIC-ZONE-3',
    name: 'Zona Sísmica III (San José, Cartago, Heredia)',
    description: 'Enhanced seismic attachment requirements for Zone III',
    mandatory: true,
    applicableCategories: ['Cerraduras', 'Herrajes', 'Puertas', 'Iluminación']
  },
  {
    code: 'SEISMIC-ZONE-4',
    name: 'Zona Sísmica IV (Costas)',
    description: 'Strictest seismic attachment requirements for coastal areas',
    mandatory: true,
    applicableCategories: ['Cerraduras', 'Herrajes', 'Puertas', 'Iluminación']
  },
  {
    code: 'COASTAL-CORROSION',
    name: 'Resistencia a Corrosión Marina',
    description: 'Corrosion-resistant materials for coastal environments',
    mandatory: true,
    applicableCategories: ['Cerraduras', 'Herrajes', 'Grifería', 'Puertas']
  },
  {
    code: 'NSF-61',
    name: 'NSF/ANSI 61 Drinking Water',
    description: 'Drinking water system components standard',
    mandatory: true,
    applicableCategories: ['Grifería', 'Plomería Comercial']
  },
  {
    code: 'GREENGUARD',
    name: 'GREENGUARD Gold Certification',
    description: 'Low chemical emissions for indoor air quality',
    mandatory: false,
    applicableCategories: ['Pisos', 'Alfombras', 'Mobiliario']
  },
  {
    code: 'FLOORSCORE',
    name: 'FloorScore Certification',
    description: 'Indoor air quality certification for flooring',
    mandatory: false,
    applicableCategories: ['Pisos', 'Alfombras']
  }
]

/**
 * Check if a product meets a specific compliance requirement
 */
export function checkProductCompliance(
  product: any,
  requirement: ComplianceRequirement,
  projectContext: { type: 'residential' | 'commercial' | 'hotel' | 'institutional'; location: string }
): ComplianceCheck {
  const certifications = product.specifications?.certifications || []

  // Check if requirement applies to this category
  if (requirement.applicableCategories &&
      !requirement.applicableCategories.includes(product.category)) {
    return {
      requirement,
      status: 'not-applicable',
      details: `Este requisito no aplica para ${product.category}`,
      certifications: []
    }
  }

  let status: 'compliant' | 'non-compliant' | 'partial' | 'not-applicable' = 'non-compliant'
  let details = ''
  let relevantCerts: string[] = []

  switch (requirement.code) {
    case 'WATERSENSE':
      if (certifications.some((cert: string) => cert.toLowerCase().includes('watersense'))) {
        status = 'compliant'
        details = '✅ Producto certificado WaterSense para eficiencia hídrica'
        relevantCerts = certifications.filter((c: string) => c.toLowerCase().includes('watersense'))
      } else {
        status = 'non-compliant'
        details = '⚠️ Requiere certificación WaterSense para cumplir con normativa CR'
      }
      break

    case 'ADA-2010':
      if (certifications.some((cert: string) => cert.toLowerCase().includes('ada'))) {
        status = 'compliant'
        details = '✅ Cumple con estándares ADA de accesibilidad'
        relevantCerts = certifications.filter((c: string) => c.toLowerCase().includes('ada'))
      } else if (projectContext.type === 'residential') {
        status = 'not-applicable'
        details = 'ADA no obligatorio para proyectos residenciales'
      } else {
        status = 'non-compliant'
        details = '⚠️ Requiere cumplimiento ADA para edificios públicos/comerciales'
      }
      break

    case 'NFPA-80':
      if (product.specifications?.fireRating) {
        status = 'compliant'
        details = `✅ Resistencia al fuego certificada: ${product.specifications.fireRating}`
        relevantCerts = ['NFPA 80', 'UL Listed']
      } else if (product.category !== 'Puertas') {
        status = 'not-applicable'
        details = 'Resistencia al fuego no requerida para esta categoría'
      } else {
        status = 'non-compliant'
        details = '⚠️ Requiere certificación NFPA 80 para puertas comerciales'
      }
      break

    case 'NSF-61':
      if (certifications.some((cert: string) => cert.toLowerCase().includes('nsf'))) {
        status = 'compliant'
        details = '✅ Certificado NSF/ANSI 61 para contacto con agua potable'
        relevantCerts = certifications.filter((c: string) => c.toLowerCase().includes('nsf'))
      } else {
        status = 'partial'
        details = '⚠️ Verificar certificación NSF/ANSI 61 con distribuidor'
      }
      break

    case 'SEISMIC-ZONE-3':
    case 'SEISMIC-ZONE-4':
      if (projectContext.location.includes('seismic') || projectContext.location.includes('coastal')) {
        const isZone4 = requirement.code === 'SEISMIC-ZONE-4'
        if (product.specifications?.features?.some((f: string) =>
            f.toLowerCase().includes('seismic') ||
            f.toLowerCase().includes('reinforced'))) {
          status = 'compliant'
          details = `✅ Producto adecuado para ${isZone4 ? 'Zona IV (costas)' : 'Zona III'} con anclajes reforzados`
        } else {
          status = 'partial'
          details = `⚠️ Requiere instalación con anclajes sísmicos reforzados para ${isZone4 ? 'Zona IV' : 'Zona III'}`
        }
      } else {
        status = 'not-applicable'
        details = 'Zona sísmica no aplica para esta ubicación'
      }
      break

    case 'COASTAL-CORROSION':
      if (projectContext.location === 'coastal') {
        const hasResistFinish = product.specifications?.features?.some((f: string) =>
          f.toLowerCase().includes('resist') ||
          f.toLowerCase().includes('corrosion') ||
          f.toLowerCase().includes('marine') ||
          f.toLowerCase().includes('stainless')
        )
        if (hasResistFinish) {
          status = 'compliant'
          details = '✅ Acabado resistente a corrosión para ambiente marino'
        } else {
          status = 'non-compliant'
          details = '⚠️ Requiere acabados resistentes a corrosión para ubicación costera (Satin Nickel, Stainless, Marine Grade)'
        }
      } else {
        status = 'not-applicable'
        details = 'Resistencia a corrosión no requerida fuera de zonas costeras'
      }
      break

    case 'GREENGUARD':
      if (certifications.some((cert: string) => cert.toLowerCase().includes('greenguard'))) {
        status = 'compliant'
        details = '✅ Certificado GREENGUARD Gold - Baja emisión de químicos'
        relevantCerts = certifications.filter((c: string) => c.toLowerCase().includes('greenguard'))
      } else {
        status = 'not-applicable'
        details = 'Certificación GREENGUARD opcional pero recomendada'
      }
      break

    case 'FLOORSCORE':
      if (certifications.some((cert: string) => cert.toLowerCase().includes('floorscore'))) {
        status = 'compliant'
        details = '✅ Certificado FloorScore para calidad de aire interior'
        relevantCerts = certifications.filter((c: string) => c.toLowerCase().includes('floorscore'))
      } else {
        status = 'not-applicable'
        details = 'Certificación FloorScore opcional pero recomendada'
      }
      break

    case 'CFIA-2024':
      // Assume CFIA compliance if NSF/ANSI certified and WaterSense
      const hasNSF = certifications.some((c: string) => c.toLowerCase().includes('nsf'))
      const hasWaterSense = certifications.some((c: string) => c.toLowerCase().includes('watersense'))
      if (hasNSF || hasWaterSense) {
        status = 'compliant'
        details = '✅ Cumple con CFIA mediante certificaciones NSF/WaterSense'
        relevantCerts = certifications
      } else {
        status = 'partial'
        details = '⚠️ Verificar cumplimiento CFIA con distribuidor autorizado'
      }
      break

    default:
      status = 'not-applicable'
      details = 'Requisito no evaluado'
  }

  return {
    requirement,
    status,
    details,
    certifications: relevantCerts
  }
}

/**
 * Generate comprehensive compliance report for a product list
 */
export function generateComplianceReport(
  products: any[],
  projectContext: {
    type: 'residential' | 'commercial' | 'hotel' | 'institutional'
    location: 'coastal' | 'urban' | 'seismic-zone-3' | 'seismic-zone-4'
  }
): ProjectCompliance {
  const allChecks: ComplianceCheck[] = []
  const recommendations: string[] = []

  // Check each product against all requirements
  for (const product of products) {
    for (const requirement of CR_COMPLIANCE_REQUIREMENTS) {
      const check = checkProductCompliance(product, requirement, projectContext)

      // Only include applicable checks
      if (check.status !== 'not-applicable') {
        allChecks.push({
          ...check,
          details: `${product.nameEs || product.name}: ${check.details}`
        })
      }
    }
  }

  // Generate recommendations based on non-compliant items
  const nonCompliantChecks = allChecks.filter(c => c.status === 'non-compliant')
  const partialChecks = allChecks.filter(c => c.status === 'partial')

  if (nonCompliantChecks.length > 0) {
    recommendations.push(`⚠️ ${nonCompliantChecks.length} productos requieren atención inmediata para cumplimiento`)
  }

  if (partialChecks.length > 0) {
    recommendations.push(`ℹ️ ${partialChecks.length} productos requieren verificación adicional con distribuidor`)
  }

  // Location-specific recommendations
  if (projectContext.location === 'coastal') {
    recommendations.push('🌊 Ubicación costera: Priorizar acabados resistentes a corrosión (Satin Nickel, Stainless Steel)')
    recommendations.push('🏗️ Zona Sísmica IV: Requerir anclajes reforzados para toda instalación')
  } else if (projectContext.location.includes('seismic')) {
    recommendations.push('🏗️ Zona sísmica: Verificar anclajes estructurales según CFIA')
  }

  // Project type recommendations
  if (projectContext.type === 'commercial' || projectContext.type === 'institutional') {
    recommendations.push('♿ Edificio público: Todos los productos deben cumplir ADA')
    recommendations.push('🔥 Verificar requisitos NFPA 80 para puertas cortafuego')
  }

  if (projectContext.type === 'hotel') {
    recommendations.push('🏨 Proyecto hotelero: Priorizar productos con garantías comerciales extendidas')
    recommendations.push('💧 Certificación WaterSense obligatoria para todas las instalaciones hidráulicas')
  }

  // Determine overall status
  let overallStatus: 'compliant' | 'needs-attention' | 'non-compliant' = 'compliant'
  if (nonCompliantChecks.length > 0) {
    overallStatus = 'non-compliant'
  } else if (partialChecks.length > 0) {
    overallStatus = 'needs-attention'
  }

  return {
    projectType: projectContext.type,
    location: projectContext.location,
    checks: allChecks,
    overallStatus,
    recommendations
  }
}

/**
 * Get summary statistics for compliance report
 */
export function getComplianceSummary(report: ProjectCompliance) {
  const total = report.checks.length
  const compliant = report.checks.filter(c => c.status === 'compliant').length
  const nonCompliant = report.checks.filter(c => c.status === 'non-compliant').length
  const partial = report.checks.filter(c => c.status === 'partial').length

  return {
    total,
    compliant,
    nonCompliant,
    partial,
    complianceRate: total > 0 ? Math.round((compliant / total) * 100) : 0
  }
}
