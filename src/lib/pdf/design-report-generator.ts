import { generate } from '@pdfme/generator'
import { Template, Font } from '@pdfme/common'

export interface AreaSpec {
  areaName: string
  areaType: string
  estimatedCost: number
  productCount: number
  products: Array<{
    name: string
    brand: string
    sku: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  userRequirements?: string
}

export interface DesignReportData {
  projectName: string
  projectType: string
  location: string
  clientName?: string
  createdDate: string
  totalCost: number
  areas: AreaSpec[]
  compliance: {
    passed: boolean
    notes: string[]
  }
}

export async function generateDesignReport(data: DesignReportData): Promise<Uint8Array> {
  // Define the template for the design report
  const template: Template = {
    basePdf: await createBasePDF(),
    schemas: [
      // Cover Page
      {
        // Logo/Header
        projectTitle: {
          type: 'text',
          position: { x: 20, y: 40 },
          width: 170,
          height: 20,
          fontSize: 24,
          fontColor: '#082B61', // alumimundo-navy
          fontName: 'Helvetica',
          alignment: 'left'
        },
        projectSubtitle: {
          type: 'text',
          position: { x: 20, y: 65 },
          width: 170,
          height: 10,
          fontSize: 14,
          fontColor: '#276770', // alumimundo-teal
          fontName: 'Helvetica',
          alignment: 'left'
        },
        generatedDate: {
          type: 'text',
          position: { x: 20, y: 80 },
          width: 170,
          height: 8,
          fontSize: 10,
          fontColor: '#69727D',
          fontName: 'Helvetica',
          alignment: 'left'
        },
        totalCost: {
          type: 'text',
          position: { x: 20, y: 120 },
          width: 170,
          height: 25,
          fontSize: 32,
          fontColor: '#082B61',
          fontName: 'Helvetica-Bold',
          alignment: 'left'
        },
        costLabel: {
          type: 'text',
          position: { x: 20, y: 145 },
          width: 170,
          height: 8,
          fontSize: 12,
          fontColor: '#69727D',
          fontName: 'Helvetica',
          alignment: 'left'
        }
      }
    ]
  }

  // Prepare input data
  const inputs = [
    {
      projectTitle: data.projectName,
      projectSubtitle: `${data.projectType} • ${data.location}`,
      generatedDate: `Generado: ${data.createdDate}`,
      totalCost: formatCurrency(data.totalCost),
      costLabel: 'Inversión Total Estimada'
    }
  ]

  // Generate the PDF
  const pdf = await generate({
    template,
    inputs,
    options: {
      font: await getCustomFonts()
    }
  })

  return pdf
}

async function createBasePDF(): Promise<string> {
  // For now, return a blank PDF base64
  // In production, you'd have an Alumimundo-branded template
  return 'data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgNjEyIDc5MiBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooQWx1bWltdW5kbyBBSSBQbGF0Zm9ybSkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G'
}

async function getCustomFonts(): Promise<Font> {
  // Return default fonts for now
  // In production, you'd load Fivo Sans or Alumimundo's custom fonts
  return {
    'Helvetica': {
      data: '',
      fallback: true
    },
    'Helvetica-Bold': {
      data: '',
      fallback: true
    }
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0
  }).format(amount)
}

