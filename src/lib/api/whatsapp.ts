import { 
  WhatsAppStatus, 
  WhatsAppInfo, 
  WhatsAppMessage, 
  WhatsAppConnectionResponse,
  SendWhatsAppMessageRequest 
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Función para decodificar JWT (solo para debug)
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
};

const getAuthHeaders = () => {
  // Obtener el token del store de Zustand
  const authStore = JSON.parse(localStorage.getItem('auth-storage') || '{}');
  const token = authStore?.state?.token;
  
  // También intentar obtener el token directamente del localStorage como fallback
  const directToken = localStorage.getItem('token');
  const finalToken = token || directToken;
  
  if (!finalToken) {
    console.error('No hay token de autenticación disponible');
    console.log('Auth store:', authStore);
    console.log('Direct token:', directToken);
    throw new Error('No hay token de autenticación disponible');
  }
  
  console.log('Token encontrado:', finalToken.substring(0, 20) + '...');
  
  // Decodificar JWT para verificar contenido
  const decodedToken = decodeJWT(finalToken);
  if (decodedToken) {
    console.log('JWT decodificado:', decodedToken);
    console.log('userId en JWT:', decodedToken.userId);
    console.log('email en JWT:', decodedToken.email);
  }
  
  return {
    'Authorization': `Bearer ${finalToken}`,
    'Content-Type': 'application/json',
  };
};

const getPublicHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

export const whatsappApi = {
  // Obtener estado de conexión (público)
  async getStatus(): Promise<WhatsAppStatus> {
    const response = await fetch(`${API_BASE_URL}/whatsapp/status`, {
      headers: getPublicHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener el estado de WhatsApp');
    }
    
    return response.json();
  },

  // Conectar WhatsApp (público - solo verifica si se puede conectar)
  async connect(): Promise<WhatsAppConnectionResponse> {
    const response = await fetch(`${API_BASE_URL}/whatsapp/connect`, {
      method: 'POST',
      headers: getPublicHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Error al conectar WhatsApp');
    }
    
    return response.json();
  },

  // Conectar WhatsApp autenticado (nuevo endpoint)
  async connectAuth(): Promise<WhatsAppConnectionResponse> {
    const headers = getAuthHeaders();
    console.log('Enviando request a:', `${API_BASE_URL}/whatsapp/connect-auth`);
    console.log('Headers enviados:', headers);
    
    const response = await fetch(`${API_BASE_URL}/whatsapp/connect-auth`, {
      method: 'POST',
      headers,
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error al conectar WhatsApp: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    return data;
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

  // Obtener información del WhatsApp conectado (público - solo verifica si se puede obtener)
  async getInfo(): Promise<WhatsAppInfo> {
    const response = await fetch(`${API_BASE_URL}/whatsapp/info`, {
      headers: getPublicHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener información de WhatsApp');
    }
    
    return response.json();
  },

  // Obtener información del WhatsApp conectado (autenticado - nuevo endpoint)
  async getInfoAuth(): Promise<WhatsAppInfo> {
    const response = await fetch(`${API_BASE_URL}/whatsapp/info-auth`, {
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

  // Verificar disponibilidad del servicio (público)
  async getAvailability(): Promise<{
    whatsappWeb: { enabled: boolean };
    features: { redis: boolean; websockets: boolean };
  }> {
    const response = await fetch(`${API_BASE_URL}/whatsapp/availability`, {
      headers: getPublicHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Error al verificar disponibilidad');
    }
    
    return response.json();
  },
};
