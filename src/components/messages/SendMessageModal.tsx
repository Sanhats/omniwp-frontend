'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMessages, useTemplates } from '@/hooks/useMessages';
import { useClients } from '@/hooks/useClients';
import { useOrders } from '@/hooks/useOrders';
import { useWhatsAppStatus } from '@/hooks/useWhatsApp';
import { MessageTemplates } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Eye, Send, Smartphone, User, Package } from 'lucide-react';
import { toast } from 'sonner';

const sendMessageSchema = z.object({
  clientId: z.string().min(1, 'Debe seleccionar un cliente'),
  orderId: z.string().min(1, 'Debe seleccionar un pedido'),
  templateType: z.enum(['confirmacion', 'recordatorio', 'seguimiento', 'entrega', 'agradecimiento']),
});

type SendMessageFormData = z.infer<typeof sendMessageSchema>;

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
  orderId?: string;
}

const templateLabels = {
  confirmacion: 'Confirmación',
  recordatorio: 'Recordatorio',
  seguimiento: 'Seguimiento',
  entrega: 'Entrega',
  agradecimiento: 'Agradecimiento',
};


export default function SendMessageModal({ isOpen, onClose, clientId, orderId }: SendMessageModalProps) {
  const [previewText, setPreviewText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  const { sendMessage, isSending } = useMessages();
  const { data: templates } = useTemplates();
  const { clients } = useClients();
  const { orders } = useOrders();
  const { data: whatsappStatus } = useWhatsAppStatus();

  const form = useForm<SendMessageFormData>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      clientId: clientId || '',
      orderId: orderId || '',
    },
  });

  const selectedClientId = form.watch('clientId');
  const selectedOrderId = form.watch('orderId');
  const selectedTemplate = form.watch('templateType');

  // Obtener datos del cliente y pedido seleccionados
  const selectedClient = clients?.find(c => c.id === selectedClientId);
  const selectedOrder = orders?.find(o => o.id === selectedOrderId);

  // Debug logs
  console.log('SendMessageModal Debug:', {
    clients: clients?.length || 0,
    orders: orders?.length || 0,
    templates: templates ? 'loaded' : 'not loaded',
    selectedClientId,
    selectedOrderId,
    selectedTemplate,
    selectedClient: selectedClient?.name,
    selectedOrder: selectedOrder?.description,
    previewText: previewText ? 'generated' : 'not generated'
  });

  // Generar vista previa cuando cambien los datos
  useEffect(() => {
    if (selectedClient && selectedOrder && selectedTemplate && templates) {
      const template = templates[selectedTemplate as keyof MessageTemplates];
      if (template) {
        const preview = template
          .replace('{clientName}', selectedClient.name)
          .replace('{orderDescription}', selectedOrder.description);
        setPreviewText(preview);
      }
    }
  }, [selectedClient, selectedOrder, selectedTemplate, templates]);

  const handleSubmit = async (data: SendMessageFormData) => {
    if (!selectedClient || !selectedOrder) {
      toast.error('Error: No se encontraron los datos del cliente o pedido');
      return;
    }

    // Validar que el cliente tenga teléfono
    if (!selectedClient.phone) {
      toast.error('El cliente debe tener un número de teléfono para enviar mensajes');
      return;
    }

    // El backend maneja automáticamente WhatsApp Web vs Twilio
    const messageData = {
      clientId: data.clientId,
      orderId: data.orderId,
      channel: 'whatsapp' as const, // El backend decide automáticamente qué usar
      templateType: data.templateType,
      variables: {
        clientName: selectedClient.name,
        orderDescription: selectedOrder.description,
      },
    };

    sendMessage(messageData, {
      onSuccess: () => {
        const channelUsed = whatsappStatus?.status === 'connected' ? 'WhatsApp Web' : 'Twilio';
        toast.success(`Mensaje enviado por ${channelUsed}`);
        form.reset();
        setPreviewText('');
        setShowPreview(false);
        onClose();
      },
    });
  };

  const handlePreview = () => {
    if (!previewText) {
      toast.error('No hay vista previa disponible');
      return;
    }
    setShowPreview(true);
  };

  const handleCopyPreview = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(previewText);
      toast.success('Vista previa copiada al portapapeles');
    }
  };

  const handleClose = () => {
    form.reset();
    setPreviewText('');
    setShowPreview(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Enviar Mensaje
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Selección de Cliente */}
          <div className="space-y-2">
            <Label htmlFor="clientId">Cliente *</Label>
            <Select
              value={selectedClientId}
              onValueChange={(value) => {
                form.setValue('clientId', value);
                form.setValue('orderId', ''); // Reset order when client changes
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients?.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{client.name}</span>
                      {client.phone && (
                        <Badge variant="outline" className="text-xs">
                          {client.phone}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.clientId && (
              <p className="text-sm text-red-600">{form.formState.errors.clientId.message}</p>
            )}
          </div>

          {/* Selección de Pedido */}
          <div className="space-y-2">
            <Label htmlFor="orderId">Pedido *</Label>
            <Select
              value={selectedOrderId}
              onValueChange={(value) => form.setValue('orderId', value)}
              disabled={!selectedClientId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar pedido" />
              </SelectTrigger>
              <SelectContent>
                {orders
                  ?.filter(order => order.clientId === selectedClientId)
                  .map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>{order.description}</span>
                        <Badge variant="outline" className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {form.formState.errors.orderId && (
              <p className="text-sm text-red-600">{form.formState.errors.orderId.message}</p>
            )}
          </div>

          {/* Información del Canal */}
          <div className="space-y-2">
            <Label>Canal de Envío</Label>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">WhatsApp Inteligente</span>
                    {whatsappStatus?.status === 'connected' ? (
                      <Badge className="bg-green-500 hover:bg-green-600 text-xs">Usará tu WhatsApp</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Usará Twilio</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {whatsappStatus?.status === 'connected' 
                      ? 'El mensaje se enviará desde tu número personal de WhatsApp'
                      : 'El mensaje se enviará usando el servicio de Twilio'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            {whatsappStatus?.status !== 'connected' && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                💡 <span>Conecta tu WhatsApp en Configuración para enviar desde tu número personal</span>
              </p>
            )}
          </div>

          {/* Selección de Template */}
          <div className="space-y-2">
            <Label htmlFor="templateType">Template *</Label>
            <Select
              value={selectedTemplate}
              onValueChange={(value) => form.setValue('templateType', value as 'confirmacion' | 'recordatorio' | 'seguimiento' | 'entrega' | 'agradecimiento')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar template" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(templateLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.templateType && (
              <p className="text-sm text-red-600">{form.formState.errors.templateType.message}</p>
            )}
          </div>

          {/* Vista Previa */}
          {previewText && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Vista Previa
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyPreview}
                    >
                      Copiar
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? 'Ocultar' : 'Mostrar'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {showPreview && (
                <CardContent>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{previewText}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Botón de Vista Previa */}
          {previewText && !showPreview && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePreview}
              className="w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Vista Previa
            </Button>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSending || !selectedClientId || !selectedOrderId || !selectedTemplate}
              className="flex items-center gap-2"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {whatsappStatus?.status === 'connected' ? 'Enviar por WhatsApp' : 'Enviar por Twilio'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
