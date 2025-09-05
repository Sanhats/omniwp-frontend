// Tipos para el sistema OmniWP

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface Order {
  id: string;
  clientId: string;
  description: string;
  status: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';
}

export interface OrderWithClient extends Order {
  client: Client;
}

export interface MessageTemplate {
  templateType: 'confirmacion' | 'recordatorio' | 'seguimiento';
  clientId: string;
  orderId: string;
}

export interface MessageResponse {
  message: string;
  client: {
    id: string;
    name: string;
    phone: string;
  };
  order: {
    id: string;
    description: string;
    status: string;
  };
}

// Nuevos tipos para mensajes reales
export interface SendMessageRequest {
  clientId: string;
  orderId: string;
  channel: 'whatsapp' | 'email';
  templateType: 'confirmacion' | 'recordatorio' | 'seguimiento' | 'entrega' | 'agradecimiento';
  variables: {
    clientName: string;
    orderDescription: string;
  };
}

export interface SendMessageResponse {
  id: string;
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
  providerMessageId: string;
  channel: 'whatsapp' | 'email';
}

export interface Message {
  id: string;
  clientId: string;
  orderId: string;
  channel: 'whatsapp' | 'email';
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
  text: string;
  createdAt: string;
  updatedAt?: string;
  providerMessageId?: string;
}

export interface MessageFilters {
  clientId?: string;
  orderId?: string;
  status?: string;
  channel?: string;
}

export interface MessageTemplates {
  confirmacion: string;
  recordatorio: string;
  seguimiento: string;
  entrega: string;
  agradecimiento: string;
}

export interface ApiError {
  error: string;
}

// Tipos para formularios
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export interface ClientForm {
  name: string;
  phone: string;
  email?: string;
}

export interface OrderForm {
  clientId: string;
  description: string;
}

export interface OrderUpdateForm {
  description?: string;
  status?: Order['status'];
}
