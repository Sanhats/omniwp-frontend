'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { messageTemplateSchema, MessageTemplateFormData } from '@/lib/validations';
import { useMessages } from '@/hooks/useMessages';
import { useClients } from '@/hooks/useClients';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MessageSquare, Copy, Check } from 'lucide-react';

const templateTypes = [
  { value: 'confirmacion', label: 'Confirmación de Pedido' },
  { value: 'recordatorio', label: 'Recordatorio de Pedido' },
  { value: 'seguimiento', label: 'Seguimiento de Pedido' },
];

export function MessageGenerator() {
  const { generateMessage, generatedText, isGenerating } = useMessages();
  const { clients } = useClients();
  const { orders } = useOrders();
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MessageTemplateFormData>({
    resolver: zodResolver(messageTemplateSchema),
    defaultValues: {
      templateType: 'confirmacion',
      variables: {},
    },
  });

  const selectedTemplateType = watch('templateType');

  const handleFormSubmit = (data: MessageTemplateFormData) => {
    generateMessage(data);
  };

  const handleCopy = async () => {
    if (generatedText && navigator.clipboard) {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : '';
  };

  const getOrderInfo = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { date: '', status: '' };
    
    const client = clients.find(c => c.id === order.clientId);
    return {
      date: new Date().toLocaleDateString('es-ES'),
      status: order.status,
      clientName: client?.name || '',
    };
  };

  const handleClientChange = (clientId: string) => {
    setValue('variables.clientName', getClientName(clientId));
  };

  const handleOrderChange = (orderId: string) => {
    const orderInfo = getOrderInfo(orderId);
    setValue('variables.orderDate', orderInfo.date);
    setValue('variables.orderStatus', orderInfo.status);
    setValue('variables.clientName', orderInfo.clientName);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Generador de Mensajes</span>
          </CardTitle>
          <CardDescription>
            Crea mensajes personalizados usando plantillas predefinidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Template Type */}
            <div className="space-y-2">
              <Label htmlFor="templateType">Tipo de Mensaje</Label>
              <Select
                value={selectedTemplateType}
                onValueChange={(value) => setValue('templateType', value as 'confirmacion' | 'recordatorio' | 'seguimiento')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo de mensaje" />
                </SelectTrigger>
                <SelectContent>
                  {templateTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.templateType && (
                <p className="text-sm text-red-500">{errors.templateType.message}</p>
              )}
            </div>

            {/* Client Selection */}
            <div className="space-y-2">
              <Label htmlFor="clientId">Cliente</Label>
              <Select onValueChange={handleClientChange}>
                <SelectTrigger>
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

            {/* Order Selection (for recordatorio and seguimiento) */}
            {(selectedTemplateType === 'recordatorio' || selectedTemplateType === 'seguimiento') && (
              <div className="space-y-2">
                <Label htmlFor="orderId">Pedido</Label>
                <Select onValueChange={handleOrderChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un pedido" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map((order) => {
                      const client = clients.find(c => c.id === order.clientId);
                      return (
                        <SelectItem key={order.id} value={order.id}>
                          {order.description} - {client?.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Manual Variables */}
            <div className="space-y-4">
              <Label>Variables del Mensaje</Label>
              
              <div className="space-y-2">
                <Label htmlFor="clientName">Nombre del Cliente</Label>
                <Input
                  id="clientName"
                  placeholder="Nombre del cliente"
                  {...register('variables.clientName')}
                />
              </div>

              {(selectedTemplateType === 'recordatorio' || selectedTemplateType === 'seguimiento') && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="orderDate">Fecha del Pedido</Label>
                    <Input
                      id="orderDate"
                      placeholder="Fecha del pedido"
                      {...register('variables.orderDate')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orderStatus">Estado del Pedido</Label>
                    <Input
                      id="orderStatus"
                      placeholder="Estado del pedido"
                      {...register('variables.orderStatus')}
                    />
                  </div>
                </>
              )}
            </div>

            <Button type="submit" disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando mensaje...
                </>
              ) : (
                'Generar Mensaje'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Generated Message */}
      {generatedText && (
        <Card>
          <CardHeader>
            <CardTitle>Mensaje Generado</CardTitle>
            <CardDescription>
              Tu mensaje personalizado está listo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={generatedText}
                readOnly
                className="min-h-[100px] resize-none"
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="flex-1"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    if (generatedText) {
                      const clientName = watch('variables.clientName');
                      const client = clients.find(c => c.name === clientName);
                      
                      if (client && client.phone) {
                        // Limpiar el teléfono (remover + si existe)
                        const cleanPhone = client.phone.replace('+', '');
                        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(generatedText)}`;
                        window.open(whatsappUrl, '_blank');
                        toast.success(`Abriendo WhatsApp para ${client.name}`);
                      } else {
                        toast.error('Selecciona un cliente con teléfono válido para enviar el mensaje');
                      }
                    } else {
                      toast.error('Primero genera un mensaje');
                    }
                  }}
                  className="flex-1"
                  disabled={!generatedText}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Enviar por WhatsApp
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
