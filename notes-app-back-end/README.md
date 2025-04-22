# 📚 notes-app-backend

Backend del proyecto Notes App, construido con **TypeScript**, **Express** y **SQLite**. Proporciona autenticación mediante **JSON Web Tokens (JWT)** y sirve como API para gestionar usuarios y notas.

## 🚀 Características

- API RESTful construida con Express
- Base de datos SQLite (ligera y fácil de usar)
- Autenticación con JWT (access)
- TypeScript
  
---

## ⚙️ Requisitos

- Node.js v22.11.00 o superior
- npm

---

## 📦 Instalación

```bash
git clone https://github.com/tu-usuario/notes-app-backend.git
cd notes-app-backend
npm install
```
## ⚙️ Configuración de variables de entorno

Debes crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
PORT=5555
ACCESS_TOKEN_SECRET=tu_clave_secreta```
```

## 🏃‍♂️ Uso

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
