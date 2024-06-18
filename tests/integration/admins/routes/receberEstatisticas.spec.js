/* globals describe, test, expect, jest, beforeAll */

/* --- REQUIRES --- */

const moment = require('moment')

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

describe('Testes de integração da rota GET /administradores/estatisticas?dataInicial={}&dataFinal={}', () => {
  jest.setTimeout(50000)

  let loginAdmin = {}
  let tokenAdmin = {}

  let disciplina = {}
  let disciplina2 = {}

  beforeAll(async () => {
    await HELPER_REGISTRAR.registrarAdministrador(DADOS_ADMIN)

    loginAdmin = await HELPER_LOGIN.login(DADOS_ADMIN)
    tokenAdmin = loginAdmin.body

    await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA, tokenAdmin)
    await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA2, tokenAdmin)
    await HELPER_DISCIPLINAS.adicionarDisciplina(DADOS_DISCIPLINA3, tokenAdmin)

    disciplina = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA.nome }, { _id: 1 })
    disciplina2 = await REPOSITORY_DISCIPLINAS.buscarUm({ nome: DADOS_DISCIPLINA2.nome }, { _id: 1 })
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

  const testeObjetoEstatistica = (response) => {
    expect(response).toHaveProperty('novosAlunos')
    expect(response).toHaveProperty('novosTutores')
    expect(response).toHaveProperty('totalDeTutoriasRealizadasNoPeriodo')
    expect(response).toHaveProperty('estatisticas')

    expect(Array.isArray(response.estatisticas)).toBe(true)

    expect(response.estatisticas[0]).toHaveProperty('nome')
    expect(response.estatisticas[0]).toHaveProperty('tutoriasRealizadas')
    expect(response.estatisticas[0]).toHaveProperty('tutoriaPendente')
    expect(response.estatisticas[0]).toHaveProperty('idTutor')
    expect(response.estatisticas[0]).toHaveProperty('quantidadeAlunosAtendidosNoPeriodo')

    expect(typeof response.novosAlunos).toBe('number')
    expect(typeof response.novosTutores).toBe('number')
    expect(typeof response.totalDeTutoriasRealizadasNoPeriodo).toBe('number')
    expect(typeof response.estatisticas[0]).toBe('object')
    expect(typeof response.estatisticas[0].nome).toBe('string')
    expect(typeof response.estatisticas[0].tutoriasRealizadas).toBe('number')
    expect(typeof response.estatisticas[0].tutoriaPendente).toBe('number')
    expect(typeof response.estatisticas[0].idTutor).toBe('string')
    expect(typeof response.estatisticas[0].quantidadeAlunosAtendidosNoPeriodo).toBe('number')
  }

  describe('Testes de validação da requisição', () => {
    test('Deve retornar 406 informando que o campo "dataInicial" é obrigatório', async () => {
      const dataFinal = moment().endOf('month').toISOString()

      const response = await HELPER_ADMINS.receberEstatisticas('', dataFinal, tokenAdmin)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/dataInicial.*obrigatório/i)
    })

    test('Deve retornar 406 informando que o campo "dataInicial" exige uma data válida', async () => {
      const dataFinal = moment().endOf('month').toISOString()

      const response = await HELPER_ADMINS.receberEstatisticas({}, dataFinal, tokenAdmin)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/dataInicial.*válida/i)
    })

    test('Deve retornar 406 informando que o campo "dataInicial" é obrigatório', async () => {
      const dataInicial = moment().startOf('month').toISOString()
      const response = await HELPER_ADMINS.receberEstatisticas(dataInicial, '', tokenAdmin)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/dataFinal.*obrigatório/i)
    })

    test('Deve retornar 406 informando que o campo "dataInicial" exige uma data válida', async () => {
      const dataInicial = moment().startOf('month').toISOString()
      const response = await HELPER_ADMINS.receberEstatisticas(dataInicial, {}, tokenAdmin)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/dataFinal.*válida/i)
    })
  })

  describe('Recebendo as estatisticas com sucesso', () => {
    test('Deve retornar status 200 "ok"', async () => {
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina._id)

      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina._id, disciplina2._id])

      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const tutoria = await criarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)

      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()
      await finalizarTutoria(tutoria._id, aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA, tokenTutor)

      const dataInicial = moment().startOf('month').toISOString()
      const dataFinal = moment().endOf('month').toISOString()

      const response = await HELPER_ADMINS.receberEstatisticas(dataInicial, dataFinal, tokenAdmin)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      testeObjetoEstatistica(response.body)
    })
  })

  describe('Testes de segurança', () => {
    test('Deve retornar 403 informando que o token não foi fornecido', async () => {
      const dataInicial = moment().startOf('month').toISOString()
      const dataFinal = moment().endOf('month').toISOString()

      const response = await HELPER_ADMINS.receberEstatisticas(dataInicial, dataFinal, '')

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*não.*fornecido/i)
    })

    test('Deve retornar 403 informando que o token é inválido', async () => {
      const dataInicial = moment().startOf('month').toISOString()
      const dataFinal = moment().endOf('month').toISOString()

      const response = await HELPER_ADMINS.receberEstatisticas(dataInicial, dataFinal, {})

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*inválido/i)
    })

    test('Deve retornar 403 informando que o acesso não é autorizado quando um aluno acessa', async () => {
      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const { tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina._id)

      const dataInicial = moment().startOf('month').toISOString()
      const dataFinal = moment().endOf('month').toISOString()

      const response = await HELPER_ADMINS.receberEstatisticas(dataInicial, dataFinal, tokenAluno)

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })

    test('Deve retornar 403 informando que o acesso não é autorizado quando um tutor acessa', async () => {
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
      const { tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina._id])

      const dataInicial = moment().startOf('month').toISOString()
      const dataFinal = moment().endOf('month').toISOString()

      const response = await HELPER_ADMINS.receberEstatisticas(dataInicial, dataFinal, tokenTutor)

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })
  })
})
