const request = require('supertest')
const db = require('../data/dbConfig')
const app = require('./server')

beforeAll(async () => {
  await db.migrate.rollback(); // so any changes to migration files are picked up
  await db.migrate.latest();
})

afterAll(async () => {
  await db.destroy(); // Close the database connection
});

test('sanity', () => {
  expect(true).toBe(true)
})
describe('[POST] /register', () => {
  it('rejects new users with the same username as an existing one', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'Captain Marvel', password: 'foobar' });

    // Test registration with the same username
    const response = await request(app)
      .post('/api/auth/register')
      .send({ username: 'Captain Marvel', password: 'newpassword' });

    expect(response.body.message).toBe('username taken');
  })
  it('returns the new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ username: 'Superman', password: 'foobar' })

    expect(response.status).toBe(200)
    expect(response.body.username).toBe('Superman')
    expect(response.body.password).not.toBe('foobar')
  })
})

describe('[POST] /login', () => {
  it ('rejects users with no password or username', async () => {
    const response = await request(app)
    .post('/api/auth/login')
    .send({}); // Sending empty payload

    expect(response.body.message).toBe('username and password required');
  })
  it('returns a welcome message and jwt', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'Captain Marvel', password: 'foobar' })

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Welcome, Captain Marvel')
    expect(response.body.token).toBeDefined()
  })
})

describe('[GET] /jokes', () => {
  it('restricts clients from joining without a token', async () => {
    const response = await request(app)
      .get('/api/jokes')
    
    expect(response.body.message).toBe('token required')
  })
  it('returns jokes array', async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: 'Captain Marvel', password: 'foobar' });

    const token = loginResponse.body.token
    
    const response = await request(app)
      .get('/api/jokes')
      .set('Authorization', token)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true) // Check if response is an array
    expect(response.body).toHaveLength(3)
  })
})