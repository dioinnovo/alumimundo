import { NextRequest, NextResponse } from 'next/server';
import { runFastSqlAgent } from '@/lib/ai/sql-agent-fast';
import { classifyQueryComplexity } from '@/lib/ai/query-classifier';
import { generateInsights, generateErrorInsights, type ResponseMode } from '@/lib/ai/insights-generator';
import { generateChartData, isChartable } from '@/lib/ai/chart-generator';

/**
 * POST /api/sql-agent
 * Execute natural language SQL queries with the LangChain SQL agent for Alumimundo
 *
 * Request Body:
 * {
 *   question: string              // User's natural language question (Spanish or English)
 *   responseMode: "quick" | "pro" // Analysis depth (default: "quick")
 * }
 *
 * Response:
 * {
 *   success: boolean
 *   response: string              // Markdown-formatted insights in Spanish
 *   sqlQuery: string | null       // Generated SQL query
 *   queryResults: {...} | null    // Query results with columns and rows
 *   chartData: {...} | null       // Chart.js-compatible chart data
 *   error: string | null          // Error message if any
 *   metadata: {...}               // Performance and routing metadata
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { question, responseMode = "quick" } = body;

    // Validate input
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Question is required and must be a string',
          response: 'Por favor proporciona una pregunta válida sobre datos de Alumimundo.',
        },
        { status: 400 }
      );
    }

    // Validate response mode
    if (responseMode !== 'quick' && responseMode !== 'pro') {
      return NextResponse.json(
        {
          success: false,
          error: 'Response mode must be "quick" or "pro"',
          response: 'Modo de respuesta inválido especificado.',
        },
        { status: 400 }
      );
    }

    console.log(`\n🎯 SQL Agent API Request:`);
    console.log(`   Question: ${question}`);
    console.log(`   Mode: ${responseMode.toUpperCase()}`);

    // Step 1: Classify query complexity to determine routing
    const classification = classifyQueryComplexity(question);
    console.log(`   Complexity: ${classification.complexity.toUpperCase()} (confidence: ${(classification.confidence * 100).toFixed(0)}%)`);
    console.log(`   Reason: ${classification.reason}`);
    console.log(`   Using Fast Path: ${classification.useFastPath ? 'YES ⚡' : 'NO (full agent)'}`);

    // Step 2: Route to appropriate agent (for now, only fast path is implemented)
    // Full ReAct agent can be added later if needed for complex queries
    let sqlQuery: string | null = null;
    let queryResults: { columns: string[]; rows: any[][] } | null = null;
    let agentError: string | null = null;
    let executionTimeMs: number | undefined = undefined;

    // Use Fast Path (single LLM call with Claude)
    const fastResult = await runFastSqlAgent(question);
    sqlQuery = fastResult.sqlQuery;
    queryResults = fastResult.queryResults;
    agentError = fastResult.error;
    executionTimeMs = fastResult.executionTimeMs;

    // Step 3: Generate chart data if we have results
    let chartData: any = null;
    if (queryResults && queryResults.rows.length > 0) {
      if (isChartable(queryResults.columns, queryResults.rows)) {
        chartData = generateChartData(queryResults.columns, queryResults.rows);
        console.log(`   📊 Chart: ${chartData ? chartData.type : 'none'}`);
      } else {
        console.log('   📊 Chart: Data not suitable for visualization');
      }
    }

    // Step 4: Generate business insights in Spanish
    let response: string;
    if (queryResults && !agentError) {
      // Success - generate insights from results
      response = await generateInsights(
        question,
        sqlQuery || "",
        queryResults,
        responseMode as ResponseMode
      );
      console.log(`   ✅ Insights: ${responseMode} mode (${response.length} chars) - Spanish`);
    } else if (agentError) {
      // Error - generate helpful error message
      response = await generateErrorInsights(
        question,
        sqlQuery,
        agentError
      );
      console.log(`   ❌ Error insights generated - Spanish`);
    } else {
      // Unexpected state - no results and no error
      response = "Encontré un problema al procesar tu pregunta. Por favor intenta reformularla o preguntar sobre datos diferentes.";
      console.log(`   ⚠️  Unexpected state: No results and no error`);
    }

    // Step 5: Return the complete response with performance metadata
    return NextResponse.json({
      success: !agentError,
      response,
      sqlQuery,
      queryResults,
      chartData,
      error: agentError,
      // Performance and routing metadata
      metadata: {
        complexity: classification.complexity,
        usedFastPath: classification.useFastPath,
        confidence: classification.confidence,
        executionTimeMs: executionTimeMs,
        reason: classification.reason
      },
    });

  } catch (error: any) {
    console.error('❌ SQL Agent API Error:', error);

    // Check if it's a database connection error
    if (error.message?.includes('DATABASE_URL')) {
      return NextResponse.json({
        success: false,
        response: `## ⚠️ Base de Datos No Configurada

La función de analítica SQL requiere una conexión a base de datos PostgreSQL. Por favor contacta a tu administrador para configurar la base de datos de analítica de Alumimundo.

**Lo que aún puedo ayudarte con:**
- Información sobre productos y especificaciones
- Consultas sobre inventario
- Información general de Alumimundo
- Detalles de proveedores`,
        error: 'Database not configured',
        sqlQuery: null,
        queryResults: null,
        chartData: null,
      });
    }

    // Generic error response
    return NextResponse.json({
      success: false,
      response: `## ⚠️ Error Inesperado

Encontré un error inesperado al procesar tu pregunta:

\`\`\`
${error.message}
\`\`\`

**Por favor intenta:**
- Actualizar la página
- Reformular tu pregunta
- Preguntar sobre datos diferentes
- Contactar soporte si el problema persiste`,
      error: error.message || 'Internal server error',
      sqlQuery: null,
      queryResults: null,
      chartData: null,
    }, { status: 500 });
  }
}

/**
 * GET /api/sql-agent
 * Health check endpoint to verify SQL agent is configured correctly
 */
export async function GET(request: NextRequest) {
  try {
    // Check if database and Anthropic Claude are configured
    const databaseUrl = process.env.DATABASE_URL;
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

    const status = {
      database: !!databaseUrl && databaseUrl.includes('postgresql'),
      anthropicClaude: !!anthropicApiKey,
      ready: !!databaseUrl && databaseUrl.includes('postgresql') && !!anthropicApiKey,
    };

    return NextResponse.json({
      status: 'SQL Agent API - Alumimundo',
      version: '1.0.0',
      configuration: status,
      message: status.ready
        ? 'SQL Agent está listo para procesar consultas'
        : 'SQL Agent no está completamente configurado. Se necesita DATABASE_URL (PostgreSQL) y ANTHROPIC_API_KEY.',
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
    }, { status: 500 });
  }
}
