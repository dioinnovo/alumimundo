import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import DisableGrammarly from '@/components/DisableGrammarly'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'Alumimundo AI Platform',
  description: 'Plataforma de IA para especificación de acabados de construcción - Costa Rica',
  keywords: 'construcción, acabados, KOHLER, especificación, IA, arquitectura, diseño, Costa Rica, inventario inteligente',
  authors: [{ name: 'Alumimundo S.A.' }],
  icons: {
    icon: '/images/alumimundo_favicon.png',
    shortcut: '/images/alumimundo_favicon.png',
    apple: '/images/alumimundo_favicon.png',
  },
  openGraph: {
    title: 'Alumimundo AI Platform - Transforme su especificación con IA',
    description: '40 años liderando la industria en acabados de construcción. La primera plataforma de IA para especificación de productos en Centroamérica.',
    type: 'website',
    locale: 'es_CR',
    siteName: 'Alumimundo AI Platform',
    images: [
      {
        url: '/images/alumimundo_logo.png',
        width: 1024,
        height: 576,
        alt: 'Alumimundo Logo',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DisableGrammarly />
          {children}
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}