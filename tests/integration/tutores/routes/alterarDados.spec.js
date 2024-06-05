/* globals describe, test, expect, beforeAll,  jest */

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
const REPOSITORY_TUTORES = require('../../../../repositories/tutores')

/* --- CONSTANTS --- */

const DADOS_DISCIPLINA = HELPER_DISCIPLINAS.gerarDadosValidosParaCriarDisciplina()
const DADOS_DISCIPLINA2 = HELPER_DISCIPLINAS.gerarDadosValidosParaCriarDisciplina()
const DADOS_DISCIPLINA3 = HELPER_DISCIPLINAS.gerarDadosValidosParaCriarDisciplina()
const DADOS_DISCIPLINA4 = HELPER_DISCIPLINAS.gerarDadosValidosParaCriarDisciplina()

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
  let disciplina4 = {}

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
    await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA4, tokenAdmin)

    disciplina = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA.nome }, { _id: 1 })
    disciplina2 = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA2.nome }, { _id: 1 })
    disciplina3 = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA3.nome }, { _id: 1 })
    disciplina4 = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA4.nome }, { _id: 1 })

    tutor = await REPOSITORY_TUTORES.buscarUm({ nome: DADOS_TUTOR.nome }, { _id: 1 })
    tutor2 = await REPOSITORY_TUTORES.buscarUm({ nome: DADOS_TUTOR2.nome }, { _id: 1 })
  })

  describe('Testes de Validação da requisição', () => {
    test('Deve retornar 406 informando que o id do tutor está inválido', async () => {
      const response = await HELPER_TUTORES.alterarDados(mongoid(), disciplina._id, tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Tutor.*não.*encontrado/i)
    })

    test('Deve retornar 406 exigindo que o campo "nome" seja uma string', async () => {
      const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      DADOS_TUTOR_EDITADO.nome = 123213312
      const response = await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/nome.*string/i)
    })

    test('Deve retornar 406 exigindo que o campo "nome" respeite o limite de caracteres', async () => {
      const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      DADOS_TUTOR_EDITADO.nome = randomstring.generate(201)
      const response = await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/nome.*100/i)
    })

    test('Deve retornar 406 exigindo que o campo "email" seja uma string', async () => {
      const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      DADOS_TUTOR_EDITADO.email = 123213312
      const response = await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/email.*string/i)
    })

    test('Deve retornar 406 exigindo que o campo "email" respeite o limite máximo de caracteres', async () => {
      const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      DADOS_TUTOR_EDITADO.email = `${randomstring.generate(201)}@aluno.ifce.edu.br`
      const response = await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/email.*100/i)
    })

    test('Deve retornar 406 exigindo que o campo "email" seja um endereço do tipo @aluno.ifce.edu.br', async () => {
      const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      DADOS_TUTOR_EDITADO.email = 'email@email.com'
      const response = await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/email.*aluno.*ifce.*edu.*br/i)
    })

    test('Deve retornar 406 exigindo que o campo "senha" seja uma string', async () => {
      const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      DADOS_TUTOR_EDITADO.senha = 123213312
      const response = await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/senha.*string/i)
    })

    test('Deve retornar 406 exigindo que o campo "senha" respeite o limite minimo de caracteres', async () => {
      const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      DADOS_TUTOR_EDITADO.senha = randomstring.generate(6)
      const response = await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/senha.*8/i)
    })

    test('Deve retornar 406 exigindo que o campo "senha" respeite o limite máximo de caracteres', async () => {
      const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      DADOS_TUTOR_EDITADO.senha = randomstring.generate(11)
      const response = await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/senha.*10/i)
    })

    test('Deve retornar 406 exigindo que o campo "matricula" seja uma string', async () => {
      const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      DADOS_TUTOR_EDITADO.matricula = 123
      const response = await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/matricula.*string/i)
    })

    test('Deve retornar 406 exigindo que o campo "matricula" respeite o limite máximo de caracteres', async () => {
      const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      DADOS_TUTOR_EDITADO.matricula = randomstring.generate(16)
      const response = await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/matricula.*14/i)
    })

    test('Deve retornar 406 exigindo que o campo "semestre" seja um inteiro', async () => {
      const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      DADOS_TUTOR_EDITADO.semestre = 'semestre'
      const response = await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/semestre.*numérico/i)
    })

    test('Deve retornar 406 exigindo que o campo "semestre" respeite o valor mínimo', async () => {
      const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      DADOS_TUTOR_EDITADO.semestre = 0
      const response = await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/superior.*1/i)
    })

    test('Deve retornar 406 informando que o campo "idDisciplina" deve conter um array', async () => {
      const response = await HELPER_TUTORES.alterarDados(tutor._id, { idDisciplina: mongoid() }, tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/idDisciplina.*array/i)
    })

    test('Deve retornar 406 informando que o tutor inseriu mais 3 disciplinas', async () => {
      const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      DADOS_TUTOR_EDITADO.idDisciplina = [disciplina._id, disciplina2._id, disciplina3._id, disciplina4._id]
      const response = await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, tokenTutor)
      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/idDisciplina.*3/i)
    })
  })

  describe('Testes de segurança', () => {
    test('Deve retornar informando o erro 403 de token inexistente', async () => {
      const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      const response = await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, '')

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*não.*fornecido/i)
    })

    test('Deve retornar informando o erro 403 de token inválido', async () => {
      const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      const response = await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, {})

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*inválido/i)
    })

    test('Deve retornar informando que o usuário não tem autorização para acessar', async () => {
      const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      const response = await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, tokenTutor2)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })
  })

  describe('Alterando os dados de um tutor', () => {
    test('Deve retornar status 200 "ok" adicionando 3 disciplinas', async () => {
      const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      DADOS_TUTOR_EDITADO.idDisciplina = [disciplina._id, disciplina2._id, disciplina3._id]
      const response = await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, tokenTutor)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      expect(response.body).toMatch(/Tutor.*sucesso/i)
    })

    test('Deve retornar status 200 "ok" adicionando 2 disciplinas', async () => {
      const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      DADOS_TUTOR_EDITADO.idDisciplina = [disciplina._id, disciplina2._id]
      const response = await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, tokenTutor)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      expect(response.body).toMatch(/Tutor.*sucesso/i)
    })

    test('Deve retornar status 200 "ok" adicionando uma disciplina', async () => {
      const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      DADOS_TUTOR_EDITADO.idDisciplina = [disciplina._id]
      const response = await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, tokenTutor)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      expect(response.body).toMatch(/Tutor.*sucesso/i)
    })
  })
})
