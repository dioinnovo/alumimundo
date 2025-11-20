/**
 * Query Complexity Classifier for Alumimundo
 * Determines if a query should use fast path or full ReAct agent
 *
 * Fast Path Criteria:
 * - Simple aggregations (count, sum, average)
 * - Single table or simple joins
 * - Common business questions
 * - No complex logic required
 *
 * Full Agent Criteria:
 * - Multi-step reasoning needed
 * - Complex joins across 3+ tables
 * - Advanced analytics (correlations, predictions)
 * - Ambiguous questions requiring exploration
 */

export type QueryComplexity = 'simple' | 'moderate' | 'complex';

export interface QueryClassification {
  complexity: QueryComplexity;
  useFastPath: boolean;
  reason: string;
  estimatedTables: number;
  confidence: number;
}

/**
 * Pattern-based complexity classifier
 * Uses heuristics to quickly determine query complexity without LLM
 */
export function classifyQueryComplexity(question: string): QueryClassification {
  const lowerQuestion = question.toLowerCase();

  // Initialize scores
  let complexityScore = 0;
  let estimatedTables = 1;
  const reasons: string[] = [];

  // === SIMPLE PATTERNS (Fast Path Candidates) ===

  // Simple "show me" or "list" queries (works in Spanish too)
  if (/^(show|list|display|get|find|muestra|lista|encuentra|cuáles?|qué)\s+(me\s+)?(all\s+)?(the\s+)?/.test(lowerQuestion)) {
    complexityScore -= 1;
    reasons.push('Simple listing query');
  }

  // Direct "what is" questions
  if (/^(what|qué|cuál)\s+(is|are|our|my|es|son)/.test(lowerQuestion)) {
    complexityScore -= 1;
    reasons.push('Direct fact query');
  }

  // Simple comparisons
  if (/^(compare|compara|comparar)\s+\w+\s+(by|across|between|por|entre)/.test(lowerQuestion)) {
    complexityScore += 0; // Neutral - could be simple or complex
    reasons.push('Comparison query');
  }

  // Top N queries (usually simple)
  if (/\b(top|bottom|best|worst|mejores|peores|principales)\s+\d+\b/.test(lowerQuestion)) {
    complexityScore -= 0.5;
    reasons.push('Top N query');
  }

  // === TABLE COMPLEXITY ESTIMATION ===

  // Count mentioned entities (proxies for table count) - Alumimundo specific
  const entities = [
    'project', 'proyecto', 'specification', 'especificación', 'product', 'producto',
    'quality', 'calidad', 'document', 'documento', 'inventory', 'inventario',
    'provider', 'proveedor', 'area', 'área', 'design', 'diseño',
    'image', 'imagen', 'movement', 'movimiento', 'allocation', 'asignación',
    'user', 'usuario', 'activity', 'actividad'
  ];

  const mentionedEntities = entities.filter(entity =>
    lowerQuestion.includes(entity)
  );

  estimatedTables = Math.max(1, mentionedEntities.length);

  if (estimatedTables >= 3) {
    complexityScore += 2;
    reasons.push(`${estimatedTables} tables likely involved`);
  } else if (estimatedTables === 2) {
    complexityScore += 0.5;
    reasons.push('2 tables likely involved');
  }

  // === COMPLEXITY INDICATORS ===

  // Statistical/analytical terms
  const analyticalTerms = [
    'correlation', 'correlación', 'trend', 'tendencia', 'pattern', 'patrón',
    'predict', 'predecir', 'forecast', 'pronóstico', 'regression', 'regresión',
    'analysis', 'análisis', 'statistical', 'estadístic', 'variance', 'varianza'
  ];

  if (analyticalTerms.some(term => lowerQuestion.includes(term))) {
    complexityScore += 2;
    reasons.push('Advanced analytics required');
  }

  // Time-series analysis
  if (/\b(trend|over time|monthly|quarterly|year[- ]over[- ]year|seasonality|tendencia|mensual|trimestral|temporal)\b/.test(lowerQuestion)) {
    complexityScore += 1;
    reasons.push('Time-series analysis');
  }

  // Multiple conditions/filters
  const conditionWords = ['and', 'or', 'but', 'except', 'excluding', 'where', 'if', 'when', 'y', 'o', 'pero', 'excepto', 'donde', 'si', 'cuando'];
  const conditionCount = conditionWords.filter(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    return (lowerQuestion.match(regex) || []).length > 0;
  }).length;

  if (conditionCount >= 3) {
    complexityScore += 1.5;
    reasons.push('Multiple conditions');
  }

  // Aggregation keywords (usually simpler)
  const simpleAggregations = ['total', 'sum', 'count', 'average', 'avg', 'max', 'min', 'suma', 'promedio', 'máximo', 'mínimo', 'conteo'];
  if (simpleAggregations.some(term => lowerQuestion.includes(term))) {
    complexityScore -= 0.5;
    reasons.push('Simple aggregation');
  }

  // === KNOWN SIMPLE PATTERNS (Quick Questions) ===

  const simplePatterns = [
    /what is (our|the) .* (lifetime value|ltv|clv|valor)/,
    /compare .* (performance|rates?|metrics?|rendimiento|tasas?)/,
    /show .* (top|highest|lowest|mejores|principales|mayores|menores) \d+/,
    /which .* have .* (highest|lowest|most|least|mayores|menores|más|menos)/,
    /what (percentage|percent|%|porcentaje) of/,
    /how many .* (are|were|have|cuántos?|hay)/,
    /list .* by (date|amount|volume|revenue|fecha|cantidad|volumen)/,
    /cuáles? .* (productos|proyectos|proveedores)/,
    /muestra .* (inventario|stock|existencias)/
  ];

  if (simplePatterns.some(pattern => pattern.test(lowerQuestion))) {
    complexityScore -= 1;
    reasons.push('Matches known simple pattern');
  }

  // === COMPLEX PATTERNS ===

  const complexPatterns = [
    /why|how come|what causes|what explains|por qué|cómo es que|qué causa/,
    /recommend|suggest|should (i|we)|recomienda|sugiere|debería/,
    /compare .* across .* considering .*/,
    /taking into account|factoring in|considering|tomando en cuenta|considerando/,
    /breakdown .* by .* and .* and|desglose .* por .* y .* y/
  ];

  if (complexPatterns.some(pattern => pattern.test(lowerQuestion))) {
    complexityScore += 2;
    reasons.push('Requires reasoning or recommendations');
  }

  // Question length (very long questions often complex)
  const wordCount = lowerQuestion.split(/\s+/).length;
  if (wordCount > 20) {
    complexityScore += 1;
    reasons.push('Long, detailed question');
  } else if (wordCount < 8) {
    complexityScore -= 0.5;
    reasons.push('Short, focused question');
  }

  // === DETERMINE CLASSIFICATION ===

  let complexity: QueryComplexity;
  let useFastPath: boolean;
  let confidence: number;

  if (complexityScore <= -1) {
    complexity = 'simple';
    useFastPath = true;
    confidence = 0.85;
  } else if (complexityScore <= 1) {
    complexity = 'moderate';
    useFastPath = estimatedTables <= 2; // Fast path if only 1-2 tables
    confidence = 0.70;
  } else {
    complexity = 'complex';
    useFastPath = false;
    confidence = 0.80;
  }

  // Override: always use fast path for these exact Quick Questions (Alumimundo)
  const knownQuickQuestions = [
    'productos por debajo del punto de reorden',
    'rotación de inventario',
    'proveedores mejor tiempo entrega',
    'inventario kohler',
    'valor promedio proyecto',
    'proyectos completados vs retrasados',
    'productos especificados proyectos',
    'presupuesto vs costo real',
    'tasa éxito inspecciones calidad',
    'defectos comunes instalaciones',
    'tiempo promedio especificación instalación',
    'productos problemas calidad',
    'tasa aceptación recomendaciones ai',
    'costos estimados vs reales diseño',
    'categorías producto rentables',
    'provincias mayor demanda'
  ];

  const normalizedQuestion = lowerQuestion.replace(/[^\w\s]/g, '').trim();
  if (knownQuickQuestions.some(q => normalizedQuestion.includes(q))) {
    complexity = 'simple';
    useFastPath = true;
    confidence = 0.95;
    reasons.unshift('Matches predefined Quick Question');
  }

  return {
    complexity,
    useFastPath,
    reason: reasons.join('; '),
    estimatedTables,
    confidence
  };
}

/**
 * Check if a question should use the fast path
 * @param question User's natural language question
 * @returns true if fast path should be used
 */
export function shouldUseFastPath(question: string): boolean {
  const classification = classifyQueryComplexity(question);
  return classification.useFastPath;
}
