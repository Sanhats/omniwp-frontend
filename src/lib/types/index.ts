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
