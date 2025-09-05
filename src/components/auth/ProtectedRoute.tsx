'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user, isInitialized, initializeAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Inicializar autenticación al montar el componente
    if (!isInitialized) {
      initializeAuth();
    }
  }, [isInitialized, initializeAuth]);

  useEffect(() => {
    // Solo redirigir si ya se inicializó y no está autenticado
    if (isInitialized && (!isAuthenticated || !user)) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, user, isInitialized, router]);

  // Mostrar loading mientras se inicializa
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Inicializando...</p>
        </div>
      </div>
    );
  }

  // Mostrar loading mientras se verifica autenticación
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
