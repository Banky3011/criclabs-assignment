import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export interface DataMapping {
  id?: number;
  title: string;
  description?: string;
  department: string;
  dataSubjectType: string;
  createdAt?: string;
}

export const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const { getAuthHeader } = useAuthStore.getState();
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    },
  };
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  if (response.status === 401 || response.status === 403) {
    useAuthStore.getState().logout();
    window.location.href = '/';
  }
  return response;
};

export const getProfile = async () => {
  const response = await apiRequest('/api/profile');
  return response.json();
};

export const makeProtectedRequest = async (endpoint: string, method: string = 'GET', body?: any) => {
  const response = await apiRequest(endpoint, {
    method,
    body: body ? JSON.stringify(body) : undefined,
  });
  return response.json();
};

export const getAllDataMappings = async (): Promise<{ success: boolean; data: DataMapping[] }> => {
  const response = await apiRequest('/api/data-mappings');
  return response.json();
};

export const getDataMappingById = async (id: number): Promise<{ success: boolean; data: DataMapping }> => {
  const response = await apiRequest(`/api/data-mappings/${id}`);
  return response.json();
};

export const createDataMapping = async (data: Omit<DataMapping, 'id' | 'createdAt'>): Promise<{ success: boolean; message: string; data?: { id: number } }> => {
  const response = await apiRequest('/api/data-mappings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateDataMapping = async (id: number, data: Omit<DataMapping, 'id' | 'createdAt'>): Promise<{ success: boolean; message: string }> => {
  const response = await apiRequest(`/api/data-mappings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteDataMapping = async (id: number): Promise<{ success: boolean; message: string }> => {
  const response = await apiRequest(`/api/data-mappings/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};
