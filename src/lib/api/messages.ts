import apiClient from './client';
import { MessageResponse, MessageTemplate, SendMessageRequest, SendMessageResponse, Message, MessageFilters, MessageTemplates } from '@/lib/types';

export const messagesApi = {
  // Generar mensaje desde template (función existente)
  generateTemplate: async (data: MessageTemplate): Promise<MessageResponse> => {
    console.log('Generando mensaje:', data);
    
    const response = await apiClient.post('/messages/template', data);
    console.log('Respuesta completa del backend:', response);
    console.log('Datos de la respuesta:', response.data);
    
    return response.data;
  },

  // Enviar mensaje real
  sendMessage: async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    console.log('Enviando mensaje real:', data);
    const response = await apiClient.post('/messages/send', data);
    console.log('Respuesta del envío:', response.data);
    return response.data;
  },

  // Obtener historial de mensajes
  getMessages: async (filters?: MessageFilters): Promise<Message[]> => {
    const params = new URLSearchParams();
    if (filters?.clientId) params.append('clientId', filters.clientId);
    if (filters?.orderId) params.append('orderId', filters.orderId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.channel) params.append('channel', filters.channel);

    const queryString = params.toString();
    const url = queryString ? `/messages?${queryString}` : '/messages';
    
    const response = await apiClient.get(url);
    return response.data;
  },

  // Obtener detalle de un mensaje
  getMessage: async (id: string): Promise<Message> => {
    const response = await apiClient.get(`/messages/${id}`);
    return response.data;
  },

  // Obtener templates disponibles
  getTemplates: async (): Promise<MessageTemplates> => {
    const response = await apiClient.get('/messages/templates');
    return response.data;
  },
};
