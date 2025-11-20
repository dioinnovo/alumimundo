/**
 * Column name mapping for Alumimundo - Spanish user-friendly display names
 * Maps database column names to human-readable Spanish/bilingual labels
 */

export const COLUMN_NAME_MAPPING: Record<string, string> = {
  // Project fields - Proyectos
  id: "ID",
  projectNumber: "Número de Proyecto",
  name: "Nombre",
  type: "Tipo",
  status: "Estado",
  priority: "Prioridad",
  location: "Ubicación",
  city: "Ciudad",
  province: "Provincia",
  country: "País",
  budgetAmount: "Presupuesto",
  actualCost: "Costo Real",
  currency: "Moneda",
  startDate: "Fecha Inicio",
  completionDate: "Fecha Finalización",
  squareMeters: "Metros Cuadrados",
  complexityScore: "Complejidad",
  riskScore: "Riesgo",
  clientName: "Cliente",
  clientEmail: "Email Cliente",
  clientPhone: "Teléfono Cliente",
  clientCompany: "Empresa Cliente",
  architectName: "Arquitecto",
  contractorName: "Contratista",

  // Specification fields - Especificaciones
  specNumber: "Número de Especificación",
  category: "Categoría",
  productFamily: "Familia de Producto",
  quantity: "Cantidad",
  unitPrice: "Precio Unitario",
  totalPrice: "Precio Total",
  productSKU: "SKU",
  productName: "Nombre de Producto",
  productModel: "Modelo",
  finish: "Acabado",
  installationDate: "Fecha de Instalación",
  installerName: "Instalador",
  aiConfidence: "Confianza IA",
  alternatives: "Alternativas",
  approvedAt: "Aprobado",

  // Product fields - Productos
  sku: "SKU",
  nameEs: "Nombre (ES)",
  brand: "Marca",
  subcategory: "Subcategoría",
  isADACompliant: "Cumple ADA",
  isMarineGrade: "Grado Marino",
  isWaterSense: "WaterSense",
  certifications: "Certificaciones",
  costPrice: "Precio Costo",
  listPrice: "Precio Lista",
  priceCRC: "Precio CRC",
  priceUSD: "Precio USD",
  currentStock: "Inventario Actual",
  minStock: "Stock Mínimo",
  maxStock: "Stock Máximo",
  reorderPoint: "Punto de Reorden",
  leadTimeDays: "Tiempo de Entrega (días)",
  weight: "Peso",
  dimensions: "Dimensiones",
  isEcoFriendly: "Eco-Amigable",
  sustainabilityRating: "Calificación Sostenibilidad",
  sourceUrl: "URL Fuente",
  lastScrapedAt: "Última Extracción",
  scrapingEnabled: "Extracción Habilitada",
  providerId: "ID Proveedor",

  // QualityCheck fields - Control de Calidad
  checkNumber: "Número de Inspección",
  area: "Área",
  productCategory: "Categoría de Producto",
  inspectorName: "Inspector",
  overallScore: "Calificación General",
  alignmentScore: "Alineación",
  finishScore: "Acabado",
  functionalityScore: "Funcionalidad",
  photoUrls: "Fotos",
  defectsFound: "Defectos Encontrados",
  aiAnalysis: "Análisis IA",
  approved: "Aprobado",
  approvedBy: "Aprobado Por",
  rejectionReason: "Razón de Rechazo",

  // Document fields - Documentos
  filename: "Nombre de Archivo",
  mimeType: "Tipo",
  size: "Tamaño",
  url: "URL",
  documentType: "Tipo de Documento",
  ocrText: "Texto OCR",
  metadata: "Metadatos",
  generatedByAI: "Generado por IA",
  generationPrompt: "Prompt de Generación",

  // InventoryMovement fields - Movimientos de Inventario
  movementNumber: "Número de Movimiento",
  reason: "Razón",
  reference: "Referencia",
  createdBy: "Creado Por",
  unitCost: "Costo Unitario",
  totalCost: "Costo Total",

  // InventoryAllocation fields - Asignaciones
  allocatedAt: "Asignado",
  releasedAt: "Liberado",

  // Provider fields - Proveedores
  contactEmail: "Email Contacto",
  contactPhone: "Teléfono Contacto",
  salesRepName: "Representante de Ventas",
  catalogUrl: "URL Catálogo",
  scrapingFrequency: "Frecuencia Extracción",
  accountNumber: "Número de Cuenta",
  paymentTerms: "Términos de Pago",
  shippingMethod: "Método de Envío",
  website: "Sitio Web",

  // ProductImage fields - Imágenes
  publicUrl: "URL Pública",
  imageType: "Tipo de Imagen",
  displayOrder: "Orden",
  width: "Ancho",
  height: "Alto",
  fileSize: "Tamaño de Archivo",

  // ScrapeLog fields - Registro de Extracción
  productsFound: "Productos Encontrados",
  productsAdded: "Productos Agregados",
  productsUpdated: "Productos Actualizados",
  imagesDownloaded: "Imágenes Descargadas",
  startedAt: "Inicio",
  completedAt: "Finalización",
  duration: "Duración",
  errors: "Errores",
  errorMessage: "Mensaje de Error",

  // Activity fields - Actividad
  action: "Acción",
  description: "Descripción",
  userId: "ID Usuario",
  userEmail: "Email Usuario",

  // User fields - Usuarios
  email: "Email",
  role: "Rol",
  phone: "Teléfono",
  company: "Empresa",
  position: "Posición",
  lastLoginAt: "Último Acceso",

  // DesignProject fields - Proyectos de Diseño
  propertyType: "Tipo de Propiedad",
  budgetRange: "Rango de Presupuesto",
  totalEstimate: "Estimado Total",

  // DesignArea fields - Áreas de Diseño
  areaType: "Tipo de Área",
  areaName: "Nombre de Área",
  userRequirements: "Requisitos",
  voiceTranscript: "Transcripción de Voz",
  visionAnalysis: "Análisis Visual",
  estimatedCost: "Costo Estimado",
  materialsCost: "Costo de Materiales",
  laborCost: "Costo de Mano de Obra",
  confidenceLevel: "Nivel de Confianza",

  // AreaImage fields - Imágenes de Área
  imageUrl: "URL Imagen",
  thumbnailUrl: "URL Miniatura",
  detectedItems: "Elementos Detectados",
  aiTags: "Etiquetas IA",

  // AreaSpecification fields - Especificaciones de Área
  unit: "Unidad",
  color: "Color",
  specifications: "Especificaciones",
  recommendedByAI: "Recomendado por IA",

  // Common aggregations and calculated fields
  count: "Cantidad",
  total: "Total",
  average: "Promedio",
  avg: "Promedio",
  sum: "Suma",
  min: "Mínimo",
  max: "Máximo",

  // Timestamp fields
  createdAt: "Creado",
  updatedAt: "Actualizado",

  // Additional computed fields commonly used in queries
  variance: "Varianza",
  margin: "Margen",
  percentage: "Porcentaje",
  rate: "Tasa",
  ratio: "Ratio",
  trend: "Tendencia",
  growth: "Crecimiento",
  revenue: "Ingresos",
  profit: "Ganancia",
  cost: "Costo",
  savings: "Ahorros",
  efficiency: "Eficiencia",
  turnover: "Rotación",
  utilization: "Utilización",
};

/**
 * Convert a database column name to a user-friendly Spanish display name
 */
export function getFriendlyColumnName(columnName: string): string {
  // Try exact match first
  if (COLUMN_NAME_MAPPING[columnName]) {
    return COLUMN_NAME_MAPPING[columnName];
  }

  // Try lowercase match
  const lowerMatch = COLUMN_NAME_MAPPING[columnName.toLowerCase()];
  if (lowerMatch) {
    return lowerMatch;
  }

  // Fallback: convert camelCase or snake_case to Title Case
  // Handle camelCase
  const spacedOut = columnName.replace(/([A-Z])/g, ' $1').trim();

  // Handle snake_case
  const words = spacedOut.includes('_')
    ? spacedOut.split('_')
    : spacedOut.split(' ');

  return words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Convert an array of column names to friendly Spanish names
 */
export function getFriendlyColumnNames(columns: string[]): string[] {
  return columns.map(getFriendlyColumnName);
}
