// frontend/src/components/dashboard/LeadCard.tsx
import React, { useState } from 'react';
import { Lead } from '../../types';

interface LeadCardProps {
  lead: Lead;
  onUpdate: (leadId: string, updatedData: Partial<Lead>) => void;
  onDelete: (leadId: string) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    designation: lead.designation,
    company: lead.company
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      designation: lead.designation,
      company: lead.company
    });
  };

  const handleSave = () => {
    onUpdate(lead._id, editData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      onDelete(lead._id);
    }
  };

  const handleInputChange = (field: keyof typeof editData, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Processed';
      case 'processing':
        return 'Processing...';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image Preview */}
      <div className="h-40 bg-gray-200 relative">
        <img
          src={lead.imageUrl}
          alt="Business card"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.processingStatus)}`}>
            {getStatusText(lead.processingStatus)}
          </span>
        </div>
        {lead.confidence > 0 && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              {Math.round(lead.confidence * 100)}% confidence
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Name"
              value={editData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              type="text"
              placeholder="Phone"
              value={editData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              type="email"
              placeholder="Email"
              value={editData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              type="text"
              placeholder="Designation"
              value={editData.designation}
              onChange={(e) => handleInputChange('designation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              type="text"
              placeholder="Company"
              value={editData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-md text-sm font-medium"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div>
              <p className="font-medium text-gray-900">{lead.name || 'No name'}</p>
              <p className="text-sm text-gray-600">{lead.designation || 'No designation'}</p>
            </div>
            <div className="text-sm text-gray-700">
              <p>{lead.company || 'No company'}</p>
              <p>{lead.phone || 'No phone'}</p>
              <p>{lead.email || 'No email'}</p>
            </div>
            <div className="text-xs text-gray-500">
              <p>Uploaded: {new Date(lead.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleEdit}
                disabled={lead.processingStatus === 'processing'}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-3 rounded-md text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadCard;