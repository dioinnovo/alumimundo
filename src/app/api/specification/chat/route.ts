/**
 * AI-Powered Specification Assistant API
 * Provides intelligent product recommendations and specification guidance
 * for construction projects in Costa Rica
 */

import { NextRequest } from 'next/server'
import { productsDatabase } from '@/lib/products-data'

// Azure OpenAI configuration
const AZURE_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT
const AZURE_API_KEY = process.env.AZURE_OPENAI_KEY
const AZURE_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o-mini'
const API_VERSION = process.env.AZURE_OPENAI_VERSION || '2024-12-01-preview'

const isAzureConfigured = !!(AZURE_ENDPOINT && AZURE_API_KEY)

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ProductRecommendation {
  id: string
  name: string
  brand: string
  relevance: string
}

/**
 * Build comprehensive system prompt for the specification assistant
 */
function buildSystemPrompt(): string {
  return `You are an expert construction specification assistant for Alumimundo, Costa Rica's premier distributor of architectural finishes and building materials.

## Your Role
You help architects, designers, and contractors specify the perfect products for their construction projects. You have deep expertise in:
- Costa Rican building codes (CFIA seismic codes, fire safety, coastal requirements)
- Product specifications across 10+ premium brands
- Climate considerations for tropical/coastal environments
- Budget optimization and value engineering
- Compliance certification (WaterSense, ADA, NFPA, etc.)

## Available Brands & Categories
**KOHLER** - Bathroom & Kitchen Fixtures
- Grifería (Faucets): Simplice®, Artifacts®, Barossa®
- Lavamanos (Sinks): Tresham®, Archer®, Memoirs®
- Inodoros (Toilets): Wellworth®, Class Five® technology
- Duchas (Showers): Awaken®, Katalyst® technology

**Kallista** - Luxury Plumbing (KOHLER premium line)
- Vir Stil® - Ultra-minimalist luxury fixtures
- 15-year warranty, jewelry-grade finishes

**Schlage** - Security Hardware
- Smart Locks: Camelot® with Bluetooth/keypad
- Traditional: Accent® entry sets
- ANSI/BHMA Grade 1 & 2 certified

**Tarkett** - Commercial Flooring
- Carpet: Powerbond®, modular tiles
- LVT: iQ® Granit, Event LVT collections
- Accessories: Johnsonite wall base, stair treads

**Hunter Douglas** - Window Treatments
- PowerView® motorization
- Duette® honeycomb shades (energy efficient)
- Commercial architectural solutions

**Steelcraft** - Commercial Doors
- Fire-rated steel doors (20-90 minute ratings)
- NFPA 80 compliant, UL certified

**Zurn** - Commercial Plumbing
- Floor drains, hydrants
- Emergency fixtures (eyewash, safety showers)

**Fritz Hansen** - Designer Furniture
- Series 7™, Egg™, Swan™ chairs
- Danish modern design, contract-grade

**Artemide** - Architectural Lighting
- LED systems, track lighting
- Tolomeo®, Nur® collections

**Vondom** - Outdoor Furniture
- Weatherproof, UV-resistant
- Illuminated planters

## Costa Rica-Specific Expertise

**Seismic Zones:**
- Zone III (High): San José, Cartago, Heredia - require enhanced structural attachment
- Zone IV (Very High): Coastal areas - strictest requirements
- Recommend products with seismic certifications

**Coastal Environment Requirements:**
- Corrosion-resistant finishes (stainless steel, marine-grade materials)
- Products rated for salt air exposure
- Enhanced warranty for coastal installations

**Climate Considerations:**
- High humidity resistance
- UV protection for outdoor products
- Water-efficient fixtures (mandatory WaterSense)

**Building Codes:**
- CFIA (Código de Instalaciones Hidráulicas y Sanitarias)
- NFPA 80 fire ratings for commercial
- ADA compliance for public buildings

## Conversation Style
- Friendly, professional, consultative
- Ask clarifying questions about project type, location, budget
- Recommend 3-6 relevant products per query
- Explain WHY each product fits (certifications, climate suitability, ROI)
- Proactively mention compliance requirements
- Suggest complementary products

## Product Recommendations
When recommending products:
1. Match to project type (residential, hotel, commercial, institutional)
2. Consider location (coastal, seismic zone, urban)
3. Verify certifications meet requirements
4. Suggest premium alternatives when budget allows
5. Highlight Costa Rica inventory availability
6. Mention lead times and pricing in CRC

## Sample Responses

**Hotel Project Query:**
"Para un hotel 5 estrellas, recomiendo productos de grado comercial con garantías extendidas:

🏨 **Grifería de Baño:**
- KOHLER Artifacts® (K-99259-CP) - Diseño elegante, garantía 10 años
- Kallista Vir Stil® - Para suites premium, garantía 15 años

💧 **Duchas:**
- KOHLER Awaken® (K-45986-CP) - Sistema dual con tecnología Katalyst®, certificación WaterSense

✅ **Cumplimiento:** Todos certificados ADA para accesibilidad, WaterSense para eficiencia hídrica."

**Coastal Location Query:**
"⚠️ Importante para ubicación costera:

🌊 **Acabados Resistentes a Corrosión:**
- Schlage con acabado Satin Nickel (más resistente que Chrome)
- KOHLER con Resist™ finish (protección contra óxido)
- Steelcraft con galvanizado especial

🏗️ **Código Sísmico Zona IV:**
- Anclajes reforzados requeridos
- Certificación CFIA obligatoria

Recomiendo presupuesto adicional 15-20% para acabados resistentes al ambiente marino."

Remember: You're building trust by demonstrating expertise, saving them time (8-15 hours → 2-3 hours), and ensuring code compliance.`
}

