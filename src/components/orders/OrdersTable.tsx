'use client';

import { useState } from 'react';
import { Order, Client } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Package, User, MessageSquare } from 'lucide-react';
import { OrderForm } from './OrderForm';
import { OrderUpdateFormData } from '@/lib/validations';
import { useMessageHistory } from '@/hooks/useMessages';
import SendMessageModal from '../messages/SendMessageModal';

interface OrdersTableProps {
  orders: Order[];
  clients: Client[];
  onUpdate: (id: string, data: OrderUpdateFormData) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const statusColors = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  en_proceso: 'bg-orange-100 text-orange-800',
  completado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800',
};

const statusLabels = {
  pendiente: 'Pendiente',
  en_proceso: 'En Proceso',
  completado: 'Completado',
  cancelado: 'Cancelado',
};

export function OrdersTable({
  orders,
  clients,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: OrdersTableProps) {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sendMessageOrder, setSendMessageOrder] = useState<Order | null>(null);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const { data: messages = [] } = useMessageHistory();

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setIsFormOpen(true);
  };

  const handleUpdate = (data: OrderUpdateFormData) => {
    if (editingOrder) {
      onUpdate(editingOrder.id, data);
      setEditingOrder(null);
      setIsFormOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
      onDelete(id);
    }
  };

  const handleSendMessage = (order: Order) => {
    setSendMessageOrder(order);
    setIsSendModalOpen(true);
  };

  const getMessageCount = (orderId: string) => {
    return messages.filter(message => message.orderId === orderId).length;
  };

  const handleCloseForm = () => {
    setEditingOrder(null);
    setIsFormOpen(false);
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente no encontrado';
  };

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
          <CardDescription>
            No tienes pedidos registrados aún
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            Comienza agregando tu primer pedido
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
          <CardDescription>
            Gestiona todos tus pedidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Package className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{order.description}</div>
                          <div className="text-sm text-gray-500">ID: {order.id.slice(0, 8)}...</div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>
                              {getMessageCount(order.id)} mensaje{getMessageCount(order.id) !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{getClientName(order.clientId)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendMessage(order)}
                          title="Enviar mensaje"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(order)}
                          disabled={isUpdating}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(order.id)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <OrderForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleUpdate}
        isLoading={isUpdating}
        order={editingOrder}
        clients={clients}
        title="Editar Pedido"
        description="Modifica la información del pedido"
        isUpdate={true}
      />

      <SendMessageModal
        isOpen={isSendModalOpen}
        onClose={() => {
          setIsSendModalOpen(false);
          setSendMessageOrder(null);
        }}
        clientId={sendMessageOrder?.clientId}
        orderId={sendMessageOrder?.id}
      />
    </>
  );
}
