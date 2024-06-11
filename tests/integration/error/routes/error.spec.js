/* globals describe, test, expect, jest */

/* --- HELPERS --- */

const HELPER_ERROR = require('../../../helpers/error')

/* --- METHODS --- */
describe('Teste das rotas inexistentes do sistema', () => {
  jest.setTimeout(10000)
  test('Deve retornar status 404 "error"', async () => {
    const response = await HELPER_ERROR.error()

    expect(response.statusCode).toBe(404)
    expect(response.status).toBe('error')
    expect(response.body).toMatch(/Rota.*inexistente/i)
  })
})
