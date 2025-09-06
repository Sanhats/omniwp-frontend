import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { whatsappApi } from '../lib/api/whatsapp';
import { toast } from 'sonner';

// Hook para obtener el estado de WhatsApp
export const useWhatsAppStatus = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['whatsapp', 'status'],
    queryFn: whatsappApi.getStatus,
    refetchInterval: 120000, // Auto-refresh cada 2 minutos (reducido)
    retry: 2, // Reducir reintentos
    retryDelay: 5000, // Esperar 5 segundos entre reintentos
    staleTime: 60000, // Los datos son válidos por 1 minuto
    enabled: options?.enabled !== false, // Permitir deshabilitar
  });
};

// Hook para obtener información de WhatsApp
export const useWhatsAppInfo = () => {
  return useQuery({
    queryKey: ['whatsapp', 'info'],
    queryFn: whatsappApi.getInfo,
    enabled: false, // Solo se ejecuta manualmente
    retry: 3,
  });
};

// Hook para obtener mensajes de WhatsApp
export const useWhatsAppMessages = (filters?: {
  limit?: number;
  offset?: number;
  direction?: 'incoming' | 'outgoing';
}) => {
  return useQuery({
    queryKey: ['whatsapp', 'messages', filters],
    queryFn: () => whatsappApi.getMessages(filters),
    refetchInterval: 60000, // Auto-refresh cada 1 minuto (reducido)
    retry: 2, // Reducir reintentos
    retryDelay: 5000, // Esperar 5 segundos entre reintentos
    staleTime: 30000, // Los datos son válidos por 30 segundos
  });
};

// Hook para conectar WhatsApp
export const useConnectWhatsApp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: whatsappApi.connect,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Iniciando conexión de WhatsApp...');
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['whatsapp'] });
      } else {
        toast.error(data.message || 'Error al conectar WhatsApp');
      }
    },
    onError: (error) => {
      toast.error('Error al conectar WhatsApp: ' + error.message);
    },
  });
};

// Hook para desconectar WhatsApp
export const useDisconnectWhatsApp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: whatsappApi.disconnect,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('WhatsApp desconectado correctamente');
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['whatsapp'] });
      } else {
        toast.error(data.message || 'Error al desconectar WhatsApp');
      }
    },
    onError: (error) => {
      toast.error('Error al desconectar WhatsApp: ' + error.message);
    },
  });
};

// Hook para restaurar sesión de WhatsApp
export const useRestoreWhatsApp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: whatsappApi.restore,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Sesión de WhatsApp restaurada');
        queryClient.invalidateQueries({ queryKey: ['whatsapp'] });
      } else {
        toast.error(data.message || 'Error al restaurar sesión de WhatsApp');
      }
    },
    onError: (error) => {
      toast.error('Error al restaurar sesión: ' + error.message);
    },
  });
};

// Hook para enviar mensaje por WhatsApp
export const useSendWhatsApp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: whatsappApi.sendMessage,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Mensaje enviado por WhatsApp');
        // Invalidar mensajes para actualizar la lista
        queryClient.invalidateQueries({ queryKey: ['whatsapp', 'messages'] });
      } else {
        toast.error('Error al enviar mensaje por WhatsApp');
      }
    },
    onError: (error) => {
      toast.error('Error al enviar mensaje: ' + error.message);
    },
  });
};

// Hook para verificar disponibilidad del servicio
export const useWhatsAppAvailability = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['whatsapp', 'availability'],
    queryFn: whatsappApi.getAvailability,
    refetchInterval: 600000, // Refrescar cada 10 minutos (reducido)
    retry: 2, // Reducir reintentos
    retryDelay: 10000, // Esperar 10 segundos entre reintentos
    staleTime: 300000, // Los datos son válidos por 5 minutos
    enabled: options?.enabled !== false, // Permitir deshabilitar
  });
};
