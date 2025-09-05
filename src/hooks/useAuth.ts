import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/types/errors';

export const useAuth = () => {
  const { login, logout, isAuthenticated, isInitialized, initializeAuth } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Mutación para login
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Limpiar caché antes de hacer login
      queryClient.clear();
      
      login(data.user, data.token);
      toast.success('¡Bienvenido!');
      router.push('/dashboard');
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error) || 'Error al iniciar sesión';
      toast.error(message);
    },
  });

  // Mutación para registro
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success('¡Cuenta creada exitosamente!');
      router.push('/auth/login');
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error) || 'Error al crear la cuenta';
      toast.error(message);
    },
  });

  // Función para logout
  const handleLogout = () => {
    // Limpiar todo el caché de React Query
    queryClient.clear();
    
    // Hacer logout del store
    logout();
    
    toast.success('Sesión cerrada');
    router.push('/auth/login');
  };

  // Verificar salud del backend (deshabilitado temporalmente por CORS)
  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: authApi.health,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: false, // Deshabilitado temporalmente
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: handleLogout,
    isAuthenticated,
    isInitialized,
    initializeAuth,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    isBackendHealthy: healthQuery.isSuccess,
  };
};
