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
const REPOSITORY_TUTORES = require('../../../../repositories/tutores')
const REPOSITORY_ADMINS = require('../../../../repositories/admins')

/* --- CONSTANTS --- */

const DADOS_ADMIN = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()

/* --- METHODS --- */

describe('Testes de integração da rota DELETE /administradores/tutores/:idAluno', () => {
  jest.setTimeout(10000)

  let loginAdmin = {}
  let tokenAdmin = {}
  let admin = {}

  beforeAll(async () => {
    await HELPER_REGISTRAR.registrarAdministrador(DADOS_ADMIN)
    loginAdmin = await HELPER_LOGIN.login(DADOS_ADMIN)
    tokenAdmin = loginAdmin.body

    admin = await REPOSITORY_ADMINS.buscarUm({ email: DADOS_ADMIN.email }, { _id: 1 })
  })

  const criarAluno = async (DADOS_ALUNO) => {
    await HELPER_REGISTRAR.registrarAluno(DADOS_ALUNO)
    const loginAluno = await HELPER_LOGIN.login(DADOS_ALUNO)
    const tokenAluno = loginAluno.body

    const aluno = await REPOSITORY_ALUNOS.buscarUm({ nome: DADOS_ALUNO.nome }, { _id: 1 })

    return { aluno, tokenAluno }
  }

  const criarTutor = async (DADOS_TUTOR) => {
    await HELPER_REGISTRAR.registrarTutor(DADOS_TUTOR)
    const loginTutor = await HELPER_LOGIN.login(DADOS_TUTOR)
    const tokenTutor = loginTutor.body

    const tutor = await REPOSITORY_TUTORES.buscarUm({ nome: DADOS_TUTOR.nome }, { _id: 1 })

    return { tutor, tokenTutor }
  }

  describe('Testes de Validação da requisição', () => {
    test('Deve retornar 406 informando que o tutor não foi encontrado', async () => {
      const response = await HELPER_ADMINS.removerTutor(mongoid(), tokenAdmin)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/tutor.*não.*encontrado/i)
    })
  })

  describe('Testes de segurança', () => {
    test('Deve retornar 403 informando que o token não foi fornecido', async () => {
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      const { tutor } = await criarTutor(DADOS_TUTOR)

      const response = await HELPER_ADMINS.removerTutor(tutor._id, '')

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*não.*fornecido/i)
    })

    test('Deve retornar 403 informando que o token está inválido', async () => {
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      const { tutor } = await criarTutor(DADOS_TUTOR)

      const response = await HELPER_ADMINS.removerTutor(tutor._id, {})

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*inválido/i)
    })

    test('Deve retornar 403 informando que o acesso não é autorizado quando um aluno acessa', async () => {
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const { tokenAluno } = await criarAluno(DADOS_ALUNO)

      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      const { tutor } = await criarTutor(DADOS_TUTOR)

      const response = await HELPER_ADMINS.removerTutor(tutor._id, tokenAluno)

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })

    test('Deve retornar 403 informando que o acesso não é autorizado quando um tutor acessa', async () => {
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR)

      const response = await HELPER_ADMINS.removerTutor(tutor._id, tokenTutor)

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })
  })

  describe('Removendo um tutor com sucesso', () => {
    test('Deve retornar status 200 "ok"', async () => {
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      const { tutor } = await criarTutor(DADOS_TUTOR)

      const response = await HELPER_ADMINS.removerTutor(tutor._id, tokenAdmin)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      expect(response.body).toMatch(/removido.*sucesso/i)
    })
  })
})
