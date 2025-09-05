import { useMutation } from '@tanstack/react-query';
import { messagesApi } from '@/lib/api/messages';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/types/errors';

export const useMessages = () => {
  // Mutación para generar mensaje desde template
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

  return {
    generateMessage: generateMutation.mutate,
    generatedText: generateMutation.data?.message,
    isGenerating: generateMutation.isPending,
    error: generateMutation.error,
  };
};
