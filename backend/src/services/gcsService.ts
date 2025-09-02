// backend/src/services/gcsService.ts
import { bucket } from '../config/gcs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export interface UploadResult {
  fileName: string;
  publicUrl: string;
}

export const uploadToGCS = async (
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<UploadResult> => {
  try {
    // Generate unique filename
    const fileExtension = path.extname(originalName);
    const fileName = `leadgen/${Date.now()}-${uuidv4()}${fileExtension}`;
    
    // Create file reference
    const file = bucket.file(fileName);
    
    // Upload file
    await file.save(fileBuffer, {
      metadata: {
        contentType: mimeType,
        metadata: {
          originalName: originalName,
          uploadedAt: new Date().toISOString()
        }
      },
      public: true // Make file publicly accessible
    });

    // Make file public and get URL
    await file.makePublic();
    
    const publicUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${fileName}`;
    
    return {
      fileName,
      publicUrl
    };
  } catch (error) {
    console.error('GCS upload error:', error);
    throw new Error('Failed to upload file to Google Cloud Storage');
  }
};

export const deleteFromGCS = async (fileName: string): Promise<void> => {
  try {
    await bucket.file(fileName).delete();
    console.log(`File ${fileName} deleted from GCS`);
  } catch (error) {
    console.error('GCS delete error:', error);
    throw new Error('Failed to delete file from Google Cloud Storage');
  }
};