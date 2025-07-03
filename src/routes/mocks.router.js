import { Router } from 'express';
import { generateMockPet } from '../mocks/petMocks.js';
import { generateUsersMock } from '../mocks/userMocker.js';
import { usersService, petsService } from '../services/index.js';
import { generateAndInsertData } from '../mocks/dataSeeder.js';


const router = Router();

//Mock de pets
router.get('/mockingpets', (req, res) => {
  const limit = 50; // Limite seguro
  const amountParam = parseInt(req.query.amount) || limit;

  if (isNaN(amountParam) || amountParam < 1 || amountParam > 100) {
    return res.status(400).send({
      status: 'error',
      message: 'El parámetro "amount" debe ser un número entre 1 y 100.'
    });
  }

    if (amountParam > 100) {
    return res.status(400).send({
      status: 'error',
      message: 'El número máximo permitido de usuarios es 100.'
    });
  }

  const pets = Array.from({ length: amountParam }, () => generateMockPet());
  res.send({ status: 'success', payload: pets });
});



// Mock de users
router.get('/mockingusers', async (req, res) => {
  const limit = 50; // Limite seguro
  const amountParam = parseInt(req.query.amount) || limit;

    if (isNaN(amountParam) || amountParam < 1 || amountParam > 100) {
    return res.status(400).send({
      status: 'error',
      message: 'El parámetro "amount" debe ser un número entre 1 y 100.'
    });
  }

  if (amountParam > 100) {
    return res.status(400).send({
      status: 'error',
      message: 'El número máximo permitido de usuarios es 100.'
    });
  }

  const users = await generateUsersMock(amountParam);
  res.send({ status: 'success', payload: users });
});


// Mock de generateData
router.post('/generateData', async (req, res) => {
  try {
    await generateAndInsertData(req.body, usersService, petsService);
    res.send({ status: 'success', message: 'Datos generados exitosamente' });
  } catch (error) {
    console.error('❌ Error al generar e insertar datos:', error.message);
    res.status(500).send({
      status: 'error',
      message: 'Ocurrió un error al generar o insertar los datos',
      error: error.message
    });
  }
});



export default router;
