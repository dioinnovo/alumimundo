/**
 * Google Cloud Storage module for Alumimundo
 *
 * @module gcs
 */

export {
  getStorageClient,
  getBucket,
  uploadImage,
  uploadImageFromUrl,
  deleteImage,
  fileExists,
  generateImagePath,
} from './storage'

export { testUpload } from './test-upload'
