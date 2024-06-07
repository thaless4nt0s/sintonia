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

/* --- METHODS --- */

describe('Testes de integração da rota POST /tutorias/:idAluno/:idTutor', () => {
  jest.setTimeout(50000)

  let loginAdmin = {}
  let tokenAdmin = {}

  let disciplina = {}
  let disciplina2 = {}
  let disciplina3 = {}

  beforeAll(async () => {
    await HELPER_REGISTRAR.registrarAdministrador(DADOS_ADMIN)

    loginAdmin = await HELPER_LOGIN.login(DADOS_ADMIN)
    tokenAdmin = loginAdmin.body

    await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA, tokenAdmin)
    await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA2, tokenAdmin)
    await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA3, tokenAdmin)

    disciplina = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA.nome }, { _id: 1 })
    disciplina2 = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA2.nome }, { _id: 1 })
    disciplina3 = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA3.nome }, { _id: 1 })
  })

  const criarAluno = async (DADOS_ALUNO, disciplina) => {
    await HELPER_REGISTRAR.registrarAluno(DADOS_ALUNO)
    const loginAluno = await HELPER_LOGIN.login(DADOS_ALUNO)
    const tokenAluno = loginAluno.body
    let aluno = await REPOSITORY_ALUNOS.buscarUm({ nome: DADOS_ALUNO.nome }, { _id: 1 })
    const DADOS_ALUNO_EDITADO = HELPER_ALUNOS.gerarDadosValidosParaEditarAluno(DADOS_ALUNO, disciplina._id)
    await HELPER_ALUNOS.alterarDados(aluno._id, DADOS_ALUNO_EDITADO, tokenAluno)
    aluno = await REPOSITORY_ALUNOS.buscarUm({ nome: DADOS_ALUNO.nome }, { _id: 1 })

    return { aluno, tokenAluno }
  }

  const criarTutor = async (DADOS_TUTOR, disciplina) => {
    await HELPER_REGISTRAR.registrarTutor(DADOS_TUTOR)
    const loginTutor = await HELPER_LOGIN.login(DADOS_TUTOR)
    const tokenTutor = loginTutor.body
    let tutor = await REPOSITORY_TUTORES.buscarUm({ nome: DADOS_TUTOR.nome }, { _id: 1 })
    const DADOS_TUTOR_EDITADO = HELPER_TUTORES.gerarDadosValidosParaEditarTutor(DADOS_TUTOR, disciplina)
    await HELPER_TUTORES.alterarDados(tutor._id, DADOS_TUTOR_EDITADO, tokenTutor)
    tutor = await REPOSITORY_TUTORES.buscarUm({ nome: DADOS_TUTOR.nome }, { _id: 1 })
    return { tutor, tokenTutor }
  }

  describe('Testes de validação da requisição', () => {
    test('Deve retornar 406 informando que o "Aluno" é inexistente', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])
      const response = await HELPER_TUTORIAS.iniciarTutoria(mongoid(), tutor._id, DADOS_TUTORIA, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Aluno.*inexistente/i)
    })

    test('Deve retornar 406 informando que o "Tutor" não foi encontrado', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)

      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, mongoid(), DADOS_TUTORIA, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Tutor.*não.*encontrado/i)
    })

    test('Deve retornar 406 informando que o "titulo" é obrigatório', async () => {
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, {}, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/titulo.*obrigatório/i)
    })

    test('Deve retornar 406 exigindo que o "titulo" seja uma string', async () => {
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, { titulo: 123 }, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/titulo.*string/i)
    })

    test('Deve retornar 406 exigindo que o "titulo" respeite o limite máximo de caracteres', async () => {
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, { titulo: randomstring.generate(101) }, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/titulo.*100/i)
    })

    test('Deve retornar 406 exigindo que o aluno e tutor tenham disciplinas em comum', async () => {
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor } = await criarTutor(DADOS_TUTOR, [disciplina2])
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/disciplina.*não.*corresponde/i)
    })

    test('Deve retornar 406 com um aluno sem disciplinas informando que a disciplina não corresponde', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, {})
      const { tutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/disciplina.*não.*corresponde/i)
    })

    test('Deve retornar 406 com um tutor sem disciplinas informando que a disciplina não corresponde', async () => {
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor } = await criarTutor(DADOS_TUTOR, [])
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/disciplina.*não.*corresponde/i)
    })

    test('Deve retornar 406 com um aluno e tutor sem disciplinas informando que a disciplina não corresponde', async () => {
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, {})
      const { tutor } = await criarTutor(DADOS_TUTOR, [])
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/disciplina.*não.*corresponde/i)
    })
  })

  describe('Testes de segurança', () => {
    test('Deve retornar 403 informando que o token é inexistente', async () => {
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])

      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, '')

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*não.*fornecido/i)
    })

    test('Deve retornar 403 informando que o token é inválido', async () => {
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])

      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, {})

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*inválido/i)
    })

    test('Deve retornar 406 informando que o usuário não tem acesso ao utilizar um token de outro aluno', async () => {
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_ALUNO2 = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const aluno2 = await criarAluno(DADOS_ALUNO2, disciplina3)
      const { tutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])

      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, aluno2.tokenAluno)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })

    test('Deve retornar 403 informando que o usuário não tem acesso ao utilizar um token de tutor', async () => {
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])

      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenTutor)

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })

    test('Deve retornar 403 informando que o usuário não tem acesso ao utilizar um token de administrador', async () => {
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])

      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAdmin)

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })
  })

  describe('Criando uma tutoria com sucesso', () => {
    test('Deve retornar status 200 "ok" ao realizar uma tutoria com um tutor que possui uma disciplina', async () => {
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor } = await criarTutor(DADOS_TUTOR, [disciplina])

      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      expect(response.body).toMatch(/Tutoria.*sucesso/i)
    })

    test('Deve retornar status 200 "ok" ao realizar uma tutoria com um tutor que possui duas disciplinas', async () => {
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])

      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      expect(response.body).toMatch(/Tutoria.*sucesso/i)
    })

    test('Deve retornar status 200 "ok" ao realizar uma tutoria com um tutor que possui três disciplinas', async () => {
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2, disciplina3])

      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const response = await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      expect(response.body).toMatch(/Tutoria.*sucesso/i)
    })
  })
})
