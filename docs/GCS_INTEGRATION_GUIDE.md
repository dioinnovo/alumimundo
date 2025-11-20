# Google Cloud Storage Integration Guide

## Overview

This guide explains how to connect your Alumimundo application to your Google Cloud Storage bucket (`alumimundo_inventory`) and display product images in the UI.

## Current Status

### ✅ Completed
- Environment variables configured for GCS project
- Product image utilities created
- API routes for fetching images
- UI components for displaying images
- Example inventory page

### ⚠️ Pending
- **Service account authentication setup** (Required to connect)

## Quick Setup

### 1. Service Account Authentication

You need to provide credentials for your service account. Choose one of the two methods below:

#### Option A: Using Key File (Recommended for Local Development)

1. **Download Service Account Key:**
   - Go to [Google Cloud Console - Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=innovoco-sandbox)
   - Find: `service-132096369431@gs-project-accounts.iam.gserviceaccount.com`
   - Click "⋮" → "Manage keys" → "Add Key" → "Create new key"
   - Select **JSON** format and download

2. **Save the key file** somewhere secure on your computer (e.g., `~/gcs-keys/alumimundo-key.json`)

3. **Add to `.env.local`:**
   ```bash
   GCS_KEY_FILE="/Users/yourusername/gcs-keys/alumimundo-key.json"
   ```

#### Option B: Using Base64 Encoded Key (For Production/Vercel)

1. If you have the JSON key file, encode it:
   ```bash
   cat ~/path/to/key.json | base64 | tr -d '\n'
   ```

2. **Add to `.env.local`:**
   ```bash
   GCS_SERVICE_ACCOUNT_KEY="your-base64-encoded-key-here"
   ```

### 2. Test the Connection

After adding the credentials, restart your dev server:

```bash
npm run dev
```

Then visit: **http://localhost:3000/dashboard/inventario**

## What's Been Built

### 1. Product Image Utilities
**File:** [src/lib/gcs/product-images.ts](../src/lib/gcs/product-images.ts)

Functions for interacting with your GCS bucket:
- `listProductImages()` - List all images in a folder
- `getProductImageSignedUrl()` - Get temporary access URLs
- `searchProductImagesBySKU()` - Find images by product SKU
- `getProductImagesByCategory()` - Get images by category/brand
- `productImageExists()` - Check if an image exists
- `makeProductImagePublic()` - Make image publicly accessible

### 2. API Routes
**File:** [src/app/api/products/images/route.ts](../src/app/api/products/images/route.ts)

**Endpoint:** `GET /api/products/images`

**Query Parameters:**
- `folder` - List images in specific folder (e.g., `products/kohler`)
- `sku` - Search by product SKU
- `category` - Filter by category (e.g., `kohler`, `schlage`)
- `limit` - Max results (default: 100)
- `signed` - Generate signed URLs (default: true)

**Examples:**
```bash
# Get all images
GET /api/products/images

# Get KOHLER products
GET /api/products/images?category=kohler

# Search by SKU
GET /api/products/images?sku=K-12345

# Get images from specific folder
GET /api/products/images?folder=products/kohler/faucets
```

### 3. UI Component
**File:** [src/components/ProductImageGalleryFromGCS.tsx](../src/components/ProductImageGalleryFromGCS.tsx)

**Props:**
- `folder?: string` - Filter by folder path
- `sku?: string` - Filter by SKU
- `category?: string` - Filter by category
- `limit?: number` - Max images to display (default: 100)
- `columns?: number` - Grid columns (default: 4)
- `showImageName?: boolean` - Show image filename (default: false)
- `aspectRatio?: 'square' | 'portrait' | 'landscape'` - Image aspect ratio

**Usage Example:**
```tsx
import ProductImageGalleryFromGCS from '@/components/ProductImageGalleryFromGCS';

// Display all KOHLER products
<ProductImageGalleryFromGCS
  category="kohler"
  columns={4}
  showImageName={true}
/>

// Display specific product by SKU
<ProductImageGalleryFromGCS
  sku="K-12345"
  columns={3}
  aspectRatio="portrait"
/>

// Display images from folder
<ProductImageGalleryFromGCS
  folder="products/schlage/locks"
  columns={6}
/>
```

### 4. Example Page
**File:** [src/app/dashboard/inventario/page.tsx](../src/app/dashboard/inventario/page.tsx)

Visit **http://localhost:3000/dashboard/inventario** to see:
- Browse all product images
- Filter by brand/category
- Search by SKU
- Browse by folder path
- Click images for full-screen view

## Your GCS Bucket Structure

**Bucket:** `alumimundo_inventory`
**Project:** `innovoco-sandbox`
**Console URL:** https://console.cloud.google.com/storage/browser/alumimundo_inventory

