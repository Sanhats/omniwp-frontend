'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { messageTemplateSchema, MessageTemplateFormData } from '@/lib/validations';
import { useMessages } from '@/hooks/useMessages';
import { useClients } from '@/hooks/useClients';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MessageSquare, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

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
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MessageTemplateFormData>({
    resolver: zodResolver(messageTemplateSchema),
    defaultValues: {
      templateType: 'confirmacion',
      clientId: '',
      orderId: '',
    },
  });

  const selectedTemplateType = watch('templateType');
  const selectedClientId = watch('clientId');
  const selectedOrderId = watch('orderId');

  // Filtrar pedidos del cliente seleccionado
  const clientOrders = selectedClientId && orders && Array.isArray(orders)
    ? orders.filter(order => order.clientId === selectedClientId)
    : [];

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

  const handleClientChange = (clientId: string) => {
    setValue('clientId', clientId);
    // Limpiar pedido seleccionado cuando cambia el cliente
    setValue('orderId', '');
  };

  const handleOrderChange = (orderId: string) => {
    setValue('orderId', orderId);
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
              <Label htmlFor="clientId">Cliente *</Label>
              <Select 
                value={selectedClientId} 
                onValueChange={handleClientChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {(clients || []).map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.clientId && (
                <p className="text-sm text-red-500">{errors.clientId.message}</p>
              )}
            </div>

            {/* Order Selection */}
            <div className="space-y-2">
              <Label htmlFor="orderId">Pedido *</Label>
              <Select 
                value={selectedOrderId} 
                onValueChange={handleOrderChange}
                disabled={!selectedClientId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedClientId ? "Selecciona un pedido" : "Primero selecciona un cliente"} />
                </SelectTrigger>
                <SelectContent>
                  {clientOrders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.description} - {order.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.orderId && (
                <p className="text-sm text-red-500">{errors.orderId.message}</p>
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
                      const client = (clients || []).find(c => c.id === selectedClientId);
                      
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
