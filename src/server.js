import app from './app.js';

const PORT = process.env.PORT || 8081;

// Solo para uso en desarrollo/producción
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export const server = app;