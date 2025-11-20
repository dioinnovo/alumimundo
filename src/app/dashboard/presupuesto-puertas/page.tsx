'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Plus, FileText, Search, Filter, Calendar,
  DollarSign, TrendingUp, CheckCircle, Clock, Archive
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Mock data - will be replaced with real database queries
interface BudgetEstimate {
  id: string
  projectNumber: string
  projectName: string
  clientName: string
  status: 'DRAFT' | 'UPLOADED' | 'PARSING' | 'REVIEWED' | 'SPECIFIED' | 'COMPLETED' | 'ARCHIVED'
  totalDoors: number
  totalCost: number | null
  createdAt: string
  propertyType: string
}

const mockEstimates: BudgetEstimate[] = [
  {
    id: '1',
    projectNumber: 'PE-2024-001',
    projectName: 'Condominio Las Palmas',
    clientName: 'Constructora ABC S.A.',
    status: 'COMPLETED',
    totalDoors: 2800,
    totalCost: 450000000,
    createdAt: '2024-11-01',
    propertyType: 'RESIDENTIAL'
  },
  {
    id: '2',
    projectNumber: 'PE-2024-002',
    projectName: 'Hotel Costa del Sol',
    clientName: 'Hotelera del Pacífico',
    status: 'REVIEWED',
    totalDoors: 156,
    totalCost: 85000000,
    createdAt: '2024-11-10',
    propertyType: 'HOSPITALITY'
  }
]

export default function PresupuestoPuertasPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return { label: 'Borrador', color: 'bg-gray-100 text-gray-700', icon: FileText }
      case 'UPLOADED':
        return { label: 'Cargado', color: 'bg-blue-100 text-blue-700', icon: Clock }
      case 'PARSING':
        return { label: 'Procesando', color: 'bg-yellow-100 text-yellow-700', icon: Clock }
      case 'REVIEWED':
        return { label: 'Revisado', color: 'bg-purple-100 text-purple-700', icon: CheckCircle }
      case 'SPECIFIED':
        return { label: 'Especificado', color: 'bg-indigo-100 text-indigo-700', icon: CheckCircle }
      case 'COMPLETED':
        return { label: 'Completado', color: 'bg-green-100 text-green-700', icon: CheckCircle }
      case 'ARCHIVED':
        return { label: 'Archivado', color: 'bg-gray-100 text-gray-500', icon: Archive }
      default:
        return { label: status, color: 'bg-gray-100 text-gray-700', icon: FileText }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredEstimates = mockEstimates.filter((estimate) => {
    const matchesSearch =
      searchTerm === '' ||
      estimate.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimate.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimate.projectNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || estimate.status === filterStatus

    return matchesSearch && matchesStatus
  })

  // Calculate summary stats
  const stats = {
    total: mockEstimates.length,
    totalDoors: mockEstimates.reduce((sum, e) => sum + e.totalDoors, 0),
    totalValue: mockEstimates.reduce((sum, e) => sum + (e.totalCost || 0), 0),
    inProgress: mockEstimates.filter((e) => ['UPLOADED', 'PARSING', 'REVIEWED', 'SPECIFIED'].includes(e.status)).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-alumimundo-navy dark:text-white">
            Presupuestos de Puertas
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Carga planos arquitectónicos y genera presupuestos automáticamente
          </p>
        </div>
        <Button
          onClick={() => router.push('/dashboard/presupuesto-puertas/nuevo')}
          className="bg-alumimundo-navy hover:bg-alumimundo-navy/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Presupuesto
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Proyectos</p>
              <p className="text-2xl font-semibold text-alumimundo-navy dark:text-white mt-1">
                {stats.total}
              </p>
            </div>
            <FileText className="w-8 h-8 text-alumimundo-teal dark:text-alumimundo-teal" />
          </div>
        </Card>

        <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Puertas</p>
              <p className="text-2xl font-semibold text-alumimundo-navy dark:text-white mt-1">
                {stats.totalDoors.toLocaleString('es-CR')}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </Card>

        <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Valor Total</p>
              <p className="text-2xl font-semibold text-alumimundo-navy dark:text-white mt-1">
                {formatCurrency(stats.totalValue)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </Card>

        <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">En Progreso</p>
              <p className="text-2xl font-semibold text-alumimundo-navy dark:text-white mt-1">
                {stats.inProgress}
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por proyecto, cliente o número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-alumimundo-navy dark:bg-gray-700 dark:text-white focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-alumimundo-navy dark:bg-gray-700 dark:text-white focus:border-transparent"
          >
            <option value="all">Todos los Estados</option>
            <option value="DRAFT">Borrador</option>
            <option value="UPLOADED">Cargado</option>
            <option value="PARSING">Procesando</option>
            <option value="REVIEWED">Revisado</option>
            <option value="SPECIFIED">Especificado</option>
            <option value="COMPLETED">Completado</option>
            <option value="ARCHIVED">Archivado</option>
          </select>
        </div>
      </Card>

      {/* Estimates List */}
      <div className="space-y-3">
        {filteredEstimates.length === 0 ? (
          <Card className="p-12 text-center dark:bg-gray-800 dark:border-gray-700">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {searchTerm || filterStatus !== 'all'
                ? 'No se encontraron presupuestos'
                : 'No hay presupuestos aún'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {searchTerm || filterStatus !== 'all'
                ? 'Intenta ajustar los filtros'
                : 'Crea tu primer presupuesto cargando planos arquitectónicos'}
            </p>
          </Card>
        ) : (
          filteredEstimates.map((estimate) => {
            const statusConfig = getStatusConfig(estimate.status)
            const StatusIcon = statusConfig.icon

            return (
              <motion.div
                key={estimate.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card
                  className="p-4 hover:border-alumimundo-navy dark:hover:border-alumimundo-teal transition-colors cursor-pointer dark:bg-gray-800 dark:border-gray-700"
                  onClick={() => router.push(`/dashboard/presupuesto-puertas/${estimate.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-alumimundo-navy dark:text-white truncate">
                          {estimate.projectName}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{estimate.projectNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>{formatDate(estimate.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 flex-shrink-0" />
                          <span>{estimate.totalDoors} puertas</span>
                        </div>
                        {estimate.totalCost && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 flex-shrink-0" />
                            <span className="font-medium text-alumimundo-navy dark:text-alumimundo-teal">
                              {formatCurrency(estimate.totalCost)}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 truncate">
                        Cliente: {estimate.clientName}
                      </p>
                    </div>
                    <StatusIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  </div>
                </Card>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
