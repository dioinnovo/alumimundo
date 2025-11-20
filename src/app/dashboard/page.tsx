'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp, DollarSign, Users, FileText, Clock, AlertTriangle,
  Calendar, BarChart3, Activity, Zap, Target, Shield,
  ArrowUp, ArrowDown, Building2, Home, Droplets, Flame,
  CloudRain, Palette, Briefcase, Presentation, MessageSquare
} from 'lucide-react'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/page-header'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    activeProjects: 32,
    monthlyRevenue: 4850000,
    inventoryValue: 18500000,
    clientSatisfaction: 96,
    avgSpecTime: 2.8,
    serviceLevel: 95
  })

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'project_created', title: 'Nuevo Proyecto - Residencial Los Arcos', time: 'Hace 15 minutos', status: 'new' },
    { id: 2, type: 'spec_completed', title: 'Especificación Completada - Hotel Marriott CR', time: 'Hace 1 hora', status: 'success' },
    { id: 3, type: 'quality_check', title: 'Control de Calidad Aprobado - Torre Vista Mar', time: 'Hace 2 horas', status: 'info' },
    { id: 4, type: 'order_placed', title: 'Pedido Generado - ₡12,500,000', time: 'Hace 3 horas', status: 'warning' },
    { id: 5, type: 'document_generated', title: 'Documentación Técnica Generada - PRY-2024-847', time: 'Hace 4 horas', status: 'info' }
  ])

  const upcomingInstallations = [
    { id: 1, project: 'Residencial Los Arcos - Escazú', time: 'Hoy 2:00 PM', product: 'KOHLER Tresham', status: 'confirmed' },
    { id: 2, project: 'Hotel Marriott - San José', time: 'Hoy 3:30 PM', product: 'Kallista Sink', status: 'confirmed' },
    { id: 3, project: 'Torre Vista Mar - Santa Ana', time: 'Mañana 10:00 AM', product: 'Schlage Hardware', status: 'pending' },
    { id: 4, project: 'Condominio Palmeras - Guanacaste', time: 'Mañana 2:00 PM', product: 'KOHLER Shower', status: 'confirmed' }
  ]

  const kpiCards = [
    {
      title: 'Proyectos Activos',
      value: stats.activeProjects,
      change: '+18%',
      trend: 'up',
      icon: Briefcase,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Ingresos Mensuales',
      value: `₡${(stats.monthlyRevenue / 1000000).toFixed(1)}M`,
      change: '+32%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Valor Inventario',
      value: `₡${(stats.inventoryValue / 1000000).toFixed(1)}M`,
      change: '+8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Nivel de Servicio',
      value: `${stats.serviceLevel}%`,
      change: '+3%',
      trend: 'up',
      icon: Target,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ]

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* Header */}
      <PageHeader
        title="Panel de Control"
        description="¡Bienvenido de nuevo! Aquí está el resumen de tus proyectos y especificaciones."
      />

      {/* Quick Actions CTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/diseno/new"
          className="group relative overflow-hidden bg-gradient-to-br from-alumimundo-navy to-alumimundo-teal text-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Nuevo Proyecto de Diseño</h3>
              </div>
              <p className="text-sm text-white/80">
                Crea una especificación inteligente con IA en minutos
              </p>
            </div>
            <div className="ml-4 p-3 bg-white/10 rounded-full group-hover:bg-white/20 transition">
              <ArrowUp className="w-5 h-5 rotate-45" />
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/diseno"
          className="group relative overflow-hidden bg-white dark:bg-gray-800 border-2 border-alumimundo-teal text-alumimundo-navy dark:text-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Presentation className="w-6 h-6 text-alumimundo-teal" />
                <h3 className="text-lg font-semibold">Ver Proyectos Activos</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stats.activeProjects} proyectos en desarrollo
              </p>
            </div>
            <div className="ml-4 p-3 bg-alumimundo-teal/10 rounded-full group-hover:bg-alumimundo-teal/20 transition">
              <ArrowUp className="w-5 h-5 rotate-45 text-alumimundo-teal" />
            </div>
          </div>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        {kpiCards.map((kpi, index) => (
          <div
            key={kpi.title}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-3 sm:p-6 hover:shadow-lg transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{kpi.title}</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1 sm:mt-2">{kpi.value}</p>
                <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-3">
                  {kpi.trend === 'up' ? (
                    <ArrowUp className="text-green-500" size={14} />
                  ) : (
                    <ArrowDown className="text-red-500" size={14} />
                  )}
                  <span className={`text-xs sm:text-sm font-medium ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {kpi.change}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">vs last month</span>
                </div>
              </div>
              <div className={`p-2 sm:p-3 rounded-lg ${kpi.lightColor} mt-2 sm:mt-0`}>
                <kpi.icon className={kpi.textColor} size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Próximas Instalaciones */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Próximas Instalaciones</h2>
          <Link href="/dashboard/quality" className="text-alumimundo-teal text-sm hover:underline">
            Ver Todas
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {upcomingInstallations.map((installation) => (
            <div key={installation.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-alumimundo-teal transition bg-white dark:bg-gray-800 hover:shadow-md">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-tight mb-1">{installation.project}</h3>
                  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                    installation.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {installation.status === 'confirmed' ? 'confirmado' : 'pendiente'}
                  </span>
                </div>
                <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{installation.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-alumimundo-teal flex-shrink-0" />
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">{installation.product}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Actividad Reciente</h2>
          <Link href="/dashboard/diseno" className="text-alumimundo-teal text-sm hover:underline">
            Ver Proyectos
          </Link>
        </div>

        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              <div className={`p-2 rounded-lg ${
                activity.status === 'new' ? 'bg-blue-100' :
                activity.status === 'success' ? 'bg-green-100' :
                activity.status === 'warning' ? 'bg-yellow-100' :
                'bg-gray-100'
              }`}>
                {activity.type === 'project_created' && <Briefcase className="text-blue-600" size={20} />}
                {activity.type === 'spec_completed' && <FileText className="text-green-600" size={20} />}
                {activity.type === 'quality_check' && <Shield className="text-gray-600 dark:text-gray-400" size={20} />}
                {activity.type === 'order_placed' && <DollarSign className="text-yellow-600" size={20} />}
                {activity.type === 'document_generated' && <FileText className="text-gray-600 dark:text-gray-400" size={20} />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-gray-100">{activity.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Productos por Categoría */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Productos por Categoría</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <Droplets className="text-blue-500 w-8 h-8 mb-2" />
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">342</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 text-center mt-1">Grifería</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <Shield className="text-green-500 w-8 h-8 mb-2" />
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">189</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 text-center mt-1">Cerraduras</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <Palette className="text-purple-500 w-8 h-8 mb-2" />
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">128</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 text-center mt-1">Lavamanos</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <Home className="text-orange-500 w-8 h-8 mb-2" />
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">95</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 text-center mt-1">Inodoros</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <CloudRain className="text-cyan-500 w-8 h-8 mb-2" />
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">76</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 text-center mt-1">Duchas</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <AlertTriangle className="text-red-500 w-8 h-8 mb-2" />
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">54</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 text-center mt-1">Puertas</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <Flame className="text-yellow-600 w-8 h-8 mb-2" />
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">43</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 text-center mt-1">Herrajes</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <Briefcase className="text-indigo-500 w-8 h-8 mb-2" />
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">38</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 text-center mt-1">Accesorios</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Tipos de Proyecto</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Building2 className="text-blue-500 w-5 h-5" />
                  <span className="font-medium text-sm sm:text-base">Comercial</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">45%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Home className="text-green-500 w-5 h-5" />
                  <span className="font-medium text-sm sm:text-base">Residencial</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">35%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Briefcase className="text-purple-500 w-5 h-5" />
                  <span className="font-medium text-sm sm:text-base">Hotelería</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">20%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>

          {/* Botón de Asistente IA */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Link
              href="/dashboard/assistant"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-alumimundo-teal bg-gray-50 dark:bg-gray-700 hover:bg-teal-50 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
            >
              <MessageSquare size={16} />
              <span>Consultar Asistente IA</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}