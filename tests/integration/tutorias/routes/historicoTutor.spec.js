/* globals describe, test, expect, jest, beforeAll */

/* --- REQUIRES --- */

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

describe('Testes de integração da rota GET /tutorias/historico/tutor/:idTutor', () => {
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

  const criarTutoria = async (idAluno, idTutor, dados, tokenAluno) => {
    await HELPER_TUTORIAS.iniciarTutoria(idAluno, idTutor, dados, tokenAluno)
    return REPOSITORY_TUTORIAS.buscarUm({ titulo: dados.titulo, idAluno, idTutor, tutoriaEncerrada: false }, { _id: 1 })
  }

  const finalizarTutoria = async (idTutoria, idAluno, idTutor, dados, tokenTutor) => {
    await HELPER_TUTORIAS.encerrarTutoria(idTutoria, idAluno, idTutor, dados, tokenTutor)
  }

  const objetoTesteTutoria = (dado) => {
    expect(dado).toHaveProperty('_id')
    expect(dado).toHaveProperty('titulo')
    expect(dado).toHaveProperty('dataRegistro')
    expect(dado).toHaveProperty('resumo')
    expect(dado).toHaveProperty('tutor')
    expect(dado.tutor).toHaveProperty('nome')
    expect(dado).toHaveProperty('aluno')
    expect(dado.aluno).toHaveProperty('nome')
    expect(dado).toHaveProperty('disciplina')
    expect(dado.disciplina).toHaveProperty('nome')
    expect(dado).toHaveProperty('emTutoria')
    expect(dado).toHaveProperty('dataEncerramento')

    expect(typeof dado._id).toBe('string')
    expect(typeof dado.titulo).toBe('string')
    expect(typeof dado.dataRegistro).toBe('string')
    expect(typeof dado.resumo).toBe('string')
    expect(typeof dado.tutor).toBe('object')
    expect(typeof dado.tutor.nome).toBe('string')
    expect(typeof dado.aluno).toBe('object')
    expect(typeof dado.aluno.nome).toBe('string')
    expect(typeof dado.disciplina).toBe('object')
    expect(typeof dado.disciplina.nome).toBe('string')
    expect(typeof dado.emTutoria).toBe('string')
    expect(typeof dado.dataEncerramento).toBe('string')
  }

  describe('Testes de validação da requisição', () => {
    test('Deve retornar 406 informando que o "Tutor" é inexistente', async () => {
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      const { tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])

      const response = await HELPER_TUTORIAS.historicoTutor(mongoid(), tokenTutor)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Tutor.*não.*encontrado/i)
    })
  })

  describe('Mostrando o histórico de tutorias de um tutor com sucesso', () => {
    test('Deve retornar status 200 "ok" para um tutor que não possui tutorias no histórico', async () => {
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2, disciplina3])

      const response = await HELPER_TUTORIAS.historicoTutor(tutor._id, tokenTutor)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      expect(Array.isArray(response.body)).toBe(true)
    })

    test('Deve retornar status 200 "ok" para um tutor que possui tutorias no histórico', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()

      const DADOS_TUTORIA2 = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_TUTORIA_ENCERRADA2 = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()

      const DADOS_TUTORIA3 = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_TUTORIA_ENCERRADA3 = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()

      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2, disciplina3])

      const tutoria = await criarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      await finalizarTutoria(tutoria._id, aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA, tokenTutor)

      const tutoria2 = await criarTutoria(aluno._id, tutor._id, DADOS_TUTORIA2, tokenAluno)
      await finalizarTutoria(tutoria2._id, aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA2, tokenTutor)

      const tutoria3 = await criarTutoria(aluno._id, tutor._id, DADOS_TUTORIA3, tokenAluno)
      await finalizarTutoria(tutoria3._id, aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA3, tokenTutor)

      const response = await HELPER_TUTORIAS.historicoTutor(tutor._id, tokenTutor)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      objetoTesteTutoria(response.body[0])
    })

    test('Deve retornar status 200 "ok" por um aluno que busca um histórico', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()

      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_ALUNO2 = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const aluno2 = await criarAluno(DADOS_ALUNO2, disciplina)
      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2, disciplina3])

      const tutoria = await criarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      await finalizarTutoria(tutoria._id, aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA, tokenTutor)

      const response = await HELPER_TUTORIAS.historicoTutor(tutor._id, aluno2.tokenAluno)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      objetoTesteTutoria(response.body[0])
    })

    test('Deve retornar status 200 "ok" para outro tutor que busca um histórico', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()

      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      const DADOS_TUTOR2 = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2, disciplina3])
      const tutor2 = await criarTutor(DADOS_TUTOR2, [disciplina, disciplina2, disciplina3])

      const tutoria = await criarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      await finalizarTutoria(tutoria._id, aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA, tokenTutor)

      const response = await HELPER_TUTORIAS.historicoTutor(tutor._id, tutor2.tokenTutor)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      objetoTesteTutoria(response.body[0])
    })

    test('Deve retornar status 200 "ok" para outro administrador que busca um histórico', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()

      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)
      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2, disciplina3])

      const tutoria = await criarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      await finalizarTutoria(tutoria._id, aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA, tokenTutor)

      const response = await HELPER_TUTORIAS.historicoTutor(tutor._id, tokenAdmin)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      objetoTesteTutoria(response.body[0])
    })
  })

  describe('Testes de segurança', () => {
    test('Deve retornar 403 informando que o token é inexistente', async () => {
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      const { tutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2, disciplina3])

      const response = await HELPER_TUTORIAS.historicoTutor(tutor._id, '')

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*não.*fornecido/i)
    })

    test('Deve retornar 403 informando que o token é inválido', async () => {
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      const { tutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2, disciplina3])

      const response = await HELPER_TUTORIAS.historicoTutor(tutor._id, {})

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*inválido/i)
    })
  })
})
