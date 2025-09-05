import apiClient from './client';
import { AuthResponse } from '@/lib/types';
import { LoginFormData, RegisterFormData } from '@/lib/validations';

export const authApi = {
  // Registro de usuario
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  // Login de usuario
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  // Verificar salud del backend
  health: async (): Promise<{ status: string }> => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};
