import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'AdoptMe API',
      version: '1.0.0',
      description: 'Documentación de endpoints del sistema AdoptMe',
    }
  },
  apis: ['./src/docs/*.js'], // Incluye todos los doc files
};

const specs = swaggerJSDoc(swaggerOptions);

export const swaggerSetup = (app) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
};
