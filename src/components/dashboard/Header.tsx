'use client';

import { useAuthStore } from '@/store/auth';
import { useWhatsAppStatus } from '@/hooks/useWhatsApp';
import { User, Smartphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function Header() {
  const { user } = useAuthStore();
  const { data: whatsappStatus } = useWhatsAppStatus();

  const getWhatsAppBadge = () => {
    if (!whatsappStatus) return null;

    const isConnected = whatsappStatus.status === 'connected';
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={isConnected ? "default" : "secondary"}
              className={`flex items-center space-x-1 ${
                isConnected 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-gray-500 hover:bg-gray-600'
              }`}
            >
              <Smartphone className="h-3 w-3" />
              <span className="text-xs">
                {isConnected ? 'WhatsApp' : 'Sin WhatsApp'}
              </span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isConnected 
                ? 'WhatsApp Web conectado - Envía desde tu número personal'
                : 'WhatsApp Web desconectado - Se usará Twilio para envíos'
              }
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            ¡Hola, {user?.name}!
          </h2>
          <p className="text-sm text-gray-600">
            Gestiona tus clientes y pedidos de manera eficiente
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {getWhatsAppBadge()}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{user?.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
