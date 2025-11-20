#!/usr/bin/env node

/**
 * Upload a test image to GCS
 * Usage: node scripts/upload-test-image.js <local-image-path> <destination-path>
 * Example: node scripts/upload-test-image.js ~/Downloads/product.jpg products/kohler/product.jpg
 */

const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

const PROJECT_ID = 'innovoco-sandbox';
const BUCKET_NAME = 'alumimundo_inventory';
const KEY_PATH = path.join(process.env.HOME, 'gcs-keys/alumimundo-service-account.json');

async function uploadImage(localPath, destinationPath) {
  try {
    // Validate local file exists
    if (!fs.existsSync(localPath)) {
      console.error('❌ File not found:', localPath);
      return;
    }

    console.log('📤 Uploading image...\n');
    console.log('Local path:', localPath);
    console.log('Destination:', `gs://${BUCKET_NAME}/${destinationPath}`);

    // Initialize storage
    const storage = new Storage({
      projectId: PROJECT_ID,
      keyFilename: KEY_PATH,
    });

    const bucket = storage.bucket(BUCKET_NAME);

    // Upload file
    await bucket.upload(localPath, {
      destination: destinationPath,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    console.log('\n✅ Upload complete!');

    // Make it public
    const file = bucket.file(destinationPath);
    await file.makePublic();

    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${destinationPath}`;
    console.log('\n🌐 Public URL:');
    console.log(publicUrl);

    console.log('\n✅ Image is now accessible!');

  } catch (error) {
    console.error('❌ Upload failed:', error.message);
  }
}

// Parse command line arguments
const [,, localPath, destinationPath] = process.argv;

if (!localPath || !destinationPath) {
  console.log('Usage: node scripts/upload-test-image.js <local-path> <destination-path>');
  console.log('Example: node scripts/upload-test-image.js ~/Downloads/product.jpg products/kohler/product.jpg');
  process.exit(1);
}

uploadImage(localPath, destinationPath);
