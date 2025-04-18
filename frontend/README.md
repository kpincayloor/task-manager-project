# 📦 Task Manager Frontend

Este proyecto es una SPA desarrollada con **Angular 18**, diseñada para gestionar tareas con autenticación integrada mediante **Firebase Authentication**, formularios reactivos, arquitectura modular, pruebas unitarias.

## 🚀 Características

- Angular 18 + Standalone Components
- Autenticación con Firebase (Email/Password)
- Interceptores y Guards para protección de rutas
- Angular Material + TailwindCSS
- Formulario reactivo con validaciones
- Pruebas unitarias con Jest
- ESLint + Prettier para calidad de código

## 🛠️ Requisitos

- Node.js 20+
- Firebase CLI
- Angular CLI (`npm install -g @angular/cli`)
- Cuenta de Firebase

## 🌐 Configuración Inicial

### 1. Configurar variables de entorno

Editar o crear el archivo `.env` en la carpeta `frontend/.env` con las credenciales de tu proyecto de Firebase:

```env
API_KEY=tu_api_key
PROJECT_ID=tu_project_id
```

> ⚠️ Si el archivo `.env` no está configurado correctamente, no funcionará la autenticación.

## 📦 Instalación local

```bash
npm install
```

## ▶️ Inicio del proyecto

```bash
npm start
```

Abre en tu navegador: [http://localhost:4200](http://localhost:4200)

## 🚀 Scripts disponibles

```bash
npm start               # Inicia el servidor de desarrollo
npm run lint            # Ejecuta ESLint sobre el código fuente
npm run lint:fix        # Arregla errores automáticamente con ESLint
npm run format          # Formatea todo el código con Prettier
npm run test            # Ejecuta todas las pruebas con Jest
npm run test:coverage   # Ejecuta todas las pruebas con Jest y coverage
```

## ✅ Notas adicionales

- Este frontend se conecta al backend desplegado en Firebase Functions.
- Se recomienda usar `npm run format` antes de cada commit para mantener el estilo del proyecto.
- Asegúrate de que el token de Firebase esté bien configurado en `.env` para que el login funcione correctamente.

## 📬 Autor

MIT © [Kevin Pincay](https://github.com/kpincayloor)
