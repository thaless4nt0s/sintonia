/* globals describe, test, expect, jest, beforeAll */

/* --- REQUIRES --- */

const randomstring = require('randomstring')
const mongoid = require('mongoid-js')

/* --- REPOSITORIES --- */

const REPOSITORY_DISCIPLINAS = require('../../../../repositories/disciplinas')
const REPOSITORY_ALUNOS = require('../../../../repositories/alunos')
const REPOSITORY_TUTORES = require('../../../../repositories/tutores')

/* ---- HELPERS ---- */

const HELPER_REGISTRAR = require('../../../helpers/registrar')
const HELPER_ALUNOS = require('../../../helpers/alunos')
const HELPER_TUTORES = require('../../../helpers/tutores')
const HELPER_ADMINS = require('../../../helpers/admins')
const HELPER_TUTORIAS = require('../../../helpers/tutorias')
const HELPER_LOGIN = require('../../../helpers/autenticar')
const HELPER_DISCIPLINAS = require('../../../helpers/disciplinas')

/* --- CONSTANTS --- */

const DADOS_DISCIPLINA = HELPER_DISCIPLINAS.gerarDadosValidosParaCriarDisciplina()
const DADOS_DISCIPLINA2 = HELPER_DISCIPLINAS.gerarDadosValidosParaCriarDisciplina()
const DADOS_DISCIPLINA3 = HELPER_DISCIPLINAS.gerarDadosValidosParaCriarDisciplina()

const DADOS_ADMIN = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()

const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
const DADOS_ALUNO2 = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
const DADOS_ALUNO3 = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
const DADOS_ALUNO4 = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()

const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
const DADOS_TUTOR2 = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
const DADOS_TUTOR3 = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
const DADOS_TUTOR4 = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

/* --- METHODS --- */

