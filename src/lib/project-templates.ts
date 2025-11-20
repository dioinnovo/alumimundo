/**
 * Project Templates for Common Building Types
 * Pre-configured product specifications for hotels, residential, and commercial projects
 */

import type { Product } from './products-data'

export interface ProjectTemplate {
  id: string
  name: string
  nameEs: string
  description: string
  descriptionEs: string
  type: 'hotel' | 'residential' | 'commercial' | 'institutional'
  location: 'coastal' | 'urban' | 'seismic-zone-3' | 'seismic-zone-4'
  estimatedBudget: {
    min: number
    max: number
  }
  productCategories: string[]
  recommendedProducts: {
    category: string
    priority: 'essential' | 'recommended' | 'optional'
    productIds: string[]
    quantity: number
    notes?: string
  }[]
  specifications: {
    projectSize: string
    style: string
    certifications: string[]
    specialRequirements: string[]
  }
  icon: string
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'hotel-luxury-coastal',
    name: 'Luxury Coastal Hotel',
    nameEs: 'Hotel de Lujo Costero',
    description: '5-star beachfront hotel with high-end finishes and marine-grade materials',
    descriptionEs: 'Hotel 5 estrellas frente al mar con acabados de alta gama y materiales resistentes a corrosión marina',
    type: 'hotel',
    location: 'coastal',
    estimatedBudget: {
      min: 500000,
      max: 1500000
    },
    productCategories: ['Grifería', 'Lavamanos', 'Inodoros', 'Duchas', 'Cerraduras', 'Herrajes', 'Iluminación'],
    recommendedProducts: [
      {
        category: 'Grifería',
        priority: 'essential',
        productIds: ['kohler-purist-k-14406', 'delta-trinsic-559ha'],
        quantity: 150,
        notes: 'Acabado resistente a corrosión marina (Satin Nickel, Chrome)'
      },
      {
        category: 'Lavamanos',
        priority: 'essential',
        productIds: ['kohler-archer-k2356', 'toto-legato-lt624'],
        quantity: 150,
        notes: 'Lavamanos de alta gama con diseño contemporáneo'
      },
      {
        category: 'Inodoros',
        priority: 'essential',
        productIds: ['toto-drake-cst744s', 'kohler-corbelle-k3814'],
        quantity: 150,
        notes: 'WaterSense certificado, tecnología dual-flush'
      },
      {
        category: 'Duchas',
        priority: 'essential',
        productIds: ['kohler-awaken-k72419', 'hansgrohe-raindance-26468001'],
        quantity: 100,
        notes: 'Sistemas de ducha premium con tecnología eco-friendly'
      },
      {
        category: 'Cerraduras',
        priority: 'essential',
        productIds: ['schlage-commercial-nd-series', 'yale-nextouch-ykrc'],
        quantity: 200,
        notes: 'Cerraduras de grado comercial con acabado resistente a corrosión'
      },
      {
        category: 'Herrajes',
        priority: 'recommended',
        productIds: [],
        quantity: 300,
        notes: 'Bisagras, manijas y accesorios en acabado marine-grade'
      },
      {
        category: 'Iluminación',
        priority: 'recommended',
        productIds: [],
        quantity: 500,
        notes: 'Iluminación LED de bajo consumo con protección IP65 para áreas húmedas'
      }
    ],
    specifications: {
      projectSize: '150 habitaciones, 10,000 m²',
      style: 'Contemporáneo de lujo con influencia tropical',
      certifications: ['WaterSense', 'ADA', 'LEED Silver', 'NSF/ANSI 61'],
      specialRequirements: [
        'Resistencia a corrosión marina',
        'Anclajes sísmicos Zona IV',
        'Bajo mantenimiento',
        'Garantías comerciales extendidas (5+ años)',
        'Eficiencia hídrica superior'
      ]
    },
    icon: '🏨'
  },
  {
    id: 'residential-modern-urban',
    name: 'Modern Urban Residence',
    nameEs: 'Residencia Urbana Moderna',
    description: 'Contemporary high-rise residential development in urban San José',
    descriptionEs: 'Desarrollo residencial contemporáneo de altura en San José urbano',
    type: 'residential',
    location: 'seismic-zone-3',
    estimatedBudget: {
      min: 150000,
      max: 400000
    },
    productCategories: ['Grifería', 'Lavamanos', 'Inodoros', 'Duchas', 'Cerraduras', 'Pisos'],
    recommendedProducts: [
      {
        category: 'Grifería',
        priority: 'essential',
        productIds: ['delta-trinsic-559ha', 'moen-arbor-7594'],
        quantity: 80,
        notes: 'Estilo contemporáneo con acabados modernos'
      },
      {
        category: 'Lavamanos',
        priority: 'essential',
        productIds: ['toto-legato-lt624', 'american-standard-studio'],
        quantity: 80,
        notes: 'Diseño minimalista para baños modernos'
      },
      {
        category: 'Inodoros',
        priority: 'essential',
        productIds: ['toto-drake-cst744s', 'american-standard-champion'],
        quantity: 80,
        notes: 'Eficiencia WaterSense, instalación estándar'
      },
      {
        category: 'Duchas',
        priority: 'recommended',
        productIds: ['delta-in2ition-58480', 'moen-velocity-26100'],
        quantity: 60,
        notes: 'Duchas duales con tecnología de ahorro de agua'
      },
      {
        category: 'Cerraduras',
        priority: 'essential',
        productIds: ['schlage-residential-series', 'kwikset-smartcode'],
        quantity: 120,
        notes: 'Cerraduras residenciales con opción de entrada sin llave'
      },
      {
        category: 'Pisos',
        priority: 'recommended',
        productIds: [],
        quantity: 5000,
        notes: 'Pisos de porcelanato o vinilo de lujo con certificación FloorScore'
      }
    ],
    specifications: {
      projectSize: '40 apartamentos, 4,000 m²',
      style: 'Contemporáneo minimalista',
      certifications: ['WaterSense', 'FloorScore', 'GREENGUARD Gold'],
      specialRequirements: [
        'Anclajes sísmicos Zona III',
        'Eficiencia energética',
        'Baja emisión de VOCs',
        'Garantías residenciales estándar (2-3 años)'
      ]
    },
    icon: '🏢'
  },
  {
    id: 'commercial-office-building',
    name: 'Commercial Office Building',
    nameEs: 'Edificio de Oficinas Comercial',
    description: 'Multi-tenant office building with ADA compliance and sustainable features',
    descriptionEs: 'Edificio de oficinas multi-inquilino con cumplimiento ADA y características sostenibles',
    type: 'commercial',
    location: 'urban',
    estimatedBudget: {
      min: 300000,
      max: 800000
    },
    productCategories: ['Grifería', 'Inodoros', 'Cerraduras', 'Puertas', 'Iluminación', 'Plomería Comercial'],
    recommendedProducts: [
      {
        category: 'Grifería',
        priority: 'essential',
        productIds: ['delta-commercial-faucet', 'chicago-faucets-commercial'],
        quantity: 60,
        notes: 'Grifería comercial con sensores automáticos, cumplimiento ADA'
      },
      {
        category: 'Inodoros',
        priority: 'essential',
        productIds: ['toto-commercial-flush', 'kohler-commercial-toilet'],
        quantity: 40,
        notes: 'Inodoros de alto tráfico con flush automático, WaterSense'
      },
      {
        category: 'Cerraduras',
        priority: 'essential',
        productIds: ['schlage-commercial-nd-series', 'sargent-8200-series'],
        quantity: 100,
        notes: 'Cerraduras de grado comercial 1, cumplimiento NFPA 80'
      },
      {
        category: 'Puertas',
        priority: 'essential',
        productIds: [],
        quantity: 80,
        notes: 'Puertas cortafuego certificadas NFPA 80, acabados durables'
      },
      {
        category: 'Iluminación',
        priority: 'recommended',
        productIds: [],
        quantity: 400,
        notes: 'LED comercial con controles de ocupación, cumplimiento de códigos energéticos'
      },
      {
        category: 'Plomería Comercial',
        priority: 'essential',
        productIds: [],
        quantity: 100,
        notes: 'Sistemas de plomería comercial certificados NSF/ANSI 61'
      }
    ],
    specifications: {
      projectSize: '8,000 m², 6 pisos',
      style: 'Corporativo profesional',
      certifications: ['ADA', 'WaterSense', 'NFPA 80', 'NSF/ANSI 61', 'LEED Gold'],
      specialRequirements: [
        'Cumplimiento total ADA en baños y accesos',
        'Puertas cortafuego certificadas',
        'Sistemas de bajo mantenimiento',
        'Garantías comerciales (3-5 años)',
        'Eficiencia energética LEED'
      ]
    },
    icon: '🏢'
  },
  {
    id: 'residential-eco-friendly',
    name: 'Eco-Friendly Residence',
    nameEs: 'Residencia Eco-Amigable',
    description: 'Sustainable home with LEED certification and green building materials',
    descriptionEs: 'Casa sostenible con certificación LEED y materiales de construcción ecológicos',
    type: 'residential',
    location: 'urban',
    estimatedBudget: {
      min: 80000,
      max: 200000
    },
    productCategories: ['Grifería', 'Inodoros', 'Duchas', 'Pisos', 'Iluminación'],
    recommendedProducts: [
      {
        category: 'Grifería',
        priority: 'essential',
        productIds: ['moen-eco-performance', 'delta-h2okinetic'],
        quantity: 8,
        notes: 'Grifería de ultra-bajo consumo, certificación WaterSense superior'
      },
      {
        category: 'Inodoros',
        priority: 'essential',
        productIds: ['toto-ultramax-eco', 'kohler-highline-eco'],
        quantity: 4,
        notes: 'Inodoros de 1.28 GPF o menos, tecnología dual-flush'
      },
      {
        category: 'Duchas',
        priority: 'essential',
        productIds: ['hansgrohe-ecosmart', 'kohler-katalyst'],
        quantity: 4,
        notes: 'Regaderas de bajo flujo con tecnología de atomización'
      },
      {
        category: 'Pisos',
        priority: 'recommended',
        productIds: [],
        quantity: 200,
        notes: 'Pisos de bambú, corcho o porcelanato reciclado con FloorScore'
      },
      {
        category: 'Iluminación',
        priority: 'recommended',
        productIds: [],
        quantity: 50,
        notes: 'Iluminación LED de eficiencia energética con controles inteligentes'
      }
    ],
    specifications: {
      projectSize: '200 m², casa unifamiliar',
      style: 'Contemporáneo sostenible',
      certifications: ['WaterSense', 'FloorScore', 'GREENGUARD Gold', 'LEED Platinum'],
      specialRequirements: [
        'Máxima eficiencia hídrica',
        'Cero emisiones de VOCs',
        'Materiales reciclados/reciclables',
        'Energía solar preparada',
        'Recolección de agua de lluvia'
      ]
    },
    icon: '🌱'
  },
  {
    id: 'hotel-boutique-urban',
    name: 'Boutique Urban Hotel',
    nameEs: 'Hotel Boutique Urbano',
    description: 'Intimate boutique hotel with designer finishes in city center',
    descriptionEs: 'Hotel boutique íntimo con acabados de diseñador en el centro de la ciudad',
    type: 'hotel',
    location: 'seismic-zone-3',
    estimatedBudget: {
      min: 200000,
      max: 500000
    },
    productCategories: ['Grifería', 'Lavamanos', 'Inodoros', 'Duchas', 'Cerraduras', 'Iluminación'],
    recommendedProducts: [
      {
        category: 'Grifería',
        priority: 'essential',
        productIds: ['kohler-purist-k-14406', 'watermark-designs-titanium'],
        quantity: 40,
        notes: 'Grifería de diseñador con acabados únicos'
      },
      {
        category: 'Lavamanos',
        priority: 'essential',
        productIds: ['kohler-artist-editions', 'duravit-luv'],
        quantity: 40,
        notes: 'Lavamanos de diseño contemporáneo, piezas de autor'
      },
      {
        category: 'Inodoros',
        priority: 'essential',
        productIds: ['toto-neorest', 'kohler-veil'],
        quantity: 40,
        notes: 'Inodoros inteligentes de alta tecnología'
      },
      {
        category: 'Duchas',
        priority: 'essential',
        productIds: ['hansgrohe-raindance-26468001', 'grohe-rainshower'],
        quantity: 30,
        notes: 'Sistemas de ducha spa de lujo'
      },
      {
        category: 'Cerraduras',
        priority: 'essential',
        productIds: ['yale-nextouch-ykrc', 'salto-wireless-lock'],
        quantity: 60,
        notes: 'Cerraduras electrónicas sin llave para huéspedes'
      },
      {
        category: 'Iluminación',
        priority: 'recommended',
        productIds: [],
        quantity: 200,
        notes: 'Iluminación de diseño con control de escenas y dimming'
      }
    ],
    specifications: {
      projectSize: '30 habitaciones, 2,500 m²',
      style: 'Boutique contemporáneo de diseño',
      certifications: ['WaterSense', 'ADA (áreas públicas)', 'GREENGUARD'],
      specialRequirements: [
        'Acabados únicos y personalizados',
        'Tecnología smart room',
        'Experiencia de huésped premium',
        'Anclajes sísmicos Zona III',
        'Bajo ruido (silent close, aislamiento)'
      ]
    },
    icon: '🏨'
  }
]

/**
 * Get template by ID
 */
export function getTemplateById(id: string): ProjectTemplate | undefined {
  return PROJECT_TEMPLATES.find(t => t.id === id)
}

/**
 * Get templates by type
 */
export function getTemplatesByType(type: 'hotel' | 'residential' | 'commercial' | 'institutional'): ProjectTemplate[] {
  return PROJECT_TEMPLATES.filter(t => t.type === type)
}

/**
 * Get templates by budget range
 */
export function getTemplatesByBudget(minBudget: number, maxBudget: number): ProjectTemplate[] {
  return PROJECT_TEMPLATES.filter(t =>
    t.estimatedBudget.min <= maxBudget && t.estimatedBudget.max >= minBudget
  )
}

/**
 * Get all template categories
 */
export function getAllTemplateCategories(): string[] {
  const categories = new Set<string>()
  PROJECT_TEMPLATES.forEach(template => {
    template.productCategories.forEach(cat => categories.add(cat))
  })
  return Array.from(categories)
}
