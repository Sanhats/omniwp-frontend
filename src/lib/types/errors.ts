// Tipos para manejo de errores de API
import { AxiosError } from 'axios';

export interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
      details?: unknown;
    };
  };
  message?: string;
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    console.error('API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        method: error.config?.method,
        url: error.config?.url,
        data: error.config?.data,
      }
    });
    
    if (error.response?.data) {
      const data = error.response.data as { message?: string; error?: string };
      return data.message || data.error || `Error ${error.response.status}: ${error.response.statusText}`;
    }
    return error.message || 'Error de conexión';
  }
  
  const apiError = error as ApiError;
  return apiError?.response?.data?.error || apiError?.message || 'Error desconocido';
};
