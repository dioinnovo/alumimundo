'use client'

import { X, Check, Minus, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { designTokens, cn } from '@/lib/design-tokens'
import Image from 'next/image'
import type { Product } from '@/lib/products-data'

interface ProductComparisonProps {
  products: Product[]
  onClose: () => void
  onRemoveProduct: (productId: string) => void
  onAddToSpec: (product: Product) => void
}

export default function ProductComparison({
  products,
  onClose,
  onRemoveProduct,
  onAddToSpec
}: ProductComparisonProps) {
  if (products.length === 0) return null

  const formatPrice = (product: Product) => {
    if (product.price) {
      return `${product.currency} ${product.price.toLocaleString()}`
    }
    if (product.priceRange) {
      return `${product.currency} ${product.priceRange.min.toLocaleString()} - ${product.priceRange.max.toLocaleString()}`
    }
    return 'Consultar precio'
  }

  // Gather all unique attributes across all products
  const allCategories = Array.from(new Set(products.map(p => p.category)))
  const allBrands = Array.from(new Set(products.map(p => p.brand)))
  const allCertifications = Array.from(
    new Set(products.flatMap(p => p.specifications?.certifications || []))
  )
  const allFeatures = Array.from(
    new Set(products.flatMap(p => p.specifications?.features || []))
  )

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={cn('p-4 border-b flex items-center justify-between', designTokens.borders.divider)}>
          <div>
            <h2 className={cn('text-xl font-bold', designTokens.text.primary)}>
              Comparación de Productos
            </h2>
            <p className={cn('text-sm mt-1', designTokens.text.secondary)}>
              {products.length} productos seleccionados
            </p>
          </div>
          <button
            onClick={onClose}
            className={cn(
              'p-2 rounded-lg transition',
              'hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <X size={20} />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className={cn('sticky top-0 z-10', designTokens.backgrounds.card)}>
              <tr>
                <th className={cn('p-4 text-left border-r', designTokens.borders.divider, designTokens.text.secondary)}>
                  Características
                </th>
                {products.map((product) => (
                  <th key={product.id} className={cn('p-4 border-r', designTokens.borders.divider)}>
                    <div className="space-y-3">
                      {/* Product Image */}
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.nameEs || product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <AlertCircle size={32} className="text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Name */}
                      <div>
                        <p className={cn('font-bold text-sm', designTokens.text.primary)}>
                          {product.nameEs || product.name}
                        </p>
                        <p className={cn('text-xs mt-1', designTokens.text.secondary)}>
                          {product.brand}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveProduct(product.id)}
                        className={cn(
                          'w-full text-xs px-3 py-1.5 rounded-lg transition',
                          'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
                          'hover:bg-red-100 dark:hover:bg-red-900/30'
                        )}
                      >
                        Remover
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Price Row */}
              <tr className={cn('border-t', designTokens.borders.divider)}>
                <td className={cn('p-4 font-semibold border-r', designTokens.borders.divider, designTokens.text.primary)}>
                  Precio
                </td>
                {products.map((product) => (
                  <td key={product.id} className={cn('p-4 text-center border-r', designTokens.borders.divider)}>
                    <span className="text-lg font-bold text-alumimundo-teal">
                      {formatPrice(product)}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Category Row */}
              <tr className={cn('border-t', designTokens.borders.divider, designTokens.backgrounds.cardSecondary)}>
                <td className={cn('p-4 font-semibold border-r', designTokens.borders.divider, designTokens.text.primary)}>
                  Categoría
                </td>
                {products.map((product) => (
                  <td key={product.id} className={cn('p-4 text-center border-r', designTokens.borders.divider, designTokens.text.primary)}>
                    {product.category}
                  </td>
                ))}
              </tr>

              {/* Material Row */}
              {products.some(p => p.specifications?.material) && (
                <tr className={cn('border-t', designTokens.borders.divider)}>
                  <td className={cn('p-4 font-semibold border-r', designTokens.borders.divider, designTokens.text.primary)}>
                    Material
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className={cn('p-4 text-center border-r', designTokens.borders.divider, designTokens.text.primary)}>
                      {product.specifications?.material || <Minus size={16} className="mx-auto text-gray-400" />}
                    </td>
                  ))}
                </tr>
              )}

              {/* Finish Row */}
              {products.some(p => p.specifications?.finishes) && (
                <tr className={cn('border-t', designTokens.borders.divider, designTokens.backgrounds.cardSecondary)}>
                  <td className={cn('p-4 font-semibold border-r', designTokens.borders.divider, designTokens.text.primary)}>
                    Acabado
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className={cn('p-4 text-center border-r', designTokens.borders.divider, designTokens.text.primary)}>
                      {product.specifications?.finishes?.join(', ') || <Minus size={16} className="mx-auto text-gray-400" />}
                    </td>
                  ))}
                </tr>
              )}

              {/* Dimensions Row */}
              {products.some(p => p.specifications?.dimensions) && (
                <tr className={cn('border-t', designTokens.borders.divider)}>
                  <td className={cn('p-4 font-semibold border-r', designTokens.borders.divider, designTokens.text.primary)}>
                    Dimensiones
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className={cn('p-4 text-center border-r', designTokens.borders.divider, designTokens.text.primary)}>
                      {product.specifications?.dimensions || <Minus size={16} className="mx-auto text-gray-400" />}
                    </td>
                  ))}
                </tr>
              )}

              {/* Warranty Row */}
              {products.some(p => p.specifications?.warranty) && (
                <tr className={cn('border-t', designTokens.borders.divider, designTokens.backgrounds.cardSecondary)}>
                  <td className={cn('p-4 font-semibold border-r', designTokens.borders.divider, designTokens.text.primary)}>
                    Garantía
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className={cn('p-4 text-center border-r', designTokens.borders.divider, designTokens.text.primary)}>
                      {product.specifications?.warranty || <Minus size={16} className="mx-auto text-gray-400" />}
                    </td>
                  ))}
                </tr>
              )}

              {/* Certifications Section */}
              {allCertifications.length > 0 && (
                <>
                  <tr className={cn('border-t', designTokens.borders.divider)}>
                    <td colSpan={products.length + 1} className={cn('p-4 font-bold bg-gray-50 dark:bg-gray-800/50', designTokens.text.primary)}>
                      Certificaciones
                    </td>
                  </tr>
                  {allCertifications.map((cert, idx) => (
                    <tr key={cert} className={cn('border-t', designTokens.borders.divider, idx % 2 === 0 ? designTokens.backgrounds.cardSecondary : '')}>
                      <td className={cn('p-4 border-r', designTokens.borders.divider, designTokens.text.secondary)}>
                        {cert}
                      </td>
                      {products.map((product) => (
                        <td key={product.id} className={cn('p-4 text-center border-r', designTokens.borders.divider)}>
                          {product.specifications?.certifications?.includes(cert) ? (
                            <Check size={20} className="mx-auto text-green-600 dark:text-green-400" />
                          ) : (
                            <Minus size={16} className="mx-auto text-gray-400" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              )}

              {/* Features Section */}
              {allFeatures.length > 0 && (
                <>
                  <tr className={cn('border-t', designTokens.borders.divider)}>
                    <td colSpan={products.length + 1} className={cn('p-4 font-bold bg-gray-50 dark:bg-gray-800/50', designTokens.text.primary)}>
                      Características
                    </td>
                  </tr>
                  {allFeatures.slice(0, 10).map((feature, idx) => (
                    <tr key={feature} className={cn('border-t', designTokens.borders.divider, idx % 2 === 0 ? designTokens.backgrounds.cardSecondary : '')}>
                      <td className={cn('p-4 border-r text-sm', designTokens.borders.divider, designTokens.text.secondary)}>
                        {feature}
                      </td>
                      {products.map((product) => (
                        <td key={product.id} className={cn('p-4 text-center border-r', designTokens.borders.divider)}>
                          {product.specifications?.features?.includes(feature) ? (
                            <Check size={20} className="mx-auto text-green-600 dark:text-green-400" />
                          ) : (
                            <Minus size={16} className="mx-auto text-gray-400" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className={cn('p-4 border-t flex items-center justify-between', designTokens.borders.divider)}>
          <p className={cn('text-sm', designTokens.text.secondary)}>
            Seleccione hasta 4 productos para comparar
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className={cn(
                'px-4 py-2 rounded-lg transition text-sm',
                'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700',
                designTokens.text.primary
              )}
            >
              Cerrar
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
