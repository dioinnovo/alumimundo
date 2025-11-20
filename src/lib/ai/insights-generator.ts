import { AzureChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

/**
 * Response mode types for insights generation
 * - quick: Concise 3-5 sentence summary
 * - pro: Comprehensive 200+ word analysis with sections
 */
export type ResponseMode = "quick" | "pro";

/**
 * Initialize Azure OpenAI for insights generation
 * Higher temperature (0.3) for more creative business analysis
 * Lazy-loaded to avoid module-level initialization errors
 */
let insightsLLM: AzureChatOpenAI | null = null;

function getInsightsLLM(): AzureChatOpenAI {
  if (!insightsLLM) {
    const azureApiKey = process.env.AZURE_OPENAI_API_KEY;
    const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o";

    if (!azureApiKey || !azureEndpoint) {
      throw new Error('Azure OpenAI credentials not set. Please add AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT to your .env.local file.');
    }

    insightsLLM = new AzureChatOpenAI({
      azureOpenAIApiKey: azureApiKey,
      azureOpenAIEndpoint: azureEndpoint,
      azureOpenAIApiDeploymentName: deploymentName,
      temperature: 0.3, // Higher temperature for creative analysis
    });
  }
  return insightsLLM;
}

/**
 * System prompt for the insights generator
 * Defines the AI's role as a business analyst for Alumimundo
 */
const INSIGHTS_SYSTEM_PROMPT = `You are a business analyst for Alumimundo, Costa Rica's premier distributor of high-end construction finishes and fixtures.
Your role is to analyze SQL query results and provide clear, actionable business insights with specific numbers and recommendations.
Use markdown formatting for emphasis (**bold** for key metrics, bullet points for lists).
Focus on practical business impact and next steps that executives can act on immediately.

RESPOND IN SPANISH - All insights must be in Spanish (español) for the Alumimundo team in Costa Rica.`;

/**
 * Generate business insights from SQL query results
 * Uses Claude to analyze data and provide business context
 *
 * @param question Original user question (Spanish or English)
 * @param sqlQuery SQL query that was executed
 * @param queryResults Results from the database (columns and rows)
 * @param responseMode "quick" for concise or "pro" for comprehensive analysis
 * @returns Markdown-formatted business insights IN SPANISH
 */
export async function generateInsights(
  question: string,
  sqlQuery: string,
  queryResults: { columns: string[]; rows: any[][] },
  responseMode: ResponseMode = "quick"
): Promise<string> {
  const { columns, rows } = queryResults;

  // Handle empty results
  if (rows.length === 0) {
    return `No se encontraron datos que coincidan con tu consulta. Esto podría significar:
- No hay registros que cumplan con los criterios especificados
- El período de tiempo seleccionado no tiene actividad
- Los filtros son demasiado restrictivos

**Sugerencia:** Intenta ajustar tu pregunta con:
- Un rango de fechas más amplio
- Criterios de filtrado diferentes
- Verificar si los datos existen en la base de datos`;
  }

  // Build context for the LLM based on response mode
  let dataContext: string;

  if (responseMode === "quick") {
    // Quick mode: concise, one paragraph response
    dataContext = `
Pregunta del Usuario: ${question}

Consulta SQL Ejecutada:
${sqlQuery}

Resultados (${rows.length} filas):
Columnas: ${columns.join(', ')}
Datos:
${rows.slice(0, 10).map((row, idx) =>
  `Fila ${idx + 1}: ${columns.map((col, i) => `${col}=${row[i]}`).join(', ')}`
).join('\n')}
${rows.length > 10 ? `\n... (${rows.length - 10} filas más)` : ''}

Instrucciones:
Proporciona una respuesta BREVE y concisa en UN SOLO PÁRRAFO MÁXIMO (3-5 oraciones) EN ESPAÑOL. Enfócate en:
- El hallazgo más importante de los datos
- Un número o métrica clave (usa **negrita** markdown)
- Una recomendación o insight accionable

Usa formato markdown (negrita para números clave como **$125,450** o **23.5%**).
Sé directo, enfocado en el negocio, y habla como un ejecutivo resumiendo datos.

IMPORTANTE: Toda la respuesta debe estar en ESPAÑOL.`;
  } else {
    // Pro mode: comprehensive analysis
    dataContext = `
Pregunta del Usuario: ${question}

Consulta SQL Ejecutada:
${sqlQuery}

Resultados (${rows.length} filas):
Columnas: ${columns.join(', ')}
Datos:
${rows.slice(0, 50).map((row, idx) =>
  `Fila ${idx + 1}: ${columns.map((col, i) => `${col}=${row[i]}`).join(', ')}`
).join('\n')}
${rows.length > 50 ? `\n... (${rows.length - 50} filas más)` : ''}

Instrucciones:
Debes proporcionar un ANÁLISIS DE NEGOCIO COMPLETO EN ESPAÑOL con la siguiente estructura OBLIGATORIA.

ESTRUCTURA OBLIGATORIA (Debes incluir LAS CUATRO secciones):

**📊 Hallazgos Clave**
- Identifica 3-5 patrones o tendencias principales en los datos
- Incluye números específicos, porcentajes y comparaciones (usa **negrita** para métricas)
- Destaca tanto hallazgos positivos como negativos
- Compara segmentos, categorías o períodos de tiempo

**💰 Impacto Financiero**
- Cuantifica el impacto empresarial en dólares, ingresos o términos de costos
- Calcula márgenes, rentabilidad o métricas de eficiencia cuando sea aplicable
- Compara rendimiento entre segmentos/categorías si es relevante
- Muestra tendencias año tras año o mes tras mes si es aplicable

**⚠️ Áreas de Riesgo y Oportunidades**
- Identifica 2-3 áreas problemáticas que necesitan atención inmediata
- Cuantifica el riesgo o costo de oportunidad con números específicos
- Destaca segmentos con bajo rendimiento u oportunidades perdidas
- Muestra la brecha entre rendimiento actual y potencial

**🎯 Recomendaciones Accionables**
- Proporciona 3-5 pasos de acción ESPECÍFICOS
- Cada recomendación debe ser concreta (no vaga como "mejorar el rendimiento")
- Incluye impacto esperado o métricas de éxito para cada recomendación
- Prioriza las recomendaciones por impacto empresarial potencial

REQUISITOS MÍNIMOS:
- Longitud total de la respuesta: 200+ palabras (esto NO ES NEGOCIABLE)
- Incluir al menos 5 números o métricas específicas con contexto
- Proporcionar al menos 3 recomendaciones concretas y accionables
- Usar viñetas y formato markdown (**negrita**, encabezados)
- Incluir porcentajes, montos en dólares o métricas comparativas
- TODO EN ESPAÑOL

CONTEXTO DE NEGOCIO ALUMIMUNDO:
- Distribuidor premium de acabados de construcción en Costa Rica
- Marcas: KOHLER (exclusivo), Schlage, Steelcraft, Kallista
- Clientes: Arquitectos, diseñadores, desarrolladores, contratistas
- Tipos de proyecto: Residencial, comercial, hotelero, institucional, salud, educativo
- Mercado objetivo: Segmento premium/lujo en construcción
- Expansión regional: Costa Rica actualmente, expansión en Centroamérica planificada

IMPORTANTE: TODA la respuesta debe estar en ESPAÑOL para el equipo de Alumimundo en Costa Rica.`;
  }

  try {
    console.log(`🧠 Generating ${responseMode.toUpperCase()} insights in Spanish...`);

    const llm = getInsightsLLM();
    const response = await llm.invoke([
      new SystemMessage(INSIGHTS_SYSTEM_PROMPT),
      new HumanMessage(dataContext),
    ]);

    const content = response.content as string;
    return content.trim() || `Se encontraron ${rows.length} resultado${rows.length !== 1 ? 's' : ''}. Ver la tabla a continuación para más detalles.`;
  } catch (error: any) {
    console.error('❌ Error generating insights:', error);
    // Fallback to basic response if insights generation fails
    return `## Resultados del Análisis

Se encontraron **${rows.length}** resultado${rows.length !== 1 ? 's' : ''} para tu consulta.

Los datos completos se muestran en la tabla a continuación. ${
  responseMode === 'pro'
    ? 'Puedes descargar los resultados como Excel para un análisis más profundo.'
    : 'Cambia a modo Pro para obtener insights empresariales detallados.'
}`;
  }
}

/**
 * Generate insights for error cases
 * Provides helpful guidance when SQL queries fail
 *
 * @param question Original user question
 * @param sqlQuery SQL query that failed (if available)
 * @param error Error message from the agent
 * @returns User-friendly error explanation with suggestions IN SPANISH
 */
export async function generateErrorInsights(
  question: string,
  sqlQuery: string | null,
  error: string
): Promise<string> {
  // Provide context-aware error messages in Spanish
  if (error.includes('syntax error') || error.includes('SQL Error')) {
    return `## ⚠️ Error en la Consulta

Generé una consulta SQL, pero hubo un error de sintaxis:

\`\`\`
${error.substring(0, 200)}
\`\`\`

**Esto podría deberse a:**
- Nombres de tabla o columna incorrectos
- Sintaxis SQL inválida
- Condiciones JOIN faltantes

**Qué intentar:**
- Reformular tu pregunta para ser más específico
- Preguntar sobre datos diferentes (ej. "muestra los proyectos" en lugar de "analiza el comportamiento del proyecto")
- Especificar un rango de fechas o filtro (ej. "últimos 30 días", "para proyectos residenciales")`;
  }

  if (error.includes('does not exist') || error.includes('relation')) {
    return `## ⚠️ Tabla o Columna No Encontrada

La consulta hizo referencia a una tabla o columna que no existe en la base de datos de Alumimundo.

**Áreas de datos disponibles:**
- **Proyectos** - Gestión de proyectos de construcción (residencial, comercial, hotelero)
- **Productos** - Catálogo completo (KOHLER, Schlage, Steelcraft, Kallista)
- **Especificaciones** - Especificaciones de productos por proyecto con precios
- **Inventario** - Niveles de stock, movimientos y asignaciones
- **Calidad** - Inspecciones de instalación con análisis CV
- **Proveedores** - Fabricantes y distribuidores
- **Diseño** - Proyectos de diseño con IA y recomendaciones
- **Usuarios** - Gestión de usuarios y actividad

**Intenta preguntar sobre:** "Muestra los 10 proyectos principales por valor" o "Inventario de productos KOHLER"`;
  }

  if (error.includes('permission denied') || error.includes('read-only')) {
    return `## ⚠️ Permiso Denegado

Esta base de datos es de solo lectura. Solo se permiten consultas SELECT para análisis de datos.

**Lo que puedes hacer:**
- Consultar y analizar cualquier dato de Alumimundo
- Generar reportes e insights
- Exportar datos a Excel

**Lo que no está permitido:**
- Modificar datos (INSERT, UPDATE, DELETE)
- Crear o alterar tablas
- Operaciones administrativas`;
  }

  if (error.includes('DATABASE_URL')) {
    return `## ⚠️ Error de Conexión a Base de Datos

La base de datos de analítica SQL no está configurada. Por favor contacta a tu administrador.

**Lo que se necesita:**
- Conexión a base de datos PostgreSQL (DATABASE_URL)
- Datos de analítica de Alumimundo restaurados

Mientras tanto, puedo ayudar con:
- Información general sobre productos y proyectos
- Consultas sobre inventario y especificaciones
- Información general de Alumimundo`;
  }

  // Generic error message
  return `## ⚠️ Algo Salió Mal

Encontré un error al procesar tu pregunta:

\`\`\`
${error.substring(0, 200)}
\`\`\`

**Por favor intenta:**
- Reformular tu pregunta
- Ser más específico sobre qué datos necesitas
- Preguntar sobre un tema diferente
- Usar criterios o filtros más simples

**Ejemplos de preguntas que puedo responder:**
- "Muestra los proyectos más importantes por presupuesto"
- "¿Cuál es el inventario actual de productos KOHLER?"
- "¿Qué proveedores tienen los mejores tiempos de entrega?"
- "Proyectos completados en los últimos 3 meses"`;
}
