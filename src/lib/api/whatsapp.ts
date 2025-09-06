import { 
  WhatsAppStatus, 
  WhatsAppInfo, 
  WhatsAppMessage, 
  WhatsAppConnectionResponse,
  SendWhatsAppMessageRequest 
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const whatsappApi = {
  // Obtener estado de conexión
  async getStatus(): Promise<WhatsAppStatus> {
    const response = await fetch(`${API_BASE_URL}/whatsapp/status`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener el estado de WhatsApp');
    }
    
    return response.json();
  },

  // Conectar WhatsApp (inicia el proceso de QR)
  async connect(): Promise<WhatsAppConnectionResponse> {
    const response = await fetch(`${API_BASE_URL}/whatsapp/connect`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Error al conectar WhatsApp');
    }
    
    return response.json();
  },

  // Desconectar WhatsApp
  async disconnect(): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/whatsapp/disconnect`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Error al desconectar WhatsApp');
    }
    
    return response.json();
  },

  // Restaurar sesión de WhatsApp
  async restore(): Promise<WhatsAppConnectionResponse> {
    const response = await fetch(`${API_BASE_URL}/whatsapp/restore`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Error al restaurar sesión de WhatsApp');
    }
    
    return response.json();
  },

  // Obtener información del WhatsApp conectado
  async getInfo(): Promise<WhatsAppInfo> {
    const response = await fetch(`${API_BASE_URL}/whatsapp/info`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener información de WhatsApp');
    }
    
    return response.json();
  },

  // Obtener mensajes de WhatsApp
  async getMessages(filters?: {
    limit?: number;
    offset?: number;
    direction?: 'incoming' | 'outgoing';
  }): Promise<{ messages: WhatsAppMessage[]; total: number }> {
    const params = new URLSearchParams();
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    if (filters?.direction) params.append('direction', filters.direction);

    const response = await fetch(`${API_BASE_URL}/whatsapp/messages?${params}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener mensajes de WhatsApp');
    }
    
    return response.json();
  },

  // Enviar mensaje por WhatsApp
  async sendMessage(data: SendWhatsAppMessageRequest): Promise<{ success: boolean; messageId: string }> {
    const response = await fetch(`${API_BASE_URL}/whatsapp/send`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Error al enviar mensaje por WhatsApp');
    }
    
    return response.json();
  },

  // Verificar disponibilidad del servicio
  async getAvailability(): Promise<{
    whatsappWeb: { enabled: boolean };
    features: { redis: boolean; websockets: boolean };
  }> {
    const response = await fetch(`${API_BASE_URL}/whatsapp/availability`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Error al verificar disponibilidad');
    }
    
    return response.json();
  },
};
