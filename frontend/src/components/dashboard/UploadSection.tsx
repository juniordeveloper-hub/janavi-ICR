// frontend/src/components/dashboard/UploadSection.tsx
import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { uploadAPI } from '../../services/api';
import { Lead } from '../../types';

interface UploadSectionProps {
  onUploadSuccess: (lead: Lead) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadAPI.uploadImage(file);
      
      // Create a temporary lead object for immediate display
      const tempLead: Lead = {
        _id: response.data.leadId,
        userId: '',
        imageUrl: response.data.imageUrl,
        name: '',
        phone: '',
        email: '',
        designation: '',
        company: '',
        processingStatus: 'processing',
        confidence: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onUploadSuccess(tempLead);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Business Cards</h2>
      <p className="text-gray-600 mb-6">Upload your business cards for AI processing and smart categorization</p>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          {isUploading ? (
            <div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Uploading and processing...</p>
            </div>
          ) : (
            <div>
              <p className="text-lg text-gray-700 mb-2">
                Drag & drop business cards here, or click to select
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports PDF, PNG, JPEG files up to 10MB each (max 50 files)
              </p>
              <button
                onClick={handleBrowseClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Browse files
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>• AI will automatically extract contact information</p>
        <p>• Processing typically takes 10-30 seconds per image</p>
        <p>• You can edit extracted information after processing</p>
      </div>
    </div>
  );
};

export default UploadSection;