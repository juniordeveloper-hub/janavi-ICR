// backend/src/config/gcs.ts
import { Storage } from '@google-cloud/storage';
import path from 'path';

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE // Path to service account key file
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);

export { storage, bucket };

// Alternative: If you want to use service account key as environment variable
// const storage = new Storage({
//   projectId: process.env.GCP_PROJECT_ID,
//   credentials: JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY!)
// });