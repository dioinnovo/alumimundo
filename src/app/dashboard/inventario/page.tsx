'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp, TrendingDown, AlertTriangle, Zap, DollarSign,
  Package, ShoppingCart, Clock, Target, BarChart3,
  ArrowUpRight, ArrowDownRight, Sparkles, Brain
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/**
 * AI-POWERED INVENTORY INTELLIGENCE DASHBOARD
 * Module 2: Predictive Inventory & Supply Chain Intelligence
 *
 * This dashboard transforms traditional inventory management into an AI-driven
 * competitive advantage with:
 * - SKU-level demand forecasting
 * - Stock-out predictions
 * - Smart reorder recommendations
 * - Market signal processing
 * - Dynamic pricing optimization
 *
 * Expected Impact (Per PRD):
 * - 90%+ service level (product availability)
 * - 25-30% reduction in inventory carrying costs
 * - 3-5% gross margin improvement
 * - $750K-$1.2M in freed working capital annually
 */

interface InventoryInsight {
  sku: string
  name: string
  brand: string
  currentStock: number
  demandForecast: {
    next30Days: number
    next60Days: number
    next90Days: number
    confidence: number // 0-1
  }
  stockOutPrediction: {
    daysUntilStockOut: number | null
    probability: number // 0-1
    risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  }
  reorderRecommendation: {
    shouldReorder: boolean
    recommendedQuantity: number
    optimalOrderDate: string
    leadTimeDays: number
  }
  pricingOptimization: {
    currentPrice: number
    recommendedPrice: number
    priceChange: number // percentage
    reasoning: string
  }
  marketSignals: Array<{
    signal: string
    impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
    source: string
  }>
}

