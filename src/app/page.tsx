'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, isInitialized, initializeAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Inicializar autenticación al montar el componente
    if (!isInitialized) {
      initializeAuth();
    }
  }, [isInitialized, initializeAuth]);

  useEffect(() => {
    // Solo redirigir si ya se inicializó
    if (isInitialized) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/auth/login');
      }
    }
  }, [isAuthenticated, isInitialized, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">
          {isInitialized ? 'Cargando...' : 'Inicializando...'}
        </p>
      </div>
    </div>
  );
}
