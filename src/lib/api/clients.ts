import apiClient from './client';
import { Client } from '@/lib/types';
import { ClientFormData, ClientUpdateFormData } from '@/lib/validations';

export const clientsApi = {
  // Obtener todos los clientes del usuario
  getAll: async (): Promise<Client[]> => {
    const response = await apiClient.get('/clients');
    return response.data;
  },

  // Crear nuevo cliente
  create: async (data: ClientFormData): Promise<Client> => {
    const response = await apiClient.post('/clients', data);
    return response.data;
  },

  // Actualizar cliente
  update: async (id: string, data: ClientUpdateFormData): Promise<Client> => {
    const response = await apiClient.put(`/clients/${id}`, data);
    return response.data;
  },

  // Eliminar cliente
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/clients/${id}`);
    return response.data;
  },
};
