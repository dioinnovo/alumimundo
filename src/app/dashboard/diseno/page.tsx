'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Plus, Calendar, MapPin, Building2, Home,
  Eye, Pencil, Search, FileText
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface DesignProject {
  id: string
  name: string
  propertyType: string
  location: string
  status: string
  budgetRange?: string
  totalEstimate?: number
  createdAt: string
  areasCount: number
  completedAreas: number
  thumbnail?: string
}

export default function DisenoListPage() {
  const router = useRouter()
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data - will be replaced with real data from database
  const projects: DesignProject[] = [
    {
      id: 'DSN-001',
      name: 'Casa Moderna - Escazú',
      propertyType: 'Residential',
      location: 'Escazú, San José',
      status: 'in_progress',
      budgetRange: 'high',
      totalEstimate: 15000000, // CRC
      createdAt: '2024-11-14',
      areasCount: 5,
      completedAreas: 2,
      thumbnail: '/images/placeholder-home.jpg'
    },
    {
      id: 'DSN-002',
      name: 'Hotel Boutique - Tamarindo',
      propertyType: 'Hospitality',
      location: 'Tamarindo, Guanacaste',
      status: 'draft',
      budgetRange: 'luxury',
      createdAt: '2024-11-15',
      areasCount: 12,
      completedAreas: 0,
    },
    {
      id: 'DSN-003',
      name: 'Oficinas Corporativas - La Sabana',
      propertyType: 'Commercial',
      location: 'La Sabana, San José',
      status: 'completed',
      budgetRange: 'medium',
      totalEstimate: 8500000,
      createdAt: '2024-11-09',
      areasCount: 8,
      completedAreas: 8,
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      case 'draft': return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
      case 'review': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_progress': return 'En Progreso'
      case 'completed': return 'Completado'
      case 'draft': return 'Borrador'
      case 'review': return 'En Revisión'
      default: return status
    }
  }

  const getPropertyTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'residential': return <Home className="w-4 h-4" />
      case 'commercial':
      case 'hospitality':
      case 'institutional':
        return <Building2 className="w-4 h-4" />
      default: return <Building2 className="w-4 h-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const filteredProjects = projects.filter(project => {
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Diseño Inteligente
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Especificación y diseño asistido por IA para proyectos de construcción
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-l-4 border-l-alumimundo-navy">
          <CardContent className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Total Proyectos</p>
            <p className="text-2xl sm:text-3xl font-bold text-alumimundo-navy dark:text-alumimundo-teal">{projects.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">En Progreso</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              {projects.filter(p => p.status === 'in_progress').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Completados</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              {projects.filter(p => p.status === 'completed').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-alumimundo-teal">
          <CardContent className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Borradores</p>
            <p className="text-2xl sm:text-3xl font-bold text-alumimundo-teal">
              {projects.filter(p => p.status === 'draft').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
          <Input
            type="text"
            placeholder="Buscar proyectos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800"
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
          />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 sm:flex-none h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="all">Todos los Estados</option>
            <option value="draft">Borradores</option>
            <option value="in_progress">En Progreso</option>
            <option value="review">En Revisión</option>
            <option value="completed">Completados</option>
          </select>
          <Link href="/dashboard/diseno/new">
            <Button className="bg-alumimundo-navy hover:bg-alumimundo-navy/90 text-white whitespace-nowrap">
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Nuevo Proyecto</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
              {/* Project Header */}
              <div className="bg-gradient-to-r from-alumimundo-navy to-alumimundo-teal p-4 text-white">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getPropertyTypeIcon(project.propertyType)}
                    <span className="text-xs font-medium opacity-90">{project.propertyType}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-1">{project.name}</h3>
                <div className="flex items-center gap-2 text-xs sm:text-sm opacity-90">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="line-clamp-1">{project.location}</span>
                </div>
              </div>

              {/* Project Content */}
              <CardContent className="p-4 flex-1 flex flex-col">
                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Progreso</span>
                    <span className="font-medium text-alumimundo-navy dark:text-alumimundo-teal">
                      {project.completedAreas}/{project.areasCount} áreas
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-alumimundo-teal h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(project.completedAreas / project.areasCount) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Estimate */}
                {project.totalEstimate && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Estimado Total</p>
                    <p className="text-base sm:text-lg font-semibold text-alumimundo-navy dark:text-alumimundo-teal">
                      {formatCurrency(project.totalEstimate)}
                    </p>
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>Creado: {new Date(project.createdAt).toLocaleDateString('es-CR')}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  {project.status === 'draft' || project.status === 'in_progress' ? (
                    <Link href={`/dashboard/diseno/${project.id}/areas`} className="flex-1">
                      <Button className="w-full bg-alumimundo-navy hover:bg-alumimundo-navy/90 text-white text-sm">
                        <Pencil className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        {project.status === 'draft' ? 'Iniciar' : 'Continuar'}
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/dashboard/diseno/${project.id}/report`} className="flex-1">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Ver Reporte
                      </Button>
                    </Link>
                  )}
                  <Link href={`/dashboard/diseno/${project.id}/review`}>
                    <Button variant="outline" size="icon" className="border-alumimundo-navy text-alumimundo-navy hover:bg-alumimundo-navy hover:text-white">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="p-8 sm:p-12 text-center">
            <Building2 className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No se encontraron proyectos
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Intenta ajustar tus filtros de búsqueda'
                : 'Comienza creando tu primer proyecto de diseño'}
            </p>
            {searchTerm === '' && filterStatus === 'all' && (
              <Link href="/dashboard/diseno/new">
                <Button className="bg-alumimundo-navy hover:bg-alumimundo-navy/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primer Proyecto
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
