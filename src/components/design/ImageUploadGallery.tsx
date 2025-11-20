'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Camera, Eye, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

interface UploadedImage {
  id: string
  file: File
  preview: string
  analyzing?: boolean
  analysis?: {
    detectedItems: string[]
    style: string
    colors: string[]
    suggestions: string[]
  }
}

interface ImageUploadGalleryProps {
  areaId: string
  areaName: string
  onImagesChange?: (images: UploadedImage[]) => void
  onAnalyze?: (imageId: string) => Promise<void>
}

export function ImageUploadGallery({
  areaId,
  areaName,
  onImagesChange,
  onAnalyze
}: ImageUploadGalleryProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null)

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return

    const newImages: UploadedImage[] = []

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = e.target?.result as string
        const newImage: UploadedImage = {
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview
        }
        newImages.push(newImage)

        if (newImages.length === files.length) {
          const updated = [...images, ...newImages]
          setImages(updated)
          onImagesChange?.(updated)
        }
      }
      reader.readAsDataURL(file)
    })
  }, [images, onImagesChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeImage = (id: string) => {
    const updated = images.filter(img => img.id !== id)
    setImages(updated)
    onImagesChange?.(updated)
    if (selectedImage?.id === id) {
      setSelectedImage(null)
    }
  }

  const analyzeImage = async (imageId: string) => {
    const image = images.find(img => img.id === imageId)
    if (!image || image.analyzing) return

    // Set analyzing state
    const updatedImages = images.map(img =>
      img.id === imageId ? { ...img, analyzing: true } : img
    )
    setImages(updatedImages)

    try {
      await onAnalyze?.(imageId)

      // Mock analysis result for now
      setTimeout(() => {
        const analyzed = images.map(img =>
          img.id === imageId
            ? {
                ...img,
                analyzing: false,
                analysis: {
                  detectedItems: ['Lavamanos', 'Grifo', 'Espejo'],
                  style: 'Moderno',
                  colors: ['Blanco', 'Cromado'],
                  suggestions: ['KOHLER Artifacts', 'KOHLER Memoirs']
                }
              }
            : img
        )
        setImages(analyzed)
        onImagesChange?.(analyzed)
      }, 2000)
    } catch (error) {
      // Reset analyzing state on error
      const resetImages = images.map(img =>
        img.id === imageId ? { ...img, analyzing: false } : img
      )
      setImages(resetImages)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-alumimundo-navy mb-1">
          Fotos del Área
        </h3>
        <p className="text-sm text-gray-600">
          Sube fotos de {areaName} para obtener recomendaciones precisas
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-xl p-6 mb-4 transition-colors ${
          isDragging
            ? 'border-alumimundo-navy bg-alumimundo-navy/5'
            : 'border-gray-300 hover:border-alumimundo-navy/50'
        }`}
      >
        <input
          type="file"
          id={`file-upload-${areaId}`}
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          aria-label="Upload area images"
        />
        <label
          htmlFor={`file-upload-${areaId}`}
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            Arrastra fotos aquí o haz clic para seleccionar
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, HEIC hasta 10MB
          </p>
        </label>
      </div>

      {/* Image Grid */}
      <div className="flex-1 overflow-y-auto">
        {images.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Camera className="w-16 h-16 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Aún no has subido fotos</p>
            <p className="text-xs mt-1">Las fotos ayudan a la IA a entender mejor tu espacio</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <AnimatePresence>
              {images.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <Card className="overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={image.preview}
                        alt={`Foto de ${areaName}`}
                        fill
                        className="object-cover"
                      />

                      {/* Analyzing Overlay */}
                      {image.analyzing && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-xs">Analizando...</p>
                          </div>
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedImage(image)}
                          className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                          aria-label="View image"
                        >
                          <Eye className="w-4 h-4 text-gray-700" />
                        </button>
                        {!image.analyzing && !image.analysis && (
                          <button
                            onClick={() => analyzeImage(image.id)}
                            className="p-2 bg-alumimundo-navy rounded-lg hover:bg-alumimundo-navy/90 transition-colors"
                            aria-label="Analyze image with AI"
                          >
                            <Sparkles className="w-4 h-4 text-white" />
                          </button>
                        )}
                        <button
                          onClick={() => removeImage(image.id)}
                          className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                          aria-label="Delete image"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Analysis Results */}
                    {image.analysis && (
                      <div className="p-2 bg-alumimundo-navy/5">
                        <div className="flex items-center gap-1 mb-1">
                          <Sparkles className="w-3 h-3 text-alumimundo-navy" />
                          <p className="text-xs font-medium text-alumimundo-navy">
                            Análisis IA
                          </p>
                        </div>
                        <p className="text-xs text-gray-600">
                          {image.analysis.detectedItems.join(', ')}
                        </p>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 p-2 bg-white rounded-lg hover:bg-gray-100"
              aria-label="Close preview"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage.preview}
              alt="Preview"
              className="max-w-full max-h-[80vh] rounded-lg"
            />
            {selectedImage.analysis && (
              <Card className="mt-4 p-4 bg-white">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-alumimundo-navy" />
                  Análisis de IA
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Elementos detectados:</span>{' '}
                    {selectedImage.analysis.detectedItems.join(', ')}
                  </div>
                  <div>
                    <span className="font-medium">Estilo:</span> {selectedImage.analysis.style}
                  </div>
                  <div>
                    <span className="font-medium">Colores:</span>{' '}
                    {selectedImage.analysis.colors.join(', ')}
                  </div>
                  {selectedImage.analysis.suggestions.length > 0 && (
                    <div>
                      <span className="font-medium">Sugerencias:</span>{' '}
                      {selectedImage.analysis.suggestions.join(', ')}
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
