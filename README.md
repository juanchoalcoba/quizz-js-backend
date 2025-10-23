# 🎮 Backend - Juego de Preguntas de Opción Múltiple

Bienvenido al backend del **Juego de Preguntas de Opción Múltiple**, un proyecto diseñado para manejar usuarios, sesiones de juego y estadísticas en tiempo real de manera segura y eficiente.

---

## 📖 Descripción

Este backend permite:

- Registro y autenticación de usuarios con verificación de correo.
- Gestión de sesiones de juego, incluyendo preguntas respondidas y resultados.
- Almacenamiento y consulta de estadísticas de desempeño.
- Manejo de preguntas de opción múltiple con categorías y niveles de dificultad.
- API RESTful segura y escalable para integrarse con cualquier frontend (web o móvil).

El sistema está pensado para ofrecer un flujo de juego rápido y confiable, con seguimiento individual de usuarios y sus resultados.

---

## ⚡ Funcionalidades Implementadas

### 🔹 Autenticación y Usuarios
- Registro de usuarios con validación de correo electrónico.
- Login seguro con JWT.
- Verificación de cuenta mediante token enviado por email.
- Estado de usuario (`isVerified`) para controlar acceso a funcionalidades.

### 🔹 Gestión de Preguntas
- CRUD completo de preguntas de opción múltiple.
- Cada pregunta incluye:
  - Texto de la pregunta.
  - Opciones de respuesta.
  - Respuesta correcta.
  - Categoría y nivel de dificultad.

### 🔹 Sesiones de Juego
- Creación de sesiones para cada usuario.
- Almacenamiento de:
  - Preguntas respondidas.
  - Cantidad de respuestas correctas, incorrectas y no respondidas.
  - Fecha de la sesión.
- Cálculo automático de puntaje.

### 🔹 Estadísticas
- Consulta de desempeño por usuario.
- Historial de partidas y resultados.
- Datos listos para visualización en frontend.

---

## 🛠 Tecnologías Utilizadas

- **Node.js** + **Express.js** – Servidor backend.
- **MongoDB** + **Mongoose** – Base de datos NoSQL.
- **TypeScript** – Tipado fuerte y escalabilidad.
- **Zod** – Validación de esquemas de datos.
- **JWT** – Autenticación segura.
- **Nodemailer** – Envío de emails para verificación de usuario.
- **dotenv** – Manejo de variables de entorno.

---

## 🚀 Instalación y Configuración

1. Clonar el repositorio:

```bash
git clone https://github.com/juanchoalcoba/quizz-js-backend
cd quizz-js-backend
npm install
```

---
Configurar variables de entorno
```
PORT=5000
MONGODB_URI=tu_mongodb_uri
JWT_SECRET=tu_jwt_secret
SMTP_HOST=tu_smtp_host
SMTP_PORT=tu_smtp_port
SMTP_USER=tu_smtp_user
SMTP_PASS=tu_smtp_pass

```

---

Ejecutar el servidor 

```
npm run start
 ```

---

El backend estará corriendo en http://localhost:5000.

📂 Estructura del Proyecto

```

backend/
├─ controllers/       # Lógica de endpoints
├─ models/            # Modelos de Mongoose
├─ routes/            # Definición de rutas
├─ middleware/        # Autenticación y validaciones
├─ utils/             # Funciones auxiliares (email, JWT, etc.)
├─ types/             # Interfaces y tipos de TypeScript
├─ .env               # Variables de entorno
└─ server.ts          # Entry point del servidor


```

---


🔗 Endpoints Principales


| Método | Ruta                  | Descripción                                      |
|:------:|:--------------------:|:------------------------------------------------|
| POST   | /auth/register        | Registrar usuario y enviar email de verificación |
| POST   | /auth/login           | Iniciar sesión y recibir token JWT             |
| GET    | /auth/verify/:token   | Verificar correo electrónico del usuario       |
| POST   | /questions            | Crear nueva pregunta                            |
| GET    | /questions            | Obtener listado de preguntas                    |
| POST   | /sessions             | Crear una nueva sesión de juego                 |
| GET    | /sessions/:userId     | Obtener historial de sesiones de un usuario    |


---


✅ Buenas Prácticas Implementadas

Validación de datos de entrada con Zod.

Manejo de errores consistente.

Seguridad mediante JWT y validación de rutas privadas.

Envío de correos electrónicos de manera asíncrona y confiable.

Uso de TypeScript para reducir errores de tipado.

Código modular y escalable, listo para agregar más funcionalidades (categorías, niveles, rankings, etc.).

📌 Notas

Este backend es independiente y puede integrarse con cualquier frontend moderno.

Se recomienda usar Postman o Insomnia para probar los endpoints.

Se puede desplegar fácilmente en Heroku, Render, Vercel u otros servicios de hosting de Node.js.

---