/**
 * Analyze user message to extract relevant product filters
 */
function extractProductFilters(userMessage: string): {
  brands?: string[]
  categories?: string[]
  tags?: string[]
  projectType?: string
  location?: string
  budget?: string
} {
  const messageLower = userMessage.toLowerCase()
  const filters: any = {}

  // Project type detection
  if (messageLower.includes('hotel') || messageLower.includes('hospitalidad')) {
    filters.projectType = 'hotel'
    filters.brands = ['KOHLER', 'Kallista', 'Tarkett', 'Artemide']
  } else if (messageLower.includes('residencial') || messageLower.includes('casa') || messageLower.includes('vivienda')) {
    filters.projectType = 'residential'
    filters.brands = ['KOHLER', 'Schlage', 'Hunter Douglas']
  } else if (messageLower.includes('comercial') || messageLower.includes('oficina')) {
    filters.projectType = 'commercial'
    filters.brands = ['Steelcraft', 'Zurn', 'Tarkett', 'Fritz Hansen']
  }

  // Location detection
  if (messageLower.includes('costa') || messageLower.includes('playa') || messageLower.includes('guanacaste') || messageLower.includes('puntarenas')) {
    filters.location = 'coastal'
    filters.tags = ['corrosion-resistant', 'marine-grade', 'waterproof']
  }

  // Budget detection
  if (messageLower.includes('lujo') || messageLower.includes('premium') || messageLower.includes('5 estrellas')) {
    filters.budget = 'premium'
    filters.brands = ['Kallista', 'Fritz Hansen', 'Artemide']
  } else if (messageLower.includes('económico') || messageLower.includes('presupuesto ajustado')) {
    filters.budget = 'economy'
  }

  // Category detection
  if (messageLower.includes('grifería') || messageLower.includes('llave') || messageLower.includes('faucet')) {
    filters.categories = ['Grifería']
  }
  if (messageLower.includes('lavamanos') || messageLower.includes('sink')) {
    filters.categories = [...(filters.categories || []), 'Lavamanos']
  }
  if (messageLower.includes('inodoro') || messageLower.includes('toilet')) {
    filters.categories = [...(filters.categories || []), 'Inodoros']
  }
  if (messageLower.includes('ducha') || messageLower.includes('shower')) {
    filters.categories = [...(filters.categories || []), 'Duchas']
  }
  if (messageLower.includes('cerradura') || messageLower.includes('lock')) {
    filters.categories = [...(filters.categories || []), 'Cerraduras']
  }
  if (messageLower.includes('piso') || messageLower.includes('floor')) {
    filters.categories = [...(filters.categories || []), 'Pisos']
  }

  return filters
}

