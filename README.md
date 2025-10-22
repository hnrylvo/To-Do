# TaskFlow - Gestor de Tareas Moderno

Una aplicación web moderna y completa para la gestión de tareas, construida con React, Node.js y SQLite. Incluye características avanzadas como categorización, prioridades, fechas de vencimiento, analytics y modo oscuro.

## ✨ Características Principales

### 🎨 Diseño Moderno
- **Interfaz intuitiva** con diseño responsive
- **Modo oscuro/claro** con persistencia de preferencias
- **Gradientes y animaciones** para una experiencia visual atractiva
- **PWA (Progressive Web App)** - Instalable en dispositivos móviles

### 📋 Gestión de Tareas Avanzada
- **Categorización**: Trabajo, Personal, Salud, Finanzas, Educación, Otro
- **Prioridades**: Urgente, Alta, Media, Baja con codificación de colores
- **Fechas de vencimiento** con alertas de tareas vencidas
- **Búsqueda y filtrado** avanzado por múltiples criterios
- **Ordenamiento** por fecha, prioridad, título, etc.

### 📊 Analytics y Estadísticas
- **Dashboard de productividad** con métricas en tiempo real
- **Distribución por categorías y prioridades**
- **Tasa de finalización** y progreso
- **Alertas de tareas vencidas**
- **Consejos de productividad** personalizados

### 🔐 Autenticación Segura
- **Registro e inicio de sesión** con validación robusta
- **Indicador de fortaleza de contraseña**
- **Autenticación JWT** con tokens seguros
- **Protección de rutas** privadas

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 19** - Biblioteca de interfaz de usuario
- **React Router** - Navegación del lado del cliente
- **Tailwind CSS** - Framework de CSS utilitario
- **Vite** - Herramienta de construcción rápida
- **PWA** - Aplicación web progresiva

### Backend
- **Node.js** - Entorno de ejecución de JavaScript
- **Express.js** - Framework web para Node.js
- **SQLite** - Base de datos ligera y rápida
- **JWT** - Autenticación basada en tokens
- **bcryptjs** - Cifrado de contraseñas
- **express-validator** - Validación de datos

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/hnrylvo/To-Do.git
cd To-Do
```

### 2. Configurar el Backend
```bash
cd Backend
npm install
npm run dev
```

El servidor backend se ejecutará en `http://localhost:3000`

### 3. Configurar el Frontend
```bash
cd Frontend/todo-app
npm install
npm run dev
```

El servidor frontend se ejecutará en `http://localhost:5173`

## 🗄️ Estructura de la Base de Datos

### Tabla Users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla Tasks
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT 0,
  priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT DEFAULT 'other' CHECK(category IN ('work', 'personal', 'health', 'finance', 'education', 'other')),
  due_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔧 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Tareas
- `GET /api/tasks` - Obtener todas las tareas del usuario
- `GET /api/tasks/:id` - Obtener tarea específica
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

## 🎯 Características Destacadas

### 1. Sistema de Prioridades
- **🚨 Urgente** - Tareas que requieren atención inmediata
- **🔴 Alta** - Tareas importantes con fecha límite cercana
- **🟡 Media** - Tareas normales de prioridad estándar
- **🟢 Baja** - Tareas que pueden esperar

### 2. Categorización Inteligente
- **💼 Trabajo** - Tareas relacionadas con el empleo
- **👤 Personal** - Tareas personales y familiares
- **🏥 Salud** - Citas médicas, ejercicios, etc.
- **💰 Finanzas** - Pagos, presupuestos, inversiones
- **📚 Educación** - Estudios, cursos, aprendizaje
- **📝 Otro** - Tareas que no encajan en otras categorías

### 3. Analytics Avanzados
- **Métricas de productividad** en tiempo real
- **Distribución visual** por categorías y prioridades
- **Alertas de tareas vencidas**
- **Consejos personalizados** basados en el comportamiento

### 4. Experiencia de Usuario
- **Diseño responsive** que funciona en todos los dispositivos
- **Modo oscuro** para uso nocturno
- **Animaciones suaves** y transiciones
- **Búsqueda instantánea** y filtrado
- **Instalación como app** en dispositivos móviles

## 🔒 Seguridad

- **Autenticación JWT** con tokens seguros
- **Cifrado de contraseñas** con bcrypt
- **Validación de datos** en frontend y backend
- **Protección de rutas** privadas
- **Sanitización de inputs** para prevenir inyecciones

## 📱 PWA (Progressive Web App)

La aplicación es completamente instalable como una PWA:
- **Manifest.json** configurado para instalación
- **Service Worker** para funcionalidad offline
- **Iconos adaptativos** para diferentes dispositivos
- **Soporte completo** para iOS y Android