/* globals describe, test, expect, jest */

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

/* --- METHODS --- */

describe('Testes de integração da rota GET /administradores', () => {
  jest.setTimeout(10000)

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

  const criarAdmin = async (DADOS_ADMIN) => {
    await HELPER_REGISTRAR.registrarAdministrador(DADOS_ADMIN)
    const loginAdmin = await HELPER_LOGIN.login(DADOS_ADMIN)
    const tokenAdmin = loginAdmin.body

    const admin = await REPOSITORY_ADMINS.buscarUm({ email: DADOS_ADMIN.email }, { _id: 1 })

    return { admin, tokenAdmin }
  }

  const testeObjetoAdmin = (response) => {
    expect(response).toHaveProperty('_id')
    expect(response).toHaveProperty('nome')
    expect(response).toHaveProperty('email')
    expect(response).toHaveProperty('dataRegistro')

    expect(typeof response._id).toBe('string')
    expect(typeof response.nome).toBe('string')
    expect(typeof response.email).toBe('string')
    expect(typeof response.dataRegistro).toBe('string')
  }

  describe('Testes de segurança', () => {
    test('Deve retornar 403 informando que o token é inexistente', async () => {
      const response = await HELPER_ADMINS.receberTodos('')

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*não.*fornecido/i)
    })

    test('Deve retornar 403 informando que o token é inválido', async () => {
      const response = await HELPER_ADMINS.receberTodos({})

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*inválido/i)
    })
  })

  describe('Mostrando todos o administradores', () => {
    test('Deve retornar status 200 "ok" com um token de aluno', async () => {
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const { tokenAluno } = await criarAluno(DADOS_ALUNO)

      const DADOS_ADMIN = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
      await criarAdmin(DADOS_ADMIN)

      const DADOS_ADMIN2 = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
      await criarAdmin(DADOS_ADMIN2)

      const DADOS_ADMIN3 = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
      await criarAdmin(DADOS_ADMIN3)

      const response = await HELPER_ADMINS.receberTodos(tokenAluno)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      testeObjetoAdmin(response.body[0])
    })

    test('Deve retornar status 200 "ok" com um token de tutor', async () => {
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      const { tokenTutor } = await criarTutor(DADOS_TUTOR)

      const DADOS_ADMIN = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
      await criarAdmin(DADOS_ADMIN)

      const DADOS_ADMIN2 = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
      await criarAdmin(DADOS_ADMIN2)

      const DADOS_ADMIN3 = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
      await criarAdmin(DADOS_ADMIN3)

      const response = await HELPER_ADMINS.receberTodos(tokenTutor)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      testeObjetoAdmin(response.body[0])
    })

    test('Deve retornar status 200 "ok" com um token de administrador', async () => {
      const DADOS_ADMIN = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
      const { tokenAdmin } = await criarAdmin(DADOS_ADMIN)

      const DADOS_ADMIN2 = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
      await criarAdmin(DADOS_ADMIN2)

      const DADOS_ADMIN3 = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
      await criarAdmin(DADOS_ADMIN3)

      const response = await HELPER_ADMINS.receberTodos(tokenAdmin)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      testeObjetoAdmin(response.body[0])
    })
  })
})
