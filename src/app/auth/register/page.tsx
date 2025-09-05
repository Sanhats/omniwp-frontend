import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">OmniWP</h1>
          <p className="text-gray-600">Gestión de Clientes y Pedidos</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
