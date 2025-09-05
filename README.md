# OmniWP Frontend

Sistema de gestión para pequeños comercios y emprendedores que permite manejar de forma centralizada clientes, pedidos y comunicaciones por WhatsApp.

## 🚀 Características

- **Autenticación JWT**: Sistema de login y registro seguro
- **Gestión de Clientes**: CRUD completo para administrar la cartera de clientes
- **Gestión de Pedidos**: Control de pedidos vinculados a clientes con estados
- **Generación de Mensajes**: Plantillas predefinidas para WhatsApp con variables dinámicas
- **Dashboard Responsive**: Interfaz moderna y adaptable a móvil y desktop
- **Notificaciones**: Feedback en tiempo real con toasts

## 🛠️ Stack Tecnológico

- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **TailwindCSS** - Estilos utilitarios
- **shadcn/ui** - Componentes prearmados
- **React Query** - Manejo de estado asíncrono
- **Zustand** - Estado global
- **React Hook Form** - Formularios con validación
- **Zod** - Validación de esquemas
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos

## 📋 Prerrequisitos

- Node.js 18+ 
- npm, yarn o pnpm
- Backend OmniWP ejecutándose en Railway: `https://omniwp-backend-production.up.railway.app/api/v1`

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd omniwp-frontend
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env.local
```

Editar `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://omniwp-backend-production.up.railway.app/api/v1
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

5. **Abrir en el navegador**
```
http://localhost:3001
```

## 👤 Usuarios de Prueba

El backend incluye usuarios de prueba:

- **Email**: `tomas@test.com`
- **Contraseña**: `123456`

- **Email**: `maria@test.com`  
- **Contraseña**: `123456`

## 📱 Funcionalidades

### 🔐 Autenticación
- Registro de nuevos usuarios
- Login con email y contraseña
- Persistencia de sesión con JWT
- Redirección automática según estado de autenticación

### 👥 Gestión de Clientes
- Listado de clientes del usuario autenticado
- Crear, editar y eliminar clientes
- Validación de datos en frontend
- Campos: nombre, teléfono, email (opcional)

### 📦 Gestión de Pedidos
- Listado de pedidos vinculados a clientes
- Crear, editar y eliminar pedidos
- Estados: pendiente, en_proceso, completado, cancelado
- Validación de cliente asociado

### 💬 Generación de Mensajes
- **Confirmación**: Mensaje de pedido registrado
- **Recordatorio**: Recordatorio de pedido pendiente
- **Seguimiento**: Actualización de estado del pedido
- Variables dinámicas: nombre del cliente, fecha, estado
- Copia automática al portapapeles

## 🎨 Diseño

- **Responsive**: Adaptable a móvil y desktop
- **Moderno**: Diseño limpio con shadcn/ui
- **Accesible**: Componentes con buena accesibilidad
- **Consistente**: Sistema de colores y tipografía unificado

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Inicio en producción
npm run start

# Linting
npm run lint

# Type checking
npm run type-check
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── auth/              # Páginas de autenticación
│   ├── dashboard/         # Páginas del dashboard
│   └── layout.tsx         # Layout principal
├── components/            # Componentes reutilizables
│   ├── auth/             # Componentes de autenticación
│   ├── dashboard/        # Componentes del dashboard
│   ├── clients/          # Componentes de clientes
│   ├── orders/           # Componentes de pedidos
│   ├── messages/         # Componentes de mensajes
│   └── ui/               # Componentes de shadcn/ui
├── hooks/                # Hooks personalizados
├── lib/                  # Utilidades y configuración
│   ├── api/              # Servicios de API
│   ├── types/            # Tipos TypeScript
│   ├── validations/      # Esquemas de validación
│   └── utils.ts          # Utilidades generales
└── store/                # Estado global con Zustand
```

## 🔌 Integración con Backend

El frontend se conecta al backend a través de los siguientes endpoints:

### Autenticación
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Login de usuario
- `GET /health` - Verificación de salud

### Clientes
- `GET /clients` - Listar clientes
- `POST /clients` - Crear cliente
- `PUT /clients/:id` - Actualizar cliente
- `DELETE /clients/:id` - Eliminar cliente

### Pedidos
- `GET /orders` - Listar pedidos
- `POST /orders` - Crear pedido
- `PUT /orders/:id` - Actualizar pedido
- `DELETE /orders/:id` - Eliminar pedido

### Mensajes
- `POST /messages/template` - Generar mensaje desde template

## 🚀 Despliegue

### Variables de Entorno para Producción

```env
NEXT_PUBLIC_API_URL=https://api.omniwp.com/api/v1
```

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variable de entorno `NEXT_PUBLIC_API_URL`
3. Desplegar automáticamente

### Otros Proveedores

El proyecto es compatible con cualquier proveedor que soporte Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisar la documentación del backend
2. Verificar que el backend esté ejecutándose
3. Comprobar las variables de entorno
4. Revisar la consola del navegador para errores

## 🔄 Próximas Funcionalidades

- [ ] Filtros y búsqueda en listados
- [ ] Exportación de datos
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)
- [ ] Integración directa con WhatsApp API
