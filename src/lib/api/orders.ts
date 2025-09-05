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
    // Filtrar campos undefined y vacíos
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined && value !== '')
    );
    
    console.log('Actualizando pedido:', { id, data: filteredData });
    
    const response = await apiClient.put(`/orders/${id}`, filteredData);
    return response.data;
  },

  // Eliminar pedido
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/orders/${id}`);
    return response.data;
  },
};
