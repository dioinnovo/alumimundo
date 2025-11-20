'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Download, Share2, FileText, CheckCircle, ArrowLeft, Mail,
  Printer, Edit
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { generateSimpleDesignReport } from '@/lib/pdf/design-report-generator'
import type { DesignReportData } from '@/lib/pdf/design-report-generator'

export default function ReportPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params)
  const router = useRouter()
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(true)
  const [showShareModal, setShowShareModal] = useState(false)
  const [email, setEmail] = useState('')

  // Mock data - will be replaced with real database queries
  const reportData: DesignReportData = {
    projectName: 'Casa Moderna - Escazú',
    projectType: 'Residencial',
    location: 'Escazú, San José',
    clientName: 'Cliente Demo',
    createdDate: new Date().toLocaleDateString('es-CR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
    totalCost: 7500000,
    areas: [
      {
        areaName: 'Cocina Principal',
        areaType: 'Cocina',
        estimatedCost: 2500000,
        productCount: 5,
        products: [
          {
            name: 'KOHLER Simplice Grifería de Cocina',
            brand: 'KOHLER',
            sku: 'KOHLER-K-596-VS',
            quantity: 1,
            unitPrice: 450000,
            totalPrice: 450000
          },
          {
            name: 'KOHLER Prolific Fregadero',
            brand: 'KOHLER',
            sku: 'KOHLER-K-5540-NA',
            quantity: 1,
            unitPrice: 850000,
            totalPrice: 850000
          },
          {
            name: 'KOHLER Vault Fregadero Auxiliar',
            brand: 'KOHLER',
            sku: 'KOHLER-K-3820-NA',
            quantity: 1,
            unitPrice: 620000,
            totalPrice: 620000
          },
          {
            name: 'Schlage Connect Cerradura Inteligente',
            brand: 'Schlage',
            sku: 'SCHLAGE-BE469-CAM',
            quantity: 1,
            unitPrice: 380000,
            totalPrice: 380000
          },
          {
            name: 'KOHLER Artifacts Dispensador de Jabón',
            brand: 'KOHLER',
            sku: 'KOHLER-K-99270-VS',
            quantity: 1,
            unitPrice: 200000,
            totalPrice: 200000
          }
        ],
        userRequirements: 'Necesito grifería moderna y fregadero de acero inoxidable con estilo contemporáneo'
      },
      {
        areaName: 'Baño Principal',
        areaType: 'Baño',
        estimatedCost: 3200000,
        productCount: 7,
        products: [
          {
            name: 'KOHLER Purist Grifería de Lavamanos',
            brand: 'KOHLER',
            sku: 'KOHLER-K-14406-4-CP',
            quantity: 2,
            unitPrice: 380000,
            totalPrice: 760000
          },
          {
            name: 'KOHLER Memoirs Lavamanos',
            brand: 'KOHLER',
            sku: 'KOHLER-K-5026-0',
            quantity: 2,
            unitPrice: 520000,
            totalPrice: 1040000
          },
          {
            name: 'KOHLER Artifacts Ducha de Lluvia',
            brand: 'KOHLER',
            sku: 'KOHLER-K-72583-CP',
            quantity: 1,
            unitPrice: 680000,
            totalPrice: 680000
          },
          {
            name: 'KOHLER San Souci Inodoro',
            brand: 'KOHLER',
            sku: 'KOHLER-K-4000-0',
            quantity: 1,
            unitPrice: 420000,
            totalPrice: 420000
          },
          {
            name: 'KOHLER Artifacts Barra Porta Toalla',
            brand: 'KOHLER',
            sku: 'KOHLER-K-72571-CP',
            quantity: 2,
            unitPrice: 150000,
            totalPrice: 300000
          }
        ],
        userRequirements: 'Quiero un baño moderno con ducha de lluvia y doble lavamanos de estilo clásico contemporáneo'
      },
      {
        areaName: 'Sala',
        areaType: 'Sala',
        estimatedCost: 1800000,
        productCount: 3,
        products: [
          {
            name: 'Tarkett Pisos de Roble Natural',
            brand: 'Tarkett',
            sku: 'TARKETT-OAK-NATURAL',
            quantity: 45,
            unitPrice: 35000,
            totalPrice: 1575000
          },
          {
            name: 'Schlage Latitude Cerradura Pasillo',
            brand: 'Schlage',
            sku: 'SCHLAGE-F170-LAT',
            quantity: 1,
            unitPrice: 125000,
            totalPrice: 125000
          },
          {
            name: 'Schlage Addison Herraje Decorativo',
            brand: 'Schlage',
            sku: 'SCHLAGE-F170-ADD',
            quantity: 1,
            unitPrice: 100000,
            totalPrice: 100000
          }
        ],
        userRequirements: 'Necesito pisos de madera de alta calidad y herrajes modernos para puertas interiores'
      }
    ],
    compliance: {
      passed: true,
      notes: [
        'Cumple con códigos de construcción de Costa Rica',
        'Productos apropiados para clima costero',
        'Certificaciones WaterSense y ADA verificadas',
        'Stock disponible para todos los productos'
      ]
    }
  }

  useEffect(() => {
    generateReport()
  }, [])

  const generateReport = async () => {
    setIsGenerating(true)
    try {
      const blob = await generateSimpleDesignReport(reportData)
      setPdfBlob(blob)

      // Create URL for preview
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error al generar el reporte PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!pdfBlob) return

    const url = URL.createObjectURL(pdfBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Alumimundo_${reportData.projectName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    if (!pdfUrl) return
    window.open(pdfUrl, '_blank')
  }

  const handleShare = async () => {
    if (!email.trim()) {
      alert('Por favor ingresa un correo electrónico')
      return
    }

    // TODO: Implement email sending via API
    console.log('Sharing report to:', email)
    alert(`Reporte enviado a ${email}`)
    setShowShareModal(false)
    setEmail('')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-alumimundo-navy/10 dark:bg-alumimundo-navy/20 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-alumimundo-navy dark:text-alumimundo-teal" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Reporte Generado
            </h1>
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Tu especificación de proyecto está lista para descargar y compartir
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900 mb-1">
                  ¡Especificación Completada!
                </h3>
                <p className="text-sm text-green-700">
                  Tu reporte profesional ha sido generado exitosamente y está listo para ser compartido con tu cliente.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Project Summary Card */}
        <Card className="p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{reportData.projectName}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>{reportData.projectType}</span>
                <span>•</span>
                <span>{reportData.location}</span>
                <span>•</span>
                <span>{reportData.createdDate}</span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/diseno/${projectId}/review`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-alumimundo-navy/5 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Inversión Total</p>
              <p className="text-3xl font-bold text-alumimundo-navy">
                {formatCurrency(reportData.totalCost)}
              </p>
            </div>
            <div className="p-4 bg-alumimundo-teal/5 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Áreas Especificadas</p>
              <p className="text-3xl font-bold text-alumimundo-teal">{reportData.areas.length}</p>
            </div>
            <div className="p-4 bg-alumimundo-magenta/5 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Productos Totales</p>
              <p className="text-3xl font-bold text-alumimundo-magenta">
                {reportData.areas.reduce((sum, a) => sum + a.productCount, 0)}
              </p>
            </div>
          </div>
        </Card>

        {/* PDF Preview and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* PDF Preview */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa del Reporte</h3>
              {isGenerating ? (
                <div className="aspect-[8.5/11] bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-alumimundo-navy border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-gray-600">Generando reporte PDF...</p>
                  </div>
                </div>
              ) : pdfUrl ? (
                <div className="aspect-[8.5/11] bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    src={pdfUrl}
                    className="w-full h-full"
                    title="Vista previa del reporte PDF"
                  />
                </div>
              ) : (
                <div className="aspect-[8.5/11] bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Error al cargar la vista previa</p>
                </div>
              )}
            </Card>
          </div>

          {/* Actions Panel */}
          <div className="space-y-4">
            {/* Download */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-alumimundo-navy/10 rounded-lg flex items-center justify-center">
                  <Download className="w-5 h-5 text-alumimundo-navy" />
                </div>
                <h4 className="font-semibold text-gray-900">Descargar</h4>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Descarga el reporte PDF para guardarlo localmente o enviarlo por correo.
              </p>
              <Button
                onClick={handleDownload}
                disabled={!pdfBlob}
                className="w-full bg-alumimundo-navy hover:bg-alumimundo-navy/90 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
            </Card>

            {/* Print */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-alumimundo-teal/10 rounded-lg flex items-center justify-center">
                  <Printer className="w-5 h-5 text-alumimundo-teal" />
                </div>
                <h4 className="font-semibold text-gray-900">Imprimir</h4>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Abre el reporte en una nueva pestaña para imprimirlo.
              </p>
              <Button
                onClick={handlePrint}
                disabled={!pdfUrl}
                variant="outline"
                className="w-full border-alumimundo-teal text-alumimundo-teal hover:bg-alumimundo-teal/10"
              >
                <Printer className="w-4 h-4 mr-2" />
                Abrir para Imprimir
              </Button>
            </Card>

            {/* Share */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-alumimundo-magenta/10 rounded-lg flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-alumimundo-magenta" />
                </div>
                <h4 className="font-semibold text-gray-900">Compartir</h4>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Envía el reporte directamente por correo electrónico.
              </p>
              <Button
                onClick={() => setShowShareModal(true)}
                variant="outline"
                className="w-full border-alumimundo-magenta text-alumimundo-magenta hover:bg-alumimundo-magenta/10"
              >
                <Mail className="w-4 h-4 mr-2" />
                Enviar por Correo
              </Button>
            </Card>

            {/* Back to Dashboard */}
            <Button
              onClick={() => router.push('/dashboard/diseno')}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Proyectos
            </Button>
          </div>
        </div>

        {/* Report Contents Preview */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contenido del Reporte</h3>
          <div className="space-y-3">
            {[
              { label: 'Portada del Proyecto', icon: FileText },
              { label: 'Resumen Ejecutivo', icon: FileText },
              { label: 'Especificaciones por Área', icon: FileText },
              { label: 'Listado de Productos', icon: FileText },
              { label: 'Desglose de Costos', icon: FileText },
              { label: 'Validación de Cumplimiento', icon: CheckCircle }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <item.icon className="w-5 h-5 text-alumimundo-navy" />
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Compartir Reporte</h3>
            <p className="text-sm text-gray-600 mb-4">
              Ingresa el correo electrónico del destinatario para enviar este reporte.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-alumimundo-navy focus:border-transparent"
            />
            <div className="flex gap-3">
              <Button
                onClick={handleShare}
                className="flex-1 bg-alumimundo-navy hover:bg-alumimundo-navy/90 text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Enviar
              </Button>
              <Button
                onClick={() => {
                  setShowShareModal(false)
                  setEmail('')
                }}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
