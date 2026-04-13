const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app;
let mongoServer;

describe('Auth flows', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
    process.env.JWT_SECRET = 'testsecret';
    // Import app after env is set
    app = require('../server');
  });

  afterAll(async () => {
    if (mongoose.connection.readyState) {
      await mongoose.disconnect();
    }
    if (mongoServer) await mongoServer.stop();
  });

  it('should signup a new user and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password' })
      .expect(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should login with valid credentials and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(200);
    expect(res.body).toHaveProperty('token');
  });
});
