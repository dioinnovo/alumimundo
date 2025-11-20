'use client'

import { X, Check, TrendingUp, Award, Building2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { designTokens, cn } from '@/lib/design-tokens'
import { PROJECT_TEMPLATES, type ProjectTemplate } from '@/lib/project-templates'

interface ProjectTemplatesProps {
  onClose: () => void
  onSelectTemplate: (template: ProjectTemplate) => void
}

export default function ProjectTemplates({ onClose, onSelectTemplate }: ProjectTemplatesProps) {
  const handleSelect = (template: ProjectTemplate) => {
    onSelectTemplate(template)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={cn('p-6 border-b', designTokens.borders.divider)}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={cn('text-2xl font-bold', designTokens.text.primary)}>
                Plantillas de Proyecto
              </h2>
              <p className={cn('text-sm mt-1', designTokens.text.secondary)}>
                Comienza rápido con especificaciones pre-configuradas para proyectos comunes
              </p>
            </div>
            <button
              onClick={onClose}
              className={cn(
                'p-2 rounded-lg transition',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              )}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECT_TEMPLATES.map(template => (
              <Card
                key={template.id}
                className={cn(
                  'p-6 cursor-pointer transition-all',
                  'hover:shadow-lg hover:scale-[1.02]',
                  'border-2 border-transparent',
                  'hover:border-alumimundo-teal'
                )}
                onClick={() => handleSelect(template)}
              >
                {/* Template Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{template.icon}</div>
                    <div>
                      <h3 className={cn('font-bold text-lg', designTokens.text.primary)}>
                        {template.nameEs}
                      </h3>
                      <p className={cn('text-sm mt-1', designTokens.text.secondary)}>
                        {template.descriptionEs}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Budget Range */}
                <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <TrendingUp size={16} className="text-green-600 dark:text-green-400" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-green-900 dark:text-green-100">
                      Presupuesto Estimado
                    </p>
                    <p className="text-sm font-bold text-green-700 dark:text-green-300">
                      ${template.estimatedBudget.min.toLocaleString()} - ${template.estimatedBudget.max.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Specifications */}
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      Tamaño del Proyecto
                    </p>
                    <p className="text-sm">{template.specifications.projectSize}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      Estilo
                    </p>
                    <p className="text-sm">{template.specifications.style}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      Categorías de Productos
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.productCategories.slice(0, 5).map((category, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        >
                          {category}
                        </span>
                      ))}
                      {template.productCategories.length > 5 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          +{template.productCategories.length - 5} más
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                      <Award size={12} />
                      Certificaciones
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.specifications.certifications.slice(0, 4).map((cert, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Special Requirements Preview */}
                  {template.specifications.specialRequirements.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                        Requisitos Especiales
                      </p>
                      <ul className="space-y-1">
                        {template.specifications.specialRequirements.slice(0, 3).map((req, idx) => (
                          <li key={idx} className="text-xs flex items-start gap-1">
                            <Check size={12} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Product Count */}
                <div className={cn(
                  'pt-3 border-t',
                  designTokens.borders.divider,
                  'flex items-center justify-between'
                )}>
                  <div className="flex items-center gap-1">
                    <Building2 size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {template.recommendedProducts.length} categorías de productos
                    </span>
                  </div>
                  <button
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition',
                      'bg-alumimundo-teal text-white',
                      'hover:bg-alumimundo-teal/90'
                    )}
                  >
                    Usar Plantilla
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={cn('p-4 border-t', designTokens.borders.divider, 'bg-gray-50 dark:bg-gray-800/50')}>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            💡 Estas plantillas son puntos de partida recomendados. Puedes personalizar todos los productos después de seleccionar.
          </p>
        </div>
      </Card>
    </div>
  )
}
