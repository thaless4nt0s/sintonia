/* globals describe, test, expect, beforeAll,  jest */

/* --- REQUIRES --- */

const mongoid = require('mongoid-js')

/* ---- HELPERS ---- */

const HELPER_ADMINS = require('../../../helpers/admins')
const HELPER_LOGIN = require('../../../helpers/autenticar')
const HELPER_REGISTRAR = require('../../../helpers/registrar')
const HELPER_ALUNOS = require('../../../helpers/alunos')
const HELPER_TUTORES = require('../../../helpers/tutores')

/* --- REPOSITORIES --- */

const REPOSITORY_TUTORES = require('../../../../repositories/tutores')

/* --- CONSTANTS --- */
const DADOS_ADMIN = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()

const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()

const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
const DADOS_TUTOR2 = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

/* --- METHODS --- */

describe('Testes de integração da rota DELETE /tutores/:idTutor', () => {
  jest.setTimeout(10000)
  let loginAluno = {}
  let tokenAluno = {}

  let loginTutor = {}
  let tokenTutor = {}
  let tutor = {}

  let loginTutor2 = {}
  let tokenTutor2 = {}

  let loginAdmin = {}
  let tokenAdmin = {}

  beforeAll(async () => {
    await HELPER_REGISTRAR.registrarAdministrador(DADOS_ADMIN)
    await HELPER_REGISTRAR.registrarAluno(DADOS_ALUNO)
    await HELPER_REGISTRAR.registrarTutor(DADOS_TUTOR)
    await HELPER_REGISTRAR.registrarTutor(DADOS_TUTOR2)

    loginAluno = await HELPER_LOGIN.login(DADOS_ALUNO)
    tokenAluno = loginAluno.body

    loginTutor = await HELPER_LOGIN.login(DADOS_TUTOR)
    tokenTutor = loginTutor.body

    loginTutor2 = await HELPER_LOGIN.login(DADOS_TUTOR2)
    tokenTutor2 = loginTutor2.body

    loginAdmin = await HELPER_LOGIN.login(DADOS_ADMIN)
    tokenAdmin = loginAdmin.body

    tutor = await REPOSITORY_TUTORES.buscarUm({ nome: DADOS_TUTOR.nome }, { _id: 1 })
  })

  const removerTutor = async (tutor) => {
    const id = tutor._id

    return HELPER_TUTORES.remover(id, tokenTutor)
  }

  describe('Testes de validação da requisição', () => {
    test('Deve retornar erro 406 informando que o "tutor" é inexistente', async () => {
      const response = await removerTutor({ _id: mongoid() })

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Tutor.*não.*encontrado/i)
    })
  })

  describe('Testes de segurança', () => {
    test('Deve retornar 403 informando que o token é inexistente', async () => {
      const response = await HELPER_TUTORES.remover(tutor._id, '')

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*não.*fornecido/i)
    })

    test('Deve retornar 403 informando que o token é inválido', async () => {
      const response = await HELPER_TUTORES.remover(tutor._id, {})

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*inválido/i)
    })

    test('Deve retornar 403 informando que o aluno não tem autorização para acessar', async () => {
      const response = await HELPER_TUTORES.remover(tutor._id, tokenAluno)

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })

    test('Deve retornar 403 informando que outro tutor não tem autorização para acessar', async () => {
      const response = await HELPER_TUTORES.remover(tutor._id, tokenTutor2)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })

    test('Deve retornar 403 informando que o administrador não tem autorização para acessar', async () => {
      const response = await HELPER_TUTORES.remover(tutor._id, tokenAdmin)

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })
  })

  describe('Removendo um tutor com sucesso', () => {
    test('Deve retornar status 200 "ok"', async () => {
      const response = await removerTutor(tutor)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      expect(response.body).toMatch(/removido.*sucesso/i)
    })
  })
})
