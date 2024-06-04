/* globals describe, test, expect, jest, beforeAll */

/* ---- HELPERS ---- */

const HELPER_DISCIPLINAS = require('../../../helpers/disciplinas')
const HELPER_ADMINS = require('../../../helpers/admins')
const HELPER_LOGIN = require('../../../helpers/autenticar')
const HELPER_REGISTRAR = require('../../../helpers/registrar')
const HELPER_ALUNOS = require('../../../helpers/alunos')

/* --- CONSTANTS --- */

const DADOS_DISCIPLINA = HELPER_DISCIPLINAS.gerarDadosValidosParaCriarDisciplina()
const DADOS_ADMIN = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()

/* ---- METHODS ---- */

describe('Testes da rota POST /disciplinas', () => {
  jest.setTimeout(10000)
  let loginAluno = {}
  let tokenAluno = {}
  let loginAdmin = {}
  let tokenAdmin = {}

  beforeAll(async () => {
    await HELPER_REGISTRAR.registrarAdministrador(DADOS_ADMIN)
    await HELPER_REGISTRAR.registrarAluno(DADOS_ALUNO)

    loginAluno = await HELPER_LOGIN.login(DADOS_ALUNO)
    tokenAluno = loginAluno.body

    loginAdmin = await HELPER_LOGIN.login(DADOS_ADMIN)
    tokenAdmin = loginAdmin.body
  })

  describe('Testes de validação', () => {
    test('Deve retornar 403 informando o token inexistente', async () => {
      const response = await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA, '')
      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*não.*fornecido/i)
    })

    test('Deve retornar 403 informando o token inválido', async () => {
      const response = await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA, 'asdadsasd')
      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*inválido/i)
    })

    test('Deve retornar 406 exigindo que o campo "nome" seja obrigatório', async () => {
      const response = await HELPER_DISCIPLINAS.adicionarDisciplina({}, tokenAdmin)
      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/nome.*obrigatório/i)
    })
  })

  describe('Adicionando uma disciplina', () => {
    test('Deve retonar status 200 "ok"', async () => {
      const response = await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA, tokenAdmin)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      expect(response).toMatch(/disciplina.*adicionada/i)
    })
  })

  describe('Testes de segurança', () => {
    test('Aluno tentando adicionar uma disciplina', async () => {
      const response = await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA, tokenAluno)

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/não.*autorizado/i)
    })
  })
})
