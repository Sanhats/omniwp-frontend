'use client';

import { MessageGenerator } from '@/components/messages/MessageGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, Package } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mensajes</h1>
        <p className="text-gray-600 mt-2">Genera mensajes personalizados para tus clientes</p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plantillas Disponibles</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Confirmación, Recordatorio, Seguimiento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variables Dinámicas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Nombre, Fecha, Estado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Copia Automática</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">✓</div>
            <p className="text-xs text-muted-foreground">
              Al portapapeles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Message Generator */}
      <MessageGenerator />

      {/* Template Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Ejemplos de Plantillas</CardTitle>
          <CardDescription>
            Estas son las plantillas disponibles y sus variables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Confirmación de Pedido</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              &ldquo;Hola {`{clientName}`}, tu pedido ha sido registrado con éxito. Te avisaremos cuando esté listo.&rdquo;
            </p>
            <p className="text-xs text-gray-500">Variables: clientName</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Recordatorio de Pedido</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              &ldquo;Hola {`{clientName}`}, te recordamos que tu pedido del {`{orderDate}`} sigue en estado: {`{orderStatus}`}.&rdquo;
            </p>
            <p className="text-xs text-gray-500">Variables: clientName, orderDate, orderStatus</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Seguimiento de Pedido</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              &ldquo;Hola {`{clientName}`}, tu pedido está ahora en estado: {`{orderStatus}`}. Gracias por confiar en nosotros.&rdquo;
            </p>
            <p className="text-xs text-gray-500">Variables: clientName, orderStatus</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
