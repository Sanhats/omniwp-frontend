import apiClient from './client';
import { MessageResponse, MessageTemplate } from '@/lib/types';

export const messagesApi = {
  // Generar mensaje desde template
  generateTemplate: async (data: MessageTemplate): Promise<MessageResponse> => {
    console.log('Generando mensaje:', data);
    
    const response = await apiClient.post('/messages/template', data);
    console.log('Respuesta completa del backend:', response);
    console.log('Datos de la respuesta:', response.data);
    
    return response.data;
  },
};
