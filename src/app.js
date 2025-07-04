import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import mocksRouter from './routes/mocks.router.js';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import addLogger from './middleware/logger.js'; 
import { swaggerSetup } from './docs/swagger.js';

const app = express();

// Conexión Mongo (solo en producción/dev pero no en test)
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch(err => console.error('❌ Error en conexión Mongo:', err));
}

// Middlewares
app.use(addLogger);
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);

// Swagger (solo en producción/dev pero no en test)
if (process.env.NODE_ENV !== 'test') {
  swaggerSetup(app);
}

// Exportamos app para testing
export default app;

// Inicio del servidor (solo en producción/dev pero no en test)
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 8081;
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}