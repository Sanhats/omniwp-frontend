'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useWhatsAppStatus, useWhatsAppDebug, useRestartWhatsApp } from '@/hooks/useWhatsApp';
import { Loader2, Smartphone, CheckCircle, AlertCircle, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode';

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
  const [generatedQrDataUrl, setGeneratedQrDataUrl] = useState<string>('');
  const { data: status, refetch } = useWhatsAppStatus();
  const debugQuery = useWhatsAppDebug();
  const restartMutation = useRestartWhatsApp();

  // Usar props si están disponibles, sino usar estado local
  const currentQrCode = propQrCode || qrCode;
  const currentIsConnecting = propIsConnecting !== undefined ? propIsConnecting : isConnecting;
  const currentError = propError || error;

  // El QR del backend no es base64, es un formato de WhatsApp Web
  // Necesitamos usar una librería para generar el QR desde este formato
  const cleanQrCode = currentQrCode;

  // Generar QR cuando recibamos el código
  useEffect(() => {
    if (currentQrCode && currentQrCode !== '') {
      console.log('🔍 Modal - Generando QR desde código:', currentQrCode.substring(0, 50) + '...');
      
      QRCode.toDataURL(currentQrCode, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      .then((dataUrl) => {
        console.log('✅ Modal - QR generado exitosamente');
        setGeneratedQrDataUrl(dataUrl);
      })
      .catch((err) => {
        console.error('❌ Modal - Error generando QR:', err);
        setError('Error generando código QR');
      });
    } else {
      setGeneratedQrDataUrl('');
    }
  }, [currentQrCode]);

  // Auto-refresh del QR cada 30 segundos
  useEffect(() => {
    if (!open || !currentQrCode) return;

    const interval = setInterval(() => {
      console.log('🔄 Modal - QR expirado, solicitando nuevo...');
      // Aquí podrías llamar a una función para obtener un nuevo QR
      // Por ahora solo mostramos un mensaje
      toast.info('El código QR ha expirado. Generando uno nuevo...');
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [open, currentQrCode]);

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
    hasCommas: currentQrCode?.includes(',') || false,
    generatedQrPresent: generatedQrDataUrl ? 'Sí' : 'No'
  });

  useEffect(() => {
    if (!open) return;

    // Limpiar estados al abrir el modal
    setQrCode('');
    setError('');
    setIsConnecting(false);
    setGeneratedQrDataUrl('');

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
    setGeneratedQrDataUrl('');
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
          {!generatedQrDataUrl && !currentIsConnecting && !currentError && (
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
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-red-700">
                  Error al conectar WhatsApp
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentError}
                </p>
                <div className="text-xs text-muted-foreground space-y-1 mt-3">
                  <p className="font-medium">Si el error persiste:</p>
                  <p>• Cierra todas las sesiones de WhatsApp Web</p>
                  <p>• Desvincular dispositivos antiguos en WhatsApp</p>
                  <p>• Verifica tu conexión a internet</p>
                  <p>• Intenta generar un nuevo QR</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      console.log('🔍 Usuario solicitó información de debug');
                      debugQuery.refetch();
                    }}
                    disabled={debugQuery.isFetching}
                  >
                    {debugQuery.isFetching ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <AlertCircle className="h-4 w-4 mr-2" />
                    )}
                    Ver Debug Info
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      console.log('🔄 Usuario solicitó reiniciar conexión');
                      restartMutation.mutate();
                    }}
                    disabled={restartMutation.isPending}
                  >
                    {restartMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Smartphone className="h-4 w-4 mr-2" />
                    )}
                    Reiniciar Conexión
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Mostrar información de debug si está disponible */}
          {debugQuery.data && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-medium text-blue-800">Información de Debug</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>Estado:</strong> {debugQuery.data.debug?.connectionStatus?.status || 'N/A'}</p>
                <p><strong>Conectado:</strong> {debugQuery.data.debug?.connectionStatus?.connected ? 'Sí' : 'No'}</p>
                <p><strong>QR Disponible:</strong> {debugQuery.data.debug?.hasQRCode ? 'Sí' : 'No'}</p>
                <p><strong>Sesión Activa:</strong> {debugQuery.data.debug?.hasActiveSession ? 'Sí' : 'No'}</p>
              </div>
              {debugQuery.data.debug?.recommendations && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-blue-800">Recomendaciones:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    {debugQuery.data.debug.recommendations.map((rec: string, index: number) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {generatedQrDataUrl && (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={generatedQrDataUrl}
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
                <p className="text-xs text-muted-foreground">
                  El código expira en 2 minutos
                </p>
                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      console.log('🔄 Usuario solicitó nuevo QR');
                      toast.info('Generando nuevo código QR...');
                      // Aquí podrías llamar a una función para obtener un nuevo QR
                    }}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Generar nuevo QR
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      console.log('🔍 Usuario solicitó información de debug');
                      debugQuery.refetch();
                    }}
                    disabled={debugQuery.isFetching}
                  >
                    {debugQuery.isFetching ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <AlertCircle className="h-4 w-4 mr-2" />
                    )}
                    Debug Info
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      console.log('🔄 Usuario solicitó reiniciar conexión');
                      restartMutation.mutate();
                    }}
                    disabled={restartMutation.isPending}
                  >
                    {restartMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Smartphone className="h-4 w-4 mr-2" />
                    )}
                    Reiniciar
                  </Button>
                </div>
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