### Recommended Folder Structure

```
gs://alumimundo_inventory/
├── products/
│   ├── kohler/
│   │   ├── faucets/
│   │   │   ├── K-12345-image1.jpg
│   │   │   └── K-12345-image2.jpg
│   │   ├── sinks/
│   │   └── toilets/
│   ├── schlage/
│   │   ├── locks/
│   │   └── handles/
│   ├── steelcraft/
│   └── kallista/
├── categories/
└── temp/
```

## Environment Variables Reference

Your current `.env.local` configuration:

```bash
# Required - Project and Bucket
GCS_PROJECT_ID="innovoco-sandbox"
GCS_BUCKET_NAME="alumimundo_inventory"

# Required - Authentication (choose ONE)
# Option 1: Key file path
GCS_KEY_FILE="/path/to/your/service-account-key.json"

# Option 2: Base64 encoded key
# GCS_SERVICE_ACCOUNT_KEY="your-base64-encoded-key"

# Optional - Legacy names (kept for compatibility)
GOOGLE_CLOUD_PROJECT_ID="innovoco-sandbox"
GOOGLE_CLOUD_BUCKET="alumimundo_inventory"
GCS_BUCKET_URL="gs://alumimundo_inventory"
GOOGLE_CLOUD_SERVICE_ACCOUNT="service-132096369431@gs-project-accounts.iam.gserviceaccount.com"
```

## Security Best Practices

### 1. Signed URLs
- Images are accessed via **signed URLs** (temporary, secure links)
- Default expiration: 60 minutes
- No public access required

### 2. Service Account Permissions
Your service account should have:
- **Storage Object Viewer** (read-only, recommended)
- **Storage Object Admin** (if you need upload/delete)

### 3. Never Commit Credentials
- ✅ `.env.local` is in `.gitignore`
- ❌ Never commit the JSON key file
- ❌ Never expose service account keys in client-side code

### 4. CORS Configuration (if needed)
If you need direct browser uploads:

```bash
# Create cors.json
echo '[{
  "origin": ["http://localhost:3000", "https://alumimundo.com"],
  "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
  "responseHeader": ["*"],
  "maxAgeSeconds": 3600
}]' > cors.json

# Apply to bucket
gsutil cors set cors.json gs://alumimundo_inventory
```

## Troubleshooting

### Error: "GCS_PROJECT_ID environment variable is not set"
**Solution:** Check that `.env.local` exists and contains `GCS_PROJECT_ID="innovoco-sandbox"`

### Error: "Could not load the default credentials"
**Solution:** Add `GCS_KEY_FILE` or `GCS_SERVICE_ACCOUNT_KEY` to `.env.local`

### Error: "Permission denied" or "403 Forbidden"
**Solution:**
1. Verify service account has correct IAM roles
2. Check that the key file is for the correct service account
3. Ensure the bucket name is correct

### No images loading / Empty gallery
**Solution:**
1. Check that images exist in your bucket at the specified path
2. Verify images are in supported formats (jpg, png, webp)
3. Check browser console for API errors
4. Test the API endpoint directly: `/api/products/images?limit=10`

### Images loading slowly
**Solution:**
- Signed URL generation can be slow for many images
- Consider making images public for faster loading (if appropriate)
- Reduce `limit` parameter
- Implement pagination

## Next Steps

### 1. Organize Your Bucket
Upload product images to your bucket in an organized structure:

```bash
# Using gsutil (Google Cloud CLI)
gsutil cp product-image.jpg gs://alumimundo_inventory/products/kohler/faucets/
```

### 2. Add Metadata to Images
Tag images with metadata for better searchability:

```bash
gsutil setmeta -h "x-goog-meta-sku:K-12345" \
               -h "x-goog-meta-brand:KOHLER" \
               gs://alumimundo_inventory/products/kohler/faucets/image.jpg
```

### 3. Integrate with Product Database
Connect the GCS images with your product database by storing image paths in your Prisma schema.

### 4. Implement Caching
Add caching layer to reduce API calls and improve performance:
- Use React Query for client-side caching
- Implement server-side caching with Redis
- Cache signed URLs (they're valid for 60 minutes)

## Support

- **GCS Console:** https://console.cloud.google.com/storage/browser/alumimundo_inventory
- **Documentation:** https://cloud.google.com/storage/docs
- **Pricing:** https://cloud.google.com/storage/pricing

## Summary

✅ **Ready to use** - Just add service account credentials
✅ **Secure** - Uses signed URLs, no public access needed
✅ **Flexible** - Search by SKU, category, or folder
✅ **Scalable** - Works with thousands of images

**Next action:** Add `GCS_KEY_FILE` to your `.env.local` file and restart the dev server!
