'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Home,
  Search,
  Package,
  FileText,
  Camera,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Users,
  Sun,
  Moon,
  Database
} from 'lucide-react'
import Image from 'next/image'
import { useTheme } from 'next-themes'

interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export default function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])
  
  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      description: 'Resumen y KPIs'
    },
    {
      title: 'Catálogo IA',
      icon: Search,
      href: '/dashboard/catalogo',
      description: 'Consultor inteligente de productos'
    },
    {
      title: 'Diseño IA',
      icon: Briefcase,
      href: '/dashboard/diseno',
      description: 'Especificación inteligente de proyectos'
    },
    {
      title: 'Inventario',
      icon: Package,
      href: '/dashboard/inventario',
      description: 'Inteligencia de inventario'
    },
    {
      title: 'Documentación',
      icon: FileText,
      href: '/dashboard/documentation',
      description: 'Documentos automatizados'
    },
    {
      title: 'Control de Calidad',
      icon: Camera,
      href: '/dashboard/quality',
      description: 'Validación de instalación'
    },
    {
      title: 'ALMA',
      icon: Database,
      href: '/dashboard/analytics',
      description: 'Analista de datos con IA'
    },
    {
      title: 'Reportes',
      icon: BarChart3,
      href: '/dashboard/reports',
      description: 'Analítica y reportes'
    }
  ]

  return (
    <aside
      className={`
        bg-slate-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 h-full transition-all duration-300 flex flex-col rounded-2xl shadow-lg shadow-gray-400/30 dark:shadow-gray-800/30 ring-2 ring-white dark:ring-gray-800
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            {isCollapsed ? (
              <div className="w-10 h-10 bg-alumimundo-navy rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
            ) : (
              <div className="bg-alumimundo-navy dark:bg-transparent px-4 py-3 rounded-lg">
                <Image
                  src="/images/alumimundo_logo.png"
                  alt="Alumimundo"
                  width={360}
                  height={100}
                  className="w-auto h-auto max-w-[180px]"
                  priority
                />
              </div>
            )}
          </Link>
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition cursor-pointer"
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = item.href === '/dashboard' 
              ? pathname === '/dashboard'
              : pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                    ${isCollapsed ? 'justify-center' : ''}
                    ${isActive
                      ? 'bg-alumimundo-teal text-white shadow-lg'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                    }
                  `}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      {item.description && (
                        <div className="text-xs opacity-75">{item.description}</div>
                      )}
                    </div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {/* Theme Toggle */}
        {mounted && (
          <div className={`mb-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              title={isCollapsed ? `Switch to ${theme === 'light' ? 'dark' : 'light'} mode` : undefined}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              {!isCollapsed && (
                <span className="text-sm font-medium">
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Company Info */}
        {!isCollapsed ? (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p className="font-semibold mb-1">ALUMIMUNDO S.A.</p>
            <p>40 años liderando la industria</p>
            <p className="mt-2">© 2024 Alumimundo</p>
          </div>
        ) : (
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p>© '24</p>
          </div>
        )}
      </div>
    </aside>
  )
}