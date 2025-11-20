import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Página no encontrada
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          La página que buscas no existe o ha sido movida.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-alumimundo-teal text-white rounded-lg hover:bg-alumimundo-teal/90 transition"
          >
            Ir al inicio
          </Link>

          <Link
            href="/dashboard"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Ir al dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
