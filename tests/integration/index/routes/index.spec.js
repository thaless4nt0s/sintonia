/* globals describe, test, expect, jest */

/* --- HELPERS --- */

const HELPER_INDEX = require('../../../helpers/')

/* ---- METHODS ---- */

describe('Teste da rota GET "/" ', () => {
  jest.setTimeout(10000)
  test('Deve retornar status 200 "ok"', async () => {
    const response = await HELPER_INDEX.index()

    expect(response.statusCode).toBe(200)
    expect(response.status).toBe('ok')
    expect(response.body).toMatch(/Bem vindo ao sintonia/i)
  })
})
