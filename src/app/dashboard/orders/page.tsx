'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useClients } from '@/hooks/useClients';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Package, Loader2 } from 'lucide-react';
import { OrderForm } from '@/components/orders/OrderForm';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { OrderFormData, OrderUpdateFormData } from '@/lib/validations';

export default function OrdersPage() {
  const {
    orders,
    isLoading: ordersLoading,
    createOrder,
    updateOrder,
    deleteOrder,
    isCreating,
    isUpdating,
    isDeleting,
  } = useOrders();

  const {
    clients,
    isLoading: clientsLoading,
  } = useClients();

  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const handleCreate = (data: OrderFormData | OrderUpdateFormData) => {
    if ('clientId' in data) {
      createOrder(data as OrderFormData);
      setIsCreateFormOpen(false);
    }
  };

  const handleUpdate = (id: string, data: OrderUpdateFormData) => {
    updateOrder({ id, data });
  };

  const handleDelete = (id: string) => {
    deleteOrder(id);
  };

  const isLoading = ordersLoading || clientsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
            <p className="text-gray-600 mt-2">Gestiona todos tus pedidos</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando pedidos...</p>
          </div>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter(order => order.status === 'pendiente').length;
  const inProgressOrders = orders.filter(order => order.status === 'en_proceso').length;
  const completedOrders = orders.filter(order => order.status === 'completado').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-600 mt-2">Gestiona todos tus pedidos</p>
        </div>
        <Button 
          onClick={() => setIsCreateFormOpen(true)}
          disabled={clients.length === 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Pedido
        </Button>
      </div>

      {clients.length === 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-yellow-800">
              <Package className="h-5 w-5" />
              <p className="font-medium">
                Necesitas tener al menos un cliente para crear pedidos
              </p>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Ve a la sección de Clientes para agregar tu primer cliente
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Package className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Pedidos por procesar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{inProgressOrders}</div>
            <p className="text-xs text-muted-foreground">
              Pedidos en preparación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedOrders}</div>
            <p className="text-xs text-muted-foreground">
              Pedidos finalizados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <OrdersTable
        orders={orders}
        clients={clients}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />

      {/* Create Order Form */}
      <OrderForm
        isOpen={isCreateFormOpen}
        onClose={() => setIsCreateFormOpen(false)}
        onSubmit={handleCreate}
        isLoading={isCreating}
        order={null}
        clients={clients}
        title="Nuevo Pedido"
        description="Crea un nuevo pedido para un cliente"
        isUpdate={false}
      />
    </div>
  );
}
