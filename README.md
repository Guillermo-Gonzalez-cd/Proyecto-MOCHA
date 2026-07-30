# Proyecto MOCHA — App movil de agente para la salud de sus mascotas.

## 1. Descripción del Proyecto

El Proyecto MOCHA es una plataforma tecnológica orientada a la gestión de la salud preventiva y bienestar integral de animales de compañía. El sistema centraliza el control del historial clínico veterinario, la automatización de alertas sanitarias y el monitoreo nutricional personalizado, optimizando el seguimiento médico por parte de los propietarios.

La arquitectura del proyecto está compuesta por una aplicación frontend desarrollada en React con Vite y una API backend construida en Express que interactúa con un motor de base de datos MySQL.

## 2. Estructura del Repositorio

El repositorio unifica los componentes de software en el siguiente esquema de directorios:

```text
mocha-unificado/
├── frontend/     # Interfaz de usuario (React + Vite)
├── backend/      # Lógica de negocio y persistencia de datos (Express + MySQL)
└── package.json  # Scripts de automatización para la ejecución del entorno
```

Nota: Los directorios `node_modules` no se incluyen en el repositorio. Deben instalarse localmente antes de iniciar los servicios.

## 3. Requisitos del Sistema

Para el despliegue del entorno de desarrollo se requiere:
* Node.js (Versión 18 o superior recomendada)
* MySQL Server activo en el entorno local

## 4. Instalación y Configuración

### 4.1 Instalación de Dependencias
Ejecute el siguiente comando desde la raíz del proyecto (`mocha-unificado/`) para instalar de forma simultánea los paquetes requeridos por el frontend y el backend:

```bash
npm run install:all
```

### 4.2 Inicialización de la Base de Datos
1. Importe el esquema de la base de datos en su servidor MySQL local utilizando el script provisto:

```bash
mysql -u root -p < backend/database.sql
```

2. Configure las credenciales de conexión y variables de entorno del backend tomando como referencia el archivo de configuración base `seed.js`.

## 5. Ejecución del Entorno de Desarrollo

El proyecto dispone de dos modalidades de ejecución desde el directorio raíz:

### Opción 1: Ejecución en Paralelo (Recomendado)
Para iniciar los servidores de desarrollo de frontend y backend de manera independiente:

```bash
npm run dev
```

### Opción 2: Ejecución Integrada
Para levantar ambos servicios de forma conjunta bajo un mismo proceso de Express:

```bash
npm start
```