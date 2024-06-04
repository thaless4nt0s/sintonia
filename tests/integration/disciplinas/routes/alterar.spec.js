/* globals describe, test, expect, jest, beforeAll */

/* ---- HELPERS ---- */

const HELPER_DISCIPLINAS = require('../../../helpers/disciplinas')
const HELPER_ADMINS = require('../../../helpers/admins')
const HELPER_LOGIN = require('../../../helpers/autenticar')
const HELPER_REGISTRAR = require('../../../helpers/registrar')
const HELPER_ALUNOS = require('../../../helpers/alunos')

/* --- REPOSITORIES --- */

const REPOSITORY_DISCIPLINAS = require('../../../../repositories/disciplinas')

/* --- CONSTANTS --- */

const DADOS_DISCIPLINA = HELPER_DISCIPLINAS.gerarDadosValidosParaCriarDisciplina()
const DADOS_DISCIPLINA_ALTERAR = HELPER_DISCIPLINAS.gerarDadosValidosParaCriarDisciplina()
const DADOS_ADMIN = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()

/* ---- METHODS ---- */

describe('Testes da rota PATCH /disciplinas/:idDisciplina', () => {
  jest.setTimeout(10000)
  let loginAluno = {}
  let tokenAluno = {}
  let loginAdmin = {}
  let tokenAdmin = {}
  let disciplina = {}

  beforeAll(async () => {
    await HELPER_REGISTRAR.registrarAdministrador(DADOS_ADMIN)
    await HELPER_REGISTRAR.registrarAluno(DADOS_ALUNO)

    loginAluno = await HELPER_LOGIN.login(DADOS_ALUNO)
    tokenAluno = loginAluno.body

    loginAdmin = await HELPER_LOGIN.login(DADOS_ADMIN)
    tokenAdmin = loginAdmin.body

    await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA, tokenAdmin)
    disciplina = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA.nome }, { _id: 1 })
  })

  const alterarDadosDisciplina = async (disciplina, dados) => {
    const { _id } = disciplina
    return HELPER_DISCIPLINAS.alterarDados(_id, dados, tokenAdmin)
  }

  describe('Testes de validação da requisição', () => {
    test('Deve retornar 406 exigindo que o campo "nome" seja obrigatório', async () => {
      const response = await alterarDadosDisciplina(disciplina, {}, tokenAdmin)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/nome.*obrigatório/i)
    })

    test('Deve retornar 406 exigindo que o campo "nome" seja uma string', async () => {
      DADOS_DISCIPLINA.nome = 123123
      const response = await alterarDadosDisciplina(disciplina, DADOS_DISCIPLINA, tokenAdmin)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/nome.*string/i)
    })
  })

  describe('Alterando os dados de uma disciplina com sucesso', () => {
    test('Deve retonar status 200 "ok"', async () => {
      const response = await alterarDadosDisciplina(disciplina, DADOS_DISCIPLINA_ALTERAR)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      expect(response.body).toMatch(/alterada.*com.*sucesso/i)
    })
  })

  describe('Testes de segurança', () => {
    test('Deve retornar 403 informando que o token é inexistente', async () => {
      const response = await HELPER_DISCIPLINAS.alterarDados(disciplina._id, DADOS_DISCIPLINA_ALTERAR, '')

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*não.*fornecido/i)
    })

    test('Deve retornar 403 informando que o token é inválido', async () => {
      const response = await HELPER_DISCIPLINAS.alterarDados(disciplina._id, DADOS_DISCIPLINA_ALTERAR, {})

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*inválido/i)
    })

    test('Deve retornar 403 informando que o usuário não tem autorização para acessar', async () => {
      const response = await HELPER_DISCIPLINAS.alterarDados(disciplina._id, DADOS_DISCIPLINA_ALTERAR, tokenAluno)

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })
  })
})
