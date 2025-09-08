'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useWhatsAppStatus } from '@/hooks/useWhatsApp';
import { Loader2, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ConnectWhatsAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrCode?: string;
  isConnecting?: boolean;
  error?: string;
}

export function ConnectWhatsAppModal({ 
  open, 
  onOpenChange, 
  qrCode: propQrCode, 
  isConnecting: propIsConnecting, 
  error: propError 
}: ConnectWhatsAppModalProps) {
  const [qrCode, setQrCode] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');
  const { data: status, refetch } = useWhatsAppStatus();

  // Usar props si están disponibles, sino usar estado local
  const currentQrCode = propQrCode || qrCode;
  const currentIsConnecting = propIsConnecting !== undefined ? propIsConnecting : isConnecting;
  const currentError = propError || error;

  // Limpiar el QR code para que sea válido base64
  const cleanQrCode = currentQrCode ? currentQrCode.replace(/,/g, '') : '';

  // Logging para debugging
  console.log('🔍 Modal - Props recibidas:', { 
    open, 
    propQrCode: propQrCode ? 'Presente' : 'No presente', 
    propIsConnecting, 
    propError 
  });
  console.log('🔍 Modal - Estado actual:', { 
    currentQrCode: currentQrCode ? 'Presente' : 'No presente', 
    currentIsConnecting, 
    currentError 
  });
  console.log('🔍 Modal - QR limpio:', { 
    originalLength: currentQrCode?.length || 0,
    cleanLength: cleanQrCode?.length || 0,
    hasCommas: currentQrCode?.includes(',') || false
  });

  useEffect(() => {
    if (!open) return;

    // Limpiar estados al abrir el modal
    setQrCode('');
    setError('');
    setIsConnecting(false);

    // Escuchar eventos de QR desde el WebSocket
    const handleQR = (event: CustomEvent) => {
      console.log('QR recibido:', event.detail);
      setQrCode(event.detail.qr);
      setIsConnecting(true);
      setError('');
    };

    const handleStatus = (event: CustomEvent) => {
      console.log('Estado WhatsApp recibido:', event.detail);
      const { status: newStatus, message, phoneNumber } = event.detail;
      
      if (newStatus === 'connected') {
        setIsConnecting(false);
        setError('');
        toast.success(`¡WhatsApp conectado con éxito! Número: ${phoneNumber}`);
        onOpenChange(false);
        // Refetch solo cuando se conecte exitosamente
        setTimeout(() => refetch(), 1000);
      } else if (newStatus === 'error') {
        setIsConnecting(false);
        setError(message || 'Error al conectar WhatsApp');
        toast.error(message || 'Error al conectar WhatsApp');
      } else if (newStatus === 'connecting') {
        setIsConnecting(true);
        setError('');
      }
    };

    const handleError = (event: CustomEvent) => {
      console.error('Error WhatsApp:', event.detail);
      setIsConnecting(false);
      setError(event.detail.message || 'Error de conexión');
      toast.error(event.detail.message || 'Error de conexión');
    };

    window.addEventListener('whatsapp:qr', handleQR as EventListener);
    window.addEventListener('whatsapp:status', handleStatus as EventListener);
    window.addEventListener('whatsapp:error', handleError as EventListener);

    return () => {
      window.removeEventListener('whatsapp:qr', handleQR as EventListener);
      window.removeEventListener('whatsapp:status', handleStatus as EventListener);
      window.removeEventListener('whatsapp:error', handleError as EventListener);
    };
  }, [open, onOpenChange, refetch]);

  const handleClose = () => {
    setQrCode('');
    setIsConnecting(false);
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <span>Conectar WhatsApp</span>
          </DialogTitle>
          <DialogDescription>
            Escanea el código QR con tu teléfono para conectar WhatsApp Web
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!cleanQrCode && !currentIsConnecting && !currentError && (
            <div className="flex flex-col items-center space-y-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-sm text-muted-foreground">
                Generando código QR...
              </p>
            </div>
          )}

          {currentError && (
            <div className="flex flex-col items-center space-y-4 py-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <div className="text-center">
                <p className="text-sm font-medium text-red-700">
                  Error al conectar WhatsApp
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentError}
                </p>
              </div>
            </div>
          )}

          {cleanQrCode && (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={`data:image/png;base64,${cleanQrCode}`}
                  alt="Código QR de WhatsApp"
                  className="w-64 h-64 border rounded-lg"
                />
                {currentIsConnecting && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <div className="flex flex-col items-center space-y-2 text-white">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="text-sm">Conectando...</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm font-medium">
                  {currentIsConnecting ? 'Escaneando código...' : 'Escanea este código con tu teléfono'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Abre WhatsApp → Menú → Dispositivos vinculados → Vincular un dispositivo
                </p>
              </div>
            </div>
          )}

          {status?.status === 'connected' && (
            <div className="flex flex-col items-center space-y-4 py-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <div className="text-center">
                <p className="text-sm font-medium text-green-700">
                  ¡WhatsApp conectado exitosamente!
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ya puedes enviar mensajes desde tu número personal
                </p>
              </div>
            </div>
          )}

          {status?.status === 'error' && (
            <div className="flex flex-col items-center space-y-4 py-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <div className="text-center">
                <p className="text-sm font-medium text-red-700">
                  Error al conectar WhatsApp
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {status.message || 'Intenta nuevamente'}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={currentIsConnecting}
            >
              {status?.status === 'connected' ? 'Cerrar' : 'Cancelar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
