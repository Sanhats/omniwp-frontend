export interface WhatsAppStatus {
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  message?: string;
  lastSeen?: string;
}

export interface WhatsAppInfo {
  number: string;
  name?: string;
  profilePicture?: string;
  isConnected: boolean;
  lastSeen?: string;
}

export interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  body: string;
  direction: 'incoming' | 'outgoing';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
  messageType?: 'text' | 'image' | 'document' | 'audio' | 'video';
}

export interface WhatsAppQR {
  qr: string;
  expiresAt: string;
}

export interface SendWhatsAppMessageRequest {
  to: string;
  message: string;
  type?: 'text' | 'image' | 'document';
  mediaUrl?: string;
}

export interface WhatsAppConnectionResponse {
  success: boolean;
  message: string;
  status?: 'qr_generated' | 'connected' | 'error';
  qrCode?: string;
}

export interface WhatsAppError {
  error: string;
  message?: string;
  code?: string;
}
