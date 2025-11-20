'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Building2, Home, Hotel, Factory, ArrowRight, MapPin,
  DollarSign, FileText, Sparkles
} from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { useSidebar } from '@/contexts/SidebarContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type PropertyType = 'RESIDENTIAL' | 'COMMERCIAL' | 'INSTITUTIONAL' | 'HOSPITALITY' | 'MIXED_USE'
type BudgetRange = 'LOW' | 'MEDIUM' | 'HIGH' | 'LUXURY'

export default function NewDesignProjectPage() {
  const router = useRouter()
  const { isCollapsed } = useSidebar()
  const [formData, setFormData] = useState({
    name: '',
    propertyType: '' as PropertyType | '',
    location: '',
    budgetRange: '' as BudgetRange | '',
    description: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const propertyTypes = [
    {
      value: 'RESIDENTIAL',
      label: 'Residencial',
      description: 'Casas, apartamentos, condominios',
      icon: Home,
      color: 'from-blue-500 to-blue-600'
    },
    {
      value: 'COMMERCIAL',
      label: 'Comercial',
      description: 'Oficinas, tiendas, locales',
      icon: Building2,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      value: 'HOSPITALITY',
      label: 'Hotelería',
      description: 'Hoteles, resorts, restaurantes',
      icon: Hotel,
      color: 'from-purple-500 to-purple-600'
    },
    {
      value: 'INSTITUTIONAL',
      label: 'Institucional',
      description: 'Escuelas, hospitales, gobierno',
      icon: Factory,
      color: 'from-teal-500 to-teal-600'
    }
  ]

  const budgetRanges = [
    {
      value: 'LOW',
      label: 'Económico',
      range: '< ₡5M',
      description: 'Opciones económicas'
    },
    {
      value: 'MEDIUM',
      label: 'Medio',
      range: '₡5M - ₡15M',
      description: 'Balance calidad-precio'
    },
    {
      value: 'HIGH',
      label: 'Premium',
      range: '₡15M - ₡30M',
      description: 'Alta calidad'
    },
    {
      value: 'LUXURY',
      label: 'Lujo',
      range: '> ₡30M',
      description: 'Lo mejor del mercado'
    }
  ]

  const costaRicaLocations = [
    'San José - Escazú',
    'San José - Santa Ana',
    'San José - Curridabat',
    'San José - La Sabana',
    'Alajuela - Centro',
    'Alajuela - Aeropuerto',
    'Heredia - Centro',
    'Heredia - Barva',
    'Cartago - Centro',
    'Guanacaste - Tamarindo',
    'Guanacaste - Liberia',
    'Guanacaste - Nosara',
    'Puntarenas - Jacó',
    'Puntarenas - Manuel Antonio',
    'Limón - Puerto Viejo',
    'Otro'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Create project in database
      const projectData = {
        ...formData,
        userId: 'temp-user-id', // TODO: Get from auth
        status: 'DRAFT'
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock project ID for now
      const projectId = 'DSN-' + Date.now().toString().slice(-6)

      // Navigate to area selection
      router.push(`/dashboard/diseno/${projectId}/start`)
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Error al crear el proyecto. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.name && formData.propertyType && formData.location

  return (
    <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'} p-4 md:p-8`}>
      <PageHeader
        title="Nuevo Proyecto de Diseño"
        description="Crea un proyecto y deja que nuestra IA te ayude a especificar los mejores materiales"
        icon={<Sparkles className="w-8 h-8 text-alumimundo-navy" />}
      />

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
        {/* Project Name & Description */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-alumimundo-navy mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Información del Proyecto
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Proyecto *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Casa Moderna - Escazú"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alumimundo-navy focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción (Opcional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe brevemente tu proyecto..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alumimundo-navy focus:border-transparent resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Property Type Selection */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-alumimundo-navy mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Tipo de Propiedad *
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {propertyTypes.map((type) => (
              <motion.button
                key={type.value}
                type="button"
                onClick={() => setFormData({ ...formData, propertyType: type.value as PropertyType })}
                className={`relative p-6 rounded-xl border-2 transition-all ${
                  formData.propertyType === type.value
                    ? 'border-alumimundo-navy bg-alumimundo-navy/5 shadow-md'
                    : 'border-gray-200 hover:border-alumimundo-navy/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center mb-3`}>
                  <type.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{type.label}</h3>
                <p className="text-xs text-gray-600">{type.description}</p>
                {formData.propertyType === type.value && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-alumimundo-navy rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </Card>

        {/* Location */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-alumimundo-navy mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Ubicación *
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona la ubicación del proyecto
            </label>
            <select
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alumimundo-navy focus:border-transparent"
            >
              <option value="">Selecciona una ubicación...</option>
              {costaRicaLocations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-2">
              La ubicación nos ayuda a recomendar productos apropiados para el clima y códigos locales
            </p>
          </div>
        </Card>

        {/* Budget Range */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-alumimundo-navy mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Rango de Presupuesto (Opcional)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {budgetRanges.map((budget) => (
              <motion.button
                key={budget.value}
                type="button"
                onClick={() => setFormData({ ...formData, budgetRange: budget.value as BudgetRange })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.budgetRange === budget.value
                    ? 'border-alumimundo-teal bg-alumimundo-teal/5 shadow-md'
                    : 'border-gray-200 hover:border-alumimundo-teal/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="font-semibold text-gray-900 mb-1">{budget.label}</h3>
                <p className="text-sm text-alumimundo-teal font-medium mb-1">{budget.range}</p>
                <p className="text-xs text-gray-600">{budget.description}</p>
              </motion.button>
            ))}
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="bg-alumimundo-navy hover:bg-alumimundo-navy/90 text-white px-8"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creando...
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
