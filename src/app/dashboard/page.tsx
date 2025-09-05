'use client';

import { useClients } from '@/hooks/useClients';
import { useOrders } from '@/hooks/useOrders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, MessageSquare, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { clients, isLoading: clientsLoading } = useClients();
  const { orders, isLoading: ordersLoading } = useOrders();

  const pendingOrders = orders.filter(order => order.status === 'pendiente').length;
  const inProgressOrders = orders.filter(order => order.status === 'en_proceso').length;
  const completedOrders = orders.filter(order => order.status === 'completado').length;

  const stats = [
    {
      title: 'Total Clientes',
      value: clients.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/dashboard/clients',
    },
    {
      title: 'Pedidos Pendientes',
      value: pendingOrders,
      icon: Package,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      href: '/dashboard/orders',
    },
    {
      title: 'En Proceso',
      value: inProgressOrders,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/dashboard/orders',
    },
    {
      title: 'Completados',
      value: completedOrders,
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/dashboard/orders',
    },
  ];

  if (clientsLoading || ordersLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Resumen de tu negocio</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Resumen de tu negocio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Gestiona tu negocio de manera eficiente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/clients">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Gestionar Clientes
              </Button>
            </Link>
            <Link href="/dashboard/orders">
              <Button variant="outline" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Gestionar Pedidos
              </Button>
            </Link>
            <Link href="/dashboard/messages">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Generar Mensajes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen de Pedidos</CardTitle>
            <CardDescription>
              Estado actual de tus pedidos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pendientes</span>
              <span className="font-semibold text-yellow-600">{pendingOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">En Proceso</span>
              <span className="font-semibold text-orange-600">{inProgressOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completados</span>
              <span className="font-semibold text-green-600">{completedOrders}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
