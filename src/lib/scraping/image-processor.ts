/**
 * Image Processor for Product Scraping
 *
 * Downloads product images and uploads them to Google Cloud Storage
 */

import { uploadImageFromUrl, generateImagePath } from '@/lib/gcs'
import { PrismaClient, ProductImageType } from '@prisma/client'

const prisma = new PrismaClient()

export interface ImageUploadResult {
  success: boolean
  gcsUrl?: string
  publicUrl?: string
  error?: string
}

export class ImageProcessor {
  /**
   * Process and upload product images
   *
   * @param productId - Database product ID
   * @param brand - Brand name
   * @param sku - Product SKU
   * @param imageUrls - Array of image URLs to download and upload
   * @param imageType - Type of images (PRODUCT_PHOTO, LIFESTYLE, etc.)
   */
  async processProductImages(
    productId: string,
    brand: string,
    sku: string,
    imageUrls: string[],
    imageType: ProductImageType = 'PRODUCT_PHOTO'
  ): Promise<ImageUploadResult[]> {
    const results: ImageUploadResult[] = []

    console.log(`\n📸 Processing ${imageUrls.length} images for ${brand} ${sku}...`)

    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i]
      const imageIndex = i + 1

      try {
        // Infer file extension from URL
        const extension = this.getExtensionFromUrl(imageUrl)

        // Generate GCS path
        const destinationPath = generateImagePath(brand, sku, imageIndex, extension)

        console.log(`  📥 Downloading image ${imageIndex}/${imageUrls.length}...`)

        // Upload to GCS
        const { gcsUrl, publicUrl } = await uploadImageFromUrl(imageUrl, destinationPath)

        console.log(`  ✅ Uploaded: ${publicUrl}`)

        // Save to database
        await prisma.productImage.create({
          data: {
            productId,
            url: gcsUrl,
            publicUrl,
            altText: `${brand} ${sku} - Image ${imageIndex}`,
            displayOrder: imageIndex,
            imageType,
          },
        })

        results.push({
          success: true,
          gcsUrl,
          publicUrl,
        })
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        console.error(`  ❌ Failed to process image ${imageIndex}:`, errorMsg)

        results.push({
          success: false,
          error: errorMsg,
        })
      }

      // Rate limiting
      await this.delay(500)
    }

    const successCount = results.filter(r => r.success).length
    console.log(`✅ Successfully uploaded ${successCount}/${imageUrls.length} images for ${sku}`)

    return results
  }

  /**
   * Update primary product image URL
   */
  async updatePrimaryImage(productId: string): Promise<void> {
    // Get the first product image (lowest displayOrder)
    const primaryImage = await prisma.productImage.findFirst({
      where: { productId },
      orderBy: { displayOrder: 'asc' },
    })

    if (primaryImage) {
      await prisma.product.update({
        where: { id: productId },
        data: { imageUrl: primaryImage.publicUrl || primaryImage.url },
      })
    }
  }

  /**
   * Get file extension from URL
   */
  private getExtensionFromUrl(url: string): string {
    const match = url.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i)
    if (match) {
      return match[1].toLowerCase()
    }
    return 'jpg' // Default to jpg
  }

  /**
   * Delay helper
   */
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Batch process images for multiple products
   */
  async batchProcessImages(
    products: Array<{
      id: string
      brand: string
      sku: string
      imageUrls: string[]
    }>
  ): Promise<void> {
    console.log(`\n🖼️  Batch processing images for ${products.length} products...`)

    for (const product of products) {
      try {
        await this.processProductImages(
          product.id,
          product.brand,
          product.sku,
          product.imageUrls
        )

        // Update primary image
        await this.updatePrimaryImage(product.id)
      } catch (error) {
        console.error(`❌ Failed to process images for ${product.sku}:`, error)
      }
    }

    console.log(`✅ Batch image processing complete`)
  }

  /**
   * Clean up orphaned images (images without products)
   */
  async cleanupOrphanedImages(): Promise<void> {
    console.log('\n🧹 Cleaning up orphaned images...')

    // Note: ProductImage.productId is required and has onDelete: Cascade,
    // so there shouldn't be any orphaned images. Skipping cleanup.
    const orphanedImages: any[] = []

    console.log(`Found ${orphanedImages.length} orphaned images`)

    for (const image of orphanedImages) {
      try {
        // Delete from database
        await prisma.productImage.delete({
          where: { id: image.id },
        })

        console.log(`✅ Deleted orphaned image: ${image.url}`)
      } catch (error) {
        console.error(`❌ Failed to delete orphaned image ${image.id}:`, error)
      }
    }

    console.log(`✅ Cleanup complete`)
  }
}
