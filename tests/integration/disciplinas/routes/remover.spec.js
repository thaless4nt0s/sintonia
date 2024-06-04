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
const DADOS_DISCIPLINA_AUXILIAR = HELPER_DISCIPLINAS.gerarDadosValidosParaCriarDisciplina()
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
  let disciplinaAuxiliar = {}

  beforeAll(async () => {
    await HELPER_REGISTRAR.registrarAdministrador(DADOS_ADMIN)
    await HELPER_REGISTRAR.registrarAluno(DADOS_ALUNO)

    loginAluno = await HELPER_LOGIN.login(DADOS_ALUNO)
    tokenAluno = loginAluno.body

    loginAdmin = await HELPER_LOGIN.login(DADOS_ADMIN)
    tokenAdmin = loginAdmin.body

    await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA, tokenAdmin)
    await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA_AUXILIAR, tokenAdmin)

    disciplina = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA.nome }, { _id: 1 })
    disciplinaAuxiliar = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA_AUXILIAR.nome }, { _id: 1 })
  })

  const removerDisciplina = async (disciplina) => {
    const id = disciplina._id

    return HELPER_DISCIPLINAS.remover(id, tokenAdmin)
  }

  describe('Testes de validação da requisição', () => {
    test('Deve retornar 406 informando que o id da disciplina está inválido', async () => {
      const response = await removerDisciplina({ _id: 12123132 })

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Contém.*inválido\(s\)\s!$/i)
    })

    test('Deve retornar 406 informando que a disciplina é inexistente', async () => {
      await HELPER_DISCIPLINAS.remover(disciplinaAuxiliar._id, tokenAdmin)
      const response = await removerDisciplina(disciplinaAuxiliar)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Disciplina.*inexistente/i)
    })
  })

  describe('Testes de segurança', () => {
    test('Deve retornar 403 informando que o token é inexistente', async () => {
      const response = await HELPER_DISCIPLINAS.remover(disciplina._id, '')

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*não.*fornecido/i)
    })

    test('Deve retornar 403 informando que o token é inválido', async () => {
      const response = await HELPER_DISCIPLINAS.remover(disciplina._id, {})

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*inválido/i)
    })

    test('Deve retornar 403 informando que o usuário não tem autorização para acessar', async () => {
      const response = await HELPER_DISCIPLINAS.remover(disciplina._id, tokenAluno)

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })
  })

  describe('Removendo uma disciplina com sucesso', () => {
    test('Deve retornar status 200 "ok"', async () => {
      const response = await removerDisciplina(disciplina)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      expect(response.body).toMatch(/excluida.*sucesso/i)
    })
  })
})
