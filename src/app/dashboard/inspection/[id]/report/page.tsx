'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, Download, Send, Share2, FileText,
  CheckCircle, AlertTriangle, TrendingUp, DollarSign,
  Calendar, MapPin, User, Building2, Home, Camera,
  Brain, Lightbulb, Target, Award, Edit, Printer, Mail
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Building/Renovation Estimate Report Data Structure
interface BuildingEstimateReportData {
  metadata: {
    reportId: string
    generatedDate: string
    consultant: string
    property: {
      address: string
      type: 'residential' | 'commercial' | 'institutional'
      existingStructure?: string
      client: string
      projectScope: string
    }
    projectInfo: {
      estimateDate: string
      projectType: 'new_construction' | 'renovation' | 'remodel' | 'addition'
      estimatedDuration: string
      priority: 'standard' | 'expedited'
    }
  }
  executiveSummary: {
    totalEstimatedCost: number
    areasIncluded: number
    productsSpecified: number
    timelineEstimate: string
    confidenceScore: number
    complianceStatus: 'compliant' | 'requires_review' | 'non_compliant'
  }
  areaEstimates: Array<{
    area: string
    category: string
    status: 'specified' | 'partial' | 'pending'
    photoCount: number
    description: string
    estimatedCost: number
    priority: 'high' | 'medium' | 'low'
    products: Array<{
      name: string
      brand: string
      sku: string
      quantity: number
      unitPrice: number
      totalPrice: number
    }>
    specifications: string[]
    complianceNotes: string[]
    installationRequirements?: string[]
    maintenanceGuidelines?: string[]
  }>
  aiRecommendations: {
    costOptimization: number
    sustainabilityScore: number
    qualityIndex: number
    valueEngineering: string
    confidenceMetrics: {
      costAccuracy: number
      productAvailability: number
      timelineReliability: number
      complianceValidation: number
    }
    marketIntelligence: {
      similarProjects: number
      averageCost: number
      timeToCompletion: string
      materialTrends: string
      supplierReliability: string
    }
    predictiveAnalysis: {
      priceStability: string
      deliveryRisk: string
      installationComplexity: string
      maintenanceProjection: string
    }
    recommendations: string[]
    buildingCodes: {
      localRequirements: string
      internationalStandards: string
      certifications: string
      inspectionSchedule: string
    }
    sustainabilityFactors: {
      energyEfficiency: string
      waterConservation: string
      materialSustainability: string
      carbonFootprint: string
      certificationOpportunities: string[]
    }
  }
}

