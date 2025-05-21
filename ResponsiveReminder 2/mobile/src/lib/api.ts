// API service for the mobile app

// The base URL will change based on whether we're in development or production
const DEV_API_URL = 'http://10.0.2.2:5000'; // For Android emulator
const IOS_DEV_API_URL = 'http://localhost:5000'; // For iOS simulator
const PROD_API_URL = 'https://your-api-domain.com'; 

// Helper to determine the correct API URL based on platform and environment
import { Platform } from 'react-native';

export const getApiUrl = () => {
  // In production, this would check if we're in dev or prod mode
  const isDev = true; // For now, assume we're always in dev
  
  if (isDev) {
    return Platform.OS === 'ios' ? IOS_DEV_API_URL : DEV_API_URL;
  }
  
  return PROD_API_URL;
};

// General API request function
export async function apiRequest<T>(
  method: string,
  endpoint: string,
  data?: unknown
): Promise<T> {
  const url = `${getApiUrl()}${endpoint}`;
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText}`);
  }
  
  return response.json();
}

// Specific API functions for our endpoints
export const api = {
  // Contacts
  getContacts: () => 
    apiRequest<any[]>('GET', '/api/contacts'),
  
  getContact: (id: number) => 
    apiRequest<any>('GET', `/api/contacts/${id}`),
  
  createContact: (contact: any) => 
    apiRequest<any>('POST', '/api/contacts', contact),
  
  updateContact: (id: number, contact: any) => 
    apiRequest<any>('PATCH', `/api/contacts/${id}`, contact),
  
  deleteContact: (id: number) => 
    apiRequest<void>('DELETE', `/api/contacts/${id}`),
  
  // Messages
  getMessages: () => 
    apiRequest<any[]>('GET', '/api/messages'),
  
  getPendingMessages: () => 
    apiRequest<any[]>('GET', '/api/messages/pending'),
  
  getContactMessages: (contactId: number) => 
    apiRequest<any[]>('GET', `/api/contacts/${contactId}/messages`),
  
  createMessage: (message: any) => 
    apiRequest<any>('POST', '/api/messages', message),
  
  updateMessage: (id: number, update: any) => 
    apiRequest<any>('PATCH', `/api/messages/${id}`, update),
  
  deleteMessage: (id: number) => 
    apiRequest<void>('DELETE', `/api/messages/${id}`),
  
  // Settings
  getSettings: () => 
    apiRequest<any>('GET', '/api/settings'),
  
  updateSettings: (settings: any) => 
    apiRequest<any>('POST', '/api/settings', settings),
};