'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, FileText, Download, Plus, CheckCircle, AlertTriangle, Shield, Trash2, Clock, TrendingUp, GitCompare, LayoutTemplate, Eye, Image as ImageIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { designTokens, cn } from '@/lib/design-tokens'
import {
  productsDatabase,
  type Product,
} from '@/lib/products-data'
import {
  generateComplianceReport,
  getComplianceSummary,
  type ProjectCompliance
} from '@/lib/compliance-checker'
import {
  generateProductSpecifications,
  generateMarkdownSpec,
  type ProjectSpecification
} from '@/lib/spec-generator'
import { type ProjectTemplate } from '@/lib/project-templates'
import Image from 'next/image'
import Markdown from '@/components/Markdown'
import ProductComparison from '@/components/ProductComparison'
import ProjectTemplates from '@/components/ProjectTemplates'
import ProductImageGallery from '@/components/ProductImageGallery'
import VisualSearch from '@/components/VisualSearch'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  products?: Product[]
  timestamp: Date
}

interface SpecificationItem {
  product: Product
  quantity: number
  notes?: string
}

type ProjectType = 'residential' | 'commercial' | 'hotel' | 'institutional'
type LocationType = 'coastal' | 'urban' | 'seismic-zone-3' | 'seismic-zone-4'

