'use client'

import { useState } from 'react'
import { FileText, Download, FileType, BookOpen, FileSpreadsheet, FileCode, Plus, Search, Filter } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DocumentationPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const documentTypes = [
    {
      id: 'specs',
      title: 'Especificaciones Técnicas',
      description: 'Documentos técnicos de productos',
      icon: FileText,
      color: 'bg-blue-500',
      count: 45
    },
    {
      id: 'guides',
      title: 'Guías de Instalación',
      description: 'Manuales paso a paso',
      icon: BookOpen,
      color: 'bg-green-500',
      count: 32
    },
    {
      id: 'warranties',
      title: 'Garantías',
      description: 'Documentos de garantía',
      icon: FileSpreadsheet,
      color: 'bg-purple-500',
      count: 28
    },
    {
      id: 'compliance',
      title: 'Reportes de Cumplimiento',
      description: 'Certificaciones y normativas',
      icon: FileCode,
      color: 'bg-orange-500',
      count: 15
    }
  ]

  const recentDocuments = [
    {
      id: 1,
      name: 'Especificación KOHLER K-12345',
      type: 'Especificación Técnica',
      category: 'specs',
      date: '2024-11-15',
      size: '2.4 MB',
      format: 'PDF'
    },
    {
      id: 2,
      name: 'Guía de Instalación Grifería KOHLER',
      type: 'Guía de Instalación',
      category: 'guides',
      date: '2024-11-14',
      size: '5.1 MB',
      format: 'PDF'
    },
    {
      id: 3,
      name: 'Garantía Schlage Connect',
      type: 'Garantía',
      category: 'warranties',
      date: '2024-11-13',
      size: '1.2 MB',
      format: 'PDF'
    },
    {
      id: 4,
      name: 'Reporte Cumplimiento CFIA',
      type: 'Reporte de Cumplimiento',
      category: 'compliance',
      date: '2024-11-12',
      size: '3.8 MB',
      format: 'PDF'
    },
    {
      id: 5,
      name: 'Especificación Steelcraft Puertas',
      type: 'Especificación Técnica',
      category: 'specs',
      date: '2024-11-10',
      size: '4.2 MB',
      format: 'PDF'
    }
  ]

  const filteredDocuments = recentDocuments.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Documentación Automatizada
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Sistema de generación y gestión de documentos técnicos con IA
        </p>
      </div>

      {/* Document Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {documentTypes.map((type) => {
          const Icon = type.icon
          return (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedCategory === type.id ? 'ring-2 ring-alumimundo-teal' : ''
              }`}
              onClick={() => setSelectedCategory(type.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`${type.color} p-3 rounded-lg text-white`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {type.count}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">{type.title}</CardTitle>
                <CardDescription className="text-sm">{type.description}</CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-alumimundo-teal text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Todos
          </button>
          {documentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedCategory(type.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === type.id
                  ? 'bg-alumimundo-teal text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {type.title}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-alumimundo-navy text-white rounded-full hover:bg-opacity-90 transition-colors">
          <Plus size={18} />
          Generar Documento
        </button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar documentos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-alumimundo-teal bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
              <Filter size={18} />
              Filtros
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos Recientes</CardTitle>
          <CardDescription>
            {filteredDocuments.length} documento{filteredDocuments.length !== 1 ? 's' : ''} encontrado{filteredDocuments.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>No se encontraron documentos</p>
              </div>
            ) : (
              filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
                      <FileType size={24} className="text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {doc.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>{doc.date}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.format}</span>
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 text-alumimundo-teal hover:bg-alumimundo-teal hover:text-white rounded-lg transition-colors">
                    <Download size={18} />
                    Descargar
                  </button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Demo Notice */}
      <Card className="border-alumimundo-teal">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="bg-alumimundo-teal/10 p-2 rounded-lg">
              <FileText className="text-alumimundo-teal" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Sistema de Documentación Automatizada
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Esta interfaz demuestra el sistema de generación automática de documentación técnica con IA.
                En producción, el sistema generará especificaciones, guías de instalación, y reportes de cumplimiento
                utilizando datos del catálogo de productos y normativas de construcción de Costa Rica.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