describe('Testes de integração da rota POST /tutorias/:idAluno/:idTutor', () => {
  jest.setTimeout(50000)
  let loginAluno = {}
  let tokenAluno = {}
  let aluno = {}

  let loginAluno2 = {}
  let tokenAluno2 = {}
  let aluno2 = {}

  let loginAluno3 = {}
  let tokenAluno3 = {}
  let aluno3 = {}

  let loginAluno4 = {}
  let tokenAluno4 = {}
  let aluno4 = {}

  let loginTutor = {}
  let tokenTutor = {}
  let tutor = {}

  let loginTutor2 = {}
  let tokenTutor2 = {}
  let tutor2 = {}

  let tutor3 = {} // tutor que não possui disciplina

  let loginTutor4 = {}
  let tokenTutor4 = {}
  let tutor4 = {}

  let loginAdmin = {}
  let tokenAdmin = {}

  let disciplina = {}
  let disciplina2 = {}
  let disciplina3 = {}

  beforeAll(async () => {
    await HELPER_REGISTRAR.registrarAdministrador(DADOS_ADMIN)

    await HELPER_REGISTRAR.registrarAluno(DADOS_ALUNO)
    await HELPER_REGISTRAR.registrarAluno(DADOS_ALUNO2)
    await HELPER_REGISTRAR.registrarAluno(DADOS_ALUNO3)
    await HELPER_REGISTRAR.registrarAluno(DADOS_ALUNO4)

    await HELPER_REGISTRAR.registrarTutor(DADOS_TUTOR)
    await HELPER_REGISTRAR.registrarTutor(DADOS_TUTOR2)
    await HELPER_REGISTRAR.registrarTutor(DADOS_TUTOR3)
    await HELPER_REGISTRAR.registrarTutor(DADOS_TUTOR4)

    loginAluno = await HELPER_LOGIN.login(DADOS_ALUNO)
    tokenAluno = loginAluno.body

    loginAluno2 = await HELPER_LOGIN.login(DADOS_ALUNO2)
    tokenAluno2 = loginAluno2.body

    loginAluno3 = await HELPER_LOGIN.login(DADOS_ALUNO3)
    tokenAluno3 = loginAluno3.body

    loginAluno4 = await HELPER_LOGIN.login(DADOS_ALUNO4)
    tokenAluno4 = loginAluno4.body

    loginTutor = await HELPER_LOGIN.login(DADOS_TUTOR)
    tokenTutor = loginTutor.body

    loginTutor2 = await HELPER_LOGIN.login(DADOS_TUTOR2)
    tokenTutor2 = loginTutor2.body

    loginTutor4 = await HELPER_LOGIN.login(DADOS_TUTOR4)
    tokenTutor4 = loginTutor4.body

    loginAdmin = await HELPER_LOGIN.login(DADOS_ADMIN)
    tokenAdmin = loginAdmin.body

    await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA, tokenAdmin)
    await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA2, tokenAdmin)
    await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA3, tokenAdmin)

    disciplina = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA.nome }, { _id: 1 })
    disciplina2 = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA2.nome }, { _id: 1 })
    disciplina3 = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA3.nome }, { _id: 1 })

    aluno = await REPOSITORY_ALUNOS.buscarUm({ nome: DADOS_ALUNO.nome }, { _id: 1 })
    aluno2 = await REPOSITORY_ALUNOS.buscarUm({ nome: DADOS_ALUNO2.nome }, { _id: 1 })
    aluno3 = await REPOSITORY_ALUNOS.buscarUm({ nome: DADOS_ALUNO3.nome }, { _id: 1 })
    aluno4 = await REPOSITORY_ALUNOS.buscarUm({ nome: DADOS_ALUNO4.nome }, { _id: 1 })

    const DADOS_ALUNO_EDITADO = HELPER_ALUNOS.gerarDadosValidosParaEditarAluno(DADOS_ALUNO, disciplina._id)
    await HELPER_ALUNOS.alterarDados(aluno._id, DADOS_ALUNO_EDITADO, tokenAluno)

    const DADOS_ALUNO2_EDITADO = HELPER_ALUNOS.gerarDadosValidosParaEditarAluno(DADOS_ALUNO2, disciplina2._id)
    await HELPER_ALUNOS.alterarDados(aluno2._id, DADOS_ALUNO2_EDITADO, tokenAluno2)

    const DADOS_ALUNO4_EDITADO = HELPER_ALUNOS.gerarDadosValidosParaEditarAluno(DADOS_ALUNO4, disciplina3._id)
    await HELPER_ALUNOS.alterarDados(aluno4._id, DADOS_ALUNO4_EDITADO, tokenAluno4)

    aluno = await REPOSITORY_ALUNOS.buscarUm({ nome: DADOS_ALUNO.nome }, { _id: 1 })
    aluno2 = await REPOSITORY_ALUNOS.buscarUm({ nome: DADOS_ALUNO2.nome }, { _id: 1 })
    aluno4 = await REPOSITORY_ALUNOS.buscarUm({ nome: DADOS_ALUNO4.nome }, { senha: 0 })

    tutor = await REPOSITORY_TUTORES.buscarUm({ nome: DADOS_TUTOR.nome }, { _id: 1 })
    tutor2 = await REPOSITORY_TUTORES.buscarUm({ nome: DADOS_TUTOR2.nome }, { _id: 1 })
    tutor3 = await REPOSITORY_TUTORES.buscarUm({ nome: DADOS_TUTOR3.nome }, { _id: 1 })
    tutor4 = await REPOSITORY_TUTORES.buscarUm({ nome: DADOS_TUTOR4.nome }, { _id: 1 })

    const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaEditarTutor(DADOS_TUTOR, [disciplina._id])
    await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, tokenTutor)

    const DADOS_TUTOR2_EDITADO = HELPER_TUTORES.gerarDadosValidosParaEditarTutor(DADOS_TUTOR2, [disciplina2._id, disciplina3._id])
    await HELPER_TUTORES.alterarDados(tutor2._id, DADOS_TUTOR2_EDITADO, tokenTutor2)

    const DADOS_TUTOR4_EDITADO = HELPER_TUTORES.gerarDadosValidosParaEditarTutor(DADOS_TUTOR4, [disciplina._id, disciplina2._id, disciplina3._id])
    await HELPER_TUTORES.alterarDados(tutor4._id, DADOS_TUTOR4_EDITADO, tokenTutor4)

    tutor = await REPOSITORY_TUTORES.buscarUm({ nome: DADOS_TUTOR.nome }, { _id: 1 })
    tutor2 = await REPOSITORY_TUTORES.buscarUm({ nome: DADOS_TUTOR2.nome }, { _id: 1 })
    tutor4 = await REPOSITORY_TUTORES.buscarUm({ nome: DADOS_TUTOR4.nome }, { senha: 1 })
  })

  describe('Testes de validação da requisição', () => {
    test('Deve retornar 406 informando que o "Aluno" é inexistente', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(mongoid(), tutor._id, DADOS_TUTORIA, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Aluno.*inexistente/i)
    })

    test('Deve retornar 406 informando que o "Tutor" não foi encontrado', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, mongoid(), DADOS_TUTORIA, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Tutor.*não.*encontrado/i)
    })

    test('Deve retornar 406 informando que o "titulo" é obrigatório', async () => {
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, {}, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/titulo.*obrigatório/i)
    })

    test('Deve retornar 406 exigindo que o "titulo" seja uma string', async () => {
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, { titulo: 123 }, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/titulo.*string/i)
    })

    test('Deve retornar 406 exigindo que o "titulo" respeite o limite máximo de caracteres', async () => {
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, { titulo: randomstring.generate(101) }, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/titulo.*100/i)
    })

    test('Deve retornar 406 exigindo que o aluno e tutor tenham disciplinas em comum', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor2._id, DADOS_TUTORIA, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/disciplina.*não.*corresponde/i)
    })

    test('Deve retornar 406 com um aluno sem disciplinas informando que a disciplina não corresponde', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno3._id, tutor2._id, DADOS_TUTORIA, tokenAluno3)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/disciplina.*não.*corresponde/i)
    })

    test('Deve retornar 406 com um tutor sem disciplinas informando que a disciplina não corresponde', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor3._id, DADOS_TUTORIA, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/disciplina.*não.*corresponde/i)
    })

    test('Deve retornar 406 com um aluno e tutor sem disciplinas informando que a disciplina não corresponde', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno3._id, tutor3._id, DADOS_TUTORIA, tokenAluno3)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/disciplina.*não.*corresponde/i)
    })
  })

  describe('Testes de segurança', () => {
    test('Deve retornar 403 informando que o token é inexistente', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, '')

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*não.*fornecido/i)
    })

    test('Deve retornar 403 informando que o token é inválido', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, {})

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*inválido/i)
    })

    test('Deve retornar 406 informando que o usuário não tem acesso ao utilizar um token de outro aluno', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno2)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })

    test('Deve retornar 403 informando que o usuário não tem acesso ao utilizar um token de tutor', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenTutor)

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })

    test('Deve retornar 403 informando que o usuário não tem acesso ao utilizar um token de administrador', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAdmin)

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })
  })

  describe('Criando uma tutoria com sucesso', () => {
    test('Deve retornar status 200 "ok" ao realizar uma tutoria com um tutor que possui uma disciplina', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      expect(response.body).toMatch(/Tutoria.*sucesso/i)
    })

    test('Deve retornar status 200 "ok" ao realizar uma tutoria com um tutor que possui duas disciplinas', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno2._id, tutor2._id, DADOS_TUTORIA, tokenAluno2)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      expect(response.body).toMatch(/Tutoria.*sucesso/i)
    })

    test('Deve retornar status 200 "ok" ao realizar uma tutoria com um tutor que possui três disciplinas', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno4._id, tutor4._id, DADOS_TUTORIA, tokenAluno4)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      expect(response.body).toMatch(/Tutoria.*sucesso/i)
    })
  })
})
