'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProjectsRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the design workflow
    router.replace('/dashboard/diseno')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-alumimundo-navy border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Redirigiendo a Diseño IA...</p>
      </div>
    </div>
  )
}
