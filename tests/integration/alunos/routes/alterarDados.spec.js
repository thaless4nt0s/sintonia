/* globals describe, test, expect, jest */

/* --- REQUIRES --- */

const mongoid = require('mongoid-js')
const randomstring = require('randomstring')

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
const DADOS_DISCIPLINA2 = HELPER_DISCIPLINAS.gerarDadosValidosParaCriarDisciplina()
const DADOS_ADMIN = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
const DADOS_ALUNO2 = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

/* --- METHODS --- */

describe('Testes de integração da rota PATCH /alunos/:idAluno', () => {
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
  let disciplina2 = {}

  beforeAll(async () => {
    const resposta = await HELPER_REGISTRAR.registrarAdministrador(DADOS_ADMIN)
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
    await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA2, tokenAdmin)
    disciplina = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA.nome }, { _id: 1 })
    disciplina2 = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA.nome }, { _id: 1 })

    aluno = await REPOSITORY_ALUNOS.buscarUm({ nome: DADOS_ALUNO.nome }, { _id: 1 })
    aluno2 = await REPOSITORY_ALUNOS.buscarUm({ nome: DADOS_ALUNO2.nome }, { _id: 1 })
  })

  describe('Testes de Validação da requisição', () => {
    test('Deve retornar 406 informando que o id do aluno está inválido', async () => {
      const response = await HELPER_ALUNOS.alterarDados(mongoid(), disciplina._id, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Aluno.*inexistente/i)
    })

    test('Deve retornar 406 exigindo que o campo "nome" seja uma string', async () => {
      const DADOS_ALUNO_EDITADO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      DADOS_ALUNO_EDITADO.nome = 123213312
      const response = await HELPER_ALUNOS.alterarDados(aluno._id, DADOS_ALUNO_EDITADO, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/nome.*string/i)
    })

    test('Deve retornar 406 exigindo que o campo "nome" respeite o limite de caracteres', async () => {
      const DADOS_ALUNO_EDITADO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      DADOS_ALUNO_EDITADO.nome = randomstring.generate(201)
      const response = await HELPER_ALUNOS.alterarDados(aluno._id, DADOS_ALUNO_EDITADO, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/nome.*100/i)
    })

    test('Deve retornar 406 exigindo que o campo "email" seja um endereço válido', async () => {
      const DADOS_ALUNO_EDITADO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      DADOS_ALUNO_EDITADO.email = 123213312
      const response = await HELPER_ALUNOS.alterarDados(aluno._id, DADOS_ALUNO_EDITADO, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/email.*válido/i)
    })

    test('Deve retornar 406 exigindo que o campo "email" respeite o limite máximo de caracteres', async () => {
      const DADOS_ALUNO_EDITADO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      DADOS_ALUNO_EDITADO.email = `${randomstring.generate(201)}@aluno.ifce.edu.br`
      const response = await HELPER_ALUNOS.alterarDados(aluno._id, DADOS_ALUNO_EDITADO, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/email.*100/i)
    })

    test('Deve retornar 406 exigindo que o campo "email" seja um endereço do tipo @aluno.ifce.edu.br', async () => {
      const DADOS_ALUNO_EDITADO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      DADOS_ALUNO_EDITADO.email = 'email@email.com'
      const response = await HELPER_ALUNOS.alterarDados(aluno._id, DADOS_ALUNO_EDITADO, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/email.*aluno.*ifce.*edu.*br/i)
    })

    test('Deve retornar 406 exigindo que o campo "senha" seja uma string', async () => {
      const DADOS_ALUNO_EDITADO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      DADOS_ALUNO_EDITADO.senha = 123213312
      const response = await HELPER_ALUNOS.alterarDados(aluno._id, DADOS_ALUNO_EDITADO, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/senha.*string/i)
    })

    test('Deve retornar 406 exigindo que o campo "senha" respeite o limite minimo de caracteres', async () => {
      const DADOS_ALUNO_EDITADO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      DADOS_ALUNO_EDITADO.senha = randomstring.generate(6)
      const response = await HELPER_ALUNOS.alterarDados(aluno._id, DADOS_ALUNO_EDITADO, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/senha.*8/i)
    })

    test('Deve retornar 406 exigindo que o campo "senha" respeite o limite máximo de caracteres', async () => {
      const DADOS_ALUNO_EDITADO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      DADOS_ALUNO_EDITADO.senha = randomstring.generate(11)
      const response = await HELPER_ALUNOS.alterarDados(aluno._id, DADOS_ALUNO_EDITADO, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/senha.*10/i)
    })

    test('Deve retornar 406 exigindo que o campo "matricula" seja uma string', async () => {
      const DADOS_ALUNO_EDITADO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      DADOS_ALUNO_EDITADO.matricula = 123
      const response = await HELPER_ALUNOS.alterarDados(aluno._id, DADOS_ALUNO_EDITADO, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/matricula.*string/i)
    })

    test('Deve retornar 406 exigindo que o campo "matricula" respeite o limite máximo de caracteres', async () => {
      const DADOS_ALUNO_EDITADO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      DADOS_ALUNO_EDITADO.matricula = randomstring.generate(16)
      const response = await HELPER_ALUNOS.alterarDados(aluno._id, DADOS_ALUNO_EDITADO, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/matricula.*14/i)
    })

    test('Deve retornar 406 informando que o idDisciplina está inválido', async () => {
      const response = await HELPER_ALUNOS.alterarDados(aluno._id, { idDisciplina: mongoid() }, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Disciplina.*inexistente/i)
    })

    test('Deve retornar 406 informando que o aluno inseriu mais de uma disciplina', async () => {
      const response = await HELPER_ALUNOS.alterarDados(aluno._id, { idDisciplina: [disciplina._id, disciplina2._id] }, tokenAluno)
      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/idDisciplina.*string/i)
    })
  })

  describe('Testes de segurança', () => {
    test('Deve retornar informando o erro 403 de token inexistente', async () => {
      const DADOS_ALUNO_EDITADO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const response = await HELPER_ALUNOS.alterarDados(aluno._id, DADOS_ALUNO_EDITADO, '')

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*não.*fornecido/i)
    })

    test('Deve retornar informando o erro 403 de token inválido', async () => {
      const DADOS_ALUNO_EDITADO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const response = await HELPER_ALUNOS.alterarDados(aluno._id, DADOS_ALUNO_EDITADO, {})

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*inválido/i)
    })

    test('Deve retornar informando que o usuário não tem autorização para acessar', async () => {
      const DADOS_ALUNO_EDITADO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const response = await HELPER_ALUNOS.alterarDados(aluno._id, DADOS_ALUNO_EDITADO, tokenAluno2)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })
  })

  describe('Alterando os dados de um aluno', () => {
    test('Deve retornar status 200 "ok"', async () => {
      const DADOS_ALUNO_EDITADO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const alunoEditado = HELPER_ALUNOS.gerarDadosValidosParaEditarAluno(DADOS_ALUNO_EDITADO, disciplina._id)
      const response = await HELPER_ALUNOS.alterarDados(aluno._id, alunoEditado, tokenAluno)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      expect(response.body).toMatch(/alterados.*sucesso/i)
    })
  })
})
