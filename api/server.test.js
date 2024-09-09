const request = require('supertest')
const express = require('express')
const server = require('./server')
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

    const user = response.body[0]
    expect(response.status).toBe(200)
    expect(user.username).toBe('Superman')
    expect(user.password).not.toBe('foobar')
  })
})

describe('[POST] /login', () => {
  it ('rejects users with no password or username', () => {

  })
  it('returns a welcome message and jwt', () => {

  })
})

describe('[GET] /jokes', () => {
  it('restricts clients from joining without a token', () => {

  })
  it('returns jokes array', () => {

  })
})