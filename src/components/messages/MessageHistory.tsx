'use client';

import { useState } from 'react';
import { useMessageHistory } from '@/hooks/useMessages';
import { MessageFilters } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Search, Filter, Calendar, User, Package, Smartphone, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface MessageHistoryProps {
  clientId?: string;
  orderId?: string;
}

const statusConfig = {
  queued: { label: 'En Cola', color: 'bg-yellow-100 text-yellow-800' },
  sent: { label: 'Enviado', color: 'bg-blue-100 text-blue-800' },
  delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800' },
  read: { label: 'Leído', color: 'bg-purple-100 text-purple-800' },
  failed: { label: 'Fallido', color: 'bg-red-100 text-red-800' },
};

const channelConfig = {
  whatsapp: { label: 'WhatsApp', icon: Smartphone, color: 'text-green-600' },
  email: { label: 'Email', icon: Mail, color: 'text-blue-600' },
};

export default function MessageHistory({ clientId, orderId }: MessageHistoryProps) {
  const [filters, setFilters] = useState<MessageFilters>({
    clientId,
    orderId,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { data: messages = [], isLoading, error, refetch } = useMessageHistory(filters);

  const handleFilterChange = (key: keyof MessageFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({ clientId, orderId });
    setSearchTerm('');
  };

  const filteredMessages = messages.filter(message =>
    message.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar mensajes por cliente
  const groupedMessages = filteredMessages.reduce((acc, message) => {
    const clientId = message.clientId;
    if (!acc[clientId]) {
      acc[clientId] = [];
    }
    acc[clientId].push(message);
    return acc;
  }, {} as Record<string, typeof filteredMessages>);

  // Obtener información de clientes para mostrar nombres
  const getClientName = (clientId: string) => {
    // En un caso real, esto vendría de un hook o contexto
    return `Cliente ${clientId.slice(-8)}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Historial de Mensajes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Historial de Mensajes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Error al cargar los mensajes</p>
            <Button onClick={() => refetch()} variant="outline">
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Historial de Mensajes
          <Badge variant="secondary">{filteredMessages.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar en mensajes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select
            value={filters.status || ''}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los estados</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.channel || ''}
            onValueChange={(value) => handleFilterChange('channel', value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Canal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los canales</SelectItem>
              {Object.entries(channelConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Limpiar
          </Button>
        </div>

        {/* Lista de mensajes agrupados */}
        {filteredMessages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hay mensajes para mostrar</p>
            {searchTerm && (
              <p className="text-sm">Intenta con otros términos de búsqueda</p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMessages).map(([clientId, clientMessages]) => (
              <div key={clientId} className="space-y-3">
                {/* Header del cliente */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-sm">
                      {getClientName(clientId)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {clientMessages.length} mensaje{clientMessages.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(clientMessages[0].createdAt), 'dd/MM/yyyy', { locale: es })}
                  </div>
                </div>

                {/* Mensajes del cliente */}
                <div className="space-y-2 ml-4">
                  {clientMessages.map((message) => {
                    const statusInfo = statusConfig[message.status as keyof typeof statusConfig];
                    const channelInfo = channelConfig[message.channel as keyof typeof channelConfig];
                    const ChannelIcon = channelInfo.icon;

                    return (
                      <div
                        key={message.id}
                        className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <ChannelIcon className={`h-4 w-4 ${channelInfo.color}`} />
                            <span className="font-medium text-sm">
                              {channelInfo.label}
                            </span>
                            <Badge className={statusInfo.color}>
                              {statusInfo.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(message.createdAt), 'HH:mm', { locale: es })}
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-2 text-sm">{message.text}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            Pedido: {message.orderId.slice(-8)}
                          </div>
                          {message.providerMessageId && (
                            <div className="text-xs text-gray-400">
                              ID: {message.providerMessageId.slice(-8)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
