# 📦 Task Manager Backend

Este proyecto es una API RESTful construida con Node.js, TypeScript y Express, diseñada con principios de arquitectura hexagonal y desplegada en Firebase Functions usando GitHub Actions como pipeline CI/CD.

## 🚀 Características

- Autenticación con Firebase
- Arquitectura hexagonal con separación clara de capas
- Pruebas unitarias y de integración con Jest
- Linter (ESLint) y formateo automático (Prettier)
- CI/CD con GitHub Actions
- Despliegue automático a Firebase

## 🛠️ Requisitos

- Node.js 20+
- Firebase CLI
- Cuenta de Firebase
- Proyecto creado en Firebase Console

## 🔧 Configuración Inicial

### 1. Crear proyecto en Firebase

- Ir a https://console.firebase.google.com
- Crear un nuevo proyecto (ej: task-manager-backend)
- Copia el Project ID generado (ej: task-manager-backend-7i123)
- Habilita los siguientes servicios de Firebase:
  - (Cloud Firestore) Crea la base de datos Firestore (Database ID - default) (especifica la localización (usualmente `south-america-1`) - (modo producción)
  - (Authentication) Autenticación → Métodos de acceso → Habilitar Email/Password

### 2. Cambiar a plan Blaze (obligatorio para deploy)

- Ir a la consola de Firebase → Configuración del proyecto → Uso y facturación
- Cambia el plan de Spark a Blaze  (pago por uso)
- Agrega un método de pago (requerido por Google Cloud)

### 3. Activar App Engine

- Una vez en Blaze, ve a https://console.cloud.google.com/appengine (selecciona el proyecto creado)
- Elige una región (usualmente `south-america-1`)
- Elige Identity and API acess (App Engine default service account)
- Esto es necesario para generar el servicio `appspot.gserviceaccount.com`

### 4. Asignar permisos al servicio en IAM

- Ir a IAM: https://console.cloud.google.com/iam-admin/iam (selecciona el proyecto creado)
- Da el rol de `"Service Account User"` a `<project-id>@appspot.gserviceaccount.com`
- Espera unos minutos (a veces 2-5 mins) para que los cambios se propaguen.

🔐 Habilitar emisión de tokens personalizados

- Presiona "Grant Access" en Firebase para generar la cuenta:
  `firebase-adminsdk-xxxxx@<project-id>.iam.gserviceaccount.com` y asigna el rol de `"Service Account Token Creator`"

- Asigna también el rol `"Service Account Token Creator`" a los siguientes:

  - `[PROJECT_NUMBER]-compute@developer.gserviceaccount.com`
  - `Tu usuario de login (correo personal o corporativo)`

Este permiso es necesario para ejecutar `admin.auth().createCustomToken()` desde el backend.

### 3. Generar y configurar el token de despliegue en nuestro backend (cd backend/)
```bash
firebase login
firebase login:ci
```
- Copia el token generado y guárdalo como `FIREBASE_TOKEN` en GitHub Secrets.

## 🔐 Configuración de Secrets en GitHub

Ir a tu repositorio en GitHub → Settings → Secrets and variables → Actions → New repository secret y añade:

| Name              | Value                                                 |
|-------------------|-------------------------------------------------------|
| FIREBASE_TOKEN    | Token generado por `firebase login:ci`               |
| FIREBASE_PROJECT_ID | El Project ID generado por Firebase (ej: task-manager-backend-7i123) |

## 📦 Instalación local

```bash
cd backend
npm install
```

## 🧪 Scripts disponibles

```bash
npm run dev              # Desarrollo con nodemon
npm run lint             # Linter con ESLint
npm run lint:fix         # Auto-fix
npm run test:unit        # Pruebas unitarias
npm run test:integration # Pruebas de integración
npm run test:ci          # Cobertura total
npm run build            # Compilar a /dist
npm run deploy           # Desplegar funciones a Firebase (manual)
```

## 🧪 Tests

Usa `jest` con `supertest` para pruebas completas.

```
📁 test
├── unit
│   └── application
├── integration
│   └── interfaces
```

## 🛠️ Despliegue CI/CD con GitHub Actions

Despliegue automático a Firebase solo si el push es a `main` y los tests pasan.

### Estructura de GitHub Actions

`.github/workflows/deploy.yml`

Incluye:

- Linter
- Pruebas unitarias e integración
- Build
- Despliegue automático a Firebase

El deploy usa:

```yml
run: npx firebase deploy --only functions --project ${{ secrets.FIREBASE_PROJECT_ID }} --non-interactive --force
```

## ⚠️ Importante

- A veces, la habilitación de APIs como `firebaseextensions.googleapis.com` o `run.googleapis.com` puede tardar 2–5 minutos. Reintenta el deploy si ves errores de propagación.
- La primera vez que deployas, puede fallar por habilitación pendiente de extensiones.
- Si usas `FIREBASE_TOKEN`, recuerda que es temporal y será deprecado. Para entornos productivos, usa `GOOGLE_APPLICATION_CREDENTIALS`.

## ✅ Notas finales

- Si tienes errores como `dist/index.js not found`, asegúrate de haber ejecutado `npm run build`.
- Verifica que `firebase.json` apunte al directorio `"."` si tu función está directamente en el root compilado.

## 📬 Autor
MIT © [Kevin Pincay](https://github.com/kpincayloor)