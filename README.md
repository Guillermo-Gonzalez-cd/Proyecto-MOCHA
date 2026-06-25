# Proyecto MOCHA — App de gestión de mascotas

Este repositorio une las dos partes del proyecto en una sola carpeta:

```
mocha-unificado/
├── frontend/   → App React + Vite (interfaz de usuario)
├── backend/    → API Express + MySQL (lógica y base de datos)
└── package.json → scripts de conveniencia para correr ambos
```

> **Nota:** las carpetas `node_modules` NO están incluidas. Hay que instalarlas
> con `npm install` antes de correr el proyecto (instrucciones abajo).

## 1. Requisitos

- Node.js (v18 o superior recomendado)
- MySQL instalado y corriendo localmente

## 2. Instalación

Desde la carpeta raíz (`mocha-unificado/`), instala las dependencias de
ambos proyectos con un solo comando:

```bash
npm run install:all
```

Esto corre `npm install` tanto en `frontend/` como en `backend/`.

## 3. Configurar la base de datos

1. Crea la base de datos en MySQL usando el script SQL incluido en el
   backend:
   ```bash
   mysql -u root -p < backend/database.sql
   ```
2. Copia el archivo de ejemplo de variables de entorno y complétalo con tus
   propios datos (usuario, contraseña, etc.):
   ```bash
   cp backend/.env-ejp backend/.env
   ```
   Luego abre `backend/.env` y ajusta los valores reales (contraseña de la
   base de datos, secreto JWT, puerto, etc.).

   ⚠️ **Nunca subas el archivo `.env` a un repositorio público** — contiene
   credenciales. El `.gitignore` del backend ya lo excluye por defecto.

## 4. Cómo correr el proyecto

### Opción A — Todo en un solo comando (recomendado para el día a día)

Desde la raíz del proyecto, con un solo comando se levantan backend y
frontend juntos, en la misma terminal:

```bash
npm run dev
```

Vas a ver la salida de ambos servidores mezclada, diferenciada por color y
una etiqueta (`BACKEND` / `FRONTEND`). Para detener los dos a la vez, basta
con `Ctrl + C` una sola vez en esa terminal.

- El backend quedará disponible en `http://localhost:3000` (o el puerto que
  hayas definido en `.env`).
- El frontend (Vite) quedará disponible normalmente en
  `http://localhost:5173`. Esa es la URL que debes abrir en el navegador.

### Opción B — Dos terminales separadas (si prefieres verlos por separado)

En dos terminales distintas, desde la raíz del proyecto:

```bash
npm run dev:backend
```
```bash
npm run dev:frontend
```

El resultado es el mismo que la Opción A, solo que cada servidor imprime
sus mensajes en su propia ventana.

El frontend debe hacer sus peticiones a la URL del backend (revisa que las
llamadas `fetch`/`axios` en `frontend/src` apunten a
`http://localhost:3000`).

### Opción C — Todo en un solo servidor (para entregar como una sola app)

Si quieres que el backend sirva también el frontend ya compilado, de modo
que todo viva en una sola URL:

```bash
npm start
```

Esto primero compila el frontend (`vite build`, genera `frontend/dist`) y
luego levanta el backend, el cual detecta automáticamente la carpeta
`frontend/dist` y la sirve junto con la API. Solo necesitas visitar la URL
del backend (por ejemplo `http://localhost:3000`) para ver la app completa.

## 5. Estructura de la base de datos

El archivo `backend/database.sql` crea las tablas: `duenos`, `mascotas`,
`medicamentos`, `historial_medico`, `vacunas`, `recordatorios` y
`alimentacion` — todo lo necesario para la gestión de mascotas que se ve
en las pantallas del frontend (Mis Mascotas, Salud, Agenda).