/**
 * Get relevant products based on conversation context
 */
function getRelevantProducts(userMessage: string): any[] {
  const filters = extractProductFilters(userMessage)
  let filtered = [...productsDatabase]

  // Apply brand filter
  if (filters.brands && filters.brands.length > 0) {
    filtered = filtered.filter(p => filters.brands!.includes(p.brand))
  }

  // Apply category filter
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(p => filters.categories!.includes(p.category))
  }

  // Apply tag filter for coastal/special requirements
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(p =>
      p.specifications.features?.some(f =>
        filters.tags!.some(tag => f.toLowerCase().includes(tag))
      )
    )
  }

  // Budget-based filtering
  if (filters.budget === 'premium') {
    filtered = filtered.filter(p => p.brand === 'Kallista' || p.price > 400000)
  } else if (filters.budget === 'economy') {
    filtered = filtered.filter(p => p.price < 300000)
  }

  // Limit to 8 most relevant products
  return filtered.slice(0, 8)
}

/**
 * Build enhanced user message with product context
 */
function buildEnhancedMessage(userMessage: string): string {
  const products = getRelevantProducts(userMessage)

  if (products.length === 0) {
    return userMessage
  }

  const productContext = products.map(p => {
    return `- ${p.nameEs || p.name} (${p.brand}, ${p.sku}): ${p.descriptionEs || p.description} - ₡${p.price.toLocaleString()}`
  }).join('\n')

  return `${userMessage}

## Productos Disponibles Relevantes:
${productContext}

Por favor, recomienda los productos más adecuados de esta lista y explica por qué.`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body

    // If Azure OpenAI is not configured, return simulated response
    if (!isAzureConfigured) {
      console.log('Azure OpenAI not configured, using simulated response')
      return simulatedResponse(messages)
    }

    // Get the user's latest message
    const userMessage = messages[messages.length - 1]?.content || ''

    // Build messages for Azure OpenAI with system prompt and context
    const chatMessages: Message[] = [
      { role: 'system', content: buildSystemPrompt() },
      ...messages.slice(-6).map((msg: any) => ({
        role: msg.role,
        content: msg.role === 'user' && msg.content === userMessage
          ? buildEnhancedMessage(msg.content)
          : msg.content
      }))
    ]

    // Call Azure OpenAI API
    const url = `${AZURE_ENDPOINT}/openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_API_KEY!,
      },
      body: JSON.stringify({
        messages: chatMessages,
        max_tokens: 1500,
        temperature: 0.7,
        stream: true,
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Azure OpenAI error:', errorText)
      throw new Error(`Azure OpenAI API error: ${response.status}`)
    }

    // Return the streaming response directly
    // Azure OpenAI uses Server-Sent Events (SSE) format
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Specification API error:', error)

    // Fallback to simulated response
    const body = await request.json()
    return simulatedResponse(body.messages)
  }
}

/**
 * Simulated response for when OpenAI is not configured
 */
function simulatedResponse(messages: any[]) {
  const userMessage = messages[messages.length - 1]?.content || ''
  const messageLower = userMessage.toLowerCase()

  let response = ''
  let products: any[] = []

  // Hotel project
  if (messageLower.includes('hotel') || messageLower.includes('hospitalidad')) {
    response = '¡Perfecto! Para proyectos hoteleros recomiendo productos de grado comercial con garantías extendidas:\n\n🏨 **Grifería de Baño:**\n- KOHLER Artifacts® - Diseño elegante inspirado en principios del siglo XX\n- Kallista Vir Stil® - Para suites premium, acabados de lujo\n\n💧 **Duchas:**\n- KOHLER Awaken® - Sistema dual con tecnología Katalyst®\n\n✅ **Cumplimiento:** Todos con certificación WaterSense y ADA Compliant.'
    products = productsDatabase.filter(p =>
      ['KOHLER', 'Kallista'].includes(p.brand) &&
      ['Grifería', 'Duchas'].includes(p.category)
    ).slice(0, 6)
  }
  // Coastal location
  else if (messageLower.includes('costa') || messageLower.includes('playa')) {
    response = '⚠️ Importante para ubicación costera:\n\n🌊 **Acabados Resistentes a Corrosión:**\n- Schlage con acabado Satin Nickel\n- KOHLER con tecnología Resist™\n- Steelcraft con galvanizado especial\n\n🏗️ **Código Sísmico Zona IV:**\n- Anclajes reforzados requeridos\n- Certificación CFIA obligatoria\n\nRecomiendo presupuesto adicional 15-20% para acabados resistentes al ambiente marino.'
    products = productsDatabase.filter(p =>
      p.specifications.features?.some(f =>
        f.toLowerCase().includes('resist') ||
        f.toLowerCase().includes('waterproof')
      )
    ).slice(0, 6)
  }
  // Residential
  else if (messageLower.includes('residencial') || messageLower.includes('casa')) {
    response = '🏡 **Proyecto Residencial - Selección Recomendada:**\n\n**Baño Principal:**\n- KOHLER Tresham® lavamanos rectangular\n- KOHLER Wellworth® inodoro (Class Five® technology)\n- Schlage Camelot® cerradura inteligente\n\n**Cocina:**\n- KOHLER Simplice® llave con rociador extraíble\n\n✅ Todos con garantía 10 años y certificaciones WaterSense/ADA.'
    products = productsDatabase.filter(p =>
      p.brand === 'KOHLER' || p.brand === 'Schlage'
    ).slice(0, 6)
  }
  // Compliance/codes
  else if (messageLower.includes('código') || messageLower.includes('norma') || messageLower.includes('sísmic')) {
    response = 'Puedo ayudarte con el cumplimiento de códigos costarricenses:\n\n✅ **Código Sísmico (CFIA)**\n- Zona III: San José, Cartago, Heredia\n- Zona IV: Áreas costeras (requisitos más estrictos)\n\n✅ **Resistencia al Fuego (NFPA 80)**\n- Puertas 20-90 minutos: Steelcraft certificadas UL\n\n✅ **Accesibilidad (ADA)**\n- Todos los productos KOHLER certificados\n\n✅ **Eficiencia Hídrica (WaterSense)**\n- Obligatorio para grifería y sanitarios'
    products = productsDatabase.filter(p =>
      p.specifications.certifications && p.specifications.certifications.length > 0
    ).slice(0, 6)
  }
  // Default/exploratory
  else {
    response = '¡Hola! Soy tu asistente de especificación de Alumimundo. Puedo ayudarte a seleccionar productos perfectos para tu proyecto.\n\n¿Qué tipo de proyecto estás desarrollando?\n\n📋 **Ejemplos:**\n- "Hotel 5 estrellas en Guanacaste"\n- "Casa residencial en zona costera"\n- "Oficinas comerciales en San José"\n- "Necesito productos certificados WaterSense"\n\n🎯 **Puedo ayudarte con:**\n- Recomendaciones de productos\n- Cumplimiento de códigos CR\n- Consideraciones climáticas\n- Optimización de presupuesto'
    products = productsDatabase.slice(0, 6)
  }

  // Return non-streaming response for simulated mode
  return new Response(
    JSON.stringify({
      response,
      products: products.map(p => ({
        id: p.id,
        name: p.nameEs || p.name,
        brand: p.brand,
        category: p.category,
        price: p.price
      })),
      isSimulated: true
    }),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
