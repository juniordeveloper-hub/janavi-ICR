// backend/src/controllers/uploadController.ts
import { Request, Response } from 'express';
import Lead from '../models/Lead';
import { extractLeadData } from '../services/geminiService';
import { uploadToGCS } from '../services/gcsService';

interface AuthenticatedRequest extends Request {
  user?: { userId: string };
  file?: Express.Multer.File;
}

export const uploadAndProcess = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Google Cloud Storage
    const uploadResult = await uploadToGCS(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // Create lead record with processing status
    const lead = new Lead({
      userId: req.user!.userId,
      imageUrl: uploadResult.publicUrl,
      processingStatus: 'processing'
    });

    await lead.save();

    // Process with Gemini AI in background
    processInBackground(lead._id.toString(), req.file.buffer, req.file.mimetype);

    res.status(201).json({
      message: 'File uploaded and processing started',
      leadId: lead._id,
      imageUrl: uploadResult.publicUrl,
      status: 'processing'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
};

const processInBackground = async (leadId: string, imageBuffer: Buffer, mimeType: string) => {
  try {
    // Extract data using Gemini
    const extractedData = await extractLeadData(imageBuffer, mimeType);

    // Update lead with extracted data
    await Lead.findByIdAndUpdate(leadId, {
      ...extractedData,
      processingStatus: 'completed'
    });

    console.log(`Lead ${leadId} processed successfully`);
  } catch (error) {
    console.error(`Processing failed for lead ${leadId}:`, error);
    
    // Mark as failed
    await Lead.findByIdAndUpdate(leadId, {
      processingStatus: 'failed'
    });
  }
};