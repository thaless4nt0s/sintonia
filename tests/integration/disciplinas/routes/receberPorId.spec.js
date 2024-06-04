/* globals describe, test, expect, jest, beforeAll */

/* --- REQUIRES --- */

const mongoid = require('mongoid-js')

/* ---- HELPERS ---- */

const HELPER_DISCIPLINAS = require('../../../helpers/disciplinas')
const HELPER_ADMINS = require('../../../helpers/admins')
const HELPER_LOGIN = require('../../../helpers/autenticar')
const HELPER_REGISTRAR = require('../../../helpers/registrar')
const HELPER_ALUNOS = require('../../../helpers/alunos')
const HELPER_TUTORES = require('../../../helpers/tutores')

/* --- REPOSITORIES --- */

const REPOSITORY_DISCIPLINAS = require('../../../../repositories/disciplinas')

/* --- CONSTANTS --- */

const DADOS_DISCIPLINA = HELPER_DISCIPLINAS.gerarDadosValidosParaCriarDisciplina()
const DADOS_ADMIN = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

/* ---- METHODS ---- */

describe('Testes da rota GET /disciplinas/:idDisciplina', () => {
  jest.setTimeout(10000)
  let loginAluno = {}
  let tokenAluno = {}
  let loginTutor = {}
  let tokenTutor = {}
  let loginAdmin = {}
  let tokenAdmin = {}
  let disciplina = {}

  const testeObjetoDisciplina = (response) => {
    expect(response).toHaveProperty('_id')
    expect(response).toHaveProperty('nome')

    expect(typeof response._id).toBe('string')
    expect(typeof response.nome).toBe('string')
  }

  beforeAll(async () => {
    await HELPER_REGISTRAR.registrarAdministrador(DADOS_ADMIN)
    await HELPER_REGISTRAR.registrarAluno(DADOS_ALUNO)
    await HELPER_REGISTRAR.registrarTutor(DADOS_TUTOR)

    loginAluno = await HELPER_LOGIN.login(DADOS_ALUNO)
    tokenAluno = loginAluno.body

    loginTutor = await HELPER_LOGIN.login(DADOS_TUTOR)
    tokenTutor = loginTutor.body

    loginAdmin = await HELPER_LOGIN.login(DADOS_ADMIN)
    tokenAdmin = loginAdmin.body

    await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA, tokenAdmin)

    disciplina = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA.nome }, { _id: 1 })
  })

  describe('Testes de validação da requisição', () => {
    test('Deve retornar 406 informando que o id da disciplina está inválido', async () => {
      const response = await HELPER_DISCIPLINAS.receberPorId(mongoid(), tokenAdmin)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Disciplina.*inexistente/i)
    })
  })

  describe('Obtendo os dados de uma disciplina com sucesso', () => {
    test('Deve retornar status 200 "ok" com um token de administrador', async () => {
      const response = await HELPER_DISCIPLINAS.receberPorId(disciplina._id, tokenAdmin)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      testeObjetoDisciplina(response.body)
    })

    test('Deve retornar status 200 "ok" com um token de aluno', async () => {
      const response = await HELPER_DISCIPLINAS.receberPorId(disciplina._id, tokenAluno)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      testeObjetoDisciplina(response.body)
    })

    test('Deve retornar status 200 "ok" com um token de tutor', async () => {
      const response = await HELPER_DISCIPLINAS.receberPorId(disciplina._id, tokenTutor)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      testeObjetoDisciplina(response.body)
    })
  })

  describe('Testes de segurança', () => {
    test('Deve retornar 403 informando que o token é inexistente', async () => {
      const response = await HELPER_DISCIPLINAS.receberPorId(disciplina._id, '')

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*não.*fornecido/i)
    })

    test('Deve retornar 403 informando que o token é inválido', async () => {
      const response = await HELPER_DISCIPLINAS.receberPorId(disciplina._id, {})

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*inválido/i)
    })
  })
})
