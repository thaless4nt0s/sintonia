/* globals describe, test, expect, jest, beforeAll */

/* --- REQUIRES --- */

const mongoid = require('mongoid-js')

/* ---- HELPERS ---- */

const HELPER_ADMINS = require('../../../helpers/admins')
const HELPER_LOGIN = require('../../../helpers/autenticar')
const HELPER_REGISTRAR = require('../../../helpers/registrar')
const HELPER_ALUNOS = require('../../../helpers/alunos')
const HELPER_TUTORES = require('../../../helpers/tutores')

/* --- REPOSITORIES --- */

const REPOSITORY_ALUNOS = require('../../../../repositories/alunos')

/* --- CONSTANTS --- */

const DADOS_ADMIN = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
const DADOS_ALUNO2 = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

/* --- METHODS --- */

describe('Testes de integração da rota DELETE /alunos/:idAluno', () => {
  jest.setTimeout(10000)
  let loginAluno = {}
  let tokenAluno = {}
  let aluno = {}

  let loginAluno2 = {}
  let tokenAluno2 = {}

  let loginTutor = {}
  let tokenTutor = {}

  let loginAdmin = {}
  let tokenAdmin = {}

  beforeAll(async () => {
    await HELPER_REGISTRAR.registrarAdministrador(DADOS_ADMIN)
    await HELPER_REGISTRAR.registrarAluno(DADOS_ALUNO)
    await HELPER_REGISTRAR.registrarAluno(DADOS_ALUNO2)
    await HELPER_REGISTRAR.registrarTutor(DADOS_TUTOR)

    loginAluno = await HELPER_LOGIN.login(DADOS_ALUNO)
    tokenAluno = loginAluno.body

    loginAluno2 = await HELPER_LOGIN.login(DADOS_ALUNO2)
    tokenAluno2 = loginAluno2.body

    loginTutor = await HELPER_LOGIN.login(DADOS_TUTOR)
    tokenTutor = loginTutor.body

    loginAdmin = await HELPER_LOGIN.login(DADOS_ADMIN)
    tokenAdmin = loginAdmin.body

    aluno = await REPOSITORY_ALUNOS.buscarUm({ nome: DADOS_ALUNO.nome }, { _id: 1 })
  })

  const removerAluno = async (aluno) => {
    const id = aluno._id

    return HELPER_ALUNOS.remover(id, tokenAluno)
  }

  describe('Testes de validação da requisição', () => {
    test('Deve retornar erro 406 informando que o "aluno" é inexistente', async () => {
      const response = await removerAluno({ _id: mongoid() }, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Aluno.*inexistente/i)
    })
  })

  describe('Testes de segurança', () => {
    test('Deve retornar 403 informando que o token é inexistente', async () => {
      const response = await HELPER_ALUNOS.remover(aluno._id, '')

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*não.*fornecido/i)
    })

    test('Deve retornar 403 informando que o token é inválido', async () => {
      const response = await HELPER_ALUNOS.remover(aluno._id, {})

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*inválido/i)
    })

    test('Deve retornar 403 informando que o aluno não tem autorização para acessar', async () => {
      const response = await HELPER_ALUNOS.remover(aluno._id, tokenAluno2)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })

    test('Deve retornar 403 informando que o tutor não tem autorização para acessar', async () => {
      const response = await HELPER_ALUNOS.remover(aluno._id, tokenTutor)

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })

    test('Deve retornar 403 informando que o administrador não tem autorização para acessar', async () => {
      const response = await HELPER_ALUNOS.remover(aluno._id, tokenAdmin)

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })
  })

  describe('Removendo um aluno com sucesso', () => {
    test('Deve retornar status 200 "ok"', async () => {
      const response = await removerAluno(aluno)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      expect(response.body).toMatch(/removido.*sucesso/i)
    })
  })
})
