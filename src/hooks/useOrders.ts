import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api/orders';
import { OrderUpdateFormData } from '@/lib/validations';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/types/errors';

export const useOrders = () => {
  const queryClient = useQueryClient();

  // Query para obtener todos los pedidos
  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.getAll,
  });

  // Mutación para crear pedido
  const createMutation = useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Pedido creado exitosamente');
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error) || 'Error al crear el pedido';
      toast.error(message);
    },
  });

  // Mutación para actualizar pedido
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: OrderUpdateFormData }) =>
      ordersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Pedido actualizado exitosamente');
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error) || 'Error al actualizar el pedido';
      toast.error(message);
    },
  });

  // Mutación para eliminar pedido
  const deleteMutation = useMutation({
    mutationFn: ordersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Pedido eliminado exitosamente');
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error) || 'Error al eliminar el pedido';
      toast.error(message);
    },
  });

  return {
    orders: Array.isArray(ordersQuery.data) ? ordersQuery.data : [],
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,
    createOrder: createMutation.mutate,
    updateOrder: updateMutation.mutate,
    deleteOrder: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
