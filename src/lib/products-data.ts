/**
 * Alumimundo Product Catalog Data
 * Based on actual brands offered: KOHLER, Kallista, Schlage, Tarkett,
 * Hunter Douglas, Steelcraft, Zurn, Fritz Hansen, Artemide, Vondom
 */

export type ProductBrand =
  | 'KOHLER'
  | 'Kallista'
  | 'Schlage'
  | 'Tarkett'
  | 'Hunter Douglas'
  | 'Steelcraft'
  | 'Zurn'
  | 'Fritz Hansen'
  | 'Artemide'
  | 'Vondom'
  | 'Armstrong'
  | 'Elkay'
  | 'Baldwin'

export type ProductCategory =
  | 'Grifería' // Faucets
  | 'Lavamanos' // Sinks
  | 'Inodoros' // Toilets
  | 'Duchas' // Showers
  | 'Cerraduras' // Locks
  | 'Herrajes' // Hardware
  | 'Puertas' // Doors
  | 'Pisos' // Flooring
  | 'Alfombras' // Carpet
  | 'Persianas' // Window Treatments
  | 'Iluminación' // Lighting
  | 'Mobiliario' // Furniture
  | 'Plomería Comercial' // Commercial Plumbing
  | 'Accesorios' // Accessories

export interface ProductSpecifications {
  material?: string
  dimensions?: string
  weight?: string
  warranty?: string
  certifications?: string[]
  finishes?: string[]
  colors?: string[]
  fireRating?: string
  features?: string[]
}

export interface Product {
  id: string
  sku: string
  name: string
  nameEs?: string
  brand: ProductBrand
  category: ProductCategory
  subcategory?: string
  description: string
  descriptionEs?: string
  price?: number
  priceRange?: { min: number; max: number }
  currency: 'CRC' | 'USD'
  finish?: string
  color?: string
  specifications: ProductSpecifications
  imageUrl: string
  galleryImages?: string[]
  inStock: boolean
  stockQuantity?: number
  leadTime?: string
  featured?: boolean
  tags: string[]
  catalogUrl?: string
}

