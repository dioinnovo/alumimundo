/**
 * Google Cloud Storage Service for Alumimundo
 *
 * Handles image uploads to GCS bucket for product inventory
 */

import { Storage } from '@google-cloud/storage'
import path from 'path'
import fs from 'fs'

// Environment variables
const PROJECT_ID = process.env.GCS_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT_ID
const BUCKET_NAME = process.env.GCS_BUCKET_NAME || process.env.GOOGLE_CLOUD_BUCKET
const SERVICE_ACCOUNT_KEY_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT

// Initialize GCS client
let storage: Storage | null = null

/**
 * Get or create Storage instance
 */
export function getStorageClient(): Storage {
  if (!storage) {
    if (!PROJECT_ID) {
      throw new Error('GCS_PROJECT_ID or GOOGLE_CLOUD_PROJECT_ID environment variable is required')
    }

    // Option 1: Use service account key JSON file (preferred for production)
    if (SERVICE_ACCOUNT_KEY_PATH) {
      const keyPath = path.resolve(SERVICE_ACCOUNT_KEY_PATH)

      if (!fs.existsSync(keyPath)) {
        throw new Error(`Service account key file not found at: ${keyPath}`)
      }

      storage = new Storage({
        projectId: PROJECT_ID,
        keyFilename: keyPath,
      })

      console.log('✅ GCS initialized with service account key:', keyPath)
    }
    // Option 2: Use Application Default Credentials (for local development with gcloud)
    else {
      storage = new Storage({
        projectId: PROJECT_ID,
      })

      console.log('✅ GCS initialized with Application Default Credentials')
    }
  }
  return storage
}

/**
 * Get the GCS bucket instance
 */
export function getBucket() {
  if (!BUCKET_NAME) {
    throw new Error('GCS_BUCKET_NAME or GOOGLE_CLOUD_BUCKET environment variable is required')
  }

  const client = getStorageClient()
  return client.bucket(BUCKET_NAME)
}

/**
 * Upload image buffer to GCS
 *
 * @param imageBuffer - Image data as Buffer
 * @param destinationPath - Path in bucket (e.g., "kohler/K-12345-1.jpg")
 * @param contentType - MIME type (e.g., "image/jpeg")
 * @returns GCS URL and public URL
 */
export async function uploadImage(
  imageBuffer: Buffer,
  destinationPath: string,
  contentType: string = 'image/jpeg'
): Promise<{
  gcsUrl: string
  publicUrl: string
}> {
  const bucket = getBucket()
  const file = bucket.file(destinationPath)

  // Upload the file
  await file.save(imageBuffer, {
    metadata: {
      contentType,
      cacheControl: 'public, max-age=31536000', // 1 year cache
    },
    resumable: false, // Use simple upload for small files
  })

  // Make the file publicly readable
  await file.makePublic()

  const gcsUrl = `gs://${BUCKET_NAME}/${destinationPath}`
  const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${destinationPath}`

  return { gcsUrl, publicUrl }
}

/**
 * Upload image from URL to GCS
 *
 * @param imageUrl - Source image URL to download
 * @param destinationPath - Path in bucket (e.g., "kohler/K-12345-1.jpg")
 * @returns GCS URL and public URL
 */
export async function uploadImageFromUrl(
  imageUrl: string,
  destinationPath: string
): Promise<{
  gcsUrl: string
  publicUrl: string
}> {
  // Fetch the image
  const response = await fetch(imageUrl)

  if (!response.ok) {
    throw new Error(`Failed to fetch image from ${imageUrl}: ${response.statusText}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Get content type from response or infer from URL
  const contentType = response.headers.get('content-type') || inferContentType(imageUrl)

  return uploadImage(buffer, destinationPath, contentType)
}

/**
 * Delete an image from GCS
 *
 * @param gcsUrl - GCS URL (e.g., "gs://bucket/path/to/image.jpg")
 */
export async function deleteImage(gcsUrl: string): Promise<void> {
  const bucket = getBucket()

  // Extract path from gs:// URL
  const path = gcsUrl.replace(`gs://${BUCKET_NAME}/`, '')
  const file = bucket.file(path)

  await file.delete()
}

/**
 * Delete a file from GCS (alias for deleteImage)
 * @param gcsUrl - GCS URL (e.g., "gs://bucket/path/to/file.pdf")
 */
export async function deleteFile(gcsUrl: string): Promise<void> {
  return deleteImage(gcsUrl)
}

/**
 * Upload a claim document to GCS
 * @param fileBuffer - File data as Buffer
 * @param destinationPath - Path in bucket
 * @param contentType - MIME type
 */
export async function uploadClaimDocument(
  fileBuffer: Buffer,
  destinationPath: string,
  contentType: string = 'application/pdf'
): Promise<{
  gcsUrl: string
  publicUrl: string
}> {
  return uploadImage(fileBuffer, destinationPath, contentType)
}

/**
 * Get a signed URL for temporary access to a private file
 * @param gcsUrl - GCS URL (e.g., "gs://bucket/path/to/file.pdf")
 * @param expiresInMinutes - URL expiration time in minutes (default 60)
 */
export async function getSignedUrl(
  gcsUrl: string,
  expiresInMinutes: number = 60
): Promise<string> {
  const bucket = getBucket()
  const path = gcsUrl.replace(`gs://${BUCKET_NAME}/`, '')
  const file = bucket.file(path)

  const [signedUrl] = await file.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + expiresInMinutes * 60 * 1000,
  })

  return signedUrl
}

/**
 * Check if a file exists in GCS
 *
 * @param gcsUrl - GCS URL (e.g., "gs://bucket/path/to/image.jpg")
 * @returns true if file exists
 */
export async function fileExists(gcsUrl: string): Promise<boolean> {
  try {
    const bucket = getBucket()
    const path = gcsUrl.replace(`gs://${BUCKET_NAME}/`, '')
    const file = bucket.file(path)

    const [exists] = await file.exists()
    return exists
  } catch (error) {
    return false
  }
}

/**
 * Infer content type from file extension
 */
function inferContentType(url: string): string {
  const ext = url.split('.').pop()?.toLowerCase()

  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'gif':
      return 'image/gif'
    default:
      return 'image/jpeg'
  }
}

/**
 * Generate a destination path for a product image
 *
 * @param brand - Brand name (e.g., "KOHLER")
 * @param sku - Product SKU
 * @param imageIndex - Image index (1-based)
 * @param extension - File extension (e.g., "jpg")
 * @returns Destination path (e.g., "kohler/K-12345-1.jpg")
 */
export function generateImagePath(
  brand: string,
  sku: string,
  imageIndex: number,
  extension: string = 'jpg'
): string {
  const brandFolder = brand.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const safeSku = sku.replace(/[^a-zA-Z0-9-]/g, '-')
  return `${brandFolder}/${safeSku}-${imageIndex}.${extension}`
}
