// frontend/src/services/api.ts
import axios from 'axios';
import { AuthResponse, Lead, UploadResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
  
  getProfile: () => api.get('/auth/profile'),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post<UploadResponse>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Leads API
export const leadsAPI = {
  getLeads: () => api.get<Lead[]>('/leads'),
  getLead: (id: string) => api.get<Lead>(`/leads/${id}`),
  updateLead: (id: string, data: Partial<Lead>) => api.put<Lead>(`/leads/${id}`, data),
  deleteLead: (id: string) => api.delete(`/leads/${id}`),
};

export default api;