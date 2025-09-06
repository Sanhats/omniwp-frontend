'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWhatsAppStatus, useWhatsAppInfo, useConnectWhatsApp, useDisconnectWhatsApp, useWhatsAppAvailability } from '@/hooks/useWhatsApp';
import { ConnectWhatsAppModal } from './ConnectWhatsAppModal';
import { useState } from 'react';
import { Loader2, Smartphone, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function WhatsAppStatusCard() {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const { data: status, isLoading: statusLoading, error: statusError } = useWhatsAppStatus();
  const { data: info } = useWhatsAppInfo();
  const { data: availability, error: availabilityError } = useWhatsAppAvailability();
  const connectMutation = useConnectWhatsApp();
  const disconnectMutation = useDisconnectWhatsApp();

  // Debug del estado del modal
  console.log('🔍 Componente - showConnectModal:', showConnectModal);
  console.log('🔍 Componente - connectMutation.isPending:', connectMutation.isPending);
  console.log('🔍 Componente - connectMutation.isSuccess:', connectMutation.isSuccess);
  console.log('🔍 Componente - connectMutation.isError:', connectMutation.isError);

  const handleConnect = () => {
    console.log('🚀 Componente - Iniciando conexión WhatsApp...');
    console.log('🚀 Componente - connectMutation.isPending:', connectMutation.isPending);
    
    // Mostrar mensaje de que puede tardar
    toast.info('Conectando WhatsApp... Esto puede tardar hasta 2 minutos.');
    
    connectMutation.mutate(undefined, {
      onSuccess: (data) => {
        console.log('✅ Componente onSuccess - Conexión exitosa:', data);
        console.log('✅ Componente onSuccess - data.success:', data.success);
        console.log('✅ Componente onSuccess - data.status:', data.status);
        console.log('✅ Componente onSuccess - data.qrCode:', data.qrCode ? 'Presente' : 'No presente');
        console.log('✅ Componente onSuccess - Abriendo modal...');
        setShowConnectModal(true);
        console.log('✅ Componente onSuccess - Modal abierto:', true);
        // No hacer refetch inmediato para evitar rate limiting
        // El refetch se hará automáticamente cuando se cierre el modal
      },
      onError: (error) => {
        console.error('❌ Componente onError - Error en conexión:', error);
      }
    });
  };

  const handleDisconnect = () => {
    disconnectMutation.mutate();
  };

  const getStatusIcon = () => {
    if (statusLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    
    switch (status?.status) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'connecting':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    if (statusLoading) return <Badge variant="secondary">Cargando...</Badge>;
    
    switch (status?.status) {
      case 'connected':
        return <Badge className="bg-green-500 hover:bg-green-600">Conectado</Badge>;
      case 'connecting':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Conectando...</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Desconectado</Badge>;
    }
  };

  const isConnected = status?.status === 'connected';
  const isServiceUnavailable = statusError?.message?.includes('503') || availabilityError?.message?.includes('503');
  const isWhatsAppEnabled = availability?.whatsappWeb?.enabled && !isServiceUnavailable;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <CardTitle className="text-lg">WhatsApp Web</CardTitle>
          </div>
          {getStatusIcon()}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estado:</span>
            {getStatusBadge()}
          </div>

          {isConnected && info && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Número:</span>
                <span className="text-sm font-mono">{info.number}</span>
              </div>
              {info.name && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Nombre:</span>
                  <span className="text-sm">{info.name}</span>
                </div>
              )}
              {info.lastSeen && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Última conexión:</span>
                  <span className="text-sm">
                    {new Date(info.lastSeen).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {status?.message && (
            <div className="text-sm text-muted-foreground">
              {status.message}
            </div>
          )}

          <div className="flex space-x-2">
            {!isConnected ? (
              <Button 
                onClick={handleConnect}
                disabled={connectMutation.isPending || statusLoading || !isWhatsAppEnabled}
                className="flex-1"
              >
                {connectMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  'Conectar WhatsApp'
                )}
              </Button>
            ) : (
              <Button 
                onClick={handleDisconnect}
                disabled={disconnectMutation.isPending}
                variant="outline"
                className="flex-1"
              >
                {disconnectMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Desconectando...
                  </>
                ) : (
                  'Desconectar'
                )}
              </Button>
            )}
          </div>

          <CardDescription className="text-xs">
            {isServiceUnavailable ? (
              '⚠️ El servicio de WhatsApp Web no está disponible temporalmente. Se usará Twilio para todos los envíos.'
            ) : !availability?.whatsappWeb.enabled ? (
              'WhatsApp Web no está disponible. Se usará Twilio para todos los envíos.'
            ) : isConnected ? (
              'Tu WhatsApp está conectado. Puedes enviar y recibir mensajes desde tu número personal.'
            ) : (
              'Conecta tu WhatsApp para enviar mensajes desde tu número personal en lugar de usar Twilio.'
            )}
          </CardDescription>
        </CardContent>
      </Card>

      <ConnectWhatsAppModal 
        open={showConnectModal}
        onOpenChange={setShowConnectModal}
      />
    </>
  );
}
