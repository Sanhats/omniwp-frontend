import { z } from 'zod';

// Validaciones para autenticación
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// Validaciones para clientes
export const clientSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
});

export const clientUpdateSchema = clientSchema.partial();

// Validaciones para pedidos
export const orderSchema = z.object({
  clientId: z.string().min(1, 'Debe seleccionar un cliente'),
  description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
});

export const orderUpdateSchema = z.object({
  description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres').optional(),
  status: z.enum(['pendiente', 'en_proceso', 'completado', 'cancelado']).optional(),
});

// Validaciones para mensajes
export const messageTemplateSchema = z.object({
  templateType: z.enum(['confirmacion', 'recordatorio', 'seguimiento']),
  variables: z.object({
    clientName: z.string().optional(),
    orderDate: z.string().optional(),
    orderStatus: z.string().optional(),
  }),
});

// Tipos inferidos de las validaciones
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ClientFormData = z.infer<typeof clientSchema>;
export type ClientUpdateFormData = z.infer<typeof clientUpdateSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
export type OrderUpdateFormData = z.infer<typeof orderUpdateSchema>;
export type MessageTemplateFormData = z.infer<typeof messageTemplateSchema>;
