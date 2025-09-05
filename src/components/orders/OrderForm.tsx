'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderSchema, orderUpdateSchema, OrderFormData, OrderUpdateFormData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Package, User } from 'lucide-react';
import { Order, Client } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OrderFormData | OrderUpdateFormData) => void;
  isLoading: boolean;
  order?: Order | null;
  clients: Client[];
  title: string;
  description: string;
  isUpdate?: boolean;
}

export function OrderForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  order,
  clients,
  title,
  description,
  isUpdate = false,
}: OrderFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrderFormData | OrderUpdateFormData>({
    resolver: zodResolver(isUpdate ? orderUpdateSchema : orderSchema),
    defaultValues: order ? {
      description: order.description,
      status: order.status,
    } : {
      clientId: '',
      description: '',
    },
  });

  const selectedClientId = watch('clientId');

  const handleFormSubmit = (data: OrderFormData | OrderUpdateFormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {!isUpdate && (
            <div className="space-y-2">
              <Label htmlFor="clientId">Cliente *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Select
                  value={selectedClientId}
                  onValueChange={(value) => setValue('clientId', value)}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Selecciona un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {!isUpdate && 'clientId' in errors && errors.clientId && (
                <p className="text-sm text-red-500">{errors.clientId.message}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <div className="relative">
              <Package className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="description"
                type="text"
                placeholder="Descripción del pedido"
                className="pl-10"
                {...register('description')}
              />
            </div>
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {isUpdate && (
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={watch('status')}
                onValueChange={(value) => setValue('status', value as Order['status'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              {'status' in errors && errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {order ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                order ? 'Actualizar' : 'Crear'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
