'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, Save, Sparkles, DollarSign,
  CheckCircle, AlertCircle, TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ImageUploadGallery } from '@/components/design/ImageUploadGallery'
import { MaterialBrowser } from '@/components/design/MaterialBrowser'
import { VoiceTextInput } from '@/components/design/VoiceTextInput'
import { getAreaIcon, getAreaLabel, type AreaType } from '@/lib/design-icons'

// Mock data - will be replaced with real database queries
interface AreaData {
  id: string
  projectId: string
  areaType: AreaType
  areaName: string
  status: string
  userRequirements?: string
  estimatedCost?: number
}

export default function AreaDesignPage({
  params
}: {
  params: Promise<{ projectId: string; areaId: string }>
}) {
  const { projectId, areaId } = use(params)
  const router = useRouter()

  // Mock area data
  const [areaData, setAreaData] = useState<AreaData>({
    id: areaId,
    projectId: projectId,
    areaType: 'KITCHEN',
    areaName: 'Cocina Principal',
    status: 'IN_PROGRESS'
  })

  const [uploadedImages, setUploadedImages] = useState<any[]>([])
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])
  const [userInput, setUserInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  const iconInfo = getAreaIcon(areaData.areaType)
  const AreaIcon = iconInfo.icon

  const handleVoiceTextSubmit = async (text: string, isVoice: boolean) => {
    setUserInput(text)
    setIsAnalyzing(true)

    try {
      // TODO: Call AI analysis API
      // const response = await fetch('/api/design/analyze', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     areaId: params.areaId,
      //     images: uploadedImages,
      //     selectedProducts: selectedProducts,
      //     userRequirements: text,
      //     areaType: areaData.areaType
      //   })
      // })

      // Mock AI response for now
      await new Promise(resolve => setTimeout(resolve, 2000))

      const mockRecommendations = {
        estimatedCost: 2500000, // CRC
        confidence: 0.85,
        recommendations: [
          {
            sku: 'KOHLER-K-596-VS',
            name: 'KOHLER Simplice Grifería de Cocina',
            reason: 'Estilo moderno que combina con las imágenes subidas',
            priority: 'high'
          },
          {
            sku: 'KOHLER-K-5540-NA',
            name: 'KOHLER Prolific Fregadero',
            reason: 'Compatible con el espacio y las dimensiones detectadas',
            priority: 'medium'
          }
        ],
        compliance: {
          passed: true,
          notes: 'Cumple con códigos de construcción de Costa Rica'
        },
        suggestions: [
          'Considera agregar iluminación bajo gabinete',
          'Superficie de cuarzo resistente al clima costero recomendada'
        ]
      }

      setAiRecommendations(mockRecommendations)
      setAreaData({
        ...areaData,
        estimatedCost: mockRecommendations.estimatedCost,
        userRequirements: text
      })
    } catch (error) {
      console.error('Error analyzing:', error)
      alert('Error al procesar. Por favor intenta de nuevo.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSaveAndContinue = async () => {
    setIsSaving(true)

    try {
      // TODO: Save to database
      // await saveAreaSpecification({
      //   areaId: params.areaId,
      //   images: uploadedImages,
      //   products: selectedProducts,
      //   requirements: userInput,
      //   estimatedCost: areaData.estimatedCost
      // })

      await new Promise(resolve => setTimeout(resolve, 1000))

      // Navigate to next area or review
      router.push(`/dashboard/diseno/${params.projectId}/review`)
    } catch (error) {
      console.error('Error saving:', error)
      alert('Error al guardar. Por favor intenta de nuevo.')
    } finally {
      setIsSaving(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getTotalProductCost = () => {
    return selectedProducts.reduce((sum, item) => {
      const price = item.product.price || item.product.priceRange?.min || 0
      return sum + price * item.quantity
    }, 0)
  }

  return (
    <div className="space-y-4 sm:space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-700 -mx-4 lg:-mx-6 px-4 lg:px-6 py-4 sticky top-0 z-10">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
              <div className={`w-10 h-10 rounded-lg ${iconInfo.bgColor} flex items-center justify-center flex-shrink-0`}>
                <AreaIcon className={`w-5 h-5 ${iconInfo.color}`} />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">{areaData.areaName}</h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{getAreaLabel(areaData.areaType)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {areaData.estimatedCost && (
                <Card className="px-3 sm:px-4 py-2 bg-alumimundo-navy/5 dark:bg-alumimundo-navy/10 border-alumimundo-navy dark:border-alumimundo-teal">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Estimado</p>
                  <p className="text-base sm:text-lg font-semibold text-alumimundo-navy dark:text-alumimundo-teal">
                    {formatCurrency(areaData.estimatedCost)}
                  </p>
                </Card>
              )}

              <Button
                onClick={handleSaveAndContinue}
                disabled={isSaving || selectedProducts.length === 0}
                className="bg-alumimundo-navy hover:bg-alumimundo-navy/90 text-white whitespace-nowrap"
              >
                <span className="hidden sm:inline">{isSaving ? 'Guardando...' : 'Guardar y Continuar'}</span>
                <span className="sm:hidden">{isSaving ? 'Guardando...' : 'Guardar'}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${uploadedImages.length > 0 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
              <span className="text-gray-600 dark:text-gray-400">{uploadedImages.length} fotos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${selectedProducts.length > 0 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
              <span className="text-gray-600 dark:text-gray-400">{selectedProducts.length} productos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${userInput ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
              <span className="text-gray-600 dark:text-gray-400">{userInput ? 'Requisitos definidos' : 'Sin requisitos'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Three Panel Layout */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          {/* Left Panel - Image Upload */}
          <div className="h-[400px] lg:h-full">
            <Card className="p-4 h-full overflow-hidden dark:bg-gray-800 dark:border-gray-700">
              <ImageUploadGallery
                areaId={areaId}
                areaName={areaData.areaName}
                onImagesChange={setUploadedImages}
                onAnalyze={async (imageId) => {
                  // TODO: Analyze image with Vision API
                  console.log('Analyzing image:', imageId)
                }}
              />
            </Card>
          </div>

          {/* Middle Panel - Material Browser */}
          <div className="h-[400px] lg:h-full">
            <Card className="p-4 h-full overflow-hidden dark:bg-gray-800 dark:border-gray-700">
              <MaterialBrowser
                areaId={areaId}
                areaType={areaData.areaType}
                onProductsChange={setSelectedProducts}
                selectedProducts={selectedProducts}
              />
            </Card>
          </div>

          {/* Right Panel - Voice/Text Input & AI Recommendations */}
          <div className="h-[400px] lg:h-full flex flex-col gap-4">
            {/* Voice/Text Input */}
            <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
              <VoiceTextInput
                areaName={areaData.areaName}
                onSubmit={handleVoiceTextSubmit}
                disabled={isAnalyzing}
              />
            </Card>

            {/* AI Recommendations */}
            {aiRecommendations && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 overflow-y-auto"
              >
                <Card className="p-4 border-2 border-alumimundo-navy dark:border-alumimundo-teal dark:bg-gray-800">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-alumimundo-navy dark:text-alumimundo-teal" />
                    <h3 className="font-semibold text-alumimundo-navy dark:text-alumimundo-teal">
                      Recomendaciones de IA
                    </h3>
                  </div>

                  {/* Estimated Cost */}
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-alumimundo-navy to-alumimundo-teal rounded-lg text-white mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm opacity-90">Costo Estimado</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs">
                          {Math.round(aiRecommendations.confidence * 100)}% confianza
                        </span>
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold">
                      {formatCurrency(aiRecommendations.estimatedCost)}
                    </p>
                    <p className="text-xs opacity-75 mt-1">
                      Basado en productos seleccionados: {formatCurrency(getTotalProductCost())}
                    </p>
                  </div>

                  {/* Compliance Status */}
                  <div className={`p-3 rounded-lg mb-4 ${
                    aiRecommendations.compliance.passed
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-start gap-2">
                      {aiRecommendations.compliance.passed ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {aiRecommendations.compliance.passed ? 'Cumple Normativas' : 'Requiere Ajustes'}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {aiRecommendations.compliance.notes}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Product Recommendations */}
                  {aiRecommendations.recommendations.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Productos Recomendados
                      </h4>
                      <div className="space-y-2">
                        {aiRecommendations.recommendations.map((rec: any, index: number) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{rec.name}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                                rec.priority === 'high'
                                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                              }`}>
                                {rec.priority === 'high' ? 'Alta' : 'Media'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{rec.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {aiRecommendations.suggestions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Sugerencias Adicionales
                      </h4>
                      <ul className="space-y-1">
                        {aiRecommendations.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                            <span className="text-alumimundo-teal mt-0.5">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {/* Loading State */}
            {isAnalyzing && (
              <Card className="p-6 sm:p-8 text-center dark:bg-gray-800 dark:border-gray-700">
                <div className="w-12 h-12 border-4 border-alumimundo-navy dark:border-alumimundo-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Analizando con IA...
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Procesando imágenes, productos y requisitos
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
