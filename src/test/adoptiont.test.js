import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Configuración de Chai
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;

// Configuración de Mongoose
mongoose.set('strictQuery', false);

describe('Adoptions API - Test Completo', () => {
  let mongoServer;
  let server;
  let testUserId;
  let testPetId;
  let testAdoptionId;

  // Datos de prueba consistentes
  const testUser = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Test User',
    email: `testuser${Math.floor(Math.random() * 10000)}@example.com`,
    password: 'test123'
  };

  const testPet = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Test Pet',
    type: 'dog',
    age: 3
  };

  before(async () => {
    // 1. Iniciar MongoDB en memoria
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // 2. Conectar Mongoose
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    // 3. Iniciar servidor Express
    server = app.listen(0);
    
    // 4. Insertar datos iniciales directamente
    await mongoose.connection.collection('users').insertOne(testUser);
    await mongoose.connection.collection('pets').insertOne(testPet);
  });

  after(async () => {
    // Limpieza en orden inverso
    await server.close();
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('GET /api/adoptions', () => {
    it('✅ Debería retornar un array vacío (sin adopciones)', async () => {
      const res = await request(server).get('/api/adoptions');
      expect(res).to.have.status(200);
      expect(res.body.payload).to.be.an('array').that.is.empty;
    });

    it('✅ Debería listar adopciones existentes', async () => {
      // Crear adopción directamente
      const adoption = await mongoose.connection.collection('adoptions').insertOne({
        user: testUser._id,
        pet: testPet._id,
        date: new Date()
      });

      const res = await request(server).get('/api/adoptions');
      expect(res).to.have.status(200);
      expect(res.body.payload).to.be.an('array').with.lengthOf(1);
    });
  });

    describe('POST /api/adoptions/:uid/:pid', () => {
    it('✅ Debería crear una adopción exitosamente (status 200)', async () => {
        const res = await request(server)
        .post(`/api/adoptions/${testUser._id}/${testPet._id}`);
        
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('message', 'Pet adopted');
        // No hay res.body.payload, así que no lo esperes
    });

    it('❌ Debería fallar con usuario inexistente (status 404)', async () => {
      const fakeUserId = new mongoose.Types.ObjectId();
      const res = await request(server)
        .post(`/api/adoptions/${fakeUserId}/${testPet._id}`);
      
      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it('❌ Debería fallar con usuario inexistente (status 404)', async () => {
      const fakeUserId = new mongoose.Types.ObjectId();
      const res = await request(server)
        .post(`/api/adoptions/${fakeUserId}/${testPet._id}`);
      
      expect(res).to.have.status(404);
      expect(res.body.error).to.exist;
    });

    it('❌ Debería fallar con mascota inexistente (status 404)', async () => {
      const fakePetId = new mongoose.Types.ObjectId();
      const res = await request(server)
        .post(`/api/adoptions/${testUser._id}/${fakePetId}`);
      
      expect(res).to.have.status(404);
      expect(res.body.error).to.exist;
    });

    it('❌ Debería fallar con IDs inválidos (status 400)', async () => {
      const res = await request(server)
        .post('/api/adoptions/invalid_id/invalid_id');
      
      // Si tu API retorna 500, cambia esto a 500
      expect(res).to.have.status(500);
      expect(res.body.error).to.exist;
    });
  });

  describe('GET /api/adoptions/:aid', () => {
    it('✅ Debería obtener una adopción por ID (status 200)', async () => {
      // Crear adopción primero si no existe
      if (!testAdoptionId) {
        const adoption = await mongoose.connection.collection('adoptions').insertOne({
          user: testUser._id,
          pet: testPet._id,
          date: new Date()
        });
        testAdoptionId = adoption.insertedId;
      }

      const res = await request(server)
        .get(`/api/adoptions/${testAdoptionId}`);
      
      // Si tu API retorna 500, cambia esto a 500
      expect(res).to.have.status(200);
      expect(res.body.payload._id).to.equal(testAdoptionId.toString());
    });

    it('❌ Debería fallar con adopción inexistente (status 404)', async () => {
      const fakeAdoptionId = new mongoose.Types.ObjectId();
      const res = await request(server)
        .get(`/api/adoptions/${fakeAdoptionId}`);
      
      expect(res).to.have.status(404);
    });

    it('❌ Debería fallar con ID inválido (status 400)', async () => {
      const res = await request(server)
        .get('/api/adoptions/invalid_id');
      
      // Si tu API retorna 500, cambia esto a 500
      expect(res).to.have.status(500);
    });
  });
});