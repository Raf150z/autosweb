# AutosWeb

Catálogo de automóviles con panel administrativo, autenticación por roles y calculadora de financiamiento. Proyecto desarrollado como parte del periodo de prueba de **Desarrollo de Software** en Turing Inteligencia Artificial.

Este repositorio es un **monorepo** que contiene el backend y el frontend en carpetas separadas:

```
autosweb/
├── backend/     → API REST (Node.js + Express + Prisma + PostgreSQL)
└── frontend/    → SPA (React + Vite + Tailwind CSS)
```

## Demo en línea

| Servicio | URL |
|---|---|
| Frontend | https://autosweb-frontend.vercel.app |
| Backend (API) | https://autosweb-backend.onrender.com/api |
| Health check | https://autosweb-backend.onrender.com/health |

> El backend está en el plan gratuito de Render: si no ha recibido tráfico en los últimos 15 minutos, la primera petición puede tardar hasta 1 minuto en responder mientras el servicio "despierta".

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19, Vite, React Router DOM 7, Tailwind CSS 4, Axios |
| Backend | Node.js, Express 5, Prisma ORM 6 |
| Base de datos | PostgreSQL |
| Autenticación | JWT (jsonwebtoken) + bcryptjs |
| Validación | express-validator |

---

## Requisitos del sistema

Antes de empezar, asegúrate de tener instalado:

- **Node.js** v18 o superior ([descargar aquí](https://nodejs.org/))
- **npm** v9 o superior (se instala junto con Node.js)
- **PostgreSQL** v14 o superior, instalado **localmente en tu equipo** ([descargar aquí](https://www.postgresql.org/download/))
- **Git**

Verifica tus versiones con:

```bash
node -v
npm -v
git --version
```

---

## 1. Clonar el repositorio

```bash
git clone https://github.com/Raf150z/autosweb.git
cd autosweb
```

---

## 2. Configurar y ejecutar el Backend

### 2.1 Instalar dependencias

```bash
cd backend
npm install
```

### 2.2 Instalar PostgreSQL y crear la base de datos local

Cada persona que clone el proyecto debe tener su propio servidor de PostgreSQL corriendo en su equipo y crear ahí su propia base de datos llamada `autosweb`.

   ```sql
   CREATE DATABASE autosweb;
   ```

### 2.3 Variables de entorno

Crea un archivo `.env` dentro de la carpeta `backend/`. Usa la conexión a **tu base de datos local** creada en el paso anterior:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/autosweb?schema=public"
DIRECT_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/autosweb?schema=public"
JWT_SECRET="clave_generada"
PORT=4000
```

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión a tu PostgreSQL local. Reemplaza `TU_PASSWORD` por la contraseña que definiste al instalar PostgreSQL. |
| `DIRECT_URL` | Cadena de conexión directa, usada por Prisma para ejecutar migraciones. En un entorno local puede ser idéntica a `DATABASE_URL` (la distinción solo importa con proveedores en la nube que usan connection pooling, como Neon). |
| `JWT_SECRET` | Cadena usada para firmar y verificar los tokens JWT de autenticación. Puede ser cualquier texto largo y difícil de adivinar. |
| `PORT` | Puerto en el que corre el servidor Express (por defecto `4000`). |


### 2.4 Preparar la base de datos

Genera el cliente de Prisma y aplica las migraciones para crear las tablas (`User`, `Brand`, `Category`, `Car`) dentro de tu base de datos local:

```bash
npx prisma generate
npx prisma migrate dev
```

`npx prisma migrate dev` aplica todas las migraciones versionadas en `prisma/migrations/` sobre la base de datos indicada en `DATABASE_URL`. Al terminar, tu base `autosweb` local tendrá las 4 tablas creadas pero **vacías**: para ver datos en el catálogo necesitarás registrar un usuario (`/register`) y cargar marcas, categorías y autos desde el panel de administración (ver sección 5 para crear tu usuario `admin`).

### 2.5 Levantar el servidor

```bash
npm run dev
```

Esto inicia el servidor con **nodemon** en `http://localhost:4000`.

### 2.6 Verificar que funciona

Abre en el navegador o con `curl`:

```
http://localhost:4000/health        → { "status": "ok" }
http://localhost:4000/api/cars      → listado de vehículos (vacío al inicio)
```

---

## 3. Configurar y ejecutar el Frontend

Abre una **segunda terminal** (deja el backend corriendo en la primera).

### 3.1 Instalar dependencias

```bash
cd frontend
npm install
```

### 3.2 Variables de entorno

Crea un archivo `.env` dentro de la carpeta `frontend/`:

```env
VITE_API_URL=http://localhost:4000/api
```

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API a la que se conecta el frontend. En local apunta al backend levantado en el paso 2. |

### 3.3 Levantar el entorno de desarrollo

```bash
npm run dev
```

Vite levanta el proyecto (por defecto) en `http://localhost:5173`. Ábrelo en el navegador y deberías ver el catálogo de AutosWeb consumiendo los datos del backend local.

## 4. Resumen de comandos

| Acción | Backend (`/backend`) | Frontend (`/frontend`) |
|---|---|---|
| Instalar dependencias | `npm install` | `npm install` |
| Entorno de desarrollo | `npm run dev` | `npm run dev` |
| Migraciones de base de datos | `npx prisma migrate dev` | — |
| Cliente de Prisma | `npx prisma generate` | — |

---

## 5. Modelo de base de datos

El esquema (`backend/prisma/schema.prisma`) está normalizado hasta la 3ra Forma Normal (3NF) y se compone de 4 tablas:

- **User** — `id, email (único), name, password (hash), role (admin | user), createdAt`
- **Brand** — `id, name (único), country, logoUrl` → 1 marca tiene N vehículos
- **Category** — `id, name (único), imageUrl` → 1 categoría tiene N vehículos
- **Car** — `id, model, year, price, imageUrl, description, brandId (FK), categoryId (FK), createdAt`

Para crear tu usuario administrador dentro de tu base local (Abrir una terminal nueva en la carpeta backend).

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@autosweb.com","password":"admin123","role":"admin"}'
```

---

## 6. Documentación de la API

Consulta [`backend/ENDPOINTS.txt`](./backend/ENDPOINTS.txt) para el listado completo de endpoints disponibles. Todos están montados bajo el prefijo `/api` (ej. `/api/cars`, `/api/auth/login`). Los endpoints de creación, edición y eliminación requieren el encabezado:

```
Authorization: Bearer <token>
```

y, en su mayoría, un usuario con rol `admin`.

---

## Autor

Proyecto desarrollado por **Rafael Velazquez Argote**
