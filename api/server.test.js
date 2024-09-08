const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

beforeAll(async () => {
  await db.migrate.rollback(); // so any changes to migration files are picked up
  await db.migrate.latest();
})

test('sanity', () => {
  expect(true).toBe(true)
})
describe('[POST] /register', () => {
  it('rejects new users with the same username as an existing one', () => {

  })
  it('returns the new user', async () => {
    // const res = await request(server).post('/register').send({ username: 'Superman', password: 'foobar' })
    // console.log(res)
    // expect(res.body.username).toBe('Superman')
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