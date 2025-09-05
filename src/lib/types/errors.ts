// Tipos para manejo de errores de API

export interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

export const getErrorMessage = (error: unknown): string => {
  const apiError = error as ApiError;
  return apiError?.response?.data?.error || apiError?.message || 'Error desconocido';
};
