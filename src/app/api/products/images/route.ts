import { NextRequest, NextResponse } from 'next/server';
import {
  listProductImages,
  getProductImageSignedUrl,
  searchProductImagesBySKU,
  getProductImagesByCategory,
} from '@/lib/gcs/product-images';

/**
 * GET /api/products/images
 *
 * Query parameters:
 * - folder: List images in a specific folder (e.g., "products/kohler")
 * - sku: Search images by product SKU
 * - category: Get images by category (e.g., "kohler", "schlage")
 * - limit: Maximum number of results (default: 100)
 * - signed: Whether to generate signed URLs (default: true)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    const sku = searchParams.get('sku');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '100');
    const generateSignedUrls = searchParams.get('signed') !== 'false';

    let images;

    // Search by SKU
    if (sku) {
      images = await searchProductImagesBySKU(sku);
    }
    // Get by category
    else if (category) {
      images = await getProductImagesByCategory(category);
    }
    // List by folder
    else if (folder) {
      images = await listProductImages(folder, limit);
    }
    // List all (root level)
    else {
      images = await listProductImages('', limit);
    }

    // Generate signed URLs if requested
    if (generateSignedUrls) {
      const imagesWithSignedUrls = await Promise.all(
        images.map(async (image) => {
          try {
            const signedUrl = await getProductImageSignedUrl(image.name, 60);
            return {
              ...image,
              signedUrl,
            };
          } catch (error) {
            console.error(`Error generating signed URL for ${image.name}:`, error);
            return image;
          }
        })
      );

      return NextResponse.json({
        success: true,
        images: imagesWithSignedUrls,
        count: imagesWithSignedUrls.length,
      });
    }

    return NextResponse.json({
      success: true,
      images,
      count: images.length,
    });
  } catch (error) {
    console.error('Error fetching product images:', error);

    // Provide helpful error messages
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('GCS_PROJECT_ID')) {
      return NextResponse.json(
        {
          error: 'Google Cloud Storage not configured. Please set GCS_PROJECT_ID environment variable.',
          details: errorMessage,
        },
        { status: 500 }
      );
    }

    if (errorMessage.includes('GCS_BUCKET_NAME')) {
      return NextResponse.json(
        {
          error: 'Google Cloud Storage bucket not configured. Please set GCS_BUCKET_NAME environment variable.',
          details: errorMessage,
        },
        { status: 500 }
      );
    }

    if (errorMessage.includes('credentials') || errorMessage.includes('authentication')) {
      return NextResponse.json(
        {
          error: 'Google Cloud Storage authentication failed. Please configure GCS_KEY_FILE or GCS_SERVICE_ACCOUNT_KEY.',
          details: errorMessage,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch product images',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
