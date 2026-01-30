const request = require('supertest');

// Mock the database module so tests don't need PostgreSQL
jest.mock('./database', () => {
  let logs = [];
  let idCounter = 0;

  return {
    initDb: jest.fn(),
    insertLog: jest.fn(async (city, action) => {
      idCounter += 1;
      const entry = {
        id: idCounter,
        timestamp: new Date().toISOString(),
        city,
        action,
      };
      logs.push(entry);
      return entry;
    }),
    getAllLogs: jest.fn(async () => [...logs].reverse()),
    closeDb: jest.fn(async () => {
      logs = [];
      idCounter = 0;
    }),
    getPool: jest.fn(),
  };
});

const app = require('./server');
const { closeDb } = require('./database');

afterEach(async () => {
  await closeDb();
});

describe('POST /api/log', () => {
  it('should log a city selection and return the log entry', async () => {
    const res = await request(app)
      .post('/api/log')
      .send({ city: 'Vilnius', action: 'CITY_SELECTED' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('city', 'Vilnius');
    expect(res.body).toHaveProperty('action', 'CITY_SELECTED');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('should return 400 if city is missing', async () => {
    const res = await request(app)
      .post('/api/log')
      .send({ action: 'CITY_SELECTED' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should default action to CITY_SELECTED', async () => {
    const res = await request(app)
      .post('/api/log')
      .send({ city: 'Kaunas' });

    expect(res.status).toBe(201);
    expect(res.body.action).toBe('CITY_SELECTED');
  });
});

describe('GET /api/logs', () => {
  it('should return empty array when no logs exist', async () => {
    const res = await request(app).get('/api/logs');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return all logged actions', async () => {
    await request(app).post('/api/log').send({ city: 'Vilnius' });
    await request(app).post('/api/log').send({ city: 'Kaunas' });

    const res = await request(app).get('/api/logs');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('Database persistence', () => {
  it('should persist logs across requests', async () => {
    await request(app).post('/api/log').send({ city: 'Vilnius' });
    await request(app).post('/api/log').send({ city: 'Kaunas' });
    await request(app).post('/api/log').send({ city: 'Klaipeda' });

    const res = await request(app).get('/api/logs');
    expect(res.body).toHaveLength(3);
    expect(res.body[0].city).toBe('Klaipeda');
    expect(res.body[2].city).toBe('Vilnius');
  });
});
