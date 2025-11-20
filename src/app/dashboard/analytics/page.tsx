'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  Send,
  ChevronDown,
  ArrowUp,
  Database,
  BarChart3,
  TrendingUp,
  Code
} from 'lucide-react'
import SiriOrb from '@/components/ui/siri-orb'
import { cn } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { getFriendlyColumnName } from '@/lib/ai/columnMapping'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sqlQuery?: string
  queryResults?: { columns: string[]; rows: any[][] }
  chartData?: any
  followUpQuestions?: string[]
}

// Alumimundo-specific Quick Questions in Spanish
const QUICK_QUESTIONS = [
  // 💰 Inventario & Supply Chain
  "¿Cuáles productos están por debajo del punto de reorden y cuánto debo comprar?",
  "Muestra la rotación de inventario por categoría de producto en los últimos 6 meses",
  "¿Qué proveedores tienen los mejores tiempos de entrega y márgenes de ganancia?",
  "Analiza el inventario de productos KOHLER vs otras marcas: stock, ventas y rentabilidad",

  // 📊 Proyectos & Ventas
  "¿Cuál es el valor promedio de proyectos por tipo (residencial, comercial, hotelero)?",
  "Muestra proyectos completados vs retrasados en los últimos 3 meses con análisis de causas",
  "¿Qué productos se especifican más en proyectos de alta gama (>$100K)?",
  "Compara presupuesto estimado vs costo real por tipo de proyecto - identifica patrones",

  // ⚙️ Calidad & Operaciones
  "¿Cuál es la tasa de éxito en inspecciones de calidad por instalador?",
  "Identifica los defectos más comunes en instalaciones y su costo de corrección",
  "Muestra el tiempo promedio desde especificación hasta instalación completada",
  "¿Qué productos tienen más problemas de calidad y qué proveedores los suministran?",

  // 🎨 Diseño & AI Workflow
  "Analiza la tasa de aceptación de recomendaciones del AI en proyectos de diseño",
  "Compara costos estimados vs reales en proyectos de diseño por tipo de área",

  // 📈 Estratégico
  "¿Cuáles son las 10 categorías de producto más rentables considerando margen y rotación?",
  "Identifica provincias con mayor demanda y sugiere estrategia de expansión basada en datos"
]

type AgentMode = 'analytics' | 'chat' | 'products'

