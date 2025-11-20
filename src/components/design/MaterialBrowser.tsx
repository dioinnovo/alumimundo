'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Plus, Check, X, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { productsDatabase, type Product } from '@/lib/products-data'

interface SelectedProduct {
  product: Product
  quantity: number
  notes?: string
}

interface MaterialBrowserProps {
  areaId: string
  areaType: string
  onProductsChange?: (products: SelectedProduct[]) => void
  selectedProducts?: SelectedProduct[]
}

export function MaterialBrowser({
  areaId,
  areaType,
  onProductsChange,
  selectedProducts = []
}: MaterialBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [localSelected, setLocalSelected] = useState<SelectedProduct[]>(selectedProducts)

  // Get relevant categories based on area type
  const getRelevantCategories = () => {
    switch (areaType.toLowerCase()) {
      case 'kitchen':
        return ['Grifería', 'Lavamanos', 'Plomería Comercial']
      case 'bathroom':
      case 'master_bathroom':
      case 'guest_bathroom':
        return ['Grifería', 'Lavamanos', 'Inodoros', 'Duchas', 'Accesorios']
      case 'entrance':
      case 'bedroom':
      case 'master_bedroom':
        return ['Cerraduras', 'Herrajes', 'Puertas']
      case 'living_room':
      case 'dining_room':
      case 'office':
        return ['Pisos', 'Alfombras', 'Persianas', 'Iluminación']
      default:
        return []
    }
  }

  const relevantCategories = getRelevantCategories()

  // Filter products
  const filteredProducts = productsDatabase.filter((product) => {
    const matchesSearch =
      searchTerm === '' ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory

    const matchesBrand =
      selectedBrand === 'all' || product.brand === selectedBrand

    const isRelevant =
      relevantCategories.length === 0 ||
      relevantCategories.includes(product.category)

    return matchesSearch && matchesCategory && matchesBrand && isRelevant
  })

  const categories = ['all', ...new Set(productsDatabase.map((p) => p.category))]
  const brands = ['all', ...new Set(productsDatabase.map((p) => p.brand))]

  const isProductSelected = (sku: string) => {
    return localSelected.some((s) => s.product.sku === sku)
  }

  const toggleProduct = (product: Product) => {
    const exists = localSelected.find((s) => s.product.sku === product.sku)

    if (exists) {
      const updated = localSelected.filter((s) => s.product.sku !== product.sku)
      setLocalSelected(updated)
      onProductsChange?.(updated)
    } else {
      const newSelection: SelectedProduct = {
        product,
        quantity: 1
      }
      const updated = [...localSelected, newSelection]
      setLocalSelected(updated)
      onProductsChange?.(updated)
    }
  }

  const updateQuantity = (sku: string, quantity: number) => {
    const updated = localSelected.map((s) =>
      s.product.sku === sku ? { ...s, quantity: Math.max(1, quantity) } : s
    )
    setLocalSelected(updated)
    onProductsChange?.(updated)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getTotalCost = () => {
    return localSelected.reduce((sum, item) => {
      const price = item.product.price || item.product.priceRange?.min || 0
      return sum + price * item.quantity
    }, 0)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-alumimundo-navy mb-1">
          Catálogo de Materiales
        </h3>
        <p className="text-sm text-gray-600">
          Selecciona productos para tu especificación
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-2 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-alumimundo-navy focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-alumimundo-navy focus:border-transparent"
          >
            <option value="all">Todas las Categorías</option>
            {categories
              .filter((c) => c !== 'all')
              .map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-alumimundo-navy focus:border-transparent"
          >
            <option value="all">Todas las Marcas</option>
            {brands
              .filter((b) => b !== 'all')
              .map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Selected Products Summary */}
      {localSelected.length > 0 && (
        <Card className="p-3 mb-4 bg-alumimundo-navy/5 border-alumimundo-navy">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-alumimundo-navy" />
              <span className="text-sm font-medium text-alumimundo-navy">
                {localSelected.length} producto{localSelected.length !== 1 ? 's' : ''} seleccionado{localSelected.length !== 1 ? 's' : ''}
              </span>
            </div>
            <span className="text-sm font-semibold text-alumimundo-navy">
              {formatPrice(getTotalCost())}
            </span>
          </div>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {localSelected.map((item) => (
              <div
                key={item.product.sku}
                className="flex items-center justify-between text-xs bg-white rounded p-2"
              >
                <span className="flex-1 truncate">{item.product.name}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product.sku, parseInt(e.target.value) || 1)}
                    className="w-12 px-1 py-0.5 border rounded text-center"
                  />
                  <button
                    onClick={() => toggleProduct(item.product)}
                    className="text-red-600 hover:text-red-700"
                    aria-label="Remove product"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Filter className="w-16 h-16 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No se encontraron productos</p>
            <p className="text-xs mt-1">Intenta ajustar los filtros</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filteredProducts.slice(0, 20).map((product) => {
                const selected = isProductSelected(product.sku)

                return (
                  <motion.div
                    key={product.sku}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Card
                      className={`p-3 cursor-pointer transition-all ${
                        selected
                          ? 'border-2 border-alumimundo-navy bg-alumimundo-navy/5'
                          : 'border hover:border-alumimundo-navy/50'
                      }`}
                      onClick={() => toggleProduct(product)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <span className="text-2xl">{product.category === 'Grifería' ? '🚰' : product.category === 'Cerraduras' ? '🔒' : product.category === 'Pisos' ? '⬜' : '🏠'}</span>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-gray-900 truncate">
                                {product.name}
                              </h4>
                              <p className="text-xs text-gray-600 mb-1">
                                {product.brand} • {product.category}
                              </p>
                              {product.description && (
                                <p className="text-xs text-gray-500 line-clamp-2">
                                  {product.description}
                                </p>
                              )}
                            </div>
                            <div className="flex-shrink-0">
                              {selected ? (
                                <div className="w-6 h-6 bg-alumimundo-navy rounded-full flex items-center justify-center">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                              )}
                            </div>
                          </div>

                          {/* Price & Stock */}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-semibold text-alumimundo-navy">
                              {product.priceCRC ? formatPrice(product.priceCRC) : 'Precio a consultar'}
                            </span>
                            {product.stock !== undefined && (
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  product.stock > 10
                                    ? 'bg-green-100 text-green-700'
                                    : product.stock > 0
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
