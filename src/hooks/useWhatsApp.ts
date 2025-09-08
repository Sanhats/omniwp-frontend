import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { whatsappApi } from '../lib/api/whatsapp';
import { toast } from 'sonner';

// Hook para obtener el estado de WhatsApp
export const useWhatsAppStatus = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['whatsapp', 'status'],
    queryFn: whatsappApi.getStatus,
    refetchInterval: false, // Deshabilitar auto-refresh
    refetchOnWindowFocus: false, // Deshabilitar refetch al enfocar ventana
    refetchOnMount: false, // Deshabilitar refetch al montar
    retry: false, // No reintentar en caso de error
    staleTime: 300000, // Los datos son válidos por 5 minutos
    enabled: options?.enabled !== false, // Permitir deshabilitar
    throwOnError: false, // No lanzar error, solo devolverlo
  });
};

// Hook para obtener información de WhatsApp
export const useWhatsAppInfo = () => {
  return useQuery({
    queryKey: ['whatsapp', 'info'],
    queryFn: whatsappApi.getInfoAuth, // Usar endpoint autenticado
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
    refetchInterval: false, // Deshabilitar auto-refresh
    refetchOnWindowFocus: false, // Deshabilitar refetch al enfocar ventana
    refetchOnMount: false, // Deshabilitar refetch al montar
    retry: 1, // Solo 1 reintento
    retryDelay: 10000, // Esperar 10 segundos entre reintentos
    staleTime: 300000, // Los datos son válidos por 5 minutos
  });
};

// Hook para conectar WhatsApp
export const useConnectWhatsApp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: whatsappApi.connectAuth, // Usar endpoint autenticado
    onSuccess: (data) => {
      console.log('🔗 Hook onSuccess - Respuesta de conexión WhatsApp:', data);
      console.log('🔗 Hook onSuccess - data.success:', data.success);
      console.log('🔗 Hook onSuccess - data.status:', data.status);
      console.log('🔗 Hook onSuccess - data.qrCode:', data.qrCode ? 'Presente' : 'No presente');
      
      if (data.success) {
        toast.success('Iniciando conexión de WhatsApp...');
        // Solo invalidar queries específicas, no todas las de WhatsApp
        queryClient.invalidateQueries({ queryKey: ['whatsapp', 'status'] });
        // No invalidar info-auth ni availability para evitar rate limiting
      } else {
        toast.error(data.message || 'Error al conectar WhatsApp');
      }
    },
    onError: (error) => {
      console.error('❌ Hook onError - Error al conectar WhatsApp:', error);
      
      if (error.message.includes('signal timed out')) {
        toast.error('La conexión está tardando más de 3 minutos. El backend puede estar teniendo problemas. Por favor, intenta nuevamente.');
      } else {
        toast.error('Error al conectar WhatsApp: ' + error.message);
      }
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
    refetchInterval: false, // Deshabilitar auto-refresh
    refetchOnWindowFocus: false, // Deshabilitar refetch al enfocar ventana
    refetchOnMount: false, // Deshabilitar refetch al montar
    retry: 1, // Solo 1 reintento
    retryDelay: 5000, // Esperar 5 segundos entre reintentos
    staleTime: 1800000, // Los datos son válidos por 30 minutos (más tiempo)
    enabled: options?.enabled !== false, // Permitir deshabilitar
    throwOnError: false, // No lanzar error, solo devolverlo
  });
};

// Hook para probar decodificación de JWT
export const useTestJWT = () => {
  return useMutation({
    mutationFn: whatsappApi.testJWT,
    onSuccess: (data) => {
      console.log('✅ Test JWT exitoso:', data);
      if (data.success) {
        toast.success('JWT decodificado correctamente');
      } else {
        toast.error(data.message || 'Error en test JWT');
      }
    },
    onError: (error) => {
      console.error('❌ Error en test JWT:', error);
      toast.error('Error en test JWT: ' + error.message);
    },
  });
};

// Hook para probar configuración del backend
export const useTestConfig = () => {
  return useMutation({
    mutationFn: whatsappApi.testConfig,
    onSuccess: (data) => {
      console.log('✅ Test Config exitoso:', data);
      if (data.success) {
        toast.success('Configuración del backend verificada');
      } else {
        toast.error(data.message || 'Error en test config');
      }
    },
    onError: (error) => {
      console.error('❌ Error en test config:', error);
      toast.error('Error en test config: ' + error.message);
    },
  });
};

// Hook para obtener información de debugging
export const useWhatsAppDebug = () => {
  return useQuery({
    queryKey: ['whatsapp', 'debug'],
    queryFn: whatsappApi.getDebug,
    enabled: false, // Solo se ejecuta manualmente
    retry: false,
  });
};

// Hook para reiniciar conexión WhatsApp
export const useRestartWhatsApp = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: whatsappApi.restart,
    onSuccess: (data) => {
      console.log('🔄 Restart exitoso:', data);
      toast.success('Conexión reiniciada exitosamente');
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['whatsapp'] });
    },
    onError: (error) => {
      console.error('❌ Error al reiniciar:', error);
      toast.error('Error al reiniciar la conexión');
    },
  });
};
