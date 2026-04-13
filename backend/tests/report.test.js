const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app;
let mongoServer;

describe('Report API (admin required for all)', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
    process.env.JWT_SECRET = 'testsecret';
    app = require('../server');
    // Seed admin and user by directly using models if needed
  });

  afterAll(async () => {
    if (mongoose.connection.readyState) await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  });

  it('should create a report with valid token', async () => {
    // First signup
    const signup = await request(app).post('/api/auth/signup').send({ name: 'Alice', email: 'alice@example.com', password: 'password' });
    const token = signup.body.token;
    const res = await request(app)
      .post('/api/report')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Missing One', location: 'Park', description: 'Last seen at 5pm' })
      .expect(200);
    expect(res.body).toHaveProperty('report');
  });
});
