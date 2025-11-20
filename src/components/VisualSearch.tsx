'use client'

import { useState, useRef } from 'react'
import { X, Upload, Image as ImageIcon, Search, Loader2, Camera } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/design-tokens'
import Image from 'next/image'
import type { Product } from '@/lib/products-data'

interface VisualSearchProps {
  onClose: () => void
  onResultsFound: (products: Product[], searchImage: string) => void
  allProducts: Product[]
}

export default function VisualSearch({ onClose, onResultsFound, allProducts }: VisualSearchProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const simulateVisualSearch = async () => {
    if (!selectedImage) return

    setIsSearching(true)

    // Simulate AI visual search processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // For demo purposes, return random similar products
    // In production, this would use actual AI vision API
    const randomProducts = [...allProducts]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6)

    setIsSearching(false)
    onResultsFound(randomProducts, selectedImage)
    onClose()
  }

  const handleCameraCapture = () => {
    // Trigger file input with camera preference on mobile
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment')
      fileInputRef.current.click()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Búsqueda Visual
              </h2>
              <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                Sube una imagen para encontrar productos similares
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Cerrar búsqueda visual"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selectedImage ? (
            <>
              {/* Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                  'border-2 border-dashed rounded-lg p-12 text-center transition-all',
                  isDragging
                    ? 'border-alumimundo-teal bg-alumimundo-teal/5'
                    : 'border-gray-300 dark:border-gray-600 hover:border-alumimundo-teal hover:bg-gray-50 dark:hover:bg-gray-800/50'
                )}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                    <ImageIcon size={48} className="text-gray-400" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Arrastra una imagen aquí
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      o haz clic para seleccionar desde tu dispositivo
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        'px-6 py-3 rounded-lg font-medium transition flex items-center gap-2',
                        'bg-alumimundo-teal text-white',
                        'hover:bg-alumimundo-teal/90'
                      )}
                    >
                      <Upload size={20} />
                      Seleccionar Imagen
                    </button>

                    {/* Camera button for mobile devices */}
                    <button
                      onClick={handleCameraCapture}
                      className={cn(
                        'px-6 py-3 rounded-lg font-medium transition flex items-center gap-2',
                        'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
                        'hover:bg-gray-200 dark:hover:bg-gray-700',
                        'md:hidden' // Only show on mobile
                      )}
                    >
                      <Camera size={20} />
                      Tomar Foto
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  💡 Consejos para mejores resultados:
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Usa imágenes claras y bien iluminadas</li>
                  <li>• Enfoca el producto principal</li>
                  <li>• Evita fondos muy complejos</li>
                  <li>• Formatos soportados: JPG, PNG, WebP</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Vista Previa
                  </h3>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                  >
                    Cambiar imagen
                  </button>
                </div>

                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={selectedImage}
                    alt="Imagen seleccionada"
                    fill
                    className="object-contain"
                  />
                </div>

                {isSearching && (
                  <div className="p-4 rounded-lg bg-alumimundo-teal/10 border border-alumimundo-teal">
                    <div className="flex items-center gap-3">
                      <Loader2 className="animate-spin text-alumimundo-teal" size={20} />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Analizando imagen...
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Buscando productos similares en nuestro catálogo
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!isSearching && (
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Nuestra IA analizará esta imagen para encontrar productos similares en estilo, color, forma y características.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {selectedImage && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className={cn(
                  'px-6 py-3 rounded-lg font-medium transition',
                  'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
                  'hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                Cancelar
              </button>
              <button
                onClick={simulateVisualSearch}
                disabled={isSearching}
                className={cn(
                  'px-6 py-3 rounded-lg font-medium transition flex items-center gap-2',
                  'bg-alumimundo-teal text-white',
                  'hover:bg-alumimundo-teal/90',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Buscar Productos Similares
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
