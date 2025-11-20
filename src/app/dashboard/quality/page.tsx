'use client'

import { useState } from 'react'
import { Camera, CheckCircle, XCircle, AlertCircle, Upload, MapPin, Image as ImageIcon, Play, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function QualityPage() {
  const [selectedInspection, setSelectedInspection] = useState<string | null>(null)

  const inspectionStats = [
    {
      id: 'approved',
      title: 'Inspecciones Aprobadas',
      value: 156,
      percentage: 87,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      id: 'pending',
      title: 'Pendientes de Revisión',
      value: 12,
      percentage: 7,
      icon: AlertCircle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      id: 'rejected',
      title: 'Requieren Corrección',
      value: 11,
      percentage: 6,
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    }
  ]

  const checkpoints = [
    { id: 1, name: 'Alineación de Marco', status: 'pass', automated: true },
    { id: 2, name: 'Instalación de Bisagras', status: 'pass', automated: true },
    { id: 3, name: 'Nivelación Horizontal', status: 'pass', automated: true },
    { id: 4, name: 'Sellado Perimetral', status: 'warning', automated: true },
    { id: 5, name: 'Hardware de Seguridad', status: 'pass', automated: false },
    { id: 6, name: 'Acabado Superficial', status: 'pass', automated: true }
  ]

  const recentInspections = [
    {
      id: 1,
      project: 'Hotel Playa Hermosa',
      area: 'Habitación 302',
      product: 'Puerta Steelcraft DX-500',
      installer: 'Juan Pérez',
      date: '2024-11-15',
      status: 'approved',
      score: 95,
      images: 8
    },
    {
      id: 2,
      project: 'Residencial Los Sueños',
      area: 'Casa 12 - Baño Principal',
      product: 'Grifería KOHLER K-12345',
      installer: 'María González',
      date: '2024-11-15',
      status: 'pending',
      score: null,
      images: 6
    },
    {
      id: 3,
      project: 'Oficinas Central Park',
      area: 'Piso 3 - Baño Hombres',
      product: 'Lavamanos KOHLER K-67890',
      installer: 'Carlos Rodríguez',
      date: '2024-11-14',
      status: 'approved',
      score: 98,
      images: 5
    },
    {
      id: 4,
      project: 'Condominio Vista Mar',
      area: 'Apto 405 - Entrada',
      product: 'Cerradura Schlage Connect',
      installer: 'Ana Morales',
      date: '2024-11-14',
      status: 'rejected',
      score: 62,
      images: 10
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
            <CheckCircle size={14} />
            Aprobada
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
            <AlertCircle size={14} />
            Pendiente
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
            <XCircle size={14} />
            Requiere Corrección
          </span>
        )
      default:
        return null
    }
  }

  const getCheckpointStatus = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle size={20} className="text-green-500" />
      case 'warning':
        return <AlertCircle size={20} className="text-yellow-500" />
      case 'fail':
        return <XCircle size={20} className="text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Control de Calidad con IA
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Sistema de validación de instalación mediante visión computacional
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {inspectionStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon size={24} className={stat.color} />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.percentage}%
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex items-center gap-3 p-4 bg-alumimundo-teal text-white rounded-xl hover:bg-opacity-90 transition-colors">
          <Camera size={24} />
          <div className="text-left">
            <div className="font-semibold">Nueva Inspección</div>
            <div className="text-xs opacity-90">Iniciar validación fotográfica</div>
          </div>
        </button>

        <button className="flex items-center gap-3 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
          <Upload size={24} />
          <div className="text-left">
            <div className="font-semibold">Subir Fotos</div>
            <div className="text-xs opacity-75">Cargar imágenes existentes</div>
          </div>
        </button>

        <button className="flex items-center gap-3 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
          <Play size={24} />
          <div className="text-left">
            <div className="font-semibold">Tutorial</div>
            <div className="text-xs opacity-75">Cómo usar el sistema</div>
          </div>
        </button>
      </div>

      {/* Inspection Checkpoints Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Puntos de Verificación Automática</CardTitle>
          <CardDescription>
            El sistema valida automáticamente estos aspectos usando visión computacional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {checkpoints.map((checkpoint) => (
              <div
                key={checkpoint.id}
                className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                {getCheckpointStatus(checkpoint.status)}
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {checkpoint.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {checkpoint.automated ? 'Validación automática' : 'Revisión manual'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Inspections */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inspecciones Recientes</CardTitle>
              <CardDescription>Últimas validaciones de instalación</CardDescription>
            </div>
            <button className="text-alumimundo-teal hover:underline text-sm font-medium">
              Ver todas
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentInspections.map((inspection) => (
              <div
                key={inspection.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => setSelectedInspection(inspection.id.toString())}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {inspection.project}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin size={14} />
                      {inspection.area}
                    </div>
                  </div>
                  {getStatusBadge(inspection.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Producto</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {inspection.product}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Instalador</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {inspection.installer}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {inspection.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <ImageIcon size={14} />
                      {inspection.images} fotos
                    </div>
                  </div>
                  {inspection.score && (
                    <div className="font-semibold text-gray-900 dark:text-white">
                      Score: {inspection.score}/100
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demo Notice */}
      <Card className="border-alumimundo-teal">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="bg-alumimundo-teal/10 p-2 rounded-lg">
              <Camera className="text-alumimundo-teal" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Sistema de Visión Computacional
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Esta interfaz demuestra el sistema de validación de calidad mediante IA.
                En producción, el sistema utilizará modelos de visión computacional (YOLO, CLIP, DINO) para:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li>• Validar alineación y nivelación de instalaciones</li>
                <li>• Detectar defectos visuales pre-instalación</li>
                <li>• Verificar correcta instalación de hardware</li>
                <li>• Confirmar sellado y impermeabilización</li>
                <li>• Activar garantías automáticamente al aprobar inspección</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
