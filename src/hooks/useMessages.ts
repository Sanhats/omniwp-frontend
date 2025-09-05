import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from '@/lib/api/messages';
import { MessageFilters } from '@/lib/types';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/types/errors';

export const useMessages = () => {
  const queryClient = useQueryClient();

  // Mutación para generar mensaje desde template (función existente)
  const generateMutation = useMutation({
    mutationFn: messagesApi.generateTemplate,
    onSuccess: (data) => {
      console.log('Respuesta del backend:', data);
      console.log('Mensaje generado:', data.message);
      
      if (data.message) {
        // Copiar al portapapeles
        if (navigator.clipboard) {
          navigator.clipboard.writeText(data.message);
          toast.success('Mensaje generado y copiado al portapapeles');
        } else {
          toast.success('Mensaje generado');
        }
      } else {
        console.error('No se pudo extraer el mensaje de la respuesta:', data);
        toast.error('Error: No se pudo generar el mensaje');
      }
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error) || 'Error al generar el mensaje';
      toast.error(message);
    },
  });

  // Mutación para enviar mensaje real
  const sendMessageMutation = useMutation({
    mutationFn: messagesApi.sendMessage,
    onSuccess: (data) => {
      console.log('Mensaje enviado:', data);
      toast.success('Mensaje enviado correctamente');
      
      // Invalidar queries de mensajes para refrescar el historial
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error) || 'Error al enviar el mensaje';
      toast.error(message);
    },
  });

  return {
    // Funciones existentes
    generateMessage: generateMutation.mutate,
    generatedText: generateMutation.data?.message,
    isGenerating: generateMutation.isPending,
    error: generateMutation.error,
    
    // Nuevas funciones
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    sendError: sendMessageMutation.error,
  };
};

// Hook para obtener historial de mensajes
export const useMessageHistory = (filters?: MessageFilters) => {
  return useQuery({
    queryKey: ['messages', filters],
    queryFn: () => messagesApi.getMessages(filters),
    staleTime: 30000, // 30 segundos
    select: (data) => Array.isArray(data) ? data : [],
  });
};

// Hook para obtener un mensaje específico
export const useMessage = (id: string) => {
  return useQuery({
    queryKey: ['message', id],
    queryFn: () => messagesApi.getMessage(id),
    enabled: !!id,
  });
};

// Hook para obtener templates disponibles
export const useTemplates = () => {
  return useQuery({
    queryKey: ['templates'],
    queryFn: messagesApi.getTemplates,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