export const productsDatabase: Product[] = [
  // ==================== KOHLER - Kitchen Faucets ====================
  {
    id: 'kohler-1',
    sku: 'K-596-CP',
    name: 'Simplice Pull-Down Kitchen Faucet',
    nameEs: 'Llave de Cocina Simplice con Rociador Extraíble',
    brand: 'KOHLER',
    category: 'Grifería',
    subcategory: 'Cocina',
    description: 'Contemporary high-arc pull-down kitchen faucet with ProMotion technology for smooth operation.',
    descriptionEs: 'Llave de cocina contemporánea de alto arco con rociador extraíble y tecnología ProMotion para operación suave.',
    price: 285000,
    currency: 'CRC',
    finish: 'Polished Chrome',
    specifications: {
      material: 'Solid brass',
      dimensions: '39.4 cm altura x 21.6 cm alcance',
      warranty: '10 años residencial / 5 años comercial',
      certifications: ['NSF/ANSI 61', 'ADA Compliant'],
      finishes: ['Polished Chrome', 'Vibrant Stainless', 'Matte Black'],
      features: ['ProMotion technology', 'Pull-down spray head', 'MasterClean spray face']
    },
    imageUrl: '/images/products/kohler-simplice.jpg',
    galleryImages: [
      '/images/products/kohler-simplice-2.jpg',
      '/images/products/kohler-simplice-3.jpg',
      '/images/products/kohler-simplice-4.jpg',
      '/images/products/kohler-simplice-detail.jpg'
    ],
    inStock: true,
    stockQuantity: 15,
    featured: true,
    tags: ['cocina', 'rociador', 'chrome', 'alto-arco', 'technology', '360-view'],
    catalogUrl: 'https://www.kohler.com/en/products/kitchen-faucets/simplice'
  },
  {
    id: 'kohler-2',
    sku: 'K-76213-4-CP',
    name: 'Barossa Kitchen Faucet with Side Spray',
    nameEs: 'Llave de Cocina Barossa con Rociador Lateral',
    brand: 'KOHLER',
    category: 'Grifería',
    subcategory: 'Cocina',
    description: 'Professional-grade kitchen faucet with Resist finish that resists fingerprints and water spots.',
    descriptionEs: 'Llave de cocina de grado profesional con acabado Resist que resiste huellas y manchas de agua.',
    price: 325000,
    currency: 'CRC',
    finish: 'Polished Chrome',
    specifications: {
      material: 'Brass with Resist finish',
      dimensions: '43.2 cm altura',
      warranty: '10 años residencial',
      certifications: ['NSF/ANSI 61'],
      finishes: ['Polished Chrome', 'Vibrant Stainless', 'Oil-Rubbed Bronze'],
      features: ['Resist finish', 'Side spray', 'High-arc spout']
    },
    imageUrl: '/images/products/kohler-barossa.jpg',
    inStock: true,
    stockQuantity: 14,
    tags: ['professional', 'side-spray', 'resist-finish'],
    catalogUrl: 'https://www.kohler.com/en/products/kitchen-faucets/barossa'
  },

  // ==================== KOHLER - Bathroom Faucets ====================
  {
    id: 'kohler-3',
    sku: 'K-99259-CP',
    name: 'Artifacts Bathroom Faucet with Lever Handles',
    nameEs: 'Llave de Baño Artifacts con Manijas de Palanca',
    brand: 'KOHLER',
    category: 'Grifería',
    subcategory: 'Baño',
    description: 'Inspired by early 1900s design with artisan details and premium finishes.',
    descriptionEs: 'Inspirada en el diseño de principios del siglo XX con detalles artesanales y acabados premium.',
    price: 195000,
    currency: 'CRC',
    finish: 'Polished Chrome',
    specifications: {
      material: 'Premium brass',
      dimensions: '12.7 cm altura',
      warranty: '10 años residencial',
      certifications: ['WaterSense', 'CALGreen'],
      finishes: ['Polished Chrome', 'Vibrant Brushed Nickel', 'Oil-Rubbed Bronze'],
      features: ['WaterSense certified', 'Lever handles', 'Victorian inspired']
    },
    imageUrl: '/images/products/kohler-artifacts.jpg',
    inStock: true,
    stockQuantity: 22,
    featured: true,
    tags: ['baño', 'lavamanos', 'chrome', 'clásico', 'victorian'],
    catalogUrl: 'https://www.kohler.com/en/products/bathroom-faucets/artifacts'
  },

  // ==================== KOHLER - Sinks ====================
  {
    id: 'kohler-4',
    sku: 'K-2205-0',
    name: 'Tresham Rectangular Undermount Sink',
    nameEs: 'Lavamanos Rectangular Tresham',
    brand: 'KOHLER',
    category: 'Lavamanos',
    description: 'Rectangular undermount sink with timeless design and clean lines.',
    descriptionEs: 'Lavamanos rectangular con diseño atemporal y líneas limpias.',
    price: 425000,
    currency: 'CRC',
    color: 'White',
    specifications: {
      material: 'Vitreous China',
      dimensions: '76.2 cm x 54.6 cm x 21 cm',
      warranty: '10 años residencial',
      certifications: ['ADA Compliant cuando se instala según especificaciones'],
      colors: ['White', 'Biscuit', 'Almond'],
      features: ['Undermount installation', 'Overflow drain', 'Rectangular basin']
    },
    imageUrl: '/images/products/kohler-tresham-sink.jpg',
    inStock: true,
    stockQuantity: 8,
    featured: true,
    tags: ['rectangular', 'undermount', 'vitreous-china', 'ada-compliant'],
    catalogUrl: 'https://www.kohler.com/en/products/bathroom-sinks/tresham'
  },
  {
    id: 'kohler-5',
    sku: 'K-2355-0',
    name: 'Archer Pedestal Sink',
    nameEs: 'Lavamanos con Pedestal Archer',
    brand: 'KOHLER',
    category: 'Lavamanos',
    description: 'Elegant pedestal sink with refined lines and distinctive architectural details.',
    descriptionEs: 'Lavamanos con pedestal elegante con líneas refinadas y detalles arquitectónicos distintivos.',
    price: 385000,
    currency: 'CRC',
    color: 'White',
    specifications: {
      material: 'Vitreous China',
      dimensions: '66 cm x 53.3 cm x 86.4 cm altura',
      warranty: '10 años residencial',
      certifications: ['ADA Compliant'],
      colors: ['White', 'Biscuit'],
      features: ['Pedestal design', '8" centers', 'Overflow drain']
    },
    imageUrl: '/images/products/kohler-archer-pedestal.jpg',
    inStock: true,
    stockQuantity: 6,
    tags: ['pedestal', 'traditional', 'ada-compliant'],
    catalogUrl: 'https://www.kohler.com/en/products/bathroom-sinks/archer'
  },
  {
    id: 'kohler-6',
    sku: 'K-4734-0',
    name: 'Memoirs Pedestal Sink',
    nameEs: 'Lavamanos Pedestal Memoirs Clásico',
    brand: 'KOHLER',
    category: 'Lavamanos',
    description: 'Inspired by classic American architecture with sophisticated details.',
    descriptionEs: 'Inspirado en la arquitectura estadounidense clásica con detalles sofisticados.',
    price: 445000,
    currency: 'CRC',
    color: 'White',
    specifications: {
      material: 'Vitreous China',
      dimensions: '61 cm x 54.6 cm x 87.6 cm altura',
      warranty: '10 años residencial',
      certifications: ['ADA Compliant'],
      colors: ['White', 'Biscuit', 'Almond'],
      features: ['Classic design', 'Pedestal conceals plumbing', '4" or 8" centers']
    },
    imageUrl: '/images/products/kohler-memoirs.jpg',
    inStock: true,
    stockQuantity: 7,
    tags: ['classic', 'pedestal', 'traditional', 'american-architecture'],
    catalogUrl: 'https://www.kohler.com/en/products/bathroom-sinks/memoirs'
  },

  // ==================== KOHLER - Toilets ====================
  {
    id: 'kohler-7',
    sku: 'K-3988-0',
    name: 'Wellworth Two-Piece Toilet',
    nameEs: 'Inodoro de Dos Piezas Wellworth',
    brand: 'KOHLER',
    category: 'Inodoros',
    description: 'High-performance two-piece toilet with Class Five flushing technology.',
    descriptionEs: 'Inodoro de alto rendimiento de dos piezas con tecnología de descarga Class Five.',
    price: 485000,
    currency: 'CRC',
    color: 'White',
    specifications: {
      material: 'Vitreous China',
      dimensions: '74.9 cm largo x 48.9 cm profundidad x 78.7 cm altura',
      warranty: '10 años residencial',
      certifications: ['WaterSense (4.8 lpf)', 'ADA Compliant'],
      colors: ['White', 'Biscuit', 'Almond'],
      features: ['Class Five flushing', 'Elongated bowl', 'Left-hand trip lever', 'Comfort Height']
    },
    imageUrl: '/images/products/kohler-wellworth.jpg',
    inStock: true,
    stockQuantity: 12,
    featured: true,
    tags: ['two-piece', 'class-five', 'watersense', 'comfort-height'],
    catalogUrl: 'https://www.kohler.com/en/products/toilets/wellworth'
  },

  // ==================== KOHLER - Shower Systems ====================
  {
    id: 'kohler-8',
    sku: 'K-45986-CP',
    name: 'Awaken Complete Shower System',
    nameEs: 'Sistema de Ducha Completo Awaken',
    brand: 'KOHLER',
    category: 'Duchas',
    description: 'Luxury shower system with rain showerhead and handshower with Katalyst technology.',
    descriptionEs: 'Sistema de ducha de lujo con cabezal de lluvia y rociador de mano con tecnología Katalyst.',
    price: 565000,
    currency: 'CRC',
    finish: 'Polished Chrome',
    specifications: {
      material: 'Premium brass with durable finish',
      dimensions: '30.5 cm rain head diameter',
      warranty: '10 años residencial',
      certifications: ['WaterSense'],
      finishes: ['Polished Chrome', 'Vibrant Brushed Nickel', 'Matte Black'],
      features: ['Katalyst spray', 'Rain showerhead', 'Handshower', 'Slide bar']
    },
    imageUrl: '/images/products/kohler-awaken.jpg',
    inStock: true,
    stockQuantity: 10,
    featured: true,
    tags: ['rain-shower', 'dual-head', 'katalyst', 'luxury'],
    catalogUrl: 'https://www.kohler.com/en/products/shower-systems/awaken'
  },

  // ==================== KALLISTA - Luxury Fixtures ====================
  {
    id: 'kallista-1',
    sku: 'KAL-P24402-CR',
    name: 'Vir Stil Minimalist Lavatory Faucet',
    nameEs: 'Llave de Lavamanos Minimalista Vir Stil',
    brand: 'Kallista',
    category: 'Grifería',
    subcategory: 'Baño Premium',
    description: 'Ultra-minimalist design with pure geometry and artisan luxury finishes.',
    descriptionEs: 'Diseño ultra minimalista con geometría pura y acabados artesanales de lujo.',
    price: 725000,
    currency: 'CRC',
    finish: 'Premium Polished Chrome',
    specifications: {
      material: 'Solid brass with jewelry-grade finish',
      dimensions: '17.8 cm altura',
      warranty: '15 años residencial',
      certifications: ['WaterSense', 'CALGreen'],
      finishes: ['Polished Chrome', 'Polished Nickel', 'Unlacquered Brass', 'Matte Black'],
      features: ['Minimalist design', 'Luxury finish', 'Premium materials']
    },
    imageUrl: '/images/products/kallista-vir-stil.jpg',
    inStock: true,
    stockQuantity: 4,
    featured: true,
    tags: ['luxury', 'minimalist', 'premium', 'designer'],
    catalogUrl: 'https://www.kallista.com/en/products/vir-stil'
  },

  // ==================== SCHLAGE - Smart Locks ====================
  {
    id: 'schlage-1',
    sku: 'SCH-FE595-CAM-619',
    name: 'Camelot Electronic Keypad Lock',
    nameEs: 'Cerradura Electrónica Camelot con Teclado',
    brand: 'Schlage',
    category: 'Cerraduras',
    description: 'Smart lock with touchscreen keypad, Bluetooth technology and smart home compatibility.',
    descriptionEs: 'Cerradura inteligente con teclado táctil, tecnología Bluetooth y compatibilidad con sistemas smart home.',
    price: 285000,
    currency: 'CRC',
    finish: 'Satin Nickel',
    specifications: {
      material: 'Hardened steel with durable finish',
      dimensions: 'Compatible with 3.5cm - 4.5cm doors',
      warranty: 'Lifetime mechanical / 3 years electronic',
      certifications: ['ANSI/BHMA Grade 2', 'ADA Compliant'],
      finishes: ['Satin Nickel', 'Aged Bronze', 'Matte Black'],
      features: ['Bluetooth enabled', 'Keypad entry', 'Smart home compatible', 'Built-in alarm']
    },
    imageUrl: '/images/products/schlage-camelot.jpg',
    inStock: true,
    stockQuantity: 18,
    featured: true,
    tags: ['smart-lock', 'keypad', 'bluetooth', 'security'],
    catalogUrl: 'https://www.schlage.com/en/home/smart-locks/camelot'
  },
  {
    id: 'schlage-2',
    sku: 'SCH-F60-ACC-619',
    name: 'Accent Entry Set with Deadbolt',
    nameEs: 'Cerradura de Entrada Accent con Deadbolt',
    brand: 'Schlage',
    category: 'Cerraduras',
    description: 'Entry set and deadbolt combo with contemporary design and commercial-grade security.',
    descriptionEs: 'Conjunto de cerradura y deadbolt con diseño contemporáneo y seguridad de grado comercial.',
    price: 145000,
    currency: 'CRC',
    finish: 'Satin Nickel',
    specifications: {
      material: 'Forged steel',
      dimensions: 'Adjustable backset',
      warranty: 'Lifetime limited',
      certifications: ['ANSI/BHMA Grade 2'],
      finishes: ['Satin Nickel', 'Aged Bronze', 'Polished Chrome', 'Matte Black'],
      features: ['Deadbolt included', 'Pick-resistant', 'Adjustable backset']
    },
    imageUrl: '/images/products/schlage-accent.jpg',
    inStock: true,
    stockQuantity: 25,
    tags: ['entry-set', 'deadbolt', 'contemporary', 'security'],
    catalogUrl: 'https://www.schlage.com/en/home/products/accent'
  },

  // ==================== TARKETT - Flooring ====================
  {
    id: 'tarkett-1',
    sku: 'TRKT-IQ-GRANIT-3040375',
    name: 'iQ Granit Homogeneous Vinyl',
    nameEs: 'Piso Vinílico Homogéneo iQ Granit',
    brand: 'Tarkett',
    category: 'Pisos',
    subcategory: 'Vinílico',
    description: 'Homogeneous vinyl flooring with through-color design for high-traffic areas.',
    descriptionEs: 'Piso vinílico homogéneo con diseño de color continuo para áreas de alto tráfico.',
    priceRange: { min: 45000, max: 65000 },
    currency: 'CRC',
    specifications: {
      material: 'Homogeneous vinyl',
      dimensions: '2m ancho x rollo',
      warranty: '15 años comercial',
      certifications: ['FloorScore', 'GREENGUARD Gold', 'NSF/ANSI 332'],
      colors: ['Multiple granit patterns'],
      features: ['Through-color design', 'High durability', 'Low maintenance', 'Anti-slip']
    },
    imageUrl: '/images/products/tarkett-iq-granit.jpg',
    inStock: true,
    featured: true,
    tags: ['commercial', 'vinyl', 'high-traffic', 'healthcare'],
    catalogUrl: 'https://commercial.tarkett.com/products/resilient/iq-granit'
  },
  {
    id: 'tarkett-2',
    sku: 'TRKT-QUIET-EDIT-24x24',
    name: 'Quiet Edit Carpet Tile Collection',
    nameEs: 'Alfombra Modular Colección Quiet Edit',
    brand: 'Tarkett',
    category: 'Alfombras',
    subcategory: 'Modular',
    description: 'High-performance carpet tile inspired by repurposed materials aesthetic.',
    descriptionEs: 'Alfombra modular de alto rendimiento inspirada en la estética de materiales reutilizados.',
    priceRange: { min: 35000, max: 48000 },
    currency: 'CRC',
    specifications: {
      material: 'Solution-dyed nylon',
      dimensions: '24" x 24" (60.96 cm x 60.96 cm)',
      warranty: 'Lifetime commercial',
      certifications: ['NSF 140 Gold', 'CRI Green Label Plus'],
      colors: ['Breathless', 'Solace', 'Thunders'],
      features: ['Modular installation', 'Easy replacement', 'Sound absorption', 'Sustainable']
    },
    imageUrl: '/images/products/tarkett-quiet-edit.jpg',
    inStock: true,
    featured: true,
    leadTime: '2-3 semanas',
    tags: ['carpet-tile', 'modular', 'sustainable', 'office'],
    catalogUrl: 'https://commercial.tarkett.com/products/carpet/quiet-edit'
  },
  {
    id: 'tarkett-3',
    sku: 'TRKT-EVENT-LVT-MELANGE',
    name: 'Event LVT Melange Collection',
    nameEs: 'Loseta Vinílica de Lujo Event Melange',
    brand: 'Tarkett',
    category: 'Pisos',
    subcategory: 'LVT',
    description: 'Luxury vinyl tile with realistic stone and wood visuals.',
    descriptionEs: 'Loseta vinílica de lujo con visuales realistas de piedra y madera.',
    priceRange: { min: 38000, max: 52000 },
    currency: 'CRC',
    specifications: {
      material: 'Luxury Vinyl Tile (LVT)',
      dimensions: '18" x 18" (45.72 cm x 45.72 cm)',
      warranty: '15 años comercial / 20 años residencial',
      certifications: ['FloorScore', 'GREENGUARD Gold'],
      colors: ['Siltstone', 'Pietro Onyx', 'Multiple wood tones'],
      features: ['Realistic visuals', 'Easy maintenance', 'Waterproof core', 'Scratch resistant']
    },
    imageUrl: '/images/products/tarkett-event-lvt.jpg',
    inStock: true,
    tags: ['lvt', 'luxury-vinyl', 'waterproof', 'hospitality'],
    catalogUrl: 'https://commercial.tarkett.com/products/resilient/event-lvt'
  },

  // ==================== STEELCRAFT - Commercial Doors ====================
  {
    id: 'steelcraft-1',
    sku: 'STC-90-MIN-20G',
    name: '90-Minute Fire-Rated Steel Door 20-Gauge',
    nameEs: 'Puerta Comercial de Acero Calibre 20 con Resistencia al Fuego',
    brand: 'Steelcraft',
    category: 'Puertas',
    description: 'Commercial-grade steel door with 90-minute fire rating and honeycomb core.',
    descriptionEs: 'Puerta de acero de grado comercial con resistencia al fuego de 90 minutos y núcleo honeycomb.',
    price: 485000,
    currency: 'CRC',
    color: 'Galvanized (Ready to paint)',
    specifications: {
      material: '20-gauge galvanized steel',
      dimensions: '91 cm x 213 cm (36" x 84")',
      warranty: '10 años',
      certifications: ['NFPA 80', 'UL 10C Fire Rating'],
      fireRating: '90-minute',
      features: ['Honeycomb core', 'Fire rated', 'Ready to paint', 'Heavy-duty']
    },
    imageUrl: '/images/products/steelcraft-commercial.jpg',
    inStock: true,
    stockQuantity: 5,
    leadTime: '3-4 semanas',
    tags: ['commercial', 'steel', 'fire-rated', 'institutional'],
    catalogUrl: 'https://www.steelcraft.com/products/doors'
  },

  // ==================== HUNTER DOUGLAS - Window Treatments ====================
  {
    id: 'hunterdouglas-1',
    sku: 'HD-DUETTE-HONEYCOMB',
    name: 'Duette Honeycomb Shades',
    nameEs: 'Persianas Celulares Duette',
    brand: 'Hunter Douglas',
    category: 'Persianas',
    description: 'Energy-efficient cellular shades with honeycomb design for superior insulation.',
    descriptionEs: 'Persianas celulares energéticamente eficientes con diseño honeycomb para aislamiento superior.',
    priceRange: { min: 120000, max: 350000 },
    currency: 'CRC',
    specifications: {
      material: 'Fabric cells',
      warranty: 'Lifetime limited',
      certifications: ['Energy Star Partner'],
      colors: ['100+ fabric options'],
      features: ['Energy efficient', 'Light filtering options', 'Blackout options', 'Motorization available']
    },
    imageUrl: '/images/products/hunter-douglas-duette.jpg',
    inStock: true,
    featured: true,
    leadTime: 'Hecho a medida - 2-3 semanas',
    tags: ['honeycomb', 'energy-efficient', 'motorized', 'custom'],
    catalogUrl: 'https://www.hunterdouglas.com/duette-honeycomb-shades'
  },
  {
    id: 'hunterdouglas-2',
    sku: 'HD-POWERVIEW-AUTO',
    name: 'PowerView Automation System',
    nameEs: 'Sistema de Automatización PowerView',
    brand: 'Hunter Douglas',
    category: 'Persianas',
    subcategory: 'Automatización',
    description: 'Smart home automation system for motorized window treatments.',
    descriptionEs: 'Sistema de automatización smart home para persianas motorizadas.',
    priceRange: { min: 450000, max: 850000 },
    currency: 'CRC',
    specifications: {
      warranty: '5 años',
      features: ['App control', 'Voice control (Alexa, Google, Siri)', 'Scheduling', 'Scene creation']
    },
    imageUrl: '/images/products/hunter-douglas-powerview.jpg',
    inStock: true,
    featured: true,
    tags: ['automation', 'smart-home', 'motorized', 'app-control'],
    catalogUrl: 'https://www.hunterdouglas.com/powerview-automation'
  },

  // ==================== ZURN - Commercial Plumbing ====================
  {
    id: 'zurn-1',
    sku: 'ZURN-Z1900-FD',
    name: 'Commercial Floor Drain',
    nameEs: 'Drenaje de Piso Comercial',
    brand: 'Zurn',
    category: 'Plomería Comercial',
    description: 'Heavy-duty commercial floor drain for high-traffic areas.',
    descriptionEs: 'Drenaje de piso comercial de servicio pesado para áreas de alto tráfico.',
    priceRange: { min: 85000, max: 165000 },
    currency: 'CRC',
    specifications: {
      material: 'Cast iron / Stainless steel',
      warranty: '1 año',
      certifications: ['ASME A112.6.3'],
      features: ['Removable strainer', 'Sediment bucket', 'Multiple grate options']
    },
    imageUrl: '/images/products/zurn-floor-drain.jpg',
    inStock: true,
    tags: ['commercial-plumbing', 'floor-drain', 'heavy-duty'],
    catalogUrl: 'https://www.zurn.com/products/drains'
  },

  // ==================== FRITZ HANSEN - Designer Furniture ====================
  {
    id: 'fritzhansen-1',
    sku: 'FH-SERIES7-3107',
    name: 'Series 7 Chair by Arne Jacobsen',
    nameEs: 'Silla Series 7 de Arne Jacobsen',
    brand: 'Fritz Hansen',
    category: 'Mobiliario',
    subcategory: 'Sillas',
    description: 'Iconic Danish design chair, the most sold chair by Fritz Hansen.',
    descriptionEs: 'Silla icónica de diseño danés, la más vendida de Fritz Hansen.',
    priceRange: { min: 450000, max: 650000 },
    currency: 'CRC',
    specifications: {
      material: 'Molded veneer, chrome or powder-coated steel legs',
      warranty: '5 años',
      colors: ['Natural wood', 'Lacquered colors', 'Upholstered options'],
      features: ['Iconic design', 'Stackable', 'Multiple finish options', 'Contract grade']
    },
    imageUrl: '/images/products/fritzhansen-series7.jpg',
    inStock: false,
    leadTime: '8-12 semanas',
    featured: true,
    tags: ['designer', 'danish-design', 'iconic', 'contract'],
    catalogUrl: 'https://fritzhansen.com/products/chairs/series-7'
  },

  // ==================== ARTEMIDE - Lighting ====================
  {
    id: 'artemide-1',
    sku: 'ART-TOLOMEO-DESK',
    name: 'Tolomeo Desk Lamp',
    nameEs: 'Lámpara de Escritorio Tolomeo',
    brand: 'Artemide',
    category: 'Iluminación',
    subcategory: 'Escritorio',
    description: 'Iconic Italian task lighting with adjustable arm and balanced movement.',
    descriptionEs: 'Iluminación de tarea italiana icónica con brazo ajustable y movimiento balanceado.',
    priceRange: { min: 385000, max: 525000 },
    currency: 'CRC',
    specifications: {
      material: 'Aluminum',
      warranty: '2 años',
      certifications: ['Energy Star qualified models available'],
      colors: ['Aluminum', 'Black', 'White'],
      features: ['LED option', 'Fully adjustable', 'Balanced arm', 'Iconic design']
    },
    imageUrl: '/images/products/artemide-tolomeo.jpg',
    inStock: true,
    stockQuantity: 6,
    featured: true,
    tags: ['task-lighting', 'iconic', 'adjustable', 'italian-design'],
    catalogUrl: 'https://www.artemide.com/products/tolomeo'
  },

  // ==================== VONDOM - Outdoor Furniture ====================
  {
    id: 'vondom-1',
    sku: 'VND-FURA-PLANTER',
    name: 'Fura Illuminated Planter',
    nameEs: 'Maceta Iluminada Fura',
    brand: 'Vondom',
    category: 'Mobiliario',
    subcategory: 'Exterior',
    description: 'Contemporary illuminated planter for outdoor spaces.',
    descriptionEs: 'Maceta iluminada contemporánea para espacios exteriores.',
    priceRange: { min: 285000, max: 485000 },
    currency: 'CRC',
    specifications: {
      material: 'Rotomolded polyethylene',
      warranty: '2 años',
      colors: ['White', 'Black', 'Red', 'LED illuminated'],
      features: ['UV-resistant', 'Weatherproof', 'LED lighting option', 'Lightweight']
    },
    imageUrl: '/images/products/vondom-fura.jpg',
    inStock: true,
    tags: ['outdoor', 'planter', 'illuminated', 'contemporary'],
    catalogUrl: 'https://vondom.com/products/planters/fura'
  }
]

