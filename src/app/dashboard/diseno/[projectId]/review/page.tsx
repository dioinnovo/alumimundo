'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft, FileText, Download, CheckCircle,
  DollarSign, Package, Image as ImageIcon, Edit, TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getAreaIcon, getAreaLabel, getStatusInfo, type AreaType, type AreaStatus } from '@/lib/design-icons'

interface AreaSpecification {
  id: string
  areaId: string
  areaType: AreaType
  areaName: string
  status: AreaStatus
  estimatedCost: number
  productCount: number
  imageCount: number
  userRequirements?: string
  products: Array<{
    sku: string
    name: string
    brand: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
}

export default function ReviewPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params)
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock data - will be replaced with real database queries
  const projectName = "Casa Moderna - Escazú"
  const projectType = "Residential"
  const location = "Escazú, San José"

  const areaSpecifications: AreaSpecification[] = [
    {
      id: 'area-1',
      areaId: 'area-1',
      areaType: 'KITCHEN',
      areaName: 'Cocina Principal',
      status: 'SPECIFICATION_COMPLETE',
      estimatedCost: 2500000,
      productCount: 5,
      imageCount: 3,
      userRequirements: 'Necesito grifería moderna y fregadero de acero inoxidable',
      products: [
        {
          sku: 'KOHLER-K-596-VS',
          name: 'KOHLER Simplice Grifería de Cocina',
          brand: 'KOHLER',
          quantity: 1,
          unitPrice: 450000,
          totalPrice: 450000
        },
        {
          sku: 'KOHLER-K-5540-NA',
          name: 'KOHLER Prolific Fregadero',
          brand: 'KOHLER',
          quantity: 1,
          unitPrice: 850000,
          totalPrice: 850000
        }
      ]
    },
    {
      id: 'area-2',
      areaId: 'area-2',
      areaType: 'MASTER_BATHROOM',
      areaName: 'Baño Principal',
      status: 'SPECIFICATION_COMPLETE',
      estimatedCost: 3200000,
      productCount: 7,
      imageCount: 5,
      userRequirements: 'Quiero un baño moderno con ducha de lluvia y doble lavamanos',
      products: [
        {
          sku: 'KOHLER-K-14406-4-CP',
          name: 'KOHLER Purist Grifería de Lavamanos',
          brand: 'KOHLER',
          quantity: 2,
          unitPrice: 380000,
          totalPrice: 760000
        },
        {
          sku: 'KOHLER-K-5026-0',
          name: 'KOHLER Memoirs Lavamanos',
          brand: 'KOHLER',
          quantity: 2,
          unitPrice: 520000,
          totalPrice: 1040000
        }
      ]
    },
    {
      id: 'area-3',
      areaId: 'area-3',
      areaType: 'LIVING_ROOM',
      areaName: 'Sala',
      status: 'IN_PROGRESS',
      estimatedCost: 1800000,
      productCount: 3,
      imageCount: 2,
      userRequirements: 'Necesito pisos de madera y persianas modernas',
      products: [
        {
          sku: 'TARKETT-OAK-NATURAL',
          name: 'Tarkett Pisos de Roble Natural',
          brand: 'Tarkett',
          quantity: 45,
          unitPrice: 35000,
          totalPrice: 1575000
        }
      ]
    }
  ]

  const totalCost = areaSpecifications.reduce((sum, area) => sum + area.estimatedCost, 0)
  const completedAreas = areaSpecifications.filter(a => a.status === 'SPECIFICATION_COMPLETE').length
  const totalProducts = areaSpecifications.reduce((sum, area) => sum + area.productCount, 0)
  const totalImages = areaSpecifications.reduce((sum, area) => sum + area.imageCount, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    try {
      // TODO: Call PDF generation API
      await new Promise(resolve => setTimeout(resolve, 2000))
      router.push(`/dashboard/diseno/${projectId}/report`)
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Error al generar reporte')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEditArea = (areaId: string) => {
    router.push(`/dashboard/diseno/${projectId}/area/${areaId}`)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-alumimundo-navy/10 dark:bg-alumimundo-navy/20 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-alumimundo-navy dark:text-alumimundo-teal" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Revisión de Especificaciones
            </h1>
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Revisa y confirma todas las especificaciones antes de generar el reporte
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Project Summary */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-alumimundo-navy to-alumimundo-teal text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{projectName}</h2>
              <div className="flex items-center gap-4 text-sm opacity-90">
                <span>{projectType}</span>
                <span>•</span>
                <span>{location}</span>
              </div>
            </div>
            <Button
              onClick={() => router.push(`/dashboard/diseno/${projectId}/areas`)}
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div>
              <p className="text-sm opacity-75 mb-1">Costo Total</p>
              <p className="text-2xl font-bold">{formatCurrency(totalCost)}</p>
            </div>
            <div>
              <p className="text-sm opacity-75 mb-1">Áreas Completas</p>
              <p className="text-2xl font-bold">{completedAreas}/{areaSpecifications.length}</p>
            </div>
            <div>
              <p className="text-sm opacity-75 mb-1">Productos</p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
            <div>
              <p className="text-sm opacity-75 mb-1">Fotos</p>
              <p className="text-2xl font-bold">{totalImages}</p>
            </div>
          </div>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 border-l-4 border-l-green-500">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Estado General</p>
                <p className="text-lg font-semibold text-gray-900">
                  {Math.round((completedAreas / areaSpecifications.length) * 100)}% Completado
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-blue-500">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Confianza IA</p>
                <p className="text-lg font-semibold text-gray-900">85% Alta</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-alumimundo-teal">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-alumimundo-teal" />
              <div>
                <p className="text-sm text-gray-600">Cumplimiento</p>
                <p className="text-lg font-semibold text-gray-900">100% Conforme</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Area Specifications */}
        <div className="space-y-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900">Especificaciones por Área</h3>

          {areaSpecifications.map((area, index) => {
            const iconInfo = getAreaIcon(area.areaType)
            const AreaIcon = iconInfo.icon
            const statusInfo = getStatusInfo(area.status)

            return (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  {/* Area Header */}
                  <div className="p-4 bg-gray-50 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg ${iconInfo.bgColor} flex items-center justify-center`}>
                          <AreaIcon className={`w-6 h-6 ${iconInfo.color}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{area.areaName}</h4>
                          <p className="text-sm text-gray-600">{getAreaLabel(area.areaType)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-3 py-1 rounded-full ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                          {statusInfo.label}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditArea(area.areaId)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Area Content */}
                  <div className="p-4">
                    {/* Stats */}
                    <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>{area.productCount} productos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        <span>{area.imageCount} fotos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold text-alumimundo-navy">
                          {formatCurrency(area.estimatedCost)}
                        </span>
                      </div>
                    </div>

                    {/* User Requirements */}
                    {area.userRequirements && (
                      <div className="p-3 bg-blue-50 rounded-lg mb-4">
                        <p className="text-xs font-medium text-blue-900 mb-1">Requisitos del Cliente</p>
                        <p className="text-sm text-blue-800 italic">"{area.userRequirements}"</p>
                      </div>
                    )}

                    {/* Products List */}
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Productos Especificados</p>
                      <div className="space-y-2">
                        {area.products.map((product, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{product.name}</p>
                              <p className="text-xs text-gray-600">
                                {product.brand} • SKU: {product.sku}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {product.quantity}x {formatCurrency(product.unitPrice)}
                              </p>
                              <p className="text-xs text-gray-600">
                                Total: {formatCurrency(product.totalPrice)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Compliance & Warnings */}
        <Card className="p-6 mb-8 border-2 border-green-500">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Validación de Cumplimiento</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                  Todos los productos cumplen con códigos de construcción de Costa Rica
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                  Productos seleccionados son apropiados para clima de {location}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                  Certificaciones WaterSense y ADA verificadas
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                  Stock disponible para todos los productos
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-alumimundo-navy" />
            <div>
              <p className="text-xs text-gray-600">Inversión Total</p>
              <p className="text-xl font-bold text-alumimundo-navy">{formatCurrency(totalCost)}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/diseno/${projectId}/areas`)}
            >
              Agregar Más Áreas
            </Button>
            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating || completedAreas === 0}
              className="bg-alumimundo-navy hover:bg-alumimundo-navy/90 dark:bg-alumimundo-teal dark:hover:bg-alumimundo-teal/90 text-white px-8"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generar Reporte PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
