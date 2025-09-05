import apiClient from './client';
import { Order } from '@/lib/types';
import { OrderFormData, OrderUpdateFormData } from '@/lib/validations';

export const ordersApi = {
  // Obtener todos los pedidos del usuario
  getAll: async (): Promise<Order[]> => {
    const response = await apiClient.get('/orders');
    return response.data;
  },

  // Crear nuevo pedido
  create: async (data: OrderFormData): Promise<Order> => {
    const response = await apiClient.post('/orders', data);
    return response.data;
  },

  // Actualizar pedido
  update: async (id: string, data: OrderUpdateFormData): Promise<Order> => {
    const response = await apiClient.put(`/orders/${id}`, data);
    return response.data;
  },

  // Eliminar pedido
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/orders/${id}`);
    return response.data;
  },
};
