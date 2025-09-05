import { useMutation } from '@tanstack/react-query';
import { messagesApi } from '@/lib/api/messages';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/types/errors';

export const useMessages = () => {
  // Mutación para generar mensaje desde template
  const generateMutation = useMutation({
    mutationFn: messagesApi.generateTemplate,
    onSuccess: (data) => {
      // Copiar al portapapeles
      if (navigator.clipboard) {
        navigator.clipboard.writeText(data.text);
        toast.success('Mensaje generado y copiado al portapapeles');
      } else {
        toast.success('Mensaje generado');
      }
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error) || 'Error al generar el mensaje';
      toast.error(message);
    },
  });

  return {
    generateMessage: generateMutation.mutate,
    generatedText: generateMutation.data?.text,
    isGenerating: generateMutation.isPending,
    error: generateMutation.error,
  };
};
