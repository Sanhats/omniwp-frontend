'use client';

import { useAuthStore } from '@/store/auth';
import { User } from 'lucide-react';

export function Header() {
  const { user } = useAuthStore();

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
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{user?.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
