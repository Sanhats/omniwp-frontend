'use client';

import { WhatsAppStatusCard } from '@/components/whatsapp/WhatsAppStatusCard';
import { AuthDebug } from '@/components/debug/AuthDebug';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Smartphone, MessageSquare, Bug } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Configuración</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <WhatsAppStatusCard />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Configuración de Mensajes</span>
            </CardTitle>
            <CardDescription>
              Configuración general del sistema de mensajería
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Fallback a Twilio</span>
                <span className="text-sm text-muted-foreground">Activo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Notificaciones</span>
                <span className="text-sm text-muted-foreground">Activo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Auto-refresh</span>
                <span className="text-sm text-muted-foreground">60s</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Debug de Autenticación - Solo mostrar en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bug className="h-5 w-5" />
              <span>Debug de Autenticación</span>
            </CardTitle>
            <CardDescription>
              Herramientas de debug para diagnosticar problemas de autenticación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthDebug />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <span>Información sobre WhatsApp Web</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <h4 className="font-medium">¿Qué es WhatsApp Web?</h4>
            <p className="text-sm text-muted-foreground">
              WhatsApp Web te permite enviar mensajes desde tu número personal de WhatsApp 
              directamente desde la aplicación, en lugar de usar el servicio de Twilio.
            </p>
            
            <h4 className="font-medium mt-4">Ventajas:</h4>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Envío desde tu número personal</li>
              <li>Recibes respuestas directamente en tu WhatsApp</li>
              <li>Sin costos adicionales por mensaje</li>
              <li>Fallback automático a Twilio si no estás conectado</li>
            </ul>

            <h4 className="font-medium mt-4">Cómo usar:</h4>
            <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
              <li>Haz clic en &quot;Conectar WhatsApp&quot;</li>
              <li>Escanea el código QR con tu teléfono</li>
              <li>Selecciona &quot;Enviar por mi WhatsApp&quot; al crear mensajes</li>
              <li>Los mensajes se enviarán desde tu número personal</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