// ==================== Helper Functions ====================

export function getProductsByCategory(category: ProductCategory): Product[] {
  return productsDatabase.filter(p => p.category === category)
}

export function getProductsByBrand(brand: ProductBrand): Product[] {
  return productsDatabase.filter(p => p.brand === brand)
}

export function getFeaturedProducts(): Product[] {
  return productsDatabase.filter(p => p.featured === true)
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase()
  return productsDatabase.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.nameEs?.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.descriptionEs?.toLowerCase().includes(lowerQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    p.brand.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery)
  )
}

export function getProductById(id: string): Product | undefined {
  return productsDatabase.find(p => p.id === id)
}

export function getProductsBySku(sku: string): Product | undefined {
  return productsDatabase.find(p => p.sku === sku)
}

export function getAvailableBrands(): ProductBrand[] {
  const brands = new Set(productsDatabase.map(p => p.brand))
  return Array.from(brands).sort()
}

export function getAvailableCategories(): ProductCategory[] {
  const categories = new Set(productsDatabase.map(p => p.category))
  return Array.from(categories).sort()
}

export function getProductsByPriceRange(min: number, max: number, currency: 'CRC' | 'USD' = 'CRC'): Product[] {
  return productsDatabase.filter(p => {
    if (p.currency !== currency) return false
    if (p.price) {
      return p.price >= min && p.price <= max
    }
    if (p.priceRange) {
      return p.priceRange.min <= max && p.priceRange.max >= min
    }
    return false
  })
}
