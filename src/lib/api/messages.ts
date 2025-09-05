import apiClient from './client';
import { MessageResponse, MessageTemplate } from '@/lib/types';

export const messagesApi = {
  // Generar mensaje desde template
  generateTemplate: async (data: MessageTemplate): Promise<MessageResponse> => {
    const response = await apiClient.post('/messages/template', data);
    return response.data;
  },
};
