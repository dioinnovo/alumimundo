import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-alumimundo-navy via-alumimundo-teal to-alumimundo-charcoal p-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Alumimundo Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/alumimundo_logo.png"
            alt="Alumimundo"
            width={400}
            height={100}
            className="w-auto h-auto max-w-[300px] sm:max-w-[400px]"
            priority
          />
        </div>

        {/* Hero Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
            Plataforma de IA para<br />
            <span className="text-alumimundo-light">Especificación de Construcción</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-200 max-w-2xl mx-auto">
            Transformando 40 años de excelencia en acabados de construcción con inteligencia artificial
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-alumimundo-navy rounded-full text-lg font-semibold hover:bg-alumimundo-light transition-all shadow-2xl hover:shadow-alumimundo-teal/50 hover:scale-105 transform"
          >
            Acceder a la Plataforma
            <ArrowRight size={24} />
          </Link>
        </div>

        {/* Footer Credit */}
        <div className="pt-16 space-y-2">
          <p className="text-sm text-gray-300">
            Desarrollado exclusivamente para Alumimundo por
          </p>
          <p className="text-lg font-semibold text-white">
            Innovoco
          </p>
          <p className="text-xs text-gray-400">
            Innovación en Soluciones Tecnológicas
          </p>
        </div>
      </div>
    </div>
  )
}