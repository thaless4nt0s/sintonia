/* globals describe, test, expect, jest, beforeAll */

/* --- REQUIRES --- */

const randomstring = require('randomstring')
const mongoid = require('mongoid-js')

/* --- REPOSITORIES --- */

const REPOSITORY_DISCIPLINAS = require('../../../../repositories/disciplinas')
const REPOSITORY_ALUNOS = require('../../../../repositories/alunos')
const REPOSITORY_TUTORES = require('../../../../repositories/tutores')
const REPOSITORY_TUTORIAS = require('../../../../repositories/tutorias')

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

describe('Testes de integração da rota PATCH /tutorias/:idTutoria/:idAluno/:idTutor', () => {
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

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])

      await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      const tutoria = await REPOSITORY_TUTORIAS.buscarUm({ titulo: DADOS_TUTORIA.titulo, idAluno: aluno._id, tutoriaEncerrada: false }, { _id: 1 })

      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()
      const response = await HELPER_TUTORIAS.encerrarTutoria(tutoria._id, mongoid(), tutor._id, DADOS_TUTORIA_ENCERRADA, tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Aluno.*inexistente/i)
    })

    test('Deve retornar 406 informando que o "Tutor" é inexistente', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])

      await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      const tutoria = await REPOSITORY_TUTORIAS.buscarUm({ titulo: DADOS_TUTORIA.titulo, idAluno: aluno._id, tutoriaEncerrada: false }, { _id: 1 })

      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()
      const response = await HELPER_TUTORIAS.encerrarTutoria(tutoria._id, aluno._id, mongoid(), DADOS_TUTORIA_ENCERRADA, tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Tutor.*não.*encontrado/i)
    })

    test('Deve retornar 406 informando que o campo "resumo" é obrigatório', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])

      await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      const tutoria = await REPOSITORY_TUTORIAS.buscarUm({ titulo: DADOS_TUTORIA.titulo, idAluno: aluno._id, tutoriaEncerrada: false }, { _id: 1 })

      const response = await HELPER_TUTORIAS.encerrarTutoria(tutoria._id, aluno._id, tutor._id, {}, tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/resumo.*obrigatório/i)
    })

    test('Deve retornar 406 informando que o campo "resumo" seja uma string', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])

      await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      const tutoria = await REPOSITORY_TUTORIAS.buscarUm({ titulo: DADOS_TUTORIA.titulo, idAluno: aluno._id, tutoriaEncerrada: false }, { _id: 1 })

      const response = await HELPER_TUTORIAS.encerrarTutoria(tutoria._id, aluno._id, tutor._id, { resumo: 123 }, tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/resumo.*string/i)
    })

    test('Deve retornar 406 informando que o campo "resumo" deve respeitar o limite maximo de caracteres', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])

      await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      const tutoria = await REPOSITORY_TUTORIAS.buscarUm({ titulo: DADOS_TUTORIA.titulo, idAluno: aluno._id, tutoriaEncerrada: false }, { _id: 1 })

      const response = await HELPER_TUTORIAS.encerrarTutoria(tutoria._id, aluno._id, tutor._id, { resumo: randomstring.generate(201) }, tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/resumo.*200/i)
    })

    test('Deve retornar 406 quando o tutor logado não é o mesmo tutor da tutoria', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      const DADOS_TUTOR2 = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])
      const tutor2 = await criarTutor(DADOS_TUTOR2, [disciplina])

      await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      const tutoria = await REPOSITORY_TUTORIAS.buscarUm({ titulo: DADOS_TUTORIA.titulo, idAluno: aluno._id, idTutor: tutor._id, tutoriaEncerrada: false }, { _id: 1 })

      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()
      const response = await HELPER_TUTORIAS.encerrarTutoria(tutoria._id, aluno._id, tutor2.tutor._id, DADOS_TUTORIA_ENCERRADA, tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })

    test('Deve retornar 406 quando o aluno não é o mesmo aluno da tutoria', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_ALUNO2 = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()

      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const aluno2 = await criarAluno(DADOS_ALUNO2, disciplina2)
      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])

      await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      const tutoria = await REPOSITORY_TUTORIAS.buscarUm({ titulo: DADOS_TUTORIA.titulo, idAluno: aluno._id, idTutor: tutor._id, tutoriaEncerrada: false }, { _id: 1 })

      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()
      const response = await HELPER_TUTORIAS.encerrarTutoria(tutoria._id, aluno2.aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA, tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/não.*pertencem.*tutoria/i)
    })
  })

  describe('Encerrando uma tutoria com sucesso', () => {
    test('Deve retornar 200 "ok" para encerrar uma tutoria onde o tutor possui uma disciplina', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina])

      await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      const tutoria = await REPOSITORY_TUTORIAS.buscarUm({ titulo: DADOS_TUTORIA.titulo, idAluno: aluno._id, tutoriaEncerrada: false }, { _id: 1 })

      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()
      const response = await HELPER_TUTORIAS.encerrarTutoria(tutoria._id, aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA, tokenTutor)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      expect(response.body).toMatch(/encerrada.*sucesso/i)
    })

    test('Deve retornar 200 "ok" para encerrar uma tutoria onde o tutor possui duas disciplinas', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])

      await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      const tutoria = await REPOSITORY_TUTORIAS.buscarUm({ titulo: DADOS_TUTORIA.titulo, idAluno: aluno._id, tutoriaEncerrada: false }, { _id: 1 })

      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()
      const response = await HELPER_TUTORIAS.encerrarTutoria(tutoria._id, aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA, tokenTutor)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      expect(response.body).toMatch(/encerrada.*sucesso/i)
    })

    test('Deve retornar 200 "ok" para encerrar uma tutoria onde o tutor possui três disciplinas', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2, disciplina3])

      await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      const tutoria = await REPOSITORY_TUTORIAS.buscarUm({ titulo: DADOS_TUTORIA.titulo, idAluno: aluno._id, tutoriaEncerrada: false }, { _id: 1 })

      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()
      const response = await HELPER_TUTORIAS.encerrarTutoria(tutoria._id, aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA, tokenTutor)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      expect(response.body).toMatch(/encerrada.*sucesso/i)
    })
  })

  describe('Testes de segurança', () => {
    test('Deve retornar 403 informando que o token é inexistente', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2, disciplina3])

      await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      const tutoria = await REPOSITORY_TUTORIAS.buscarUm({ titulo: DADOS_TUTORIA.titulo, idAluno: aluno._id, tutoriaEncerrada: false }, { _id: 1 })

      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()
      const response = await HELPER_TUTORIAS.encerrarTutoria(tutoria._id, aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA, '')

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*não.*fornecido/i)
    })

    test('Deve retornar 403 informando que o token é inválido', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2, disciplina3])

      await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      const tutoria = await REPOSITORY_TUTORIAS.buscarUm({ titulo: DADOS_TUTORIA.titulo, idAluno: aluno._id, tutoriaEncerrada: false }, { _id: 1 })

      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()
      const response = await HELPER_TUTORIAS.encerrarTutoria(tutoria._id, aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA, {})

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*inválido/i)
    })

    test('Deve retornar 406 informando que o usuário não tem acesso ao utilizar um token de outro tutor', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      const DADOS_TUTOR2 = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor } = await criarTutor(DADOS_TUTOR, [disciplina])
      const tutor2 = await criarTutor(DADOS_TUTOR2, [disciplina])

      await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      const tutoria = await REPOSITORY_TUTORIAS.buscarUm({ titulo: DADOS_TUTORIA.titulo, idAluno: aluno._id, tutoriaEncerrada: false }, { _id: 1 })

      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()
      const response = await HELPER_TUTORIAS.encerrarTutoria(tutoria._id, aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA, tutor2.tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })

    test('Deve retornar 403 informando que o usuário não tem acesso ao utilizar um token de aluno', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor } = await criarTutor(DADOS_TUTOR, [disciplina])

      await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      const tutoria = await REPOSITORY_TUTORIAS.buscarUm({ titulo: DADOS_TUTORIA.titulo, idAluno: aluno._id, tutoriaEncerrada: false }, { _id: 1 })

      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()
      const response = await HELPER_TUTORIAS.encerrarTutoria(tutoria._id, aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA, tokenAluno)

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })

    test('Deve retornar 403 informando que o usuário não tem acesso ao utilizar um token de aluno', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor } = await criarTutor(DADOS_TUTOR, [disciplina])

      await HELPER_TUTORIAS.iniciarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      const tutoria = await REPOSITORY_TUTORIAS.buscarUm({ titulo: DADOS_TUTORIA.titulo, idAluno: aluno._id, tutoriaEncerrada: false }, { _id: 1 })

      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()
      const response = await HELPER_TUTORIAS.encerrarTutoria(tutoria._id, aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA, tokenAdmin)

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })
  })
})
