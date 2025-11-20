/**
 * Mock Product Data for Alumimundo Platform
 * Represents KOHLER, Kallista, Schlage, and Steelcraft products
 */

export interface Product {
  id: string
  sku: string
  name: string
  brand: 'KOHLER' | 'Kallista' | 'Schlage' | 'Steelcraft'
  category: 'Grifería' | 'Lavamanos' | 'Inodoros' | 'Duchas' | 'Cerraduras' | 'Herrajes' | 'Puertas' | 'Accesorios'
  subcategory?: string
  description: string
  price: number
  currency: 'CRC' | 'USD'
  finish?: string
  color?: string
  specifications: {
    material?: string
    dimensions?: string
    weight?: string
    warranty?: string
    certification?: string
  }
  imageUrl: string
  inStock: boolean
  stockQuantity: number
  featured?: boolean
  tags: string[]
}

export const mockProducts: Product[] = [
  // KOHLER Grifería
  {
    id: '1',
    sku: 'K-596-CP',
    name: 'Simplice Llave de Cocina con Rociador Extraíble',
    brand: 'KOHLER',
    category: 'Grifería',
    subcategory: 'Cocina',
    description: 'Llave de cocina con diseño contemporáneo, rociador extraíble de alto arco y tecnología de respuesta ProMotion para movimiento suave.',
    price: 285000,
    currency: 'CRC',
    finish: 'Chrome Pulido',
    specifications: {
      material: 'Latón sólido',
      dimensions: '39.4 cm altura x 21.6 cm alcance',
      warranty: '10 años residencial / 5 años comercial',
      certification: 'NSF/ANSI 61, ADA Compliant'
    },
    imageUrl: '/images/products/kohler-simplice.jpg',
    inStock: true,
    stockQuantity: 15,
    featured: true,
    tags: ['cocina', 'rociador', 'chrome', 'alto-arco']
  },
  {
    id: '2',
    sku: 'K-99259-CP',
    name: 'Artifacts Llave de Baño con Manijas de Palanca',
    brand: 'KOHLER',
    category: 'Grifería',
    subcategory: 'Baño',
    description: 'Inspirada en el diseño de principios del siglo XX, con detalles artesanales y acabados premium.',
    price: 195000,
    currency: 'CRC',
    finish: 'Chrome Pulido',
    specifications: {
      material: 'Latón premium',
      dimensions: '12.7 cm altura',
      warranty: '10 años residencial',
      certification: 'WaterSense, CALGreen'
    },
    imageUrl: '/images/products/kohler-artifacts.jpg',
    inStock: true,
    stockQuantity: 22,
    featured: true,
    tags: ['baño', 'lavamanos', 'chrome', 'clásico']
  },

  // KOHLER Lavamanos
  {
    id: '3',
    sku: 'K-2205-0',
    name: 'Tresham Lavamanos Rectangular',
    brand: 'KOHLER',
    category: 'Lavamanos',
    description: 'Lavamanos rectangular de diseño atemporal con líneas limpias y proporciones clásicas.',
    price: 425000,
    currency: 'CRC',
    color: 'Blanco',
    specifications: {
      material: 'Vitreous China',
      dimensions: '76.2 cm x 54.6 cm x 21 cm',
      warranty: '10 años residencial',
      certification: 'ADA Compliant cuando se instala según especificaciones'
    },
    imageUrl: '/images/products/kohler-tresham-sink.jpg',
    inStock: true,
    stockQuantity: 8,
    featured: true,
    tags: ['rectangular', 'undermount', 'vitreous-china']
  },
  {
    id: '4',
    sku: 'K-2355-0',
    name: 'Archer Lavamanos con Pedestal',
    brand: 'KOHLER',
    category: 'Lavamanos',
    description: 'Diseño elegante con líneas refinadas y detalles arquitectónicos distintivos.',
    price: 385000,
    currency: 'CRC',
    color: 'Blanco',
    specifications: {
      material: 'Vitreous China',
      dimensions: '66 cm x 53.3 cm x 86.4 cm altura',
      warranty: '10 años residencial',
      certification: 'ADA Compliant'
    },
    imageUrl: '/images/products/kohler-archer-pedestal.jpg',
    inStock: true,
    stockQuantity: 6,
    tags: ['pedestal', 'traditional', 'ada-compliant']
  },

  // KOHLER Inodoros
  {
    id: '5',
    sku: 'K-3988-0',
    name: 'Wellworth Inodoro de Dos Piezas',
    brand: 'KOHLER',
    category: 'Inodoros',
    description: 'Inodoro de alto rendimiento con tecnología Class Five para limpieza excepcional.',
    price: 485000,
    currency: 'CRC',
    color: 'Blanco',
    specifications: {
      material: 'Vitreous China',
      dimensions: '74.9 cm largo x 48.9 cm profundidad x 78.7 cm altura',
      warranty: '10 años residencial',
      certification: 'WaterSense (4.8 lpf), ADA Compliant'
    },
    imageUrl: '/images/products/kohler-wellworth.jpg',
    inStock: true,
    stockQuantity: 12,
    featured: true,
    tags: ['two-piece', 'class-five', 'watersense']
  },

  // KOHLER Duchas
  {
    id: '6',
    sku: 'K-45986-CP',
    name: 'Awaken Sistema de Ducha Completo',
    brand: 'KOHLER',
    category: 'Duchas',
    description: 'Sistema de ducha de lujo con cabezal superior de lluvia y rociador de mano con tecnología Katalyst.',
    price: 565000,
    currency: 'CRC',
    finish: 'Chrome Pulido',
    specifications: {
      material: 'Latón premium con acabado durable',
      dimensions: '30.5 cm cabezal de lluvia',
      warranty: '10 años residencial',
      certification: 'WaterSense'
    },
    imageUrl: '/images/products/kohler-awaken.jpg',
    inStock: true,
    stockQuantity: 10,
    featured: true,
    tags: ['rain-shower', 'dual-head', 'katalyst']
  },

  // Kallista Luxury
  {
    id: '7',
    sku: 'KAL-P24402-CR',
    name: 'Vir Stil Llave de Lavamanos Minimalista',
    brand: 'Kallista',
    category: 'Grifería',
    subcategory: 'Baño Premium',
    description: 'Diseño ultra minimalista con geometría pura y acabados artesanales de lujo.',
    price: 725000,
    currency: 'CRC',
    finish: 'Chrome Pulido Premium',
    specifications: {
      material: 'Latón sólido con acabado de joyería',
      dimensions: '17.8 cm altura',
      warranty: '15 años residencial',
      certification: 'WaterSense, CALGreen'
    },
    imageUrl: '/images/products/kallista-vir-stil.jpg',
    inStock: true,
    stockQuantity: 4,
    featured: true,
    tags: ['luxury', 'minimalist', 'premium']
  },

  // Schlage Cerraduras
  {
    id: '8',
    sku: 'SCH-FE595-CAM-619',
    name: 'Camelot Cerradura Electrónica con Teclado',
    brand: 'Schlage',
    category: 'Cerraduras',
    description: 'Cerradura inteligente con teclado táctil, tecnología Bluetooth y compatibilidad con sistemas smart home.',
    price: 285000,
    currency: 'CRC',
    finish: 'Satin Nickel',
    specifications: {
      material: 'Acero endurecido con acabado resistente',
      dimensions: 'Compatible con puertas estándar 3.5cm - 4.5cm',
      warranty: 'Limitada de por vida mecánica / 3 años electrónica',
      certification: 'ANSI/BHMA Grade 2, ADA Compliant'
    },
    imageUrl: '/images/products/schlage-camelot.jpg',
    inStock: true,
    stockQuantity: 18,
    featured: true,
    tags: ['smart-lock', 'keypad', 'bluetooth']
  },
  {
    id: '9',
    sku: 'SCH-F60-ACC-619',
    name: 'Accent Cerradura de Entrada con Deadbolt',
    brand: 'Schlage',
    category: 'Cerraduras',
    description: 'Conjunto de cerradura y deadbolt con diseño contemporáneo y seguridad de grado comercial.',
    price: 145000,
    currency: 'CRC',
    finish: 'Satin Nickel',
    specifications: {
      material: 'Acero forjado',
      dimensions: 'Backset ajustable',
      warranty: 'Limitada de por vida',
      certification: 'ANSI/BHMA Grade 2'
    },
    imageUrl: '/images/products/schlage-accent.jpg',
    inStock: true,
    stockQuantity: 25,
    tags: ['entry-set', 'deadbolt', 'contemporary']
  },

  // Steelcraft Puertas
  {
    id: '10',
    sku: 'STC-90-MIN-20G',
    name: 'Puerta Comercial de Acero Calibre 20',
    brand: 'Steelcraft',
    category: 'Puertas',
    description: 'Puerta de acero de alto tráfico con núcleo honeycomb, ideal para aplicaciones comerciales.',
    price: 485000,
    currency: 'CRC',
    color: 'Galvanizado (Lista para pintar)',
    specifications: {
      material: 'Acero galvanizado calibre 20',
      dimensions: '91 cm x 213 cm (36" x 84")',
      warranty: '10 años',
      certification: 'NFPA 80, UL 10C Fire Rating disponible'
    },
    imageUrl: '/images/products/steelcraft-commercial.jpg',
    inStock: true,
    stockQuantity: 5,
    tags: ['commercial', 'steel', 'fire-rated']
  },

  // Más productos KOHLER
  {
    id: '11',
    sku: 'K-76213-4-CP',
    name: 'Barossa Llave de Cocina con Rociador Lateral',
    brand: 'KOHLER',
    category: 'Grifería',
    subcategory: 'Cocina',
    description: 'Diseño profesional con acabado resistente a manchas y corrosión.',
    price: 325000,
    currency: 'CRC',
    finish: 'Chrome Pulido',
    specifications: {
      material: 'Latón con acabado Resist',
      dimensions: '43.2 cm altura',
      warranty: '10 años residencial',
      certification: 'NSF/ANSI 61'
    },
    imageUrl: '/images/products/kohler-barossa.jpg',
    inStock: true,
    stockQuantity: 14,
    tags: ['professional', 'side-spray', 'resist-finish']
  },
  {
    id: '12',
    sku: 'K-4734-0',
    name: 'Memoirs Lavamanos Pedestal Clásico',
    brand: 'KOHLER',
    category: 'Lavamanos',
    description: 'Inspirado en la arquitectura estadounidense clásica con detalles sofisticados.',
    price: 445000,
    currency: 'CRC',
    color: 'Blanco',
    specifications: {
      material: 'Vitreous China',
      dimensions: '61 cm x 54.6 cm x 87.6 cm altura',
      warranty: '10 años residencial',
      certification: 'ADA Compliant'
    },
    imageUrl: '/images/products/kohler-memoirs.jpg',
    inStock: true,
    stockQuantity: 7,
    tags: ['classic', 'pedestal', 'traditional']
  }
]

// Helper functions
export function getProductsByCategory(category: Product['category']): Product[] {
  return mockProducts.filter(p => p.category === category)
}

export function getProductsByBrand(brand: Product['brand']): Product[] {
  return mockProducts.filter(p => p.brand === brand)
}

export function getFeaturedProducts(): Product[] {
  return mockProducts.filter(p => p.featured)
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase()
  return mockProducts.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    p.brand.toLowerCase().includes(lowerQuery)
  )
}
