import { Storage } from '@google-cloud/storage';

// Initialize Google Cloud Storage client
let storage: Storage | null = null;

// Get storage instance (singleton pattern)
function getStorage(): Storage {
  if (!storage) {
    const projectId = process.env.GCS_PROJECT_ID;
    const keyFilename = process.env.GCS_KEY_FILE;
    const credentials = process.env.GCS_SERVICE_ACCOUNT_KEY
      ? JSON.parse(Buffer.from(process.env.GCS_SERVICE_ACCOUNT_KEY, 'base64').toString())
      : undefined;

    if (!projectId) {
      throw new Error('GCS_PROJECT_ID environment variable is not set');
    }

    storage = new Storage({
      projectId,
      ...(keyFilename && { keyFilename }),
      ...(credentials && { credentials }),
    });
  }
  return storage;
}

// Get bucket instance
function getBucket() {
  const bucketName = process.env.GCS_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('GCS_BUCKET_NAME environment variable is not set');
  }
  return getStorage().bucket(bucketName);
}

export interface ProductImage {
  name: string;
  url: string;
  publicUrl: string;
  contentType: string;
  size: number;
  updated: Date;
  metadata?: Record<string, string | number | boolean | null>;
}

/**
 * List all product images in a specific folder
 */
export async function listProductImages(
  folderPath: string = '',
  limit: number = 100
): Promise<ProductImage[]> {
  try {
    const bucket = getBucket();
    const [files] = await bucket.getFiles({
      prefix: folderPath,
      maxResults: limit,
      autoPaginate: false,
    });

    const images: ProductImage[] = [];

    for (const file of files) {
      // Skip folders (files ending with /)
      if (file.name.endsWith('/')) continue;

      // Only include image files
      const contentType = file.metadata.contentType || '';
      if (!contentType.startsWith('image/')) continue;

      const [metadata] = await file.getMetadata();

      images.push({
        name: file.name,
        url: `gs://${bucket.name}/${file.name}`,
        publicUrl: file.publicUrl(),
        contentType: metadata.contentType || 'image/jpeg',
        size: parseInt(String(metadata.size || '0')),
        updated: new Date(metadata.updated || Date.now()),
        metadata: metadata.metadata || {},
      });
    }

    return images;
  } catch (error) {
    console.error('Error listing product images:', error);
    throw error;
  }
}

/**
 * Get a signed URL for a product image (temporary access)
 */
export async function getProductImageSignedUrl(
  imagePath: string,
  expiresInMinutes: number = 60
): Promise<string> {
  try {
    const bucket = getBucket();
    const file = bucket.file(imagePath);

    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + expiresInMinutes * 60 * 1000,
    });

    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
}

/**
 * Get public URL for a product image (if bucket/file is public)
 */
export function getProductImagePublicUrl(imagePath: string): string {
  const bucketName = process.env.GCS_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('GCS_BUCKET_NAME environment variable is not set');
  }
  return `https://storage.googleapis.com/${bucketName}/${imagePath}`;
}

/**
 * Search for product images by SKU or product code
 */
export async function searchProductImagesBySKU(
  sku: string
): Promise<ProductImage[]> {
  try {
    const bucket = getBucket();
    const [files] = await bucket.getFiles({
      prefix: `products/${sku}`,
    });

    const images: ProductImage[] = [];

    for (const file of files) {
      if (file.name.endsWith('/')) continue;

      const contentType = file.metadata.contentType || '';
      if (!contentType.startsWith('image/')) continue;

      const [metadata] = await file.getMetadata();

      images.push({
        name: file.name,
        url: `gs://${bucket.name}/${file.name}`,
        publicUrl: file.publicUrl(),
        contentType: metadata.contentType || 'image/jpeg',
        size: parseInt(String(metadata.size || '0')),
        updated: new Date(metadata.updated || Date.now()),
        metadata: metadata.metadata || {},
      });
    }

    return images;
  } catch (error) {
    console.error('Error searching product images:', error);
    throw error;
  }
}

/**
 * Get all product images organized by category/brand
 */
export async function getProductImagesByCategory(
  category: string
): Promise<ProductImage[]> {
  return listProductImages(`products/${category}/`);
}

/**
 * Check if an image exists in the bucket
 */
export async function productImageExists(imagePath: string): Promise<boolean> {
  try {
    const bucket = getBucket();
    const [exists] = await bucket.file(imagePath).exists();
    return exists;
  } catch (error) {
    console.error('Error checking image existence:', error);
    return false;
  }
}

/**
 * Get image metadata
 */
export async function getProductImageMetadata(imagePath: string) {
  try {
    const bucket = getBucket();
    const [metadata] = await bucket.file(imagePath).getMetadata();
    return metadata;
  } catch (error) {
    console.error('Error getting image metadata:', error);
    throw error;
  }
}

/**
 * Make an image publicly accessible (use with caution)
 */
export async function makeProductImagePublic(imagePath: string): Promise<string> {
  try {
    const bucket = getBucket();
    const file = bucket.file(imagePath);
    await file.makePublic();
    return file.publicUrl();
  } catch (error) {
    console.error('Error making image public:', error);
    throw error;
  }
}