export default function CatalogoIAPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy tu consultor inteligente de productos. Cuéntame sobre tu proyecto y te ayudaré a encontrar los productos perfectos. Puedes describirme:\n\n• Tipo de proyecto (hotel, residencial, comercial)\n• Ubicación y zona climática\n• Estilo o estética deseada\n• Presupuesto estimado\n• Requisitos especiales',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([])
  const [specification, setSpecification] = useState<SpecificationItem[]>([])
  const [showSpecBuilder, setShowSpecBuilder] = useState(false)
  const [complianceReport, setComplianceReport] = useState<ProjectCompliance | null>(null)
  const [projectType, setProjectType] = useState<ProjectType>('commercial')
  const [projectLocation, setProjectLocation] = useState<LocationType>('urban')
  const [showCompliance, setShowCompliance] = useState(false)
  const [conversationContext, setConversationContext] = useState({
    projectBudget: '',
    projectSize: '',
    timeframe: '',
    specialRequirements: [] as string[]
  })
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([])
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [galleryProduct, setGalleryProduct] = useState<Product | null>(null)
  const [showGallery, setShowGallery] = useState(false)
  const [showVisualSearch, setShowVisualSearch] = useState(false)
  const [visualSearchImage, setVisualSearchImage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Generate suggested follow-up questions based on context
  useEffect(() => {
    if (messages.length > 1) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'assistant') {
        const suggestions: string[] = []

        if (specification.length === 0) {
          suggestions.push('¿Qué productos son más populares para hoteles?')
          suggestions.push('¿Cuáles son las opciones eco-friendly disponibles?')
        } else if (specification.length > 0 && !complianceReport) {
          suggestions.push('¿Estos productos cumplen con los códigos de construcción?')
          suggestions.push('¿Cuál sería el presupuesto total estimado?')
        } else if (complianceReport) {
          suggestions.push('¿Cómo puedo mejorar la tasa de cumplimiento?')
          suggestions.push('¿Hay alternativas más económicas?')
        }

        if (projectLocation === 'coastal') {
          suggestions.push('¿Qué garantías tienen contra la corrosión marina?')
        }

        setSuggestedQuestions(suggestions.slice(0, 3))
      }
    }
  }, [messages, specification, complianceReport, projectLocation])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')
    setIsTyping(true)

    try {
      // Call the specification chat API
      const response = await fetch('/api/specification/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role === 'system' ? 'assistant' : m.role, // Convert system to assistant for API
            content: m.content
          }))
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      // Check if this is a simulated response (non-streaming)
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        // Handle simulated response
        const data = await response.json()
        const aiResponse: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.response,
          products: data.products ? productsDatabase.filter(p =>
            data.products.some((dp: any) => dp.id === p.id)
          ) : undefined,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiResponse])
        if (aiResponse.products) {
          setSuggestedProducts(aiResponse.products)
        }
        setIsTyping(false)
      } else {
        // Handle streaming response (Azure OpenAI SSE format)
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let streamedContent = ''

        // Create the assistant message that will be updated as we stream
        const assistantMessageId = Date.now().toString()
        const assistantMessage: Message = {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
        setIsTyping(false)

        // Read the stream
        if (reader) {
          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break

              // Decode the chunk
              const chunk = decoder.decode(value, { stream: true })

              // Parse SSE format from Azure OpenAI
              // Format: "data: {...}\n\n"
              const lines = chunk.split('\n')
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.substring(6) // Remove "data: " prefix

                  // Skip [DONE] message
                  if (data === '[DONE]') continue

                  try {
                    const parsed = JSON.parse(data)
                    const content = parsed.choices?.[0]?.delta?.content

                    if (content) {
                      streamedContent += content

                      // Update the message with accumulated content
                      setMessages(prev =>
                        prev.map(msg =>
                          msg.id === assistantMessageId
                            ? { ...msg, content: streamedContent }
                            : msg
                        )
                      )
                    }
                  } catch (e) {
                    // Skip invalid JSON lines
                  }
                }
              }
            }

            // After streaming completes, update suggested products based on message
            const relevantProducts = getRelevantProducts(currentInput)
            if (relevantProducts.length > 0) {
              setSuggestedProducts(relevantProducts)
              // Update the message with products
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantMessageId
                    ? { ...msg, products: relevantProducts }
                    : msg
                )
              )
            }
          } catch (streamError) {
            console.error('Streaming error:', streamError)
            // If streaming fails, show error message
            setMessages(prev =>
              prev.map(msg =>
                msg.id === assistantMessageId
                  ? { ...msg, content: streamedContent || 'Error al procesar la respuesta. Por favor, intenta de nuevo.' }
                  : msg
              )
            )
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      // Fallback to simulated response on error
      const aiResponse = generateAIResponse(currentInput)
      setMessages(prev => [...prev, aiResponse])
      if (aiResponse.products) {
        setSuggestedProducts(aiResponse.products)
      }
      setIsTyping(false)
    }
  }

  // Helper function to get relevant products based on query
  const getRelevantProducts = (query: string): Product[] => {
    const queryLower = query.toLowerCase()
    let filtered = [...productsDatabase]

    // Hotel/hospitality
    if (queryLower.includes('hotel') || queryLower.includes('hospitalidad')) {
      filtered = filtered.filter(p =>
        ['KOHLER', 'Kallista', 'Tarkett', 'Artemide'].includes(p.brand)
      )
    }
    // Residential
    else if (queryLower.includes('residencial') || queryLower.includes('casa')) {
      filtered = filtered.filter(p =>
        p.brand === 'KOHLER' || p.brand === 'Schlage'
      )
    }
    // Coastal
    else if (queryLower.includes('costa') || queryLower.includes('playa')) {
      filtered = filtered.filter(p =>
        p.specifications.features?.some(f =>
          f.toLowerCase().includes('resist') ||
          f.toLowerCase().includes('waterproof')
        )
      )
    }

    return filtered.slice(0, 6)
  }

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase()

    // Intent detection based on keywords
    let response = ''
    let products: Product[] = []

    // Hotel project detection
    if (input.includes('hotel') || input.includes('hospitalidad')) {
      response = '¡Perfecto! Para proyectos hoteleros recomiendo productos de grado comercial con garantías extendidas. Basándome en tu descripción, he seleccionado:\n\n**Grifería de baño:**\n• KOHLER Artifacts - Diseño clásico, garantía 10 años\n• Kallista Vir Stil - Lujo premium para suites\n\n**Pisos:**\n• Tarkett iQ Granit - Alta durabilidad, fácil mantenimiento\n\n**Iluminación:**\n• Artemide - Diseño italiano para espacios públicos\n\n¿Te gustaría ver más detalles de algún producto o agregar otra categoría?'

      products = productsDatabase.filter(p =>
        ['KOHLER', 'Kallista', 'Tarkett', 'Artemide'].includes(p.brand) &&
        (p.subcategory?.includes('Baño') || p.category === 'Pisos' || p.category === 'Iluminación')
      ).slice(0, 6)
    }
    // Residential project detection
    else if (input.includes('residencial') || input.includes('casa') || input.includes('vivienda')) {
      response = 'Entiendo que es un proyecto residencial. Para hogares de alto nivel, sugiero:\n\n**Cocina:**\n• KOHLER Simplice - Grifería con tecnología ProMotion\n\n**Baño:**\n• KOHLER Tresham - Lavamanos de diseño atemporal\n• KOHLER Wellworth - Inodoro con tecnología Class Five\n\n**Seguridad:**\n• Schlage Camelot - Cerradura inteligente con Bluetooth\n\n¿Necesitas productos para alguna otra área específica?'

      products = productsDatabase.filter(p =>
        p.brand === 'KOHLER' || p.brand === 'Schlage'
      ).slice(0, 5)
    }
    // Budget focused
    else if (input.includes('presupuesto') || input.includes('precio') || input.includes('costo')) {
      response = 'Para optimizar tu presupuesto, puedo mostrarte opciones en diferentes rangos de precio. ¿Prefieres:\n\n1. **Gama Premium** (mayor durabilidad y garantías)\n2. **Gama Media-Alta** (balance calidad-precio)\n3. **Soluciones Eficientes** (máximo valor)\n\nTambién puedo calcular el costo total estimado si me indicas las cantidades necesarias.'

      products = productsDatabase.slice(0, 6)
    }
    // Coastal location
    else if (input.includes('costa') || input.includes('playa') || input.includes('guanacaste')) {
      response = '⚠️ Importante: Para ubicaciones costeras recomiendo productos con acabados resistentes a la corrosión.\n\n**Productos recomendados:**\n• KOHLER - Acabados con tecnología Resist\n• Schlage - Cerraduras con tratamiento anti-corrosión\n• Tarkett - Pisos resistentes a humedad alta\n\nEstos productos cumplen con los requisitos de zona costera según código CFIA. ¿Quieres que revise compliance para alguna categoría específica?'

      products = productsDatabase.filter(p =>
        p.specifications.features?.some(f =>
          f.toLowerCase().includes('resist') ||
          f.toLowerCase().includes('waterproof') ||
          f.toLowerCase().includes('corrosion')
        )
      )
    }
    // Compliance/code question
    else if (input.includes('código') || input.includes('norma') || input.includes('compliance') || input.includes('sísmic')) {
      response = 'Puedo ayudarte con el cumplimiento de códigos costarricenses:\n\n✅ **Código Sísmico (CFIA)**\n✅ **Resistencia al Fuego (NFPA 80)**  \n✅ **Accesibilidad (ADA)**\n✅ **Eficiencia de Agua (WaterSense)**\n\nTodos los productos que recomiendo incluyen sus certificaciones. ¿Sobre qué categoría de producto necesitas validar compliance?'

      products = productsDatabase.filter(p =>
        p.specifications.certifications && p.specifications.certifications.length > 0
      ).slice(0, 5)
    }
    // Default response
    else {
      response = 'Gracias por la información. Para darte las mejores recomendaciones, ¿podrías contarme un poco más sobre:\n\n• ¿Qué tipo de proyecto es? (hotel, residencial, oficinas, etc.)\n• ¿En qué ubicación? (zona climática)\n• ¿Qué categorías de productos necesitas? (grifería, pisos, iluminación, etc.)\n• ¿Tienes un presupuesto estimado?\n\nMientras tanto, aquí tienes nuestros productos más populares:'

      products = productsDatabase.filter(p => p.featured).slice(0, 6)
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: response,
      products: products.length > 0 ? products : undefined,
      timestamp: new Date()
    }
  }

  const addToSpecification = (product: Product) => {
    const exists = specification.find(item => item.product.id === product.id)
    if (!exists) {
      setSpecification(prev => [...prev, { product, quantity: 1 }])
      setShowSpecBuilder(true)

      // Add confirmation message
      const confirmMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: `✅ ${product.nameEs || product.name} agregado a tu especificación. Total de productos: ${specification.length + 1}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, confirmMessage])
    }
  }

  const formatPrice = (product: Product) => {
    if (product.price) {
      return `${product.currency} ${product.price.toLocaleString()}`
    }
    if (product.priceRange) {
      return `${product.currency} ${product.priceRange.min.toLocaleString()} - ${product.priceRange.max.toLocaleString()}`
    }
    return 'Consultar precio'
  }

  // Clear conversation and start fresh
  const handleClearConversation = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: '¡Hola! Soy tu consultor inteligente de productos. Cuéntame sobre tu proyecto y te ayudaré a encontrar los productos perfectos. Puedes describirme:\n\n• Tipo de proyecto (hotel, residencial, comercial)\n• Ubicación y zona climática\n• Estilo o estética deseada\n• Presupuesto estimado\n• Requisitos especiales',
        timestamp: new Date()
      }
    ])
    setSuggestedProducts([])
    setSuggestedQuestions([])
  }

  // Calculate total budget for current specification
  const calculateBudget = () => {
    return specification.reduce((total, item) => {
      const productPrice = item.product.price || item.product.priceRange?.min || 0
      return total + (productPrice * item.quantity)
    }, 0)
  }

  // Remove item from specification
  const removeFromSpecification = (productId: string) => {
    setSpecification(prev => prev.filter(item => item.product.id !== productId))
  }

  // Comparison functions
  const addToComparison = (product: Product) => {
    if (comparisonProducts.length >= 4) {
      return // Max 4 products
    }
    if (!comparisonProducts.find(p => p.id === product.id)) {
      setComparisonProducts(prev => [...prev, product])
    }
  }

  const removeFromComparison = (productId: string) => {
    setComparisonProducts(prev => prev.filter(p => p.id !== productId))
  }

  const toggleComparison = () => {
    if (comparisonProducts.length < 2) {
      return // Need at least 2 products
    }
    setShowComparison(!showComparison)
  }

  // Apply project template
  const handleSelectTemplate = (template: ProjectTemplate) => {
    // Set project context from template
    setProjectType(template.type)
    setProjectLocation(template.location)

    // Find products that match the template's recommended product IDs
    const templateProducts: Product[] = []
    template.recommendedProducts.forEach(rec => {
      rec.productIds.forEach(productId => {
        const product = productsDatabase.find(p => p.id === productId)
        if (product) {
          templateProducts.push(product)
        }
      })
    })

    // Add template products to suggested products
    setSuggestedProducts(templateProducts)
    setShowSpecBuilder(true)

    // Add assistant message explaining the template
    const templateMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `✨ **Plantilla aplicada: ${template.nameEs}**\n\n${template.descriptionEs}\n\n**Presupuesto estimado:** $${template.estimatedBudget.min.toLocaleString()} - $${template.estimatedBudget.max.toLocaleString()}\n\n**Categorías incluidas:**\n${template.productCategories.map(cat => `• ${cat}`).join('\n')}\n\n**Certificaciones requeridas:**\n${template.specifications.certifications.join(', ')}\n\nHe sugerido ${templateProducts.length} productos basados en esta plantilla. Puedes agregarlos a tu especificación o preguntarme sobre alternativas.`,
      timestamp: new Date(),
      products: templateProducts
    }

    setMessages(prev => [...prev, templateMessage])
  }

  // Open product image gallery
  const handleOpenGallery = (product: Product) => {
    setGalleryProduct(product)
    setShowGallery(true)
  }

  // Handle visual search results
  const handleVisualSearchResults = (products: Product[], searchImage: string) => {
    setVisualSearchImage(searchImage)
    setSuggestedProducts(products)
    setShowSpecBuilder(true)

    // Add assistant message with visual search results
    const visualSearchMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `🔍 **Búsqueda Visual Completada**\n\nHe encontrado ${products.length} productos similares a tu imagen:\n\n${products.map((p, i) => `${i + 1}. **${p.nameEs || p.name}** - ${p.brand}`).join('\n')}\n\nEstos productos coinciden en estilo, color y características con la imagen que proporcionaste. Puedes explorarlos en el panel de productos sugeridos.`,
      timestamp: new Date(),
      products: products
    }

    setMessages(prev => [...prev, visualSearchMessage])
  }

  // Generate compliance report
  const handleCheckCompliance = () => {
    if (specification.length === 0) return

    const products = specification.map(item => item.product)
    const report = generateComplianceReport(products, {
      type: projectType,
      location: projectLocation
    })

    setComplianceReport(report)
    setShowCompliance(true)

    // Add message to chat
    const summary = getComplianceSummary(report)
    const complianceMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: `✅ Análisis de cumplimiento completado:\n\n📊 Tasa de cumplimiento: ${summary.complianceRate}%\n✅ Cumple: ${summary.compliant}\n⚠️ Requiere atención: ${summary.partial}\n❌ No cumple: ${summary.nonCompliant}\n\nRevisa el panel de cumplimiento para más detalles.`,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, complianceMessage])
  }

  // Generate specification document
  const handleGenerateSpec = () => {
    if (specification.length === 0) return

    const products = specification.map(item => item.product)
    const sections = generateProductSpecifications(products)

    const spec: ProjectSpecification = {
      projectName: `Proyecto ${projectType.charAt(0).toUpperCase() + projectType.slice(1)}`,
      projectType,
      location: projectLocation,
      date: new Date().toLocaleDateString('es-CR'),
      preparedBy: 'Alumimundo AI - Catálogo IA',
      sections,
      products,
      compliance: complianceReport || undefined
    }

    const markdownDoc = generateMarkdownSpec(spec)

    // Download as markdown file
    const blob = new Blob([markdownDoc], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `especificacion-${projectType}-${Date.now()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Add confirmation message
    const confirmMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: '📄 Especificación técnica generada y descargada exitosamente.',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, confirmMessage])
  }

  // Auto-detect project context from conversation
  useEffect(() => {
    const lastMessages = messages.slice(-5).map(m => m.content.toLowerCase()).join(' ')

    // Detect project type
    if (lastMessages.includes('hotel') || lastMessages.includes('hospitalidad')) {
      setProjectType('hotel')
    } else if (lastMessages.includes('residencial') || lastMessages.includes('casa')) {
      setProjectType('residential')
    } else if (lastMessages.includes('comercial') || lastMessages.includes('oficina')) {
      setProjectType('commercial')
    } else if (lastMessages.includes('institución') || lastMessages.includes('escuela') || lastMessages.includes('hospital')) {
      setProjectType('institutional')
    }

    // Detect location
    if (lastMessages.includes('costa') || lastMessages.includes('playa') || lastMessages.includes('guanacaste') || lastMessages.includes('puntarenas')) {
      setProjectLocation('coastal')
    } else if (lastMessages.includes('sísmico') || lastMessages.includes('sísmica') || lastMessages.includes('zona iii')) {
      setProjectLocation('seismic-zone-3')
    }
  }, [messages])

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col lg:flex-row gap-4">
        {/* Left Panel - AI Chat (Primary Interface) */}
        <div className="flex-1 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className={cn('p-4 border-b', designTokens.borders.divider)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-alumimundo-teal to-blue-500 rounded-lg">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className={cn('font-bold text-lg', designTokens.text.primary)}>
                      Catálogo IA
                    </h2>
                    <p className={cn('text-sm', designTokens.text.secondary)}>
                      Consultor inteligente de productos • Powered by Azure OpenAI
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowVisualSearch(true)}
                    className={cn(
                      'px-4 py-2 rounded-lg transition flex items-center gap-2',
                      'bg-blue-50 dark:bg-blue-900/20',
                      'text-blue-700 dark:text-blue-300',
                      'hover:bg-blue-100 dark:hover:bg-blue-900/30',
                      'text-sm font-medium'
                    )}
                    title="Búsqueda visual con imagen"
                  >
                    <ImageIcon size={18} />
                    <span className="hidden sm:inline">Búsqueda Visual</span>
                  </button>
                  <button
                    onClick={() => setShowTemplates(true)}
                    className={cn(
                      'px-4 py-2 rounded-lg transition flex items-center gap-2',
                      'bg-purple-50 dark:bg-purple-900/20',
                      'text-purple-700 dark:text-purple-300',
                      'hover:bg-purple-100 dark:hover:bg-purple-900/30',
                      'text-sm font-medium'
                    )}
                    title="Usar plantilla de proyecto"
                  >
                    <LayoutTemplate size={18} />
                    <span className="hidden sm:inline">Plantillas</span>
                  </button>
                  <button
                    onClick={handleClearConversation}
                    className={cn(
                      'p-2 rounded-lg transition',
                      'hover:bg-red-50 dark:hover:bg-red-900/20',
                      'text-gray-400 hover:text-red-600'
                    )}
                    title="Limpiar conversación"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-3',
                      message.role === 'user'
                        ? 'bg-alumimundo-teal text-white'
                        : message.role === 'system'
                        ? cn(designTokens.status.success.bg, designTokens.status.success.text, 'text-sm')
                        : cn(designTokens.backgrounds.cardSecondary, designTokens.text.primary)
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={16} className="text-alumimundo-teal" />
                        <span className={cn('text-xs font-medium', designTokens.text.brand)}>
                          Catálogo IA
                        </span>
                      </div>
                    )}
                    {message.role === 'assistant' ? (
                      <Markdown content={message.content} />
                    ) : (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    )}

                    {/* Show product suggestions inline */}
                    {message.products && message.products.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-xs font-semibold mb-3">Productos sugeridos:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {message.products.slice(0, 4).map(product => (
                            <button
                              key={product.id}
                              onClick={() => addToSpecification(product)}
                              className={cn(
                                'text-left p-2 rounded-lg text-xs transition',
                                'bg-white dark:bg-gray-700 hover:ring-2 hover:ring-alumimundo-teal'
                              )}
                            >
                              <p className="font-semibold truncate">{product.brand}</p>
                              <p className="truncate text-gray-600 dark:text-gray-300">
                                {product.nameEs?.substring(0, 30) || product.name.substring(0, 30)}...
                              </p>
                              <p className="text-alumimundo-teal font-bold mt-1">
                                {formatPrice(product)}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className={cn('rounded-2xl px-4 py-3', designTokens.backgrounds.cardSecondary)}>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-alumimundo-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-alumimundo-teal rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-alumimundo-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                      <span className={cn('text-sm', designTokens.text.secondary)}>Analizando...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className={cn('p-4 border-t', designTokens.borders.divider)}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Describe tu proyecto o haz una pregunta..."
                  className={cn(
                    'flex-1 px-4 py-3 rounded-xl',
                    designTokens.borders.input,
                    designTokens.backgrounds.card,
                    designTokens.text.primary,
                    'focus:outline-none focus:ring-2 focus:ring-alumimundo-teal'
                  )}
                  data-gramm="false"
                  data-gramm_editor="false"
                  data-enable-grammarly="false"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className={cn(
                    'px-6 py-3 rounded-xl font-medium transition',
                    'bg-alumimundo-teal text-white',
                    'hover:bg-alumimundo-teal/90',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <Send size={20} />
                </button>
              </div>

              {/* Smart suggestions based on conversation context */}
              {suggestedQuestions.length > 0 ? (
                <div className="mt-3">
                  <p className={cn('text-xs font-medium mb-2', designTokens.text.secondary)}>
                    Preguntas sugeridas:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInputValue(question)}
                        className={cn(
                          'text-xs px-3 py-1.5 rounded-full',
                          'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
                          'hover:bg-alumimundo-teal hover:text-white transition'
                        )}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => setInputValue('Necesito grifería para un hotel 5 estrellas')}
                    className={cn('text-xs px-3 py-1.5 rounded-full', designTokens.backgrounds.cardSecondary, 'hover:bg-alumimundo-teal hover:text-white transition')}
                  >
                    🏨 Hotel de lujo
                  </button>
                  <button
                    onClick={() => setInputValue('Proyecto residencial en zona costera')}
                    className={cn('text-xs px-3 py-1.5 rounded-full', designTokens.backgrounds.cardSecondary, 'hover:bg-alumimundo-teal hover:text-white transition')}
                  >
                    🏖️ Zona costera
                  </button>
                  <button
                    onClick={() => setInputValue('Necesito productos con certificación WaterSense')}
                    className={cn('text-xs px-3 py-1.5 rounded-full', designTokens.backgrounds.cardSecondary, 'hover:bg-alumimundo-teal hover:text-white transition')}
                  >
                    💧 Eco-friendly
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Panel - Products & Specification */}
        <div className="w-full lg:w-96 flex flex-col gap-4 min-h-0">
          {/* Session Stats */}
          {messages.length > 2 && (
            <Card className="p-3">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Clock size={14} className="text-gray-400" />
                  <span className={designTokens.text.secondary}>{messages.length} mensajes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles size={14} className="text-alumimundo-teal" />
                  <span className={designTokens.text.secondary}>{suggestedProducts.length} sugerencias</span>
                </div>
                {specification.length > 0 && (
                  <div className="flex items-center gap-1">
                    <FileText size={14} className="text-green-600" />
                    <span className={designTokens.text.secondary}>{specification.length} productos</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Suggested Products */}
          <Card className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={cn('font-bold', designTokens.text.primary)}>
                Productos Sugeridos
              </h3>
              <p className={cn('text-sm mt-1', designTokens.text.secondary)}>
                {suggestedProducts.length} productos basados en conversación
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {suggestedProducts.length > 0 ? (
                suggestedProducts.map(product => (
                  <div
                    key={product.id}
                    className={cn(
                      'p-3 rounded-lg border transition cursor-pointer',
                      designTokens.borders.card,
                      'hover:border-alumimundo-teal hover:shadow-md'
                    )}
                    onClick={() => addToSpecification(product)}
                  >
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenGallery(product)
                        }}
                        className="relative w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0 group hover:ring-2 hover:ring-alumimundo-teal transition"
                      >
                        <span className="text-xs text-gray-400 group-hover:hidden">IMG</span>
                        <Eye className="text-alumimundo-teal hidden group-hover:block" size={20} />
                        {product.galleryImages && product.galleryImages.length > 1 && (
                          <span className="absolute top-1 right-1 bg-alumimundo-teal text-white text-xs px-1 rounded">
                            +{product.galleryImages.length}
                          </span>
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-xs', designTokens.text.brand)}>{product.brand}</p>
                        <p className={cn('font-semibold text-sm line-clamp-2', designTokens.text.primary)}>
                          {product.nameEs || product.name}
                        </p>
                        <p className="text-alumimundo-teal font-bold text-sm mt-1">
                          {formatPrice(product)}
                        </p>
                        {product.inStock && (
                          <span className="text-xs text-green-600 dark:text-green-400">● En stock</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          addToSpecification(product)
                        }}
                        className="flex-1 px-3 py-1.5 bg-alumimundo-teal/10 text-alumimundo-teal rounded text-xs font-medium hover:bg-alumimundo-teal hover:text-white transition"
                      >
                        + Agregar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenGallery(product)
                        }}
                        className="px-3 py-1.5 rounded text-xs font-medium transition bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        title="Ver imágenes"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          addToComparison(product)
                        }}
                        className={cn(
                          'px-3 py-1.5 rounded text-xs font-medium transition',
                          comparisonProducts.find(p => p.id === product.id)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                        )}
                        disabled={comparisonProducts.length >= 4 && !comparisonProducts.find(p => p.id === product.id)}
                        title="Comparar"
                      >
                        <GitCompare size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="mx-auto mb-3 text-gray-400" size={32} />
                  <p className={cn('text-sm', designTokens.text.secondary)}>
                    Los productos aparecerán aquí basados en tu conversación
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Specification Builder */}
          {showSpecBuilder && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className={cn('font-bold flex items-center gap-2', designTokens.text.primary)}>
                  <FileText size={18} />
                  Mi Especificación
                </h3>
                <span className={cn('text-xs px-2 py-1 rounded-full', designTokens.status.info.bg, designTokens.status.info.text)}>
                  {specification.length} productos
                </span>
              </div>

              {/* Project Context */}
              <div className="mb-3 p-2 rounded bg-gray-100 dark:bg-gray-800 text-xs">
                <p className={cn('font-medium mb-1', designTokens.text.primary)}>Contexto del Proyecto:</p>
                <p className={designTokens.text.secondary}>
                  Tipo: <span className="font-semibold">{projectType}</span> • Ubicación: <span className="font-semibold">{projectLocation}</span>
                </p>
              </div>

              <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                {specification.map(item => (
                  <div key={item.product.id} className={cn('text-xs p-2 rounded flex items-start justify-between gap-2', designTokens.backgrounds.cardSecondary)}>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{item.product.nameEs || item.product.name}</p>
                      <p className={cn(designTokens.text.secondary, 'text-xs')}>{item.product.brand}</p>
                      <p className="text-alumimundo-teal font-bold mt-1">
                        {formatPrice(item.product)} × {item.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromSpecification(item.product.id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition text-gray-400 hover:text-red-600"
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Budget Summary */}
              {specification.length > 0 && (
                <div className={cn('mb-3 p-3 rounded-lg', 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20')}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-green-600 dark:text-green-400" />
                      <span className="text-sm font-semibold text-green-900 dark:text-green-100">Presupuesto Estimado</span>
                    </div>
                    <span className="text-lg font-bold text-green-700 dark:text-green-300">
                      ${calculateBudget().toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Compliance Status */}
              {complianceReport && (
                <div className={cn('mb-3 p-3 rounded-lg text-xs',
                  complianceReport.overallStatus === 'compliant'
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : complianceReport.overallStatus === 'needs-attention'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={14} />
                    <span className="font-semibold">Estado de Cumplimiento</span>
                  </div>
                  <p className={cn('text-xs', designTokens.text.secondary)}>
                    {getComplianceSummary(complianceReport).complianceRate}% de cumplimiento
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckCompliance}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm"
                >
                  <Shield size={16} />
                  Verificar Cumplimiento
                </button>
                <button
                  onClick={handleGenerateSpec}
                  className="w-full px-4 py-2 bg-alumimundo-teal text-white rounded-lg font-medium hover:bg-alumimundo-teal/90 transition flex items-center justify-center gap-2 text-sm"
                >
                  <Download size={16} />
                  Generar Documento
                </button>
              </div>
            </Card>
          )}

          {/* Compliance Details Panel */}
          {showCompliance && complianceReport && (
            <Card className="p-4 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className={cn('font-bold flex items-center gap-2', designTokens.text.primary)}>
                  <Shield size={18} />
                  Análisis de Cumplimiento
                </h3>
                <button
                  onClick={() => setShowCompliance(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="p-2 rounded bg-green-50 dark:bg-green-900/20 text-center">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {getComplianceSummary(complianceReport).compliant}
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300">Cumple</div>
                </div>
                <div className="p-2 rounded bg-yellow-50 dark:bg-yellow-900/20 text-center">
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {getComplianceSummary(complianceReport).partial}
                  </div>
                  <div className="text-xs text-yellow-700 dark:text-yellow-300">Parcial</div>
                </div>
                <div className="p-2 rounded bg-red-50 dark:bg-red-900/20 text-center">
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">
                    {getComplianceSummary(complianceReport).nonCompliant}
                  </div>
                  <div className="text-xs text-red-700 dark:text-red-300">No Cumple</div>
                </div>
              </div>

              {/* Recommendations */}
              {complianceReport.recommendations.length > 0 && (
                <div className="mb-4">
                  <h4 className={cn('font-semibold text-sm mb-2', designTokens.text.primary)}>
                    Recomendaciones:
                  </h4>
                  <div className="space-y-1">
                    {complianceReport.recommendations.map((rec, idx) => (
                      <div key={idx} className="text-xs p-2 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Checks */}
              <div>
                <h4 className={cn('font-semibold text-sm mb-2', designTokens.text.primary)}>
                  Detalles de Verificación:
                </h4>
                <div className="space-y-2">
                  {complianceReport.checks.slice(0, 10).map((check, idx) => (
                    <div key={idx} className="text-xs p-2 rounded bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-start gap-2">
                        {check.status === 'compliant' && <CheckCircle size={12} className="text-green-600 mt-0.5 flex-shrink-0" />}
                        {check.status === 'partial' && <AlertTriangle size={12} className="text-yellow-600 mt-0.5 flex-shrink-0" />}
                        {check.status === 'non-compliant' && <AlertTriangle size={12} className="text-red-600 mt-0.5 flex-shrink-0" />}
                        <div className="flex-1">
                          <p className="font-semibold">{check.requirement.name}</p>
                          <p className={cn('mt-1', designTokens.text.secondary)}>{check.details}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Floating Comparison Button */}
        {comparisonProducts.length > 0 && (
          <div className="fixed bottom-6 right-6 z-40">
            <button
              onClick={toggleComparison}
              disabled={comparisonProducts.length < 2}
              className={cn(
                'px-6 py-3 rounded-lg shadow-lg font-medium flex items-center gap-2 transition-all',
                comparisonProducts.length >= 2
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              )}
            >
              <GitCompare size={18} />
              Comparar {comparisonProducts.length} Producto{comparisonProducts.length !== 1 ? 's' : ''}
              {comparisonProducts.length < 2 && (
                <span className="text-xs ml-1">(min. 2)</span>
              )}
            </button>
          </div>
        )}

        {/* Product Comparison Modal */}
        {showComparison && (
          <ProductComparison
            products={comparisonProducts}
            onClose={() => setShowComparison(false)}
            onRemoveProduct={removeFromComparison}
            onAddToSpec={addToSpecification}
          />
        )}

        {/* Project Templates Modal */}
        {showTemplates && (
          <ProjectTemplates
            onClose={() => setShowTemplates(false)}
            onSelectTemplate={handleSelectTemplate}
          />
        )}

        {/* Product Image Gallery */}
        {showGallery && galleryProduct && (
          <ProductImageGallery
            images={[galleryProduct.imageUrl, ...(galleryProduct.galleryImages || [])]}
            productName={galleryProduct.nameEs || galleryProduct.name}
            has360View={galleryProduct.tags?.includes('360-view')}
            onClose={() => {
              setShowGallery(false)
              setGalleryProduct(null)
            }}
          />
        )}

        {/* Visual Search Modal */}
        {showVisualSearch && (
          <VisualSearch
            onClose={() => setShowVisualSearch(false)}
            onResultsFound={handleVisualSearchResults}
            allProducts={productsDatabase}
          />
        )}
    </div>
  )
}
