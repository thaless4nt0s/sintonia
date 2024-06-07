/* globals describe, test, expect, jest, beforeAll */

/* --- REQUIRES --- */

const mongoid = require('mongoid-js')

/* --- REPOSITORIES --- */

const REPOSITORY_DISCIPLINAS = require('../../../../repositories/disciplinas')
const REPOSITORY_ALUNOS = require('../../../../repositories/alunos')
const REPOSITORY_TUTORES = require('../../../../repositories/tutores')
const REPOSITORY_TUTORIAS = require('../../../../repositories/tutorias')
const REPOSITORY_AVALIACOES = require('../../../../repositories/avaliacoes')

/* ---- HELPERS ---- */

const HELPER_REGISTRAR = require('../../../helpers/registrar')
const HELPER_ALUNOS = require('../../../helpers/alunos')
const HELPER_TUTORES = require('../../../helpers/tutores')
const HELPER_ADMINS = require('../../../helpers/admins')
const HELPER_TUTORIAS = require('../../../helpers/tutorias')
const HELPER_LOGIN = require('../../../helpers/autenticar')
const HELPER_DISCIPLINAS = require('../../../helpers/disciplinas')
const HELPER_AVALIACOES = require('../../../helpers/avaliacoes')

/* --- CONSTANTS --- */

const DADOS_DISCIPLINA = HELPER_DISCIPLINAS.gerarDadosValidosParaCriarDisciplina()
const DADOS_DISCIPLINA2 = HELPER_DISCIPLINAS.gerarDadosValidosParaCriarDisciplina()
const DADOS_DISCIPLINA3 = HELPER_DISCIPLINAS.gerarDadosValidosParaCriarDisciplina()

const DADOS_ADMIN = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()

/* --- METHODS --- */

describe('Testes de integração da rota DELETE /avaliacoes/:idAvaliacao', () => {
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

  describe('Testes de validação da requisição', () => {
    test('Deve retornar 406 informando que o id da avaliação é inválido', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()

      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const DADOS_AVALIACAO = HELPER_AVALIACOES.gerarDadosValidosParaUmaAvaliacao()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)

      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])

      const tutoria = await criarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      await finalizarTutoria(tutoria._id, aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA, tokenTutor)

      await HELPER_AVALIACOES.adicionarAvaliacao(tutoria._id, DADOS_AVALIACAO, tokenAluno)

      const response = await HELPER_AVALIACOES.removerAvaliacao(mongoid(), tokenAdmin)

      expect(response.statusCode).toBe(406)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Avaliacao.*não.*existe/i)
    })
  })

  describe('Testes de segurança', () => {
    test('Deve retornar 403 informando o token é inexistente', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()

      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const DADOS_AVALIACAO = HELPER_AVALIACOES.gerarDadosValidosParaUmaAvaliacao()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)

      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])

      const tutoria = await criarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      await finalizarTutoria(tutoria._id, aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA, tokenTutor)

      await HELPER_AVALIACOES.adicionarAvaliacao(tutoria._id, DADOS_AVALIACAO, tokenAluno)

      const response = await HELPER_AVALIACOES.removerAvaliacao(tutoria._id, '')

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*não.*fornecido/i)
    })

    test('Deve retornar 403 informando o token é inexistente', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()

      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const DADOS_AVALIACAO = HELPER_AVALIACOES.gerarDadosValidosParaUmaAvaliacao()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)

      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])

      const tutoria = await criarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      await finalizarTutoria(tutoria._id, aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA, tokenTutor)

      await HELPER_AVALIACOES.adicionarAvaliacao(tutoria._id, DADOS_AVALIACAO, tokenAluno)

      const response = await HELPER_AVALIACOES.removerAvaliacao(tutoria._id, {})

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/token.*inválido/i)
    })

    test('Deve retornar 406 quando um aluno tentar remover uma avaliação', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()

      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const DADOS_AVALIACAO = HELPER_AVALIACOES.gerarDadosValidosParaUmaAvaliacao()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)

      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])

      const tutoria = await criarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      await finalizarTutoria(tutoria._id, aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA, tokenTutor)

      await HELPER_AVALIACOES.adicionarAvaliacao(tutoria._id, DADOS_AVALIACAO, tokenAluno)

      const response = await HELPER_AVALIACOES.removerAvaliacao(tutoria._id, tokenAluno)

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })

    test('Deve retornar 406 quando um tutor tentar remover uma avaliação', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()

      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const DADOS_AVALIACAO = HELPER_AVALIACOES.gerarDadosValidosParaUmaAvaliacao()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)

      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])

      const tutoria = await criarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      await finalizarTutoria(tutoria._id, aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA, tokenTutor)

      await HELPER_AVALIACOES.adicionarAvaliacao(tutoria._id, DADOS_AVALIACAO, tokenAluno)

      const response = await HELPER_AVALIACOES.removerAvaliacao(tutoria._id, tokenTutor)

      expect(response.statusCode).toBe(403)
      expect(response.status).toBe('error')
      expect(response.body).toMatch(/Acesso.*não.*autorizado/i)
    })
  })

  describe('Removendo uma avaliação com sucesso', () => {
    test('Deve retornar status 200 "ok"', async () => {
      const DADOS_TUTORIA = HELPER_TUTORIAS.gerarDadosValidosParaCriarTutoria()
      const DADOS_TUTORIA_ENCERRADA = HELPER_TUTORIAS.gerarDadosValidosParaEncerrarTutoria()

      const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
      const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

      const DADOS_AVALIACAO = HELPER_AVALIACOES.gerarDadosValidosParaUmaAvaliacao()

      const { aluno, tokenAluno } = await criarAluno(DADOS_ALUNO, disciplina)

      const { tutor, tokenTutor } = await criarTutor(DADOS_TUTOR, [disciplina, disciplina2])

      const tutoria = await criarTutoria(aluno._id, tutor._id, DADOS_TUTORIA, tokenAluno)
      await finalizarTutoria(tutoria._id, aluno._id, tutor._id, DADOS_TUTORIA_ENCERRADA, tokenTutor)

      await HELPER_AVALIACOES.adicionarAvaliacao(tutoria._id, DADOS_AVALIACAO, tokenAluno)
      const avaliacao = await REPOSITORY_AVALIACOES.buscarUm({ idTutoria: tutoria._id }, { _id: 1 })

      const response = await HELPER_AVALIACOES.removerAvaliacao(avaliacao._id, tokenAdmin)

      expect(response.statusCode).toBe(200)
      expect(response.status).toBe('ok')
      expect(response.body).toMatch(/removida.*sucesso/i)
    })
  })
})
