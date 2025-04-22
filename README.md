# App Notes 📝

**App Notes** es una aplicación full-stack que permite a los usuarios crear, editar, eliminar y exportar notas. Las notas pueden guardarse como **PDF** o **Markdown**, y la autenticación se maneja mediante **JWT**.

Este proyecto está estructurado como un **monorepo** con las siguientes tecnologías:

- **Backend**: Express + TypeScript + SQLite
- **Frontend**: React + TypeScript

---

## 🔧 Requisitos

- Node.js v22.14.0
- npm 

---

## Variables de Entorno (Solo Backend)
```bash
PORT=5555
ACCESS_TOKEN_SECRET=tu_secreto_para_jwt
```
## Instalar Paquetes e Iniciar Proyecto
Usando nvm asegurece de que tiene la version 22.14.0 de node.js
```bash
  nvm install 22.14.0
  nvm use 22.14.0
  node -v// debe ser 22.14.0
```
Dentro de la carpeta del repositorio haga
```bash
cd app-notes-front-end
npm i //--force de ser necesario
npm run start
cd ..
cd app-app-back-end
npm i
npm run dev
```
Listo, puedes probar Notes App