// Alternative: Simple PDF generation using jsPDF (more straightforward)
export async function generateSimpleDesignReport(data: DesignReportData): Promise<Blob> {
  // Import jsPDF dynamically to avoid SSR issues
  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF()
  let yPos = 20

  // Helper function to add text
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')
    doc.text(text, 20, yPos)
    yPos += fontSize / 2 + 2
  }

  const addLine = () => {
    doc.setDrawColor(200, 200, 200)
    doc.line(20, yPos, 190, yPos)
    yPos += 10
  }

  // Header with Alumimundo branding
  doc.setFillColor(8, 43, 97) // alumimundo-navy
  doc.rect(0, 0, 210, 40, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('ALUMIMUNDO', 20, 20)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Especificación de Proyecto', 20, 30)

  // Reset colors
  doc.setTextColor(0, 0, 0)
  yPos = 50

  // Project Information
  addText(data.projectName, 18, true)
  addText(`${data.projectType} • ${data.location}`, 11)
  addText(`Fecha: ${data.createdDate}`, 10)
  if (data.clientName) {
    addText(`Cliente: ${data.clientName}`, 10)
  }

  yPos += 5
  addLine()

  // Executive Summary
  addText('RESUMEN EJECUTIVO', 14, true)
  yPos += 3

  doc.setFillColor(8, 43, 97, 0.1)
  doc.rect(20, yPos, 170, 25, 'F')

  yPos += 8
  doc.setFontSize(10)
  doc.text(`Total de Áreas: ${data.areas.length}`, 25, yPos)
  yPos += 6
  doc.text(`Total de Productos: ${data.areas.reduce((sum, a) => sum + a.productCount, 0)}`, 25, yPos)
  yPos += 6

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(8, 43, 97)
  doc.text(`INVERSIÓN TOTAL: ${formatCurrency(data.totalCost)}`, 25, yPos)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')

  yPos += 15

  // Area Specifications
  data.areas.forEach((area, index) => {
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }

    addLine()
    addText(`${index + 1}. ${area.areaName}`, 13, true)
    addText(`Tipo: ${area.areaType}`, 10)

    if (area.userRequirements) {
      doc.setTextColor(39, 103, 112) // alumimundo-teal
      doc.setFontSize(9)
      doc.setFont('helvetica', 'italic')
      const reqText = doc.splitTextToSize(`"${area.userRequirements}"`, 160)
      doc.text(reqText, 25, yPos)
      yPos += reqText.length * 5
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
    }

    yPos += 5
    addText(`Costo Estimado: ${formatCurrency(area.estimatedCost)}`, 11, true)
    yPos += 3

    // Products
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Productos Especificados:', 25, yPos)
    yPos += 6
    doc.setFont('helvetica', 'normal')

    area.products.forEach((product) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(9)
      doc.text(`• ${product.name}`, 30, yPos)
      yPos += 5
      doc.setTextColor(100, 100, 100)
      doc.text(`  ${product.brand} | SKU: ${product.sku}`, 32, yPos)
      yPos += 5
      doc.text(`  Cantidad: ${product.quantity} | Precio: ${formatCurrency(product.unitPrice)} | Total: ${formatCurrency(product.totalPrice)}`, 32, yPos)
      doc.setTextColor(0, 0, 0)
      yPos += 7
    })

    yPos += 5
  })

  // Compliance Section
  if (yPos > 220) {
    doc.addPage()
    yPos = 20
  }

  addLine()
  addText('VALIDACIÓN DE CUMPLIMIENTO', 14, true)
  yPos += 3

  doc.setFillColor(data.compliance.passed ? 34 : 220, data.compliance.passed ? 197 : 53, data.compliance.passed ? 94 : 69, 0.1)
  doc.rect(20, yPos, 170, 8 + (data.compliance.notes.length * 6), 'F')

  yPos += 6
  doc.setFontSize(10)
  doc.setTextColor(data.compliance.passed ? 22 : 185, data.compliance.passed ? 163 : 28, data.compliance.passed ? 74 : 28)
  doc.text(data.compliance.passed ? '✓ CUMPLE CON NORMATIVAS' : '⚠ REQUIERE REVISIÓN', 25, yPos)
  doc.setTextColor(0, 0, 0)
  yPos += 7

  doc.setFontSize(9)
  data.compliance.notes.forEach(note => {
    doc.text(`• ${note}`, 25, yPos)
    yPos += 6
  })

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Alumimundo S.A. | Especificación generada con IA | Página ${i} de ${pageCount}`,
      105,
      285,
      { align: 'center' }
    )
  }

  return doc.output('blob')
}
