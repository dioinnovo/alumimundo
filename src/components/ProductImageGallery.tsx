'use client'

import { useState, useRef, useEffect } from 'react'
import { X, ZoomIn, ZoomOut, RotateCw, Maximize2, ChevronLeft, ChevronRight, Rotate3d } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/design-tokens'
import Image from 'next/image'

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  has360View?: boolean
  onClose: () => void
}

export default function ProductImageGallery({
  images,
  productName,
  has360View = false,
  onClose
}: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [is360Mode, setIs360Mode] = useState(false)
  const [rotation360, setRotation360] = useState(0)
  const imageRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle zoom
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1))
    if (zoomLevel <= 1.5) {
      setPosition({ x: 0, y: 0 })
    }
  }

  const handleResetZoom = () => {
    setZoomLevel(1)
    setPosition({ x: 0, y: 0 })
  }

  // Handle navigation
  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
    handleResetZoom()
  }

  const handleNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
    handleResetZoom()
  }

  // Handle dragging for pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Handle 360° view dragging
  const handle360Drag = (e: React.MouseEvent) => {
    if (is360Mode && isDragging) {
      const deltaX = e.clientX - dragStart.x
      const rotationDelta = deltaX * 0.5
      setRotation360(prev => (prev + rotationDelta) % 360)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handle360MouseDown = (e: React.MouseEvent) => {
    if (is360Mode) {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'Escape') {
        if (isFullscreen) toggleFullscreen()
        else onClose()
      }
      if (e.key === '+' || e.key === '=') handleZoomIn()
      if (e.key === '-') handleZoomOut()
      if (e.key === '0') handleResetZoom()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black/95 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-white font-bold text-lg">{productName}</h2>
          <span className="text-gray-400 text-sm">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          {!is360Mode && (
            <>
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                className={cn(
                  'p-2 rounded-lg transition',
                  'bg-white/10 hover:bg-white/20',
                  'text-white disabled:opacity-40 disabled:cursor-not-allowed'
                )}
                title="Zoom out (-)"
              >
                <ZoomOut size={20} />
              </button>
              <span className="text-white text-sm min-w-[3rem] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                className={cn(
                  'p-2 rounded-lg transition',
                  'bg-white/10 hover:bg-white/20',
                  'text-white disabled:opacity-40 disabled:cursor-not-allowed'
                )}
                title="Zoom in (+)"
              >
                <ZoomIn size={20} />
              </button>
              <button
                onClick={handleResetZoom}
                className={cn(
                  'p-2 rounded-lg transition',
                  'bg-white/10 hover:bg-white/20',
                  'text-white'
                )}
                title="Reset zoom (0)"
              >
                <RotateCw size={20} />
              </button>
            </>
          )}

          {/* 360° View Toggle */}
          {has360View && (
            <button
              onClick={() => {
                setIs360Mode(!is360Mode)
                handleResetZoom()
                setRotation360(0)
              }}
              className={cn(
                'p-2 rounded-lg transition flex items-center gap-2 px-3',
                is360Mode
                  ? 'bg-alumimundo-teal text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              )}
              title="Toggle 360° view"
            >
              <Rotate3d size={20} />
              <span className="text-sm">360°</span>
            </button>
          )}

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className={cn(
              'p-2 rounded-lg transition',
              'bg-white/10 hover:bg-white/20',
              'text-white'
            )}
            title="Fullscreen (F)"
          >
            <Maximize2 size={20} />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className={cn(
              'p-2 rounded-lg transition',
              'bg-white/10 hover:bg-white/20',
              'text-white'
            )}
            title="Close (Esc)"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Image Area */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <div
          ref={imageRef}
          className={cn(
            'relative w-full h-full flex items-center justify-center',
            (zoomLevel > 1 && !is360Mode) && 'cursor-move',
            is360Mode && 'cursor-ew-resize'
          )}
          onMouseDown={is360Mode ? handle360MouseDown : handleMouseDown}
          onMouseMove={is360Mode ? handle360Drag : handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="relative max-w-full max-h-full"
            style={{
              transform: is360Mode
                ? `rotateY(${rotation360}deg)`
                : `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              transformStyle: 'preserve-3d'
            }}
          >
            <Image
              src={images[currentIndex]}
              alt={`${productName} - Image ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-[calc(100vh-200px)] w-auto h-auto object-contain"
              draggable={false}
              priority
            />
          </div>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && !is360Mode && (
          <>
            <button
              onClick={handlePrevious}
              className={cn(
                'absolute left-4 top-1/2 -translate-y-1/2',
                'p-3 rounded-full transition',
                'bg-white/10 hover:bg-white/20 backdrop-blur-sm',
                'text-white'
              )}
              title="Previous (←)"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={handleNext}
              className={cn(
                'absolute right-4 top-1/2 -translate-y-1/2',
                'p-3 rounded-full transition',
                'bg-white/10 hover:bg-white/20 backdrop-blur-sm',
                'text-white'
              )}
              title="Next (→)"
            >
              <ChevronRight size={32} />
            </button>
          </>
        )}

        {/* 360° Mode Indicator */}
        {is360Mode && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-sm">
            <p className="text-white text-sm flex items-center gap-2">
              <Rotate3d size={16} />
              Arrastra horizontalmente para rotar • {Math.round(rotation360)}°
            </p>
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="p-4 bg-black/50 backdrop-blur-sm">
          <div className="flex gap-2 justify-center overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  handleResetZoom()
                }}
                className={cn(
                  'relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition',
                  'border-2',
                  currentIndex === index
                    ? 'border-alumimundo-teal'
                    : 'border-transparent hover:border-white/50'
                )}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
        <p>← → Navigate • +/- Zoom • 0 Reset • Esc Close</p>
      </div>
    </div>
  )
}
