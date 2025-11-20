'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Upload, FileText, Building, User,
  MapPin, DollarSign, Sparkles, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function NuevoPresupuestoPage() {
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState({
    projectName: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    propertyType: 'RESIDENTIAL',
    location: '',
    address: '',
    city: '',
    province: ''
  })

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setUploadedFiles((prev) => [...prev, ...files])
    }
  }

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()

      // Add form fields
      formDataToSend.append('projectName', formData.projectName)
      formDataToSend.append('clientName', formData.clientName)
      formDataToSend.append('clientEmail', formData.clientEmail)
      formDataToSend.append('clientPhone', formData.clientPhone)
      formDataToSend.append('propertyType', formData.propertyType)
      formDataToSend.append('location', formData.location)
      formDataToSend.append('address', formData.address)
      formDataToSend.append('city', formData.city)
      formDataToSend.append('province', formData.province)

      // Add files
      uploadedFiles.forEach((file) => {
        formDataToSend.append('files', file)
      })

      // Create estimation
      const createResponse = await fetch('/api/budget-estimation/create', {
        method: 'POST',
        body: formDataToSend
      })

      if (!createResponse.ok) {
        throw new Error('Failed to create estimation')
      }

      const { estimation } = await createResponse.json()

      // Trigger AI analysis in background
      fetch('/api/budget-estimation/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estimationId: estimation.id })
      }).catch(err => console.error('AI analysis error:', err))

      // Navigate to estimation detail page
      router.push(`/dashboard/presupuesto-puertas/${estimation.id}`)
    } catch (error) {
      console.error('Error creating estimation:', error)
      alert('Error al crear presupuesto. Por favor intenta de nuevo.')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-alumimundo-navy dark:text-white">
            Nuevo Presupuesto de Puertas
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Completa la información y carga los planos arquitectónicos
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Information */}
        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Building className="w-5 h-5 text-alumimundo-navy dark:text-alumimundo-teal" />
            <h2 className="text-lg font-semibold text-alumimundo-navy dark:text-white">
              Información del Proyecto
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre del Proyecto *
              </label>
              <input
                type="text"
                required
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                placeholder="ej. Condominio Las Palmas"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-alumimundo-navy dark:bg-gray-700 dark:text-white focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Propiedad *
              </label>
              <select
                required
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-alumimundo-navy dark:bg-gray-700 dark:text-white focus:border-transparent"
              >
                <option value="RESIDENTIAL">Residencial</option>
                <option value="COMMERCIAL">Comercial</option>
                <option value="INSTITUTIONAL">Institucional</option>
                <option value="HOSPITALITY">Hotelería</option>
                <option value="MIXED_USE">Uso Mixto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ubicación *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="ej. San José, Costa Rica"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-alumimundo-navy dark:bg-gray-700 dark:text-white focus:border-transparent"
              />
            </div>
          </div>
        </Card>

        {/* Client Information */}
        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-alumimundo-navy dark:text-alumimundo-teal" />
            <h2 className="text-lg font-semibold text-alumimundo-navy dark:text-white">
              Información del Cliente
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre / Empresa *
              </label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="ej. Constructora ABC S.A."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-alumimundo-navy dark:bg-gray-700 dark:text-white focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                placeholder="cliente@ejemplo.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-alumimundo-navy dark:bg-gray-700 dark:text-white focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                placeholder="+506 1234-5678"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-alumimundo-navy dark:bg-gray-700 dark:text-white focus:border-transparent"
              />
            </div>
          </div>
        </Card>

        {/* File Upload */}
        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-alumimundo-navy dark:text-alumimundo-teal" />
            <h2 className="text-lg font-semibold text-alumimundo-navy dark:text-white">
              Planos Arquitectónicos
            </h2>
          </div>

          <div className="space-y-4">
            {/* Upload Zone */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <input
                type="file"
                id="file-upload"
                multiple
                accept=".pdf,.dxf,.dwg"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Cargar planos arquitectónicos"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Haz clic para cargar archivos
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF o AutoCAD (DXF, DWG) - Máximo 50MB por archivo
                </p>
              </label>
            </div>

            {/* AI Feature Highlight */}
            <div className="bg-gradient-to-r from-alumimundo-navy to-alumimundo-teal rounded-lg p-4 text-white">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Análisis Inteligente con IA</p>
                  <p className="text-sm opacity-90">
                    Nuestra IA analizará automáticamente los planos para detectar puertas,
                    identificar tipos y calcular herrajes necesarios. El proceso que antes
                    tomaba 8 semanas ahora se completa en horas.
                  </p>
                </div>
              </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Archivos cargados ({uploadedFiles.length})
                </p>
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="w-5 h-5 text-alumimundo-navy dark:text-alumimundo-teal flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Eliminar
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Validation Warning */}
            {uploadedFiles.length === 0 && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  Debes cargar al menos un plano arquitectónico para continuar
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={uploadedFiles.length === 0 || isProcessing}
            className="bg-alumimundo-navy hover:bg-alumimundo-navy/90 text-white"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Procesando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Crear Presupuesto
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
