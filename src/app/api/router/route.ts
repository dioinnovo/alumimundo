/**
 * Smart Router API - LLM-based Intent Classification
 * Routes user queries to the appropriate agent (analytics, chat, products)
 * Uses Claude Haiku for fast, cost-effective classification (~200-500ms)
 */

import { NextRequest, NextResponse } from 'next/server'

// Azure OpenAI configuration for Claude Haiku
const AZURE_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT
const AZURE_API_KEY = process.env.AZURE_OPENAI_KEY
const AZURE_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o-mini'
const API_VERSION = process.env.AZURE_OPENAI_VERSION || '2024-12-01-preview'

type AgentMode = 'analytics' | 'chat' | 'products'

interface RouterRequest {
  query: string
  context?: {
    previousMode?: AgentMode
    conversationHistory?: Array<{ role: string; content: string }>
  }
}

interface RouterResponse {
  mode: AgentMode
  confidence: 'high' | 'medium' | 'low'
  reasoning?: string
}

const CLASSIFICATION_PROMPT = `Eres un clasificador de intenciones para ALMA, el asistente de Alumimundo.

Tu tarea es determinar qué agente debe manejar cada consulta del usuario:

**AGENTS DISPONIBLES:**

1. **analytics** - Para consultas de datos y análisis SQL
   - Métricas, KPIs, tendencias de negocio
   - Preguntas sobre ventas, inventario, proyectos, clientes
   - Análisis comparativos, rankings, estadísticas
   - Ejemplos: "¿Cuántos proyectos tenemos activos?", "Top 10 productos más vendidos", "Tendencia de ventas por provincia"

2. **products** - Para búsqueda y consulta de productos
   - Información sobre productos específicos (KOHLER, Schlage, etc.)
   - Especificaciones técnicas, compatibilidad
   - Búsqueda por características o aplicación
   - Ejemplos: "Muéstrame lavamanos KOHLER", "Qué cerraduras Schlage son para exterior", "Productos para baño de hotel"

3. **chat** - Para conversación general y soporte
   - Preguntas sobre procesos, instalación, uso del sistema
   - Conversación general, saludos, ayuda
   - Consultas que no requieren datos específicos ni búsqueda de productos
   - Ejemplos: "¿Cómo funciona el sistema?", "Ayúdame a crear un proyecto", "¿Cómo se instala esto?"

**INSTRUCCIONES:**
- Analiza la consulta del usuario
- Clasifica en uno de los tres agentes
- Responde SOLO con un JSON válido en este formato:
{
  "mode": "analytics" | "chat" | "products",
  "confidence": "high" | "medium" | "low",
  "reasoning": "breve explicación de 1 frase"
}

**REGLAS:**
- Si menciona datos, números, métricas, tendencias → "analytics"
- Si busca productos, marcas, especificaciones → "products"
- Si es conversación, ayuda, procesos → "chat"
- Si hay ambigüedad, usa "confidence": "medium" o "low"
- SIEMPRE responde con JSON válido, nada más`

export async function POST(request: NextRequest) {
  try {
    const body: RouterRequest = await request.json()
    const { query, context } = body

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    if (!AZURE_ENDPOINT || !AZURE_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      )
    }

    // Build context-aware prompt
    let userPrompt = `Consulta del usuario: "${query}"`

    if (context?.previousMode) {
      userPrompt += `\n\nContexto: El usuario estaba usando el modo "${context.previousMode}"`
    }

    // Call Azure OpenAI for intent classification
    const classificationResponse = await fetch(
      `${AZURE_ENDPOINT}/openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': AZURE_API_KEY,
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: CLASSIFICATION_PROMPT },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 100,
          temperature: 0.3, // Low temperature for consistent classification
          response_format: { type: 'json_object' }
        })
      }
    )

    if (!classificationResponse.ok) {
      const errorText = await classificationResponse.text()
      console.error('Classification error:', errorText)

      // Fallback to rule-based classification
      return NextResponse.json(fallbackClassification(query))
    }

    const data = await classificationResponse.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      // Fallback to rule-based classification
      return NextResponse.json(fallbackClassification(query))
    }

    try {
      const classification: RouterResponse = JSON.parse(content)

      // Validate response
      if (!['analytics', 'chat', 'products'].includes(classification.mode)) {
        throw new Error('Invalid mode in classification')
      }

      return NextResponse.json(classification)
    } catch (parseError) {
      console.error('Failed to parse classification response:', parseError)
      return NextResponse.json(fallbackClassification(query))
    }

  } catch (error) {
    console.error('Router API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Fallback rule-based classification when LLM fails
 */
function fallbackClassification(query: string): RouterResponse {
  const lowerQuery = query.toLowerCase()

  // Analytics keywords
  const analyticsKeywords = [
    'cuántos', 'cuántas', 'total', 'suma', 'promedio', 'tendencia', 'análisis',
    'top', 'ranking', 'mejor', 'peor', 'más', 'menos', 'estadística',
    'ventas', 'proyectos', 'clientes', 'ingresos', 'gastos', 'margen',
    'kpi', 'métrica', 'dashboard', 'reporte', 'comparar', 'comparación'
  ]

  // Products keywords
  const productsKeywords = [
    'kohler', 'schlage', 'producto', 'productos', 'lavamanos', 'inodoro',
    'grifería', 'cerradura', 'ducha', 'tina', 'llave', 'baño', 'cocina',
    'puerta', 'acabados', 'herraje', 'especificación', 'catálogo', 'modelo',
    'marca', 'precio', 'disponible', 'stock'
  ]

  // Check for analytics intent
  if (analyticsKeywords.some(keyword => lowerQuery.includes(keyword))) {
    return {
      mode: 'analytics',
      confidence: 'medium',
      reasoning: 'Clasificación basada en palabras clave de análisis'
    }
  }

  // Check for products intent
  if (productsKeywords.some(keyword => lowerQuery.includes(keyword))) {
    return {
      mode: 'products',
      confidence: 'medium',
      reasoning: 'Clasificación basada en palabras clave de productos'
    }
  }

  // Default to chat for general queries
  return {
    mode: 'chat',
    confidence: 'low',
    reasoning: 'Sin coincidencias claras, usando conversación general'
  }
}
