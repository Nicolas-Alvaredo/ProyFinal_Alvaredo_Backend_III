# 🐶 AdoptMe - PROYECTO FINAL - Backend III (Coderhouse)

## 📌 Descripción del Proyecto

Este es el proyecto final del curso **Backend III con Node.js** de Coderhouse. Se desarrollaron funcionalidades orientadas a generar y mockear datos para una aplicación de adopción de mascotas, integrando lógica de backend con conexión a base de datos MongoDB y también se aplicó el uso de Winston para logs de errores, Supertest y Dockerhub.

## 🚀 Funcionalidades implementadas

### 🐳 0. Ejecución directa desde DockerHub (sin clonar repositorio)

Si no querés clonar el proyecto ni correrlo localmente, podés levantar la app directamente usando **Docker**:

### 🔗 Imagen pública en Docker Hub

[https://hub.docker.com/r/nicolasalvaredo/proy_final_alvaredo_backend_iii](https://hub.docker.com/r/nicolasalvaredo/proy_final_alvaredo_backend_iii)

### ▶️ Pasos para ejecutarlo

1. Asegurate de tener Docker instalado y en funcionamiento.
2. Crear un archivo `.env` siguiendo el formato del `.env.example`
3. Eliminar contenedor anterior (si ya está corriendo con ese nombre)

    ```bash
    docker stop proy_final_container
    docker rm proy_final_container
    ```

4. Eliminar imagen local (opcional, para simular entorno limpio)

    ```bash
    docker rmi nicolasalvaredo/proy_final_alvaredo_backend_iii
    ```

5. Hacer pull desde Docker Hub

    ```bash
    docker pull nicolasalvaredo/proy_final_alvaredo_backend_iii
    ```

6. Ejecutar la imagen descargada con nombre proy_final_container

    ```bash
    docker run -d -p 3000:8080 \
    --name proy_final_container \
    --env-file .env \
    nicolasalvaredo/proy_final_alvaredo_backend_iii
    ```

7. Verificar que está corriendo

    ```bash
    docker ps
    ```

8. Ver logs si querés monitorear

    ```bash
    docker logs -f proy_final_container
    ```  

9. Acceder desde Postman en  [http://localhost:3000](http://localhost:3000)  

### 📊 1. Logging con Winston

Se implementó Winston para el manejo centralizado de logs. Los mensajes se clasifican en distintos niveles: `debug`, `http`, `info`, `warning`, `error`, y `fatal`.
Cada log se imprime en consola (modo desarrollo) o en archivos (modo producción), con formato y colores personalizados para facilitar el monitoreo y el debugging de errores en endpoints y controladores.

### 🧪 2. Tests funcionales con Supertest + Chai

Se desarrolló un archivo de test `adoption.test.js` para ejecutarse con el comando ```bash npm test``` y validar la API de adopciones usando:

- **MongoMemoryServer:** Base de datos en memoria para pruebas aisladas.

- **Supertest + Chai:** Para simular peticiones HTTP y realizar aserciones sobre las respuestas.

Los tests cubren:

- **📥 GET /api/adoptions** → respuesta vacía o con datos

- **➕ POST /api/adoptions/:uid/:pid** → adopción exitosa o con errores (404, 400)

- **🔍 GET /api/adoptions/:aid** → búsqueda por ID o manejo de errores

Estos tests ayudan a garantizar la estabilidad y robustez de los endpoints críticos.

### 🔹 3. Router `/api/mocks`

Se creó un router específico llamado `mocks.router.js` que maneja rutas bajo la base `/api/mocks`.

### 🔹 4. Endpoint GET `/mockingpets`

Se desarrolló un módulo de mocking (`petMocks.js`) que genera mascotas falsas utilizando la biblioteca `@faker-js/faker`. El endpoint devuelve un array JSON con 50 mascotas ficticias.

📍 Ruta: GET /api/mocks/mockingpets

Cada mascota generada contiene:

- `name`
- `specie`
- `birthDate`
- `adopted`
- `image`

### 🔹 5. Endpoint GET `/mockingusers`

Se creó un módulo (`userMocker.js`) que genera usuarios falsos con las siguientes características:

- Contraseña `"coder123"` encriptada con `bcrypt`
- Campo `role` con valores aleatorios `"user"` o `"admin"`
- Campo `pets` como array vacío (`[]`)

📍 Ruta:  GET /api/mocks/mockingusers

Devuelve 50 usuarios en formato similar a una respuesta Mongo, con `_id`, `email`, `password`, etc.

### 🔹 6. Endpoint POST `/generateData`

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

### 🔹 7. Verificación de inserción de datos

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

- Winston

- Mocha, Chai, Supertest
  
- Docker

## 🧪 Cómo probar localmente?

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
