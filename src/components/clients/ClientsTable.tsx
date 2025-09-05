'use client';

import { useState } from 'react';
import { Client } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Phone, Mail, User, MessageSquare } from 'lucide-react';
import { ClientForm } from './ClientForm';
import { ClientUpdateFormData } from '@/lib/validations';
import { useOrders } from '@/hooks/useOrders';
import { useMessageHistory } from '@/hooks/useMessages';
import { toast } from 'sonner';
import SendMessageModal from '../messages/SendMessageModal';

interface ClientsTableProps {
  clients: Client[];
  onUpdate: (id: string, data: ClientUpdateFormData) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function ClientsTable({
  clients,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: ClientsTableProps) {
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sendMessageClient, setSendMessageClient] = useState<Client | null>(null);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const { orders } = useOrders();
  const { data: messages = [] } = useMessageHistory();

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleUpdate = (data: ClientUpdateFormData) => {
    if (editingClient) {
      onUpdate(editingClient.id, data);
      setEditingClient(null);
      setIsFormOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    // Verificar si el cliente tiene pedidos asociados
    const clientOrders = orders.filter(order => order.clientId === id);
    
    if (clientOrders.length > 0) {
      toast.error(`No se puede eliminar este cliente porque tiene ${clientOrders.length} pedido(s) asociado(s). Elimina primero los pedidos.`);
      return;
    }
    
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      onDelete(id);
    }
  };

  const handleSendMessage = (client: Client) => {
    setSendMessageClient(client);
    setIsSendModalOpen(true);
  };

  const getMessageCount = (clientId: string) => {
    if (!messages || !Array.isArray(messages)) return 0;
    return messages.filter(message => message.clientId === clientId).length;
  };

  const handleCloseForm = () => {
    setEditingClient(null);
    setIsFormOpen(false);
  };

  if (clients.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
          <CardDescription>
            No tienes clientes registrados aún
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            Comienza agregando tu primer cliente
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Gestiona tu cartera de clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(clients || []).map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-gray-500">ID: {client.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{client.phone}</span>
                        </div>
                        {client.email && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span>{client.email}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-sm">
                          <MessageSquare className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-500">
                            {getMessageCount(client.id)} mensaje{getMessageCount(client.id) !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendMessage(client)}
                          disabled={!client.phone}
                          title={!client.phone ? "El cliente debe tener teléfono para enviar mensajes" : "Enviar mensaje"}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(client)}
                          disabled={isUpdating}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(client.id)}
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

      <ClientForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleUpdate}
        isLoading={isUpdating}
        client={editingClient}
        title="Editar Cliente"
        description="Modifica la información del cliente"
      />

      <SendMessageModal
        isOpen={isSendModalOpen}
        onClose={() => {
          setIsSendModalOpen(false);
          setSendMessageClient(null);
        }}
        clientId={sendMessageClient?.id}
      />
    </>
  );
}
