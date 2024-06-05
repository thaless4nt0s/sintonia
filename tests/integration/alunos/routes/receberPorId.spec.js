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
const REPOSITORY_ALUNOS = require('../../../../repositories/alunos')

/* --- CONSTANTS --- */

const DADOS_DISCIPLINA = HELPER_DISCIPLINAS.gerarDadosValidosParaCriarDisciplina()
const DADOS_ADMIN = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
const DADOS_ALUNO2 = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

/* ---- METHODS ---- */

describe('Testes da rota GET /alunos/:idAluno', () => {
  jest.setTimeout(10000)
  let loginAluno = {}
  let tokenAluno = {}
  let aluno = {}

  let loginAluno2 = {}
  let tokenAluno2 = {}
  let aluno2 = {}

  let loginTutor = {}
  let tokenTutor = {}
  let loginAdmin = {}
  let tokenAdmin = {}
  let disciplina = {}

  const testeObjetoAluno = (response) => {
    expect(response).toHaveProperty('_id')
    expect(response).toHaveProperty('nome')
    expect(response).toHaveProperty('email')
    expect(response).toHaveProperty('matricula')
    expect(response).toHaveProperty('emTutoria')
    expect(response).toHaveProperty('tutorias')

    expect(Array.isArray(response.tutorias)).toBe(true)

    expect(typeof response._id).toBe('string')
    expect(typeof response.nome).toBe('string')
    expect(typeof response.email).toBe('string')
    expect(typeof response.matricula).toBe('string')
    expect(typeof response.emTutoria).toBe('string')
  }

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

    await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA, tokenAdmin)

    disciplina = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA.nome }, { _id: 1 })

    aluno = await REPOSITORY_ALUNOS.buscarUm({ nome: DADOS_ALUNO.nome }, { _id: 1 })
    aluno2 = await REPOSITORY_ALUNOS.buscarUm({ nome: DADOS_ALUNO2.nome }, { _id: 1 })

    const DADOS_ALUNO_EDITADO = HELPER_ALUNOS.gerarDadosValidosParaEditarAluno(DADOS_ALUNO, disciplina._id)
    await HELPER_ALUNOS.alterarDados(aluno._id, DADOS_ALUNO_EDITADO, tokenAluno)

    aluno = await REPOSITORY_ALUNOS.buscarUm({ nome: DADOS_ALUNO.nome }, { _id: 1 })
  })

  describe('Testes de validação da requisição', () => {
    test('Deve retornar 406 informando que o id do aluno é inexistente', async () => {
      const response = await HELPER_ALUNOS.receberPorId(mongoid(), tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Aluno.*inexistente/i)
    })
  })

  describe('Obtendo os dados de uma aluno com sucesso', () => {
    test('Deve retornar status 200 "ok" com um aluno que possui disciplina', async () => {
      const response = await HELPER_ALUNOS.receberPorId(aluno._id, tokenAluno)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      testeObjetoAluno(response.body)

      expect(response.body).toHaveProperty('disciplina')
      expect(response.body.disciplina).toHaveProperty('nome')
      expect(typeof response.body.disciplina).toBe('object')
      expect(typeof response.body.disciplina.nome).toBe('string')
    })

    test('Deve retornar status 200 "ok" com um aluno não que possui disciplina', async () => {
      const response = await HELPER_ALUNOS.receberPorId(aluno2._id, tokenAluno)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      testeObjetoAluno(response.body)
    })

    test('Deve retornar status 200 "ok" com um token de aluno', async () => {
      const response = await HELPER_ALUNOS.receberPorId(aluno._id, tokenAluno)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      testeObjetoAluno(response.body)
    })

    test('Deve retornar status 200 "ok" com um token de tutor', async () => {
      const response = await HELPER_ALUNOS.receberPorId(aluno._id, tokenTutor)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      testeObjetoAluno(response.body)
    })
  })

  describe('Testes de segurança', () => {
    test('Deve retornar 403 informando que o token é inexistente', async () => {
      const response = await HELPER_ALUNOS.receberPorId(aluno._id, '')

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*não.*fornecido/i)
    })

    test('Deve retornar 403 informando que o token é inválido', async () => {
      const response = await HELPER_ALUNOS.receberPorId(aluno._id, {})

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*inválido/i)
    })
  })
})
