import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientsApi } from '@/lib/api/clients';
import { ClientUpdateFormData } from '@/lib/validations';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/types/errors';

export const useClients = () => {
  const queryClient = useQueryClient();

  // Query para obtener todos los clientes
  const clientsQuery = useQuery({
    queryKey: ['clients'],
    queryFn: clientsApi.getAll,
  });

  // Mutación para crear cliente
  const createMutation = useMutation({
    mutationFn: clientsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente creado exitosamente');
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error) || 'Error al crear el cliente';
      toast.error(message);
    },
  });

  // Mutación para actualizar cliente
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClientUpdateFormData }) =>
      clientsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente actualizado exitosamente');
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error) || 'Error al actualizar el cliente';
      toast.error(message);
    },
  });

  // Mutación para eliminar cliente
  const deleteMutation = useMutation({
    mutationFn: clientsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente eliminado exitosamente');
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error) || 'Error al eliminar el cliente';
      toast.error(message);
    },
  });

  return {
    clients: Array.isArray(clientsQuery.data) ? clientsQuery.data : [],
    isLoading: clientsQuery.isLoading,
    error: clientsQuery.error,
    createClient: createMutation.mutate,
    updateClient: updateMutation.mutate,
    deleteClient: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
