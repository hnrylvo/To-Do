# To-Do App Backend API

API REST para gestión de tareas con autenticación de usuarios, construida con Node.js, Express y SQLite.

## 🚀 Características

- ✅ Registro y autenticación de usuarios con JWT
- ✅ CRUD completo de tareas
- ✅ Validación de datos
- ✅ Cada usuario solo ve sus propias tareas
- ✅ Base de datos SQLite
- ✅ Contraseñas hasheadas con bcrypt

## 📋 Requisitos

- Node.js (v14 o superior)
- npm o yarn

## 🛠️ Instalación

1. Navega al directorio del backend:
```bash
cd Backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
El archivo `.env` ya está creado, pero puedes modificar el `JWT_SECRET` por seguridad:
```env
PORT=3000
JWT_SECRET=tu_clave_secreta_aqui
```

## 🚀 Ejecución

### Modo desarrollo (con nodemon):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📚 API Endpoints

### Autenticación

#### POST `/api/auth/register`
Registrar un nuevo usuario.

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

#### POST `/api/auth/login`
Iniciar sesión.

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

### Tareas (Requieren autenticación)

**Nota:** Todas las rutas de tareas requieren el header `Authorization: Bearer <token>`

#### GET `/api/tasks`
Obtener todas las tareas del usuario autenticado.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "tasks": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Completar proyecto",
      "description": "Terminar la aplicación de tareas",
      "completed": 0,
      "created_at": "2025-10-19 10:30:00"
    }
  ]
}
```

#### GET `/api/tasks/:id`
Obtener una tarea específica por ID (propiedad del usuario autenticado).

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "task": {
    "id": 1,
    "user_id": 1,
    "title": "Completar proyecto",
    "description": "Terminar la aplicación de tareas",
    "completed": 0,
    "created_at": "2025-10-19 10:30:00"
  }
}
```

**Response (404):**
```json
{ "error": "Task not found or unauthorized" }
```

#### POST `/api/tasks`
Crear una nueva tarea.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "title": "Nueva tarea",
  "description": "Descripción de la tarea (opcional)"
}
```

**Response (201):**
```json
{
  "message": "Task created successfully",
  "task": {
    "id": 2,
    "user_id": 1,
    "title": "Nueva tarea",
    "description": "Descripción de la tarea",
    "completed": false
  }
}
```

#### PUT `/api/tasks/:id`
Actualizar una tarea existente.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body (todos los campos son opcionales):**
```json
{
  "title": "Tarea actualizada",
  "description": "Nueva descripción",
  "completed": true
}
```

**Response (200):**
```json
{
  "message": "Task updated successfully",
  "task": {
    "id": 1,
    "user_id": 1,
    "title": "Tarea actualizada",
    "description": "Nueva descripción",
    "completed": 1,
    "created_at": "2025-10-19 10:30:00"
  }
}
```

#### DELETE `/api/tasks/:id`
Eliminar una tarea.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

### Health Check

#### GET `/api/health`
Verificar el estado del servidor.

**Response (200):**
```json
{
  "status": "ok",
  "message": "To-Do API is running"
}
```

## 🔒 Seguridad

- Las contraseñas se hashean con bcrypt antes de guardarlas
- Se utiliza JWT para autenticación con expiración de 7 días
- Las tareas solo pueden ser accedidas/modificadas por su propietario
- Validación de datos en todos los endpoints

## 📦 Estructura del Proyecto

```
Backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de SQLite
│   ├── controllers/
│   │   ├── authController.js    # Lógica de autenticación
│   │   └── taskController.js    # Lógica de tareas
│   ├── middlewares/
│   │   └── auth.js              # Middleware de autenticación JWT
│   ├── models/
│   │   ├── User.js              # Modelo de usuario
│   │   └── Task.js              # Modelo de tarea
│   └── routes/
│       ├── authRoutes.js        # Rutas de autenticación
│       └── taskRoutes.js        # Rutas de tareas
├── .env                         # Variables de entorno
├── .gitignore
├── server.js                    # Punto de entrada
├── package.json
└── database.sqlite              # Base de datos (generada automáticamente)
```

## 🗄️ Modelo de Datos

### Users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Tasks
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

## ✅ Validaciones

### Registro
- Nombre: requerido, mínimo 2 caracteres
- Email: requerido, formato válido, único
- Password: requerido, mínimo 6 caracteres

### Login
- Email: requerido, formato válido
- Password: requerido

### Tareas
- Title: requerido, entre 1 y 200 caracteres
- Description: opcional
- Completed: boolean (true/false o 0/1)

## 🧪 Pruebas con cURL

```bash
# Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan","email":"juan@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@test.com","password":"123456"}'

# Crear tarea (reemplaza TOKEN con el token recibido)
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Mi primera tarea","description":"Descripción"}'

# Listar tareas
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer TOKEN"

# Obtener una tarea por ID
curl -X GET http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer TOKEN"

# Actualizar tarea
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"completed":true}'

# Eliminar tarea
curl -X DELETE http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer TOKEN"
```

## 🐛 Solución de Problemas

### La base de datos no se crea
- Asegúrate de que el directorio Backend tiene permisos de escritura
- La base de datos se crea automáticamente al iniciar el servidor

### Error de autenticación
- Verifica que el token JWT esté en el header Authorization
- Asegúrate de que el JWT_SECRET en .env sea el mismo que se usó para generar el token

### Error de CORS
- El servidor ya tiene CORS habilitado para todas las solicitudes
- Si usas un puerto específico en el frontend, puedes configurar CORS en server.js

## 📝 Licencia

ISC

## 👨‍💻 Autor

Henry
