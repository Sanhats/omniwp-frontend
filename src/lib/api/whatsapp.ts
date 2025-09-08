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
    console.log('🌐 API - Enviando request a:', `${API_BASE_URL}/whatsapp/connect-auth`);
    console.log('🌐 API - Headers enviados:', headers);
    
    try {
      const response = await fetch(`${API_BASE_URL}/whatsapp/connect-auth`, {
        method: 'POST',
        headers,
        // Agregar timeout más largo para WhatsApp (puede tardar hasta 3 minutos)
        signal: AbortSignal.timeout(180000), // 3 minutos
      });
      
      console.log('🌐 API - Response status:', response.status);
      console.log('🌐 API - Response ok:', response.ok);
      console.log('🌐 API - Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API - Error response:', errorText);
        throw new Error(`Error al conectar WhatsApp: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ API - Response data recibida:', data);
      console.log('✅ API - data.success:', data.success);
      console.log('✅ API - data.status:', data.status);
      console.log('✅ API - data.qrCode presente:', !!data.qrCode);
      
      return data;
    } catch (error) {
      console.error('❌ API - Error en fetch:', error);
      if (error instanceof Error) {
        console.error('❌ API - Error message:', error.message);
        console.error('❌ API - Error name:', error.name);
      }
      throw error;
    }
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

  // Probar decodificación de JWT (endpoint de prueba)
  async testJWT(): Promise<{
    success: boolean;
    message: string;
    token?: string;
    decoded?: {
      userId: string;
      email: string;
      iat: number;
      exp: number;
    };
    user?: {
      id: string;
      email: string;
      name: string;
    };
  }> {
    const headers = getAuthHeaders();
    console.log('🔍 Test JWT - Probando endpoint /test-jwt...');
    console.log('🔍 Test JWT - Headers para test:', headers);
    
    const response = await fetch(`${API_BASE_URL}/whatsapp/test-jwt`, {
      method: 'GET',
      headers,
    });
    
    console.log('🔍 Test JWT - Response status:', response.status);
    console.log('🔍 Test JWT - Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Test JWT - Error response:', errorText);
      throw new Error(`Error en test JWT: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ Test JWT - Response data:', data);
    return data;
  },

  // Probar configuración del backend (endpoint de prueba)
  async testConfig(): Promise<{
    success: boolean;
    message: string;
    config?: {
      whatsapp: {
        enabled: boolean;
        client: string;
        sessionPath: string;
      };
      redis: {
        connected: boolean;
        host: string;
        port: number;
      };
      environment: {
        nodeEnv: string;
        port: number;
      };
    };
  }> {
    console.log('🔍 Test Config - Probando endpoint /test-config...');
    
    const response = await fetch(`${API_BASE_URL}/whatsapp/test-config`, {
      method: 'GET',
      headers: getPublicHeaders(),
    });
    
    console.log('🔍 Test Config - Response status:', response.status);
    console.log('🔍 Test Config - Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Test Config - Error response:', errorText);
      throw new Error(`Error en test config: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ Test Config - Response data:', data);
    return data;
  },
};
