// frontend/src/types/index.ts

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
  }
  
  export interface Lead {
    _id: string;
    userId: string;
    imageUrl: string;
    name: string;
    phone: string;
    email: string;
    designation: string;
    company: string;
    processingStatus: 'processing' | 'completed' | 'failed';
    confidence: number;
    rawExtraction?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AuthResponse {
    message: string;
    token: string;
    user: User;
  }
  
  export interface UploadResponse {
    message: string;
    leadId: string;
    imageUrl: string;
    status: string;
  }