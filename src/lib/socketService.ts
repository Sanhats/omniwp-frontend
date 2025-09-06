import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private authToken: string | null = null;

  connect(authToken: string) {
    if (this.socket?.connected) {
      return;
    }

    this.authToken = authToken;
    this.socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      auth: {
        token: authToken
      },
      transports: ['websocket']
    });

    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Conectado al WebSocket');
      // Suscribirse a eventos de WhatsApp
      this.socket?.emit('subscribe_whatsapp');
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del WebSocket');
    });

    // Eventos de WhatsApp según el backend
    this.socket.on('whatsapp_qr_generated', (data: { qrCode: string }) => {
      window.dispatchEvent(new CustomEvent('whatsapp:qr', { detail: { qr: data.qrCode } }));
    });

    this.socket.on('whatsapp_status_change', (data: { 
      status: string; 
      message?: string; 
      phoneNumber?: string; 
      name?: string 
    }) => {
      window.dispatchEvent(new CustomEvent('whatsapp:status', { detail: data }));
    });

    this.socket.on('whatsapp_message_received', (data: unknown) => {
      window.dispatchEvent(new CustomEvent('whatsapp:message', { detail: data }));
    });

    this.socket.on('whatsapp_message_sent', (data: unknown) => {
      window.dispatchEvent(new CustomEvent('whatsapp:message:sent', { detail: data }));
    });

    this.socket.on('whatsapp_error', (data: { error: { message: string } }) => {
      window.dispatchEvent(new CustomEvent('whatsapp:error', { detail: { error: data.error.message } }));
    });
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
