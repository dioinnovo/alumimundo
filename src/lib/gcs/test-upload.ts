/**
 * Test script for Google Cloud Storage upload
 *
 * Run with: npx ts-node --esm src/lib/gcs/test-upload.ts
 */

import { uploadImage, getBucket, generateImagePath } from './storage'

async function testUpload() {
  console.log('🧪 Testing Google Cloud Storage upload...\n')

  try {
    // Test 1: Check bucket access
    console.log('1️⃣ Testing bucket access...')
    const bucket = getBucket()
    console.log(`   ✅ Bucket: ${bucket.name}`)

    // Test 2: Create a simple test image (1x1 red pixel PNG)
    console.log('\n2️⃣ Creating test image...')
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
      'base64'
    )

    // Test 3: Upload test image
    console.log('3️⃣ Uploading test image...')
    const testPath = generateImagePath('TEST-BRAND', 'TEST-SKU-001', 1, 'png')
    console.log(`   Path: ${testPath}`)

    const result = await uploadImage(testImageBuffer, testPath, 'image/png')

    console.log('   ✅ Upload successful!')
    console.log(`   GCS URL: ${result.gcsUrl}`)
    console.log(`   Public URL: ${result.publicUrl}`)

    console.log('\n✅ All tests passed!')
    console.log('\n📝 You can verify the upload at:')
    console.log(`   ${result.publicUrl}`)
    console.log('\n🗑️  To clean up, you can delete the test image from the GCS console.')

    return result
  } catch (error) {
    console.error('\n❌ Test failed:')
    console.error(error)

    if (error instanceof Error) {
      if (error.message.includes('Could not load the default credentials')) {
        console.error('\n💡 Solution: Run the following command to authenticate:')
        console.error('   gcloud auth application-default login')
      }
    }

    throw error
  }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testUpload()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

export { testUpload }
