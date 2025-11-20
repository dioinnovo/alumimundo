import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Placeholder images from Unsplash for different product categories
const CATEGORY_IMAGES: Record<string, string[]> = {
  'Bathroom Faucets': [
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800', // Modern bathroom faucet
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800', // Chrome faucet
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800', // Bathroom sink faucet
  ],
  'Kitchen Faucets': [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', // Modern kitchen faucet
    'https://images.unsplash.com/photo-1556909114-4b18d6d0fac4?w=800', // Kitchen sink
    'https://images.unsplash.com/photo-1565183928294-7d22f2d8a4de?w=800', // Kitchen tap
  ],
  'Toilets': [
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800', // Modern toilet
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800', // White toilet
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800', // Bathroom toilet
  ],
  'Showers': [
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800', // Shower head
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800', // Modern shower
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800', // Rainfall shower
  ],
  'Bathroom Sinks': [
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800', // Modern sink
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800', // White sink
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800', // Bathroom basin
  ],
  'Bathtubs': [
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800', // Freestanding tub
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800', // White bathtub
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800', // Modern bathtub
  ],
}

async function main() {
  console.log('🎨 Starting product image seeding...\n')

  // Get all products
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      category: true,
      sku: true,
    },
  })

  console.log(`Found ${products.length} products\n`)

  let imagesCreated = 0
  let imagesSkipped = 0

  for (const product of products) {
    // Check if product already has images
    const existingImages = await prisma.productImage.findMany({
      where: { productId: product.id },
    })

    if (existingImages.length > 0) {
      console.log(`⏭️  Skipping ${product.name} - already has ${existingImages.length} image(s)`)
      imagesSkipped++
      continue
    }

    // Get category images
    const categoryImages = CATEGORY_IMAGES[product.category] || []
    if (categoryImages.length === 0) {
      console.log(`⚠️  No images found for category: ${product.category}`)
      continue
    }

    // Pick a random image from the category
    const randomIndex = Math.floor(Math.random() * categoryImages.length)
    const imageUrl = categoryImages[randomIndex]

    // Create the product image
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: imageUrl,
        altText: `${product.name} - ${product.sku}`,
        displayOrder: 1,
        width: 800,
        height: 800,
      },
    })

    console.log(`✅ Added image for: ${product.name}`)
    imagesCreated++
  }

  console.log(`\n📊 Summary:`)
  console.log(`   Images created: ${imagesCreated}`)
  console.log(`   Images skipped: ${imagesSkipped}`)
  console.log(`   Total products: ${products.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
