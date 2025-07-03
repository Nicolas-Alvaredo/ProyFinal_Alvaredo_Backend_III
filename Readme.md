# 🐶 AdoptMe - Entrega N°1 - Backend III (Coderhouse)

## 📌 Descripción del Proyecto

Este proyecto corresponde a la **Entrega N°1** del curso **Backend III con Node.js** de Coderhouse. Se desarrollaron funcionalidades orientadas a generar y mockear datos para una aplicación de adopción de mascotas, integrando lógica de backend con conexión a base de datos MongoDB.

## 🚀 Funcionalidades implementadas

### 🔹 1. Router `/api/mocks`

Se creó un router específico llamado `mocks.router.js` que maneja rutas bajo la base `/api/mocks`.

### 🔹 2. Endpoint GET `/mockingpets`

Se desarrolló un módulo de mocking (`petMocks.js`) que genera mascotas falsas utilizando la biblioteca `@faker-js/faker`. El endpoint devuelve un array JSON con 50 mascotas ficticias.

📍 Ruta: GET /api/mocks/mockingpets

Cada mascota generada contiene:

- `name`
- `specie`
- `birthDate`
- `adopted`
- `image`

### 🔹 3. Endpoint GET `/mockingusers`

Se creó un módulo (`userMocker.js`) que genera usuarios falsos con las siguientes características:

- Contraseña `"coder123"` encriptada con `bcrypt`
- Campo `role` con valores aleatorios `"user"` o `"admin"`
- Campo `pets` como array vacío (`[]`)

📍 Ruta:  GET /api/mocks/mockingusers

Devuelve 50 usuarios en formato similar a una respuesta Mongo, con `_id`, `email`, `password`, etc.

### 🔹 4. Endpoint POST `/generateData`

Se desarrolló un endpoint para insertar datos en la base de datos a partir de parámetros numéricos.

📍 Ruta:  POST /api/mocks/generateData

📤 Body esperado (JSON):

```json
{
  "users": 10,
  "pets": 15
}
```

Este endpoint:

- Inserta la cantidad especificada de usuarios con faker y bcrypt

- Inserta la cantidad especificada de mascotas faker

- Cada mascota es asignada aleatoriamente a un usuario como owner

### 🔹 5. Verificación de inserción de datos

Se utilizaron los endpoints existentes para comprobar que los datos generados fueron insertados correctamente en la base de datos MongoDB:

`GET /api/users`

`GET /api/pets`

Ambos devuelven los registros desde la base real (MongoDB Atlas), verificables también vía Compass.

## 🛠️ Tecnologías utilizadas

- Node.js + Express

- MongoDB Atlas + Mongoose

- Faker.js (@faker-js/faker)

- Bcrypt

- Postman

- MongoDB Compass

- Arquitectura con DAOs, Repositories, DTOs y Controllers

## 🧪 Cómo probar?

- Clonar el repositorio

- Instalar dependencias:

`npm install`

- Crear un archivo .env con la URI de tu Mongo Atlas

- Ejecutar el servidor en modo desarrollo:

`npm run dev`

- Probar los endpoints con Postman:

`GET /api/mocks/mockingpets`

`GET /api/mocks/mockingusers`

`POST /api/mocks/generateData`

`GET /api/users`

`GET /api/pets`