export default function InventoryIntelligencePage() {
  const [insights, setInsights] = useState<InventoryInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedView, setSelectedView] = useState<'overview' | 'predictions' | 'recommendations'>('overview')

  // Mock data for demo - In production, this would come from AI models
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setInsights([
        {
          sku: 'KOHLER-K-2210-0',
          name: 'KOHLER Caxton Undermount Bathroom Sink',
          brand: 'KOHLER',
          currentStock: 15,
          demandForecast: {
            next30Days: 22,
            next60Days: 45,
            next90Days: 68,
            confidence: 0.89
          },
          stockOutPrediction: {
            daysUntilStockOut: 18,
            probability: 0.92,
            risk: 'CRITICAL'
          },
          reorderRecommendation: {
            shouldReorder: true,
            recommendedQuantity: 50,
            optimalOrderDate: '2025-11-20',
            leadTimeDays: 60
          },
          pricingOptimization: {
            currentPrice: 245.00,
            recommendedPrice: 264.60,
            priceChange: 8.0,
            reasoning: 'High demand + Low inventory → Price increase recommended'
          },
          marketSignals: [
            { signal: '3 new hotel projects announced in San José', impact: 'POSITIVE', source: 'Construction Permits' },
            { signal: 'Luxury residential trend increasing 15%', impact: 'POSITIVE', source: 'Market Analysis' }
          ]
        },
        {
          sku: 'SCHLAGE-F60-SAT',
          name: 'Schlage Saturn Entry Door Knob',
          brand: 'Schlage',
          currentStock: 45,
          demandForecast: {
            next30Days: 12,
            next60Days: 24,
            next90Days: 36,
            confidence: 0.76
          },
          stockOutPrediction: {
            daysUntilStockOut: null,
            probability: 0.05,
            risk: 'LOW'
          },
          reorderRecommendation: {
            shouldReorder: false,
            recommendedQuantity: 0,
            optimalOrderDate: '2026-01-15',
            leadTimeDays: 45
          },
          pricingOptimization: {
            currentPrice: 89.99,
            recommendedPrice: 83.99,
            priceChange: -6.7,
            reasoning: 'Overstock + Normal demand → Price reduction to move inventory'
          },
          marketSignals: [
            { signal: 'Competitor price drop detected', impact: 'NEGATIVE', source: 'Price Monitoring' }
          ]
        },
        {
          sku: 'KOHLER-K-5180-NA',
          name: 'KOHLER Riverby Undermount Kitchen Sink',
          brand: 'KOHLER',
          currentStock: 8,
          demandForecast: {
            next30Days: 15,
            next60Days: 32,
            next90Days: 48,
            confidence: 0.82
          },
          stockOutPrediction: {
            daysUntilStockOut: 14,
            probability: 0.88,
            risk: 'HIGH'
          },
          reorderRecommendation: {
            shouldReorder: true,
            recommendedQuantity: 35,
            optimalOrderDate: '2025-11-18',
            leadTimeDays: 60
          },
          pricingOptimization: {
            currentPrice: 312.50,
            recommendedPrice: 331.25,
            priceChange: 6.0,
            reasoning: 'Strong demand + Limited supply → Moderate price increase'
          },
          marketSignals: [
            { signal: 'Kitchen renovation trend up 20% this quarter', impact: 'POSITIVE', source: 'Social Media Analysis' }
          ]
        }
      ])
      setLoading(false)
    }, 800)
  }, [])

  const criticalCount = insights.filter(i => i.stockOutPrediction.risk === 'CRITICAL').length
  const highRiskCount = insights.filter(i => i.stockOutPrediction.risk === 'HIGH').length
  const reorderNeeded = insights.filter(i => i.reorderRecommendation.shouldReorder).length
  const avgConfidence = insights.length > 0
    ? (insights.reduce((sum, i) => sum + i.demandForecast.confidence, 0) / insights.length * 100).toFixed(1)
    : '0'

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return 'text-red-600 bg-red-50'
      case 'HIGH': return 'text-orange-600 bg-orange-50'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50'
      case 'LOW': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with AI Badge */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-8 h-8 text-alumimundo-teal" />
            <h1 className="text-3xl font-bold text-gray-900">
              Inteligencia de Inventario IA
            </h1>
            <Badge className="bg-gradient-to-r from-alumimundo-teal to-alumimundo-navy text-white border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
          <p className="text-gray-600 text-lg">
            Pronósticos de demanda, predicciones de agotamiento y optimización de precios con IA
          </p>
        </div>

        {/* AI Intelligence KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-5 bg-white border-2 border-red-100 hover:border-red-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Riesgo Crítico</p>
                  <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600">Productos con agotamiento inminente</p>
          </Card>

          <Card className="p-5 bg-white border-2 border-orange-100 hover:border-orange-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Reorden Urgente</p>
                  <p className="text-2xl font-bold text-orange-600">{reorderNeeded}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600">Productos requieren orden ahora</p>
          </Card>

          <Card className="p-5 bg-white border-2 border-alumimundo-teal/20 hover:border-alumimundo-teal transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-alumimundo-teal/10 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-alumimundo-teal" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Precisión IA</p>
                  <p className="text-2xl font-bold text-alumimundo-teal">{avgConfidence}%</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600">Confianza en pronósticos</p>
          </Card>

          <Card className="p-5 bg-white border-2 border-green-100 hover:border-green-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Ahorro Proyectado</p>
                  <p className="text-2xl font-bold text-green-600">$875K</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600">Capital liberado anualmente</p>
          </Card>
        </div>

        {/* ALMA Integration CTA */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-alumimundo-navy to-alumimundo-teal text-white border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Analiza tu inventario con ALMA</h3>
                <p className="text-sm text-white/80">
                  Pregunta sobre tendencias, predicciones y optimizaciones en lenguaje natural
                </p>
              </div>
            </div>
            <Link href="/dashboard/analytics">
              <Button variant="secondary" className="bg-white text-alumimundo-navy hover:bg-gray-100">
                <Zap className="w-4 h-4 mr-2" />
                Preguntar a ALMA
              </Button>
            </Link>
          </div>
        </Card>

        {/* Inventory Intelligence Cards */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-alumimundo-teal border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Analizando inventario con IA...</p>
            </div>
          ) : (
            insights.map((insight) => (
              <Card key={insight.sku} className="p-6 bg-white hover:shadow-xl transition-all border-l-4"
                    style={{ borderLeftColor:
                      insight.stockOutPrediction.risk === 'CRITICAL' ? '#DC2626' :
                      insight.stockOutPrediction.risk === 'HIGH' ? '#EA580C' :
                      insight.stockOutPrediction.risk === 'MEDIUM' ? '#CA8A04' : '#16A34A'
                    }}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Product Info */}
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Badge className="mb-2">{insight.brand}</Badge>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {insight.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono">SKU: {insight.sku}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 border-t border-gray-100">
                        <span className="text-sm text-gray-600">Inventario Actual</span>
                        <span className="text-lg font-bold text-gray-900">{insight.currentStock} unidades</span>
                      </div>

                      <div className={`flex items-center justify-between p-3 rounded-lg ${getRiskColor(insight.stockOutPrediction.risk)}`}>
                        <div className="flex items-center gap-2">
                          {insight.stockOutPrediction.risk === 'CRITICAL' || insight.stockOutPrediction.risk === 'HIGH' ? (
                            <AlertTriangle className="w-4 h-4" />
                          ) : (
                            <Package className="w-4 h-4" />
                          )}
                          <span className="text-sm font-medium">Riesgo de Agotamiento</span>
                        </div>
                        <Badge variant="outline" className="border-current">
                          {insight.stockOutPrediction.risk}
                        </Badge>
                      </div>

                      {insight.stockOutPrediction.daysUntilStockOut && (
                        <div className="text-sm text-gray-600">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Agotamiento estimado en <strong>{insight.stockOutPrediction.daysUntilStockOut} días</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Demand Forecast */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-alumimundo-teal" />
                      Pronóstico de Demanda
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Próximos 30 días</span>
                        <span className="text-lg font-bold text-gray-900">{insight.demandForecast.next30Days}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Próximos 60 días</span>
                        <span className="text-lg font-bold text-gray-900">{insight.demandForecast.next60Days}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Próximos 90 días</span>
                        <span className="text-lg font-bold text-gray-900">{insight.demandForecast.next90Days}</span>
                      </div>
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Confianza del modelo</span>
                          <span className="text-sm font-semibold text-alumimundo-teal">
                            {(insight.demandForecast.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-alumimundo-magenta" />
                      Recomendaciones IA
                    </h4>

                    {/* Reorder Recommendation */}
                    {insight.reorderRecommendation.shouldReorder ? (
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <ShoppingCart className="w-4 h-4 text-orange-600" />
                          <span className="text-sm font-semibold text-orange-900">Acción Requerida</span>
                        </div>
                        <p className="text-xs text-orange-800 mb-2">
                          Ordenar <strong>{insight.reorderRecommendation.recommendedQuantity} unidades</strong> antes del {new Date(insight.reorderRecommendation.optimalOrderDate).toLocaleDateString('es-CR')}
                        </p>
                        <p className="text-xs text-orange-700">
                          Tiempo de entrega: {insight.reorderRecommendation.leadTimeDays} días
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-3">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-900">Inventario Óptimo</span>
                        </div>
                        <p className="text-xs text-green-800 mt-1">
                          No se requiere reorden inmediato
                        </p>
                      </div>
                    )}

                    {/* Pricing Optimization */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-900">Optimización de Precio</span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-blue-800">Precio actual</span>
                        <span className="text-sm font-mono text-blue-900">
                          ${insight.pricingOptimization.currentPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-blue-800">Precio recomendado</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono font-bold text-blue-900">
                            ${insight.pricingOptimization.recommendedPrice.toFixed(2)}
                          </span>
                          {insight.pricingOptimization.priceChange > 0 ? (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              <ArrowUpRight className="w-3 h-3 mr-0.5" />
                              +{insight.pricingOptimization.priceChange.toFixed(1)}%
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700 text-xs">
                              <ArrowDownRight className="w-3 h-3 mr-0.5" />
                              {insight.pricingOptimization.priceChange.toFixed(1)}%
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-blue-700 italic">
                        {insight.pricingOptimization.reasoning}
                      </p>
                    </div>

                    {/* Market Signals */}
                    {insight.marketSignals.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Señales de Mercado</p>
                        {insight.marketSignals.map((signal, idx) => (
                          <div key={idx} className="text-xs flex items-start gap-2 p-2 bg-gray-50 rounded">
                            <div className={`w-2 h-2 rounded-full mt-1 ${
                              signal.impact === 'POSITIVE' ? 'bg-green-500' :
                              signal.impact === 'NEGATIVE' ? 'bg-red-500' : 'bg-gray-400'
                            }`} />
                            <div className="flex-1">
                              <p className="text-gray-800">{signal.signal}</p>
                              <p className="text-gray-500 text-xs mt-0.5">{signal.source}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Footer Note */}
        <Card className="mt-6 p-4 bg-alumimundo-light border-alumimundo-teal/20">
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <Brain className="w-4 h-4 text-alumimundo-teal" />
            <strong>Inteligencia Predictiva:</strong> Los pronósticos y recomendaciones se actualizan diariamente basándose en análisis de ventas históricas, tendencias de mercado, señales macroeconómicas y datos de construcción en tiempo real.
          </p>
        </Card>
      </div>
    </div>
  )
}
