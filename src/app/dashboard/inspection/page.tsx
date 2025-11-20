'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Camera, Plus, Calendar, Clock, MapPin, CheckCircle,
  AlertCircle, FileText, Search, Building2, Home, ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface QualityInspection {
  id: string
  projectName: string
  projectId: string
  propertyAddress: string
  propertyType: string
  status: string
  scheduledDate: string
  scheduledTime: string
  inspector: string
  clientName: string
  productCategories: string[]
  estimatedDuration: string
  completionRate: number
  reportReady?: boolean
  imageUrl?: string
  photosCount?: number
  areasInspected?: string[]
  currentArea?: string
  qualityScore?: number
  defectsFound?: number
  complianceStatus?: {
    passed: boolean
    notes: string
  }
  reportDetails?: {
    totalPhotos: number
    areasCompleted: number
    totalAreas: number
    findings: string[]
    productsInspected: number
  }
}

export default function QualityInspectionListPage() {
  const router = useRouter()
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProductType, setFilterProductType] = useState('all')

  // Mock data for quality inspections
  const inspections: QualityInspection[] = [
    // Active inspection
    {
      id: 'QA-002',
      projectId: 'PROJ-2024-002',
      projectName: 'Hotel Boutique Tamarindo',
      propertyAddress: 'Playa Tamarindo, Guanacaste',
      propertyType: 'Hospitality',
      status: 'in_progress',
      scheduledDate: '2024-11-19',
      scheduledTime: '2:00 PM',
      inspector: 'Carlos Rodríguez',
      clientName: 'Desarrollos Costeros S.A.',
      productCategories: ['KOHLER Baños', 'Schlage Cerraduras', 'Acabados'],
      estimatedDuration: '4 horas',
      completionRate: 65,
      imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop&q=80',
      photosCount: 47,
      currentArea: 'Habitaciones - Piso 2',
      areasInspected: ['Lobby', 'Restaurante', 'Habitaciones Piso 1', 'Áreas Comunes'],
      qualityScore: 92,
      defectsFound: 3,
      complianceStatus: {
        passed: true,
        notes: 'Cumple con especificaciones técnicas y códigos de construcción'
      }
    },
    // Scheduled inspections
    {
      id: 'QA-001',
      projectId: 'PROJ-2024-001',
      projectName: 'Residencial Las Colinas',
      propertyAddress: 'Escazú, San José',
      propertyType: 'Residential',
      status: 'scheduled',
      scheduledDate: '2024-11-20',
      scheduledTime: '10:00 AM',
      inspector: 'María González',
      clientName: 'Constructora Urbana',
      productCategories: ['KOHLER Cocina', 'KOHLER Baños', 'Acabados'],
      estimatedDuration: '3 horas',
      completionRate: 0,
      imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop&q=80',
    },
    {
      id: 'QA-005',
      projectId: 'PROJ-2024-005',
      projectName: 'Oficinas Corporativas La Sabana',
      propertyAddress: 'La Sabana, San José',
      propertyType: 'Commercial',
      status: 'scheduled',
      scheduledDate: '2024-11-21',
      scheduledTime: '9:30 AM',
      inspector: 'Carlos Rodríguez',
      clientName: 'Inversiones La Sabana',
      productCategories: ['Schlage Cerraduras', 'Acabados Comerciales'],
      estimatedDuration: '5 horas',
      completionRate: 0,
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&q=80',
    },
    // Completed - Report Ready
    {
      id: 'QA-003',
      projectId: 'PROJ-2024-003',
      projectName: 'Casa Moderna Valle del Sol',
      propertyAddress: 'Santa Ana, San José',
      propertyType: 'Residential',
      status: 'completed',
      scheduledDate: '2024-11-18',
      scheduledTime: '9:00 AM',
      inspector: 'María González',
      clientName: 'Familia Jiménez',
      productCategories: ['KOHLER Baños', 'KOHLER Cocina', 'Kallista'],
      estimatedDuration: '2.5 horas',
      completionRate: 100,
      reportReady: true,
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&q=80',
      qualityScore: 98,
      defectsFound: 0,
      complianceStatus: {
        passed: true,
        notes: 'Instalación perfecta. Cumple con todos los estándares de calidad KOHLER.'
      },
      reportDetails: {
        totalPhotos: 52,
        areasCompleted: 5,
        totalAreas: 5,
        findings: [
          'Grifería KOHLER Simplice instalada correctamente con sellado perfecto',
          'Fregadero KOHLER Prolific nivelado y fijado según especificaciones',
          'Inodoro y lavamanos verificados - funcionamiento óptimo',
          'Acabados de instalación profesionales en todas las áreas',
          'Garantía activada exitosamente'
        ],
        productsInspected: 12
      }
    },
    {
      id: 'QA-004',
      projectId: 'PROJ-2024-004',
      projectName: 'Apartamentos Lindora',
      propertyAddress: 'Lindora, Santa Ana',
      propertyType: 'Residential',
      status: 'report_ready',
      scheduledDate: '2024-11-17',
      scheduledTime: '11:00 AM',
      inspector: 'Carlos Rodríguez',
      clientName: 'Inmobiliaria Santa Ana',
      productCategories: ['KOHLER Baños', 'Schlage Cerraduras'],
      estimatedDuration: '6 horas',
      completionRate: 100,
      reportReady: true,
      imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop&q=80',
      qualityScore: 95,
      defectsFound: 1,
      complianceStatus: {
        passed: true,
        notes: 'Un ajuste menor requerido en cerradura - corregido en sitio'
      },
      reportDetails: {
        totalPhotos: 78,
        areasCompleted: 8,
        totalAreas: 8,
        findings: [
          '15 baños completos con productos KOHLER instalados correctamente',
          'Cerraduras Schlage verificadas - funcionamiento suave en todas las unidades',
          'Un ajuste menor en cerradura unidad 3B - corregido inmediatamente',
          'Sellados y acabados profesionales',
          'Documentación de garantía completada'
        ],
        productsInspected: 45
      }
    }
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'scheduled': return 'bg-blue-500 text-white'
      case 'in_progress': return 'bg-green-500 text-white'
      case 'completed': return 'bg-alumimundo-teal text-white'
      case 'report_ready': return 'bg-alumimundo-navy text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'scheduled': return 'Programada'
      case 'in_progress': return 'En Progreso'
      case 'completed': return 'Completada'
      case 'report_ready': return 'Reporte Listo'
      default: return status
    }
  }

  // Filter inspections
  const activeScheduledInspections = inspections.filter(inspection =>
    inspection.status === 'scheduled' || inspection.status === 'in_progress'
  ).filter(inspection => {
    const matchesSearch = inspection.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inspection.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inspection.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || inspection.status === filterStatus
    const matchesProductType = filterProductType === 'all' ||
      inspection.productCategories.some(cat => cat.toLowerCase().includes(filterProductType.toLowerCase()))
    return matchesSearch && matchesStatus && matchesProductType
  }).sort((a, b) => {
    const dateA = new Date(`${a.scheduledDate} ${a.scheduledTime}`)
    const dateB = new Date(`${b.scheduledDate} ${b.scheduledTime}`)
    return dateA.getTime() - dateB.getTime()
  })

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Inspecciones de Calidad
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
          Validación visual asistida por IA para garantizar la excelencia en instalación
        </p>
        <Link
          href="/dashboard/inspection/new"
          className="inline-flex h-12 px-6 bg-alumimundo-navy text-white rounded-full hover:bg-alumimundo-navy/90 items-center justify-center gap-2 transition-colors font-medium"
        >
          <Plus size={20} />
          <span>Nueva Inspección</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-l-4 border-l-alumimundo-navy">
          <CardContent className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Total Inspecciones</p>
            <p className="text-2xl sm:text-3xl font-bold text-alumimundo-navy dark:text-alumimundo-teal">{inspections.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">En Progreso</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              {inspections.filter(i => i.status === 'in_progress').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Programadas</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              {inspections.filter(i => i.status === 'scheduled').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-alumimundo-teal">
          <CardContent className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Completadas</p>
            <p className="text-2xl sm:text-3xl font-bold text-alumimundo-teal">
              {inspections.filter(i => i.status === 'completed' || i.status === 'report_ready').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
            <Input
              type="text"
              placeholder="Buscar por proyecto, dirección o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-800"
              data-gramm="false"
              data-gramm_editor="false"
              data-enable-grammarly="false"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Todos los Estados</option>
              <option value="scheduled">Programadas</option>
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completadas</option>
              <option value="report_ready">Reporte Listo</option>
            </select>

            <select
              value={filterProductType}
              onChange={(e) => setFilterProductType(e.target.value)}
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Todas las Categorías</option>
              <option value="KOHLER">KOHLER</option>
              <option value="Schlage">Schlage</option>
              <option value="Kallista">Kallista</option>
              <option value="Acabados">Acabados</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Inspections Grid */}
      {activeScheduledInspections.length > 0 && (
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Inspecciones Activas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {activeScheduledInspections.map((inspection, index) => (
              <motion.div
                key={inspection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group h-full flex flex-col"
                  onClick={() => {
                    if (inspection.status === 'in_progress') {
                      router.push(`/dashboard/inspection/${inspection.id}/continue`)
                    } else {
                      router.push(`/dashboard/inspection/${inspection.id}/start`)
                    }
                  }}
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                    {inspection.imageUrl && (
                      <Image
                        src={inspection.imageUrl}
                        alt={inspection.projectName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-alumimundo-navy via-alumimundo-navy/60 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-white text-base sm:text-lg leading-tight drop-shadow-lg line-clamp-1">
                        {inspection.projectName}
                      </h3>
                      <p className="text-white/90 text-xs sm:text-sm mt-1 line-clamp-1">
                        {inspection.propertyAddress}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 ${getStatusColor(inspection.status)} rounded-full text-[10px] font-semibold shadow-lg`}>
                        {inspection.status === 'in_progress' && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"/>}
                        {getStatusLabel(inspection.status)}
                      </span>
                    </div>

                    <div className="absolute top-2 left-2">
                      <span className="inline-block px-2 py-1 rounded-full text-[10px] font-semibold bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 shadow-lg">
                        {inspection.propertyType}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-4 flex-1 flex flex-col">
                    {/* Progress for In Progress */}
                    {inspection.status === 'in_progress' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Progreso</span>
                          <span className="text-xs font-bold text-green-600">{inspection.completionRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${inspection.completionRate}%` }}
                          />
                        </div>
                        {inspection.currentArea && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            Área actual: <span className="font-medium text-green-600">{inspection.currentArea}</span>
                          </p>
                        )}
                      </div>
                    )}

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Inspector</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{inspection.inspector}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Cliente</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{inspection.clientName}</p>
                      </div>
                    </div>

                    {/* Product Categories */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Productos a Inspeccionar</p>
                      <div className="flex flex-wrap gap-1">
                        {inspection.productCategories.map((category, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 bg-alumimundo-navy/10 dark:bg-alumimundo-teal/10 text-alumimundo-navy dark:text-alumimundo-teal rounded-full">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Date and Time */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 mb-4">
                      <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{new Date(inspection.scheduledDate).toLocaleDateString('es-CR')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{inspection.scheduledTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto">
                      {inspection.status === 'scheduled' && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/dashboard/inspection/${inspection.id}/start`)
                          }}
                          className="w-full bg-alumimundo-navy hover:bg-alumimundo-navy/90 text-white"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Iniciar Inspección
                        </Button>
                      )}
                      {inspection.status === 'in_progress' && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/dashboard/inspection/${inspection.id}/continue`)
                          }}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          <ChevronRight className="w-4 h-4 mr-2" />
                          Continuar Inspección
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {activeScheduledInspections.length === 0 && (
        <Card>
          <CardContent className="p-8 sm:p-12 text-center">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No se encontraron inspecciones
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Intenta ajustar tus filtros de búsqueda'
                : 'Comienza creando tu primera inspección de calidad'}
            </p>
            {searchTerm === '' && filterStatus === 'all' && (
              <Link href="/dashboard/inspection/new">
                <Button className="bg-alumimundo-navy hover:bg-alumimundo-navy/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Inspección
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
