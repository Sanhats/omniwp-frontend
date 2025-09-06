'use client';

import { useAuthStore } from '@/store/auth';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { User } from '@/lib/types';

interface LocalStorageData {
  authStore: {
    state?: {
      user?: User | null;
      token?: string | null;
      isAuthenticated?: boolean;
    };
  };
  directToken: string | null;
  directUser: User | null;
}

export function AuthDebug() {
  const { user, token, isAuthenticated } = useAuthStore();
  const [showToken, setShowToken] = useState(false);
  const [localStorageData, setLocalStorageData] = useState<LocalStorageData | null>(null);

  const refreshData = () => {
    const authStore = JSON.parse(localStorage.getItem('auth-storage') || '{}');
    const directToken = localStorage.getItem('token');
    const directUser = localStorage.getItem('user');
    
    setLocalStorageData({
      authStore,
      directToken,
      directUser: directUser ? JSON.parse(directUser) : null
    });
  };

  useEffect(() => {
    refreshData();
  }, []);

  const getTokenPreview = (token: string | null) => {
    if (!token) return 'No disponible';
    return showToken ? token : `${token.substring(0, 20)}...`;
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Debug de Autenticación</CardTitle>
            <CardDescription>
              Información de debug para diagnosticar problemas de autenticación
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado del Store */}
        <div>
          <h4 className="font-medium mb-2">Estado del Store Zustand</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Autenticado:</span>
              <Badge variant={isAuthenticated ? "default" : "destructive"}>
                {isAuthenticated ? "Sí" : "No"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Usuario:</span>
              <span className="text-muted-foreground">
                {user ? `${user.name} (${user.email})` : "No disponible"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Token:</span>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {getTokenPreview(token)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowToken(!showToken)}
                  className="h-6 w-6 p-0"
                >
                  {showToken ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Datos del localStorage */}
        <div>
          <h4 className="font-medium mb-2">Datos del localStorage</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">auth-storage:</span>
              <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                {JSON.stringify(localStorageData?.authStore, null, 2)}
              </pre>
            </div>
            <div>
              <span className="font-medium">token directo:</span>
              <code className="text-xs bg-muted px-2 py-1 rounded ml-2">
                {localStorageData?.directToken ? getTokenPreview(localStorageData.directToken) : "No disponible"}
              </code>
            </div>
            <div>
              <span className="font-medium">usuario directo:</span>
              <span className="text-muted-foreground ml-2">
                {localStorageData?.directUser ? `${localStorageData.directUser.name} (${localStorageData.directUser.email})` : "No disponible"}
              </span>
            </div>
          </div>
        </div>

        {/* Verificación de Headers */}
        <div>
          <h4 className="font-medium mb-2">Verificación de Headers de API</h4>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                try {
                  const authStore = JSON.parse(localStorage.getItem('auth-storage') || '{}');
                  const token = authStore?.state?.token;
                  const directToken = localStorage.getItem('token');
                  const finalToken = token || directToken;
                  
                  if (finalToken) {
                    console.log('Headers que se enviarían:', {
                      'Authorization': `Bearer ${finalToken}`,
                      'Content-Type': 'application/json',
                    });
                    alert('Headers generados correctamente. Revisa la consola.');
                  } else {
                    alert('No se pudo generar el token para los headers.');
                  }
                } catch (error) {
                  console.error('Error generando headers:', error);
                  alert('Error generando headers. Revisa la consola.');
                }
              }}
            >
              Probar Generación de Headers
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                try {
                  const authStore = JSON.parse(localStorage.getItem('auth-storage') || '{}');
                  const token = authStore?.state?.token;
                  const directToken = localStorage.getItem('token');
                  const finalToken = token || directToken;
                  
                  if (finalToken) {
                    // Decodificar JWT
                    const base64Url = finalToken.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    const decoded = JSON.parse(jsonPayload);
                    
                    console.log('JWT decodificado:', decoded);
                    alert(`JWT decodificado:\nuserId: ${decoded.userId}\nemail: ${decoded.email}\nRevisa la consola para más detalles.`);
                  } else {
                    alert('No hay token disponible para decodificar.');
                  }
                } catch (error) {
                  console.error('Error decodificando JWT:', error);
                  alert('Error decodificando JWT. Revisa la consola.');
                }
              }}
            >
              Decodificar JWT
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