export default function SQLAnalyticsChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [expandedQuery, setExpandedQuery] = useState<string | null>(null)
  const [mode, setMode] = useState<AgentMode>('analytics')
  const [isAutoMode, setIsAutoMode] = useState(true) // Auto routing enabled by default
  const [lastClassification, setLastClassification] = useState<{ mode: AgentMode; confidence: string } | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const latestAssistantMessageRef = useRef<HTMLDivElement>(null)

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [inputValue])

  // Auto-scroll to latest message
  useEffect(() => {
    if (latestAssistantMessageRef.current) {
      setTimeout(() => {
        latestAssistantMessageRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }, 100)
    }
  }, [messages])

  const handleSend = async (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText) return

    if (!text) {
      setInputValue('')
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setIsTyping(true)

    try {
      // Determine routing mode
      let effectiveMode = mode

      // If auto mode is enabled, call router API for intent classification
      if (isAutoMode) {
        try {
          const routerResponse = await fetch('/api/router', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: messageText,
              context: {
                previousMode: mode
              }
            })
          })

          if (routerResponse.ok) {
            const classification = await routerResponse.json()
            effectiveMode = classification.mode
            setLastClassification({
              mode: classification.mode,
              confidence: classification.confidence
            })

            // Update mode state to reflect classification
            setMode(effectiveMode)
          }
        } catch (routerError) {
          console.warn('Router failed, using manual mode:', routerError)
          // Continue with manually selected mode
        }
      }

      // Route to appropriate API based on effective mode
      let endpoint = '/api/assistant/unified'
      let requestBody: any = {}

      if (effectiveMode === 'analytics') {
        endpoint = '/api/sql-agent'
        requestBody = {
          question: messageText,
          responseMode: 'quick'
        }
      } else if (effectiveMode === 'products') {
        endpoint = '/api/products/search'
        requestBody = {
          query: messageText
        }
      } else {
        // chat mode
        endpoint = '/api/assistant/unified'
        requestBody = {
          messages: [...newMessages].map(m => ({
            role: m.role,
            content: m.content
          })),
          model: 'stella-pro',
          stream: false,
          temperature: 0.5
        }
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'No se pudo generar respuesta',
        timestamp: new Date(),
        sqlQuery: data.sqlQuery,
        queryResults: data.queryResults,
        chartData: data.chartData,
        followUpQuestions: data.suggestions || data.followUpQuestions || []
      }

      setMessages([...newMessages, assistantMessage])
      setIsTyping(false)
    } catch (error) {
      console.error('Error calling API:', error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Disculpa, pero tengo problemas para procesar esa consulta. Por favor intenta de nuevo.',
        timestamp: new Date()
      }

      setMessages([...newMessages, errorMessage])
      setIsTyping(false)
    }
  }

  const renderChart = (chartData: any) => {
    if (!chartData || !chartData.datasets || chartData.datasets.length === 0) return null

    const { type, labels, datasets } = chartData

    if (type === 'line') {
      return (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={labels.map((label: string, idx: number) => ({
              name: label,
              ...datasets.reduce((acc: any, ds: any) => ({
                ...acc,
                [ds.label]: ds.data[idx]
              }), {})
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              {datasets.map((ds: any, idx: number) => (
                <Line
                  key={idx}
                  type="monotone"
                  dataKey={ds.label}
                  stroke={`hsl(${idx * 137.5}, 70%, 50%)`}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )
    }

    // Default: Bar chart
    return (
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={labels.map((label: string, idx: number) => ({
            name: label,
            ...datasets.reduce((acc: any, ds: any) => ({
              ...acc,
              [ds.label]: ds.data[idx]
            }), {})
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            {datasets.map((ds: any, idx: number) => (
              <Bar
                key={idx}
                dataKey={ds.label}
                fill={`hsl(${idx * 137.5}, 70%, 50%)`}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const renderTable = (results: { columns: string[]; rows: any[][] }) => {
    if (!results || !results.rows || results.rows.length === 0) {
      return <p className="text-sm text-gray-500">No se encontraron resultados</p>
    }

    const { columns, rows } = results

    return (
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  {getFriendlyColumnName(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    {typeof cell === 'number' ? cell.toLocaleString() : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Top Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 min-h-[4rem] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-alumimundo-navy" />
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              ALMA
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Analista de Datos
            </p>
          </div>

          {/* Auto/Manual Toggle */}
          <div className="ml-2 flex items-center gap-2">
            <button
              onClick={() => setIsAutoMode(!isAutoMode)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                isAutoMode
                  ? 'bg-alumimundo-navy text-white dark:bg-alumimundo-teal'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              title={isAutoMode ? 'Modo automático activado' : 'Modo manual activado'}
            >
              {isAutoMode ? '🤖 Auto' : '✋ Manual'}
            </button>

            {/* Mode Selector - only enabled in manual mode */}
            {!isAutoMode && (
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as AgentMode)}
                className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-alumimundo-navy dark:focus:ring-alumimundo-teal focus:border-transparent cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <option value="analytics">📊 Análisis SQL</option>
                <option value="chat">💬 Asistente General</option>
                <option value="products">🔍 Productos</option>
              </select>
            )}
          </div>
        </div>

        {/* Agent Status Indicator */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {mode === 'analytics' && 'SQL Analytics'}
            {mode === 'chat' && 'Asistente IA'}
            {mode === 'products' && 'Búsqueda Productos'}
          </span>
          {isAutoMode && lastClassification && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({lastClassification.confidence === 'high' ? '✓' : lastClassification.confidence === 'medium' ? '~' : '?'})
            </span>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4">
        {messages.length === 0 ? (
          /* Welcome Screen */
          <div className="flex flex-col items-center justify-start pt-2 sm:pt-4 text-center space-y-4 sm:space-y-6">
            <div className="w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center">
              <div className="sm:hidden">
                <SiriOrb size="80px" animationDuration={6} isActive={true} />
              </div>
              <div className="hidden sm:block">
                <SiriOrb size="128px" animationDuration={6} isActive={true} />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Hola, soy ALMA
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-sm px-4 sm:px-0">
                Tu analista de datos con IA. Pregúntame sobre inventario, proyectos, ventas y más.
              </p>
            </div>

            {/* Quick Questions */}
            <div className="max-w-2xl w-full">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Preguntas Rápidas:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_QUESTIONS.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(question)}
                    className="text-left p-3 rounded-lg border border-alumimundo-navy/20 hover:border-alumimundo-navy hover:bg-alumimundo-navy/5 dark:border-alumimundo-teal/30 dark:hover:border-alumimundo-teal dark:hover:bg-alumimundo-teal/10 transition-all group"
                  >
                    <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {question}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Messages View */
          <div className="space-y-4 max-w-4xl mx-auto pb-8">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  ref={message.role === 'assistant' && index === messages.length - 1
                    ? latestAssistantMessageRef
                    : null}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[90%] ${message.role === 'user' ? 'order-last' : ''}`}>
                    {/* Message bubble */}
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-alumimundo-navy text-white'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-sm'
                    }`}>
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    </div>

                    {/* Assistant-specific content */}
                    {message.role === 'assistant' && (
                      <div className="mt-3 space-y-3">
                        {/* Visualization */}
                        {message.chartData && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <BarChart3 className="w-4 h-4 text-alumimundo-teal" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Visualización</span>
                              <span className="text-xs text-gray-500">
                                {message.queryResults?.rows.length} resultados
                              </span>
                            </div>
                            {renderChart(message.chartData)}
                          </div>
                        )}

                        {/* Expandable SQL Query */}
                        {message.sqlQuery && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <button
                              onClick={() => setExpandedQuery(expandedQuery === message.id ? null : message.id)}
                              className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <Code className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Consulta SQL Generada
                                </span>
                              </div>
                              <ChevronDown
                                className={cn(
                                  "w-4 h-4 text-gray-600 transition-transform",
                                  expandedQuery === message.id && "transform rotate-180"
                                )}
                              />
                            </button>
                            {expandedQuery === message.id && (
                              <div className="px-4 pb-4">
                                <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
                                  <code>{message.sqlQuery}</code>
                                </pre>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(message.sqlQuery!)
                                  }}
                                  className="mt-2 text-xs text-alumimundo-navy hover:text-alumimundo-teal dark:text-alumimundo-teal"
                                >
                                  Copiar
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Query Results Table */}
                        {message.queryResults && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Resultados de Consulta</span>
                              </div>
                            </div>
                            {renderTable(message.queryResults)}
                          </div>
                        )}

                        {/* Follow-up Questions */}
                        {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {message.followUpQuestions.map((question, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSend(question)}
                                className="text-sm px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:border-alumimundo-navy hover:text-alumimundo-navy dark:hover:border-alumimundo-teal dark:hover:text-alumimundo-teal transition"
                              >
                                {question}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-right text-gray-400' : 'text-left text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString('es-CR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%]">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-sm rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 pb-[16px] sm:pb-4">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl backdrop-saturate-150 border-2 border-white/30 dark:border-gray-700/30 rounded-2xl p-2 shadow-lg shadow-black/10 ring-2 ring-white dark:ring-gray-700">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Pregúntale a ALMA sobre tus datos..."
            disabled={isTyping}
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
            className="w-full px-2 py-1.5 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none resize-none transition-all disabled:opacity-50 min-h-[32px] max-h-[120px]"
            style={{
              overflowY: inputValue.split('\n').length > 3 ? 'auto' : 'hidden'
            }}
          />

          <div className="flex items-center justify-between mt-1">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              ALMA - Analista de Datos IA
            </div>

            <button
              onClick={() => handleSend()}
              disabled={isTyping || !inputValue.trim()}
              className={cn(
                "p-1.5 rounded-full transition-all",
                inputValue.trim() && !isTyping
                  ? "bg-alumimundo-navy hover:bg-alumimundo-teal text-white shadow-sm"
                  : "text-gray-400 bg-gray-100 dark:bg-gray-700"
              )}
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