export default function BuildingEstimateReportPage() {
  const params = useParams()
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [email, setEmail] = useState('')

  // Mock data - will be replaced with real database queries
  const reportData: BuildingEstimateReportData = {
    metadata: {
      reportId: params.id as string || 'EST-001',
      generatedDate: new Date().toLocaleDateString('es-CR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      consultant: 'María González - Arquitecta Registrada',
      property: {
        address: 'Escazú, San José, Costa Rica',
        type: 'residential',
        existingStructure: 'Casa unifamiliar de 250m²',
        client: 'Familia Rodríguez',
        projectScope: 'Remodelación integral con ampliación'
      },
      projectInfo: {
        estimateDate: new Date().toLocaleDateString('es-CR'),
        projectType: 'renovation',
        estimatedDuration: '4-6 meses',
        priority: 'standard'
      }
    },
    executiveSummary: {
      totalEstimatedCost: 12500000,
      areasIncluded: 5,
      productsSpecified: 28,
      timelineEstimate: '4-6 meses',
      confidenceScore: 0.92,
      complianceStatus: 'compliant'
    },
    areaEstimates: [
      {
        area: 'Cocina Principal',
        category: 'Remodelación',
        status: 'specified',
        photoCount: 8,
        description: 'Renovación completa de cocina con diseño moderno, electrodomésticos de alta gama, y acabados premium',
        estimatedCost: 4200000,
        priority: 'high',
        products: [
          {
            name: 'KOHLER Simplice Grifería Profesional',
            brand: 'KOHLER',
            sku: 'K-596-VS',
            quantity: 1,
            unitPrice: 450000,
            totalPrice: 450000
          },
          {
            name: 'KOHLER Prolific Fregadero de Acero Inoxidable',
            brand: 'KOHLER',
            sku: 'K-5540-NA',
            quantity: 1,
            unitPrice: 850000,
            totalPrice: 850000
          },
          {
            name: 'Tarkett Pisos Vinílicos Premium',
            brand: 'Tarkett',
            sku: 'TAR-VIN-PRO-001',
            quantity: 25,
            unitPrice: 45000,
            totalPrice: 1125000
          }
        ],
        specifications: [
          'Grifería con tecnología Sweep Spray',
          'Fregadero bajo cubierta de acero inoxidable calibre 16',
          'Pisos resistentes al agua y manchas',
          'Instalación profesional incluida'
        ],
        complianceNotes: [
          'Cumple con códigos de plomería de Costa Rica',
          'Productos con certificación WaterSense',
          'Materiales apropiados para clima tropical'
        ],
        installationRequirements: [
          'Preparación de superficie existente',
          'Instalación de plomería actualizada',
          'Nivelación y acabado de pisos'
        ],
        maintenanceGuidelines: [
          'Limpieza regular con productos no abrasivos',
          'Revisión anual de conexiones de plomería',
          'Sellado de juntas cada 2 años'
        ]
      },
      {
        area: 'Baño Principal',
        category: 'Remodelación',
        status: 'specified',
        photoCount: 6,
        description: 'Transformación de baño principal con ducha de lujo, doble lavamanos y acabados de spa',
        estimatedCost: 3800000,
        priority: 'high',
        products: [
          {
            name: 'KOHLER Purist Grifería de Lavamanos',
            brand: 'KOHLER',
            sku: 'K-14406-4-CP',
            quantity: 2,
            unitPrice: 380000,
            totalPrice: 760000
          },
          {
            name: 'KOHLER Memoirs Lavamanos Pedestal',
            brand: 'KOHLER',
            sku: 'K-5026-0',
            quantity: 2,
            unitPrice: 520000,
            totalPrice: 1040000
          },
          {
            name: 'KOHLER Artifacts Ducha de Lluvia 12"',
            brand: 'KOHLER',
            sku: 'K-72583-CP',
            quantity: 1,
            unitPrice: 680000,
            totalPrice: 680000
          }
        ],
        specifications: [
          'Grifería con acabado cromado pulido',
          'Lavamanos de porcelana vitrificada',
          'Sistema de ducha con control termostático',
          'Accesorios coordinados de la línea Artifacts'
        ],
        complianceNotes: [
          'Cumple ADA para accesibilidad',
          'Válvulas anti-escaldadura incluidas',
          'Certificación EPA WaterSense'
        ],
        installationRequirements: [
          'Impermeabilización completa de paredes',
          'Sistema de drenaje actualizado',
          'Ventilación mecánica adecuada'
        ]
      },
      {
        area: 'Sala y Comedor',
        category: 'Ampliación',
        status: 'specified',
        photoCount: 4,
        description: 'Ampliación de espacio social con nuevos pisos y puertas de alta calidad',
        estimatedCost: 2800000,
        priority: 'medium',
        products: [
          {
            name: 'Tarkett Pisos de Roble Europeo',
            brand: 'Tarkett',
            sku: 'TAR-OAK-EUR-NAT',
            quantity: 55,
            unitPrice: 42000,
            totalPrice: 2310000
          },
          {
            name: 'Schlage Latitude Cerradura Inteligente',
            brand: 'Schlage',
            sku: 'SCH-LAT-SMA-BRZ',
            quantity: 2,
            unitPrice: 245000,
            totalPrice: 490000
          }
        ],
        specifications: [
          'Pisos de madera de ingeniería AAA',
          'Acabado UV de alto tráfico',
          'Cerraduras con conectividad WiFi',
          'Herrajes de bronce envejecido'
        ],
        complianceNotes: [
          'Madera certificada FSC',
          'Resistencia sísmica verificada',
          'Cerraduras grado 1 ANSI/BHMA'
        ]
      }
    ],
    aiRecommendations: {
      costOptimization: 850000,
      sustainabilityScore: 87,
      qualityIndex: 92,
      valueEngineering: 'Posibilidad de optimizar costos en 6.8% manteniendo calidad mediante selección alternativa de acabados',
      confidenceMetrics: {
        costAccuracy: 0.94,
        productAvailability: 0.96,
        timelineReliability: 0.89,
        complianceValidation: 0.98
      },
      marketIntelligence: {
        similarProjects: 47,
        averageCost: 11800000,
        timeToCompletion: '5 meses',
        materialTrends: 'Estabilidad en precios de acabados premium',
        supplierReliability: 'Alta disponibilidad de productos KOHLER y Tarkett'
      },
      predictiveAnalysis: {
        priceStability: 'Estable - Variación esperada <3% en próximos 6 meses',
        deliveryRisk: 'Bajo - Todos los productos en stock local',
        installationComplexity: 'Media - Requiere especialistas certificados',
        maintenanceProjection: 'Bajo mantenimiento - Materiales de larga duración'
      },
      recommendations: [
        'Considerar sistema de recuperación de aguas grises para sostenibilidad',
        'Instalar iluminación LED de alta eficiencia en todas las áreas',
        'Agregar sensores de movimiento en baños para optimizar uso de agua',
        'Evaluar certificación LEED para valor agregado de la propiedad'
      ],
      buildingCodes: {
        localRequirements: 'Código de Construcción de Costa Rica - CCCR 2020',
        internationalStandards: 'IBC 2021, ADA 2010',
        certifications: 'WaterSense, FSC, Energy Star aplicables',
        inspectionSchedule: 'Pre-instalación, durante obra, inspección final'
      },
      sustainabilityFactors: {
        energyEfficiency: 'Reducción estimada del 35% en consumo energético',
        waterConservation: 'Ahorro proyectado de 45% con grifería WaterSense',
        materialSustainability: 'Maderas certificadas y materiales reciclables',
        carbonFootprint: 'Huella reducida con productos de fabricación local',
        certificationOpportunities: [
          'LEED Silver o Gold factible',
          'EDGE Certification disponible',
          'CASA Costa Rica (certificación local sostenible)'
        ]
      }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleDownload = () => {
    // TODO: Implement PDF generation
    console.log('Downloading report...')
    alert('Función de descarga en desarrollo')
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (!email.trim()) {
      alert('Por favor ingresa un correo electrónico')
      return
    }

    // TODO: Implement email sending via API
    console.log('Sharing report to:', email)
    alert(`Reporte enviado a ${email}`)
    setShowShareModal(false)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Volver</span>
              </Button>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-alumimundo-navy/10 dark:bg-alumimundo-navy/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-alumimundo-navy dark:text-alumimundo-teal" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
                  Estimado de Construcción
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {reportData.metadata.reportId} • {reportData.metadata.generatedDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <Card className="p-4 sm:p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-500 dark:border-green-600">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-green-900 dark:text-green-100 mb-1">
                  ¡Estimado Completado!
                </h3>
                <p className="text-xs sm:text-sm text-green-700 dark:text-green-300">
                  Tu estimado profesional de construcción ha sido generado exitosamente con especificaciones detalladas de productos Alumimundo.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Project Overview Card */}
        <Card className="p-4 sm:p-6 mb-6 sm:mb-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                <Building2 className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{reportData.metadata.property.type === 'residential' ? 'Residencial' : reportData.metadata.property.type === 'commercial' ? 'Comercial' : 'Institucional'}</span>
                <span>•</span>
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{reportData.metadata.property.address}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {reportData.metadata.property.projectScope}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{reportData.metadata.property.client}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{reportData.metadata.projectInfo.estimatedDuration}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/inspection/${params.id}`)}
              className="flex-shrink-0"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar Estimado
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 sm:p-4 bg-alumimundo-navy/5 dark:bg-alumimundo-navy/10 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Inversión Total</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-alumimundo-navy dark:text-alumimundo-teal">
                {formatCurrency(reportData.executiveSummary.totalEstimatedCost)}
              </p>
            </div>
            <div className="p-3 sm:p-4 bg-alumimundo-teal/5 dark:bg-alumimundo-teal/10 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Áreas Incluidas</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-alumimundo-teal dark:text-alumimundo-teal">
                {reportData.executiveSummary.areasIncluded}
              </p>
            </div>
            <div className="p-3 sm:p-4 bg-alumimundo-magenta/5 dark:bg-alumimundo-magenta/10 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Productos</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-alumimundo-magenta dark:text-alumimundo-magenta">
                {reportData.executiveSummary.productsSpecified}
              </p>
            </div>
            <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Confianza</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-400">
                {Math.round(reportData.executiveSummary.confidenceScore * 100)}%
              </p>
            </div>
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Report Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Compliance Status */}
            <Card className="p-4 sm:p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  reportData.executiveSummary.complianceStatus === 'compliant'
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : reportData.executiveSummary.complianceStatus === 'requires_review'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30'
                    : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                  {reportData.executiveSummary.complianceStatus === 'compliant' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {reportData.executiveSummary.complianceStatus === 'compliant'
                      ? 'Cumple con Normativas'
                      : reportData.executiveSummary.complianceStatus === 'requires_review'
                      ? 'Requiere Revisión'
                      : 'No Cumple'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {reportData.aiRecommendations.buildingCodes.localRequirements}
                  </p>
                </div>
              </div>
            </Card>

            {/* Area Estimates */}
            <Card className="p-4 sm:p-6 dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Estimados por Área
              </h3>
              <div className="space-y-4">
                {reportData.areaEstimates.map((area, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {area.area}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {area.category} • {area.products.length} productos
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg sm:text-xl font-bold text-alumimundo-navy dark:text-alumimundo-teal">
                          {formatCurrency(area.estimatedCost)}
                        </p>
                        <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                          area.priority === 'high'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            : area.priority === 'medium'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        }`}>
                          Prioridad {area.priority === 'high' ? 'Alta' : area.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {area.description}
                    </p>

                    {/* Products List */}
                    <div className="space-y-2 mb-3">
                      <p className="text-xs font-medium text-gray-900 dark:text-white">
                        Productos Especificados:
                      </p>
                      {area.products.map((product, pIndex) => (
                        <div
                          key={pIndex}
                          className="flex items-center justify-between text-xs bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {product.name}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                              {product.brand} • {product.sku}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatCurrency(product.totalPrice)}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                              {product.quantity} × {formatCurrency(product.unitPrice)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Specifications */}
                    {area.specifications.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                          Especificaciones:
                        </p>
                        <ul className="space-y-1">
                          {area.specifications.map((spec, sIndex) => (
                            <li key={sIndex} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                              <span className="text-alumimundo-teal mt-0.5">•</span>
                              <span>{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Compliance Notes */}
                    {area.complianceNotes.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Cumplimiento:
                        </p>
                        <ul className="space-y-1">
                          {area.complianceNotes.map((note, nIndex) => (
                            <li key={nIndex} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                              <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* AI Recommendations */}
            <Card className="p-4 sm:p-6 border-2 border-alumimundo-navy dark:border-alumimundo-teal dark:bg-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-alumimundo-navy/10 dark:bg-alumimundo-navy/20 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-alumimundo-navy dark:text-alumimundo-teal" />
                </div>
                <div>
                  <h3 className="font-semibold text-alumimundo-navy dark:text-alumimundo-teal">
                    Recomendaciones de IA
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Análisis predictivo y optimización
                  </p>
                </div>
              </div>

              {/* Confidence Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Costo</p>
                  <p className="text-lg font-bold text-alumimundo-navy dark:text-alumimundo-teal">
                    {Math.round(reportData.aiRecommendations.confidenceMetrics.costAccuracy * 100)}%
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Stock</p>
                  <p className="text-lg font-bold text-alumimundo-navy dark:text-alumimundo-teal">
                    {Math.round(reportData.aiRecommendations.confidenceMetrics.productAvailability * 100)}%
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tiempo</p>
                  <p className="text-lg font-bold text-alumimundo-navy dark:text-alumimundo-teal">
                    {Math.round(reportData.aiRecommendations.confidenceMetrics.timelineReliability * 100)}%
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Normas</p>
                  <p className="text-lg font-bold text-alumimundo-navy dark:text-alumimundo-teal">
                    {Math.round(reportData.aiRecommendations.confidenceMetrics.complianceValidation * 100)}%
                  </p>
                </div>
              </div>

              {/* Recommendations List */}
              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  Sugerencias de Optimización
                </h4>
                <ul className="space-y-2">
                  {reportData.aiRecommendations.recommendations.map((rec, index) => (
                    <li key={index} className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/10 rounded">
                      <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">💡</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sustainability Factors */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="text-sm font-medium text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Sostenibilidad
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Eficiencia Energética</p>
                    <p className="text-green-700 dark:text-green-300">{reportData.aiRecommendations.sustainabilityFactors.energyEfficiency}</p>
                  </div>
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Conservación de Agua</p>
                    <p className="text-green-700 dark:text-green-300">{reportData.aiRecommendations.sustainabilityFactors.waterConservation}</p>
                  </div>
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Materiales</p>
                    <p className="text-green-700 dark:text-green-300">{reportData.aiRecommendations.sustainabilityFactors.materialSustainability}</p>
                  </div>
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Huella de Carbono</p>
                    <p className="text-green-700 dark:text-green-300">{reportData.aiRecommendations.sustainabilityFactors.carbonFootprint}</p>
                  </div>
                </div>
                {reportData.aiRecommendations.sustainabilityFactors.certificationOpportunities.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium text-green-800 dark:text-green-200 text-xs mb-1">
                      Certificaciones Disponibles:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {reportData.aiRecommendations.sustainabilityFactors.certificationOpportunities.map((cert, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-4">
            {/* Download Action */}
            <Card className="p-4 sm:p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-alumimundo-navy/10 dark:bg-alumimundo-navy/20 rounded-lg flex items-center justify-center">
                  <Download className="w-5 h-5 text-alumimundo-navy dark:text-alumimundo-teal" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Descargar</h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
                Descarga el estimado completo en formato PDF profesional.
              </p>
              <Button
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full bg-alumimundo-navy hover:bg-alumimundo-navy/90 dark:bg-alumimundo-teal dark:hover:bg-alumimundo-teal/90 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
            </Card>

            {/* Print Action */}
            <Card className="p-4 sm:p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-alumimundo-teal/10 dark:bg-alumimundo-teal/20 rounded-lg flex items-center justify-center">
                  <Printer className="w-5 h-5 text-alumimundo-teal dark:text-alumimundo-teal" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Imprimir</h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
                Imprime una copia física del estimado.
              </p>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="w-full border-alumimundo-teal text-alumimundo-teal hover:bg-alumimundo-teal/10 dark:border-alumimundo-teal dark:text-alumimundo-teal"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
            </Card>

            {/* Share Action */}
            <Card className="p-4 sm:p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-alumimundo-magenta/10 dark:bg-alumimundo-magenta/20 rounded-lg flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-alumimundo-magenta dark:text-alumimundo-magenta" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Compartir</h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
                Envía el estimado por correo electrónico al cliente.
              </p>
              <Button
                onClick={() => setShowShareModal(true)}
                variant="outline"
                className="w-full border-alumimundo-magenta text-alumimundo-magenta hover:bg-alumimundo-magenta/10 dark:border-alumimundo-magenta dark:text-alumimundo-magenta"
              >
                <Mail className="w-4 h-4 mr-2" />
                Enviar por Correo
              </Button>
            </Card>

            {/* Market Intelligence */}
            <Card className="p-4 sm:p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Inteligencia de Mercado</h4>
              </div>
              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Proyectos Similares</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {reportData.aiRecommendations.marketIntelligence.similarProjects} completados
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Costo Promedio</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(reportData.aiRecommendations.marketIntelligence.averageCost)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Tiempo Típico</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {reportData.aiRecommendations.marketIntelligence.timeToCompletion}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Tendencia de Precios</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {reportData.aiRecommendations.marketIntelligence.materialTrends}
                  </p>
                </div>
              </div>
            </Card>

            {/* Back to Dashboard */}
            <Button
              onClick={() => router.push('/dashboard/inspection')}
              variant="outline"
              className="w-full dark:border-gray-600 dark:text-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Estimados
            </Button>
          </div>
        </div>

        {/* Report Contents Summary */}
        <Card className="p-4 sm:p-6 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Contenido del Estimado
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: 'Información del Proyecto', icon: FileText },
              { label: 'Resumen Ejecutivo', icon: Target },
              { label: 'Estimados por Área', icon: Building2 },
              { label: 'Especificaciones de Productos', icon: FileText },
              { label: 'Desglose de Costos', icon: DollarSign },
              { label: 'Análisis de Cumplimiento', icon: CheckCircle },
              { label: 'Recomendaciones de IA', icon: Brain },
              { label: 'Factores de Sostenibilidad', icon: Award },
              { label: 'Inteligencia de Mercado', icon: TrendingUp }
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <item.icon className="w-5 h-5 text-alumimundo-navy dark:text-alumimundo-teal flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowShareModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Compartir Estimado
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Ingresa el correo electrónico del destinatario para enviar este estimado.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cliente@ejemplo.com"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg mb-4 focus:ring-2 focus:ring-alumimundo-navy dark:focus:ring-alumimundo-teal focus:border-transparent"
            />
            <div className="flex gap-3">
              <Button
                onClick={handleShare}
                className="flex-1 bg-alumimundo-navy hover:bg-alumimundo-navy/90 dark:bg-alumimundo-teal dark:hover:bg-alumimundo-teal/90 text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Enviar
              </Button>
              <Button
                onClick={() => {
                  setShowShareModal(false)
                  setEmail('')
                }}
                variant="outline"
                className="flex-1 dark:border-gray-600 dark:text-gray-300"
              >
                Cancelar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
