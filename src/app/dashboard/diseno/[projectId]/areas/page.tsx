'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, ArrowRight, Check, X } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getAreaIcon, getAreaLabel, type AreaType } from '@/lib/design-icons'

interface SelectedArea {
  id: string
  areaType: AreaType
  areaName: string
}

export default function AreasSelectionPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params)
  const router = useRouter()
  const [selectedAreas, setSelectedAreas] = useState<SelectedArea[]>([])
  const [customAreaName, setCustomAreaName] = useState('')
  const [customAreaType, setCustomAreaType] = useState<AreaType | ''>('')
  const [showCustomForm, setShowCustomForm] = useState(false)

  const commonAreas: { type: AreaType; defaultName: string }[] = [
    { type: 'KITCHEN', defaultName: 'Cocina Principal' },
    { type: 'MASTER_BATHROOM', defaultName: 'Baño Principal' },
    { type: 'GUEST_BATHROOM', defaultName: 'Baño de Visitas' },
    { type: 'LIVING_ROOM', defaultName: 'Sala' },
    { type: 'DINING_ROOM', defaultName: 'Comedor' },
    { type: 'MASTER_BEDROOM', defaultName: 'Habitación Principal' },
    { type: 'BEDROOM', defaultName: 'Habitación' },
    { type: 'ENTRANCE', defaultName: 'Entrada Principal' },
    { type: 'OFFICE', defaultName: 'Oficina' },
    { type: 'LAUNDRY', defaultName: 'Lavandería' },
    { type: 'OUTDOOR', defaultName: 'Área Exterior' },
    { type: 'GARAGE', defaultName: 'Garaje' }
  ]

  const allAreaTypes: AreaType[] = [
    'KITCHEN',
    'BATHROOM',
    'MASTER_BATHROOM',
    'GUEST_BATHROOM',
    'LIVING_ROOM',
    'DINING_ROOM',
    'BEDROOM',
    'MASTER_BEDROOM',
    'ENTRANCE',
    'HALLWAY',
    'OFFICE',
    'LAUNDRY',
    'OUTDOOR',
    'PATIO',
    'GARAGE',
    'OTHER'
  ]

  const toggleArea = (type: AreaType, defaultName: string) => {
    const exists = selectedAreas.find(a => a.areaType === type && a.areaName === defaultName)

    if (exists) {
      setSelectedAreas(selectedAreas.filter(a => a.id !== exists.id))
    } else {
      const newArea: SelectedArea = {
        id: `area-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        areaType: type,
        areaName: defaultName
      }
      setSelectedAreas([...selectedAreas, newArea])
    }
  }

  const addCustomArea = () => {
    if (!customAreaType || !customAreaName.trim()) return

    const newArea: SelectedArea = {
      id: `area-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      areaType: customAreaType,
      areaName: customAreaName.trim()
    }

    setSelectedAreas([...selectedAreas, newArea])
    setCustomAreaName('')
    setCustomAreaType('')
    setShowCustomForm(false)
  }

  const removeArea = (id: string) => {
    setSelectedAreas(selectedAreas.filter(a => a.id !== id))
  }

  const handleContinue = async () => {
    if (selectedAreas.length === 0) {
      alert('Por favor selecciona al menos un área para continuar')
      return
    }

    // TODO: Save selected areas to database

    // Navigate to first area
    router.push(`/dashboard/diseno/${projectId}/area/${selectedAreas[0].id}`)
  }

  const isAreaSelected = (type: AreaType, defaultName: string) => {
    return selectedAreas.some(a => a.areaType === type && a.areaName === defaultName)
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      <PageHeader
        title="Selecciona las Áreas"
        description="Elige las áreas o espacios que deseas especificar en tu proyecto"
      />

      {/* Common Areas Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Áreas Comunes</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {commonAreas.map((area) => {
              const iconInfo = getAreaIcon(area.type)
              const Icon = iconInfo.icon
              const selected = isAreaSelected(area.type, area.defaultName)

              return (
                <motion.button
                  key={`${area.type}-${area.defaultName}`}
                  onClick={() => toggleArea(area.type, area.defaultName)}
                  className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all ${
                    selected
                      ? 'border-alumimundo-navy bg-alumimundo-navy/5 shadow-md dark:bg-alumimundo-navy/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-alumimundo-navy/50 dark:hover:border-alumimundo-navy/70'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${iconInfo.bgColor} flex items-center justify-center mx-auto mb-2`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconInfo.color}`} />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white text-center line-clamp-2">
                    {area.defaultName}
                  </p>
                  {selected && (
                    <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 bg-alumimundo-navy rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
      </div>

      {/* Add Custom Area */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Agregar Área Personalizada</h3>
          {!showCustomForm && (
            <Button
              onClick={() => setShowCustomForm(true)}
              variant="outline"
              className="border-alumimundo-navy text-alumimundo-navy dark:border-alumimundo-teal dark:text-alumimundo-teal w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          )}
        </div>

        {showCustomForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3 sm:space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Área
              </label>
              <select
                value={customAreaType}
                onChange={(e) => setCustomAreaType(e.target.value as AreaType)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-alumimundo-navy dark:focus:ring-alumimundo-teal focus:border-transparent"
              >
                <option value="">Selecciona un tipo...</option>
                {allAreaTypes.map((type) => (
                  <option key={type} value={type}>
                    {getAreaLabel(type)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre del Área
              </label>
              <input
                type="text"
                value={customAreaName}
                onChange={(e) => setCustomAreaName(e.target.value)}
                placeholder="Ej: Cocina Secundaria, Baño 3, etc."
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-alumimundo-navy dark:focus:ring-alumimundo-teal focus:border-transparent"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={addCustomArea}
                disabled={!customAreaType || !customAreaName.trim()}
                className="bg-alumimundo-navy hover:bg-alumimundo-navy/90 text-white w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Área
              </Button>
              <Button
                onClick={() => {
                  setShowCustomForm(false)
                  setCustomAreaName('')
                  setCustomAreaType('')
                }}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
            </div>
          </motion.div>
        )}
      </Card>

        {/* Selected Areas Summary */}
        {selectedAreas.length > 0 && (
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Áreas Seleccionadas ({selectedAreas.length})
            </h3>
            <div className="space-y-2">
              {selectedAreas.map((area, index) => {
                const iconInfo = getAreaIcon(area.areaType)
                const Icon = iconInfo.icon

                return (
                  <motion.div
                    key={area.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${iconInfo.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${iconInfo.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{area.areaName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{getAreaLabel(area.areaType)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeArea(area.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </Card>
        )}

        {/* Continue Button */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            Volver
          </Button>
          <Button
            onClick={handleContinue}
            disabled={selectedAreas.length === 0}
            className="bg-alumimundo-navy hover:bg-alumimundo-navy/90 text-white px-8 w-full sm:w-auto"
          >
            Continuar
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
    </div>
  )
}
