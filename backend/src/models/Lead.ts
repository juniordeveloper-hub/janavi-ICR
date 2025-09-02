// backend/src/models/Lead.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl: string;
  
  // Mandatory fields
  name: string;
  phone: string;
  email: string;
  designation: string;
  company: string;
  
  // Processing info
  processingStatus: 'processing' | 'completed' | 'failed';
  confidence: number;
  rawExtraction?: string; // Raw AI response
  
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  
  // Mandatory lead fields
  name: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  designation: {
    type: String,
    default: ''
  },
  company: {
    type: String,
    default: ''
  },
  
  // Processing metadata
  processingStatus: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  confidence: {
    type: Number,
    default: 0,
    min: 0,
    max: 1
  },
  rawExtraction: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model<ILead>('Lead', leadSchema);