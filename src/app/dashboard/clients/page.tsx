'use client';

import { useState } from 'react';
import { useClients } from '@/hooks/useClients';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, Loader2 } from 'lucide-react';
import { ClientForm } from '@/components/clients/ClientForm';
import { ClientsTable } from '@/components/clients/ClientsTable';
import { ClientFormData, ClientUpdateFormData } from '@/lib/validations';

export default function ClientsPage() {
  const {
    clients,
    isLoading,
    createClient,
    updateClient,
    deleteClient,
    isCreating,
    isUpdating,
    isDeleting,
  } = useClients();

  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const handleCreate = (data: ClientFormData) => {
    createClient(data);
    setIsCreateFormOpen(false);
  };

  const handleUpdate = (id: string, data: ClientUpdateFormData) => {
    updateClient({ id, data });
  };

  const handleDelete = (id: string) => {
    deleteClient(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600 mt-2">Gestiona tu cartera de clientes</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando clientes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-2">Gestiona tu cartera de clientes</p>
        </div>
        <Button onClick={() => setIsCreateFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{clients.length}</div>
          <p className="text-xs text-muted-foreground">
            {clients.length === 0 
              ? 'No tienes clientes registrados' 
              : `${clients.length} cliente${clients.length !== 1 ? 's' : ''} registrado${clients.length !== 1 ? 's' : ''}`
            }
          </p>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <ClientsTable
        clients={clients}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />

      {/* Create Client Form */}
      <ClientForm
        isOpen={isCreateFormOpen}
        onClose={() => setIsCreateFormOpen(false)}
        onSubmit={handleCreate}
        isLoading={isCreating}
        client={null}
        title="Nuevo Cliente"
        description="Agrega un nuevo cliente a tu cartera"
      />
    </div>
  );
}
