const superTest = require('supertest')
const {app, server} = require('../../index')
const {models} = require('../../db/connec')

const api = superTest(app)

beforeAll( async () => {
    await models.items.destroy({
        where: {},
        truncate: true // reinicia el contador autoincremental
      });
})

test('Items is a json', async () => {
    await api
    .get('/api/v1/items/test')
    .expect(200)
    .expect('Content-Type', /application\/json/)
});

afterAll(() => {
    server.close()
})
