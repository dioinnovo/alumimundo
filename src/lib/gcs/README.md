# Google Cloud Storage Integration

This module handles image uploads to Google Cloud Storage for the Alumimundo product inventory.

## Configuration

### Environment Variables

Add the following to your `.env.local`:

```env
GCS_PROJECT_ID="innovoco-sandbox"
GCS_BUCKET_NAME="alumimundo_inventory"
GOOGLE_CLOUD_PROJECT_ID="innovoco-sandbox"
GOOGLE_CLOUD_BUCKET="alumimundo_inventory"
```

### Authentication

The GCS client uses **Application Default Credentials (ADC)**. You need to authenticate using the gcloud CLI:

#### 1. Install gcloud CLI

**macOS (Homebrew):**
```bash
brew install --cask google-cloud-sdk
```

**Other OS:**
Visit: https://cloud.google.com/sdk/docs/install

#### 2. Authenticate

```bash
# Login to gcloud
gcloud auth login

# Set the project
gcloud config set project innovoco-sandbox

# Generate application default credentials
gcloud auth application-default login
```

#### 3. Verify Access

Test that you can access the bucket:

```bash
gsutil ls gs://alumimundo_inventory
```

### Testing

Run the test upload script to verify everything is working:

```bash
npx ts-node --esm src/lib/gcs/test-upload.ts
```

This will upload a 1x1 test image and return the public URL.

## Usage

### Upload an image from a URL

```typescript
import { uploadImageFromUrl, generateImagePath } from '@/lib/gcs'

// Generate a proper path
const path = generateImagePath('KOHLER', 'K-12345', 1, 'jpg')
// Result: "kohler/K-12345-1.jpg"

// Upload the image
const { gcsUrl, publicUrl } = await uploadImageFromUrl(
  'https://example.com/product.jpg',
  path
)

console.log(gcsUrl)    // gs://alumimundo_inventory/kohler/K-12345-1.jpg
console.log(publicUrl) // https://storage.googleapis.com/alumimundo_inventory/kohler/K-12345-1.jpg
```

### Upload an image buffer

```typescript
import { uploadImage } from '@/lib/gcs'

const buffer = Buffer.from(imageData)
const { gcsUrl, publicUrl } = await uploadImage(
  buffer,
  'kohler/K-12345-1.jpg',
  'image/jpeg'
)
```

### Check if an image exists

```typescript
import { fileExists } from '@/lib/gcs'

const exists = await fileExists('gs://alumimundo_inventory/kohler/K-12345-1.jpg')
```

### Delete an image

```typescript
import { deleteImage } from '@/lib/gcs'

await deleteImage('gs://alumimundo_inventory/kohler/K-12345-1.jpg')
```

## File Organization

Images are organized by brand in the GCS bucket:

```
alumimundo_inventory/
├── kohler/
│   ├── K-12345-1.jpg
│   ├── K-12345-2.jpg
│   └── K-67890-1.jpg
├── tarkett/
│   ├── TR-ABC-123-1.jpg
│   └── TR-ABC-123-2.jpg
├── schlage/
│   └── SCH-XYZ-1.jpg
└── test-brand/
    └── TEST-SKU-001-1.png
```

## Troubleshooting

### Error: "Could not load the default credentials"

**Solution:** Run `gcloud auth application-default login`

### Error: "User was denied access"

**Solution:** Make sure you have the correct permissions on the `innovoco-sandbox` project.

### Error: "Bucket not found"

**Solution:** Verify the bucket name and that it exists:
```bash
gsutil ls | grep alumimundo
```

## GCS Console

View uploaded files at:
https://console.cloud.google.com/storage/browser/alumimundo_inventory
