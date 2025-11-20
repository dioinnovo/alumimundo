'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Camera, FileText, TrendingUp, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function ProjectStartPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params)
  const router = useRouter()

  const steps = [
    {
      icon: Camera,
      title: 'Captura tu Espacio',
      description: 'Toma fotos de las áreas que deseas rediseñar o construir',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: FileText,
      title: 'Selecciona Materiales',
      description: 'Explora y elige productos de KOHLER, Schlage, Tarkett y más',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Sparkles,
      title: 'Describe tu Visión',
      description: 'Usa voz o texto para explicar exactamente lo que necesitas',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: TrendingUp,
      title: 'Obtén tu Estimado',
      description: 'Recibe un estimado detallado con costos y especificaciones',
      color: 'from-green-500 to-green-600'
    }
  ]

  const features = [
    'IA que entiende tus necesidades en lenguaje natural',
    'Búsqueda visual de productos similares',
    'Validación automática de códigos de construcción',
    'Recomendaciones basadas en clima y ubicación',
    'Reportes profesionales listos para aprobar'
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-alumimundo-navy/10 dark:bg-alumimundo-navy/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-alumimundo-navy dark:text-alumimundo-teal" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                ¡Bienvenido a tu Proyecto!
              </h1>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Vamos a crear especificaciones profesionales con ayuda de IA
          </p>
        </div>

        {/* Hero Section */}
        <Card className="p-8 md:p-12 mb-8 bg-gradient-to-br from-alumimundo-navy to-alumimundo-teal text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Diseño Inteligente Asistido por IA
            </h2>
            <p className="text-xl opacity-90 mb-6">
              Transforma tus ideas en especificaciones profesionales en minutos, no horas
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => router.push(`/dashboard/diseno/${projectId}/areas`)}
                className="bg-white text-alumimundo-navy hover:bg-gray-100 px-8 py-6 text-lg"
              >
                Comenzar Ahora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                onClick={() => router.push('/dashboard/diseno')}
              >
                Ver Tutorial
              </Button>
            </div>
          </motion.div>
        </Card>

        {/* How it Works */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-alumimundo-navy mb-6">
            ¿Cómo Funciona?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">Paso {index + 1}</span>
                      </div>
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">
                        {step.title}
                      </h4>
                      <p className="text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features */}
        <Card className="p-8 mb-8">
          <h3 className="text-2xl font-semibold text-alumimundo-navy mb-6">
            Características Principales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button
            onClick={() => router.push(`/dashboard/diseno/${projectId}/areas`)}
            className="bg-alumimundo-navy hover:bg-alumimundo-navy/90 text-white px-12 py-6 text-lg"
            size="lg"
          >
            Seleccionar Áreas del Proyecto
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Tiempo estimado: 15-30 minutos por área
          </p>
        </div>
      </div>
    </div>
  )
}
