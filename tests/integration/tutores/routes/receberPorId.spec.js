/* globals describe, test, expect, beforeAll,  jest */

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
const REPOSITORY_TUTORES = require('../../../../repositories/tutores')

/* --- CONSTANTS --- */

const DADOS_DISCIPLINA = HELPER_DISCIPLINAS.gerarDadosValidosParaCriarDisciplina()
const DADOS_DISCIPLINA2 = HELPER_DISCIPLINAS.gerarDadosValidosParaCriarDisciplina()
const DADOS_DISCIPLINA3 = HELPER_DISCIPLINAS.gerarDadosValidosParaCriarDisciplina()

const DADOS_ADMIN = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()

const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()

const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
const DADOS_TUTOR2 = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

/* --- METHODS --- */

describe('Testes de integração da rota PATCH /tutores/:idTutor', () => {
  jest.setTimeout(10000)
  let loginAluno = {}
  let tokenAluno = {}

  let loginTutor = {}
  let tokenTutor = {}
  let tutor = {}

  let loginTutor2 = {}
  let tokenTutor2 = {}
  let tutor2 = {}

  let loginAdmin = {}
  let tokenAdmin = {}
  let disciplina = {}
  let disciplina2 = {}
  let disciplina3 = {}

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

    await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA, tokenAdmin)
    await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA2, tokenAdmin)
    await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA3, tokenAdmin)

    disciplina = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA.nome }, { _id: 1 })
    disciplina2 = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA2.nome }, { _id: 1 })
    disciplina3 = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA3.nome }, { _id: 1 })

    tutor = await REPOSITORY_TUTORES.buscarUm({ nome: DADOS_TUTOR.nome }, { senha: 0 })
    tutor2 = await REPOSITORY_TUTORES.buscarUm({ nome: DADOS_TUTOR2.nome }, { _id: 1 })

    const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaEditarTutor(DADOS_TUTOR, [disciplina._id, disciplina2._id, disciplina3._id])

    await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, tokenTutor)
    tutor = await REPOSITORY_TUTORES.buscarUm({ nome: DADOS_TUTOR.nome }, { _id: 1, matricula: 1 })
  })

  const testeObjetoTutor = (response) => {
    expect(response).toHaveProperty('_id')
    expect(response).toHaveProperty('nome')
    expect(response).toHaveProperty('email')
    expect(response).toHaveProperty('semestre')
    expect(response).toHaveProperty('matricula')
    expect(response).toHaveProperty('emTutoria')

    expect(typeof response._id).toBe('string')
    expect(typeof response.nome).toBe('string')
    expect(typeof response.email).toBe('string')
    expect(typeof response.matricula).toBe('string')
    expect(typeof response.semestre).toBe('number')
    expect(typeof response.emTutoria).toBe('string')
  }

  describe('Testes de validação da requisição', () => {
    test('Deve retornar 406 informando que o id da do tutor é inexistente', async () => {
      const response = await HELPER_TUTORES.receberPorId(mongoid(), tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Tutor.*não.*encontrado/i)
    })
  })

  describe('Testes de segurança', () => {
    test('Deve retornar 403 informando que o token é inexistente', async () => {
      const response = await HELPER_TUTORES.receberPorId(tokenTutor._id, '')

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*não.*fornecido/i)
    })

    test('Deve retornar 403 informando que o token é inválido', async () => {
      const response = await HELPER_TUTORES.receberPorId(tokenTutor._id, {})

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*inválido/i)
    })
  })

  describe('Obtendo os dados de um tutor com sucesso', () => {
    test('Deve retornar status 200 "ok" com um tutor que possui disciplina', async () => {
      const response = await HELPER_TUTORES.receberPorId(tutor._id, tokenAluno)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')

      testeObjetoTutor(response.body)

      expect(response.body).toHaveProperty('disciplinas')
      expect(Array.isArray(response.body.disciplinas)).toBe(true)

      expect(response.body.disciplinas[0]).toHaveProperty('nome')
      expect(typeof response.body.disciplinas[0].nome).toBe('string')
    })

    test('Deve retornar status 200 "ok" com um tutor não que possui disciplina', async () => {
      const response = await HELPER_TUTORES.receberPorId(tutor2._id, tokenAluno)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      testeObjetoTutor(response.body)
    })

    test('Deve retornar status 200 "ok" com um token de aluno', async () => {
      const response = await HELPER_TUTORES.receberPorId(tutor._id, tokenAluno)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      testeObjetoTutor(response.body)
    })

    test('Deve retornar status 200 "ok" com um token de tutor', async () => {
      const response = await HELPER_TUTORES.receberPorId(tutor._id, tokenTutor2)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      testeObjetoTutor(response.body)
    })
  })
})
