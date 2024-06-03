/* globals describe, test, expect, jest, beforeAll */

/* --- REQUIRES --- */

const randomstring = require('randomstring')
const validator = require('validator')

/* ---- HELPERS ---- */

const HELPER_REGISTRAR = require('../../../helpers/registrar')
const HELPER_ALUNOS = require('../../../helpers/alunos')
const HELPER_LOGIN = require('../../../helpers/autenticar')
const HELPER_TUTORES = require('../../../helpers/tutores')
const HELPER_ADMINS = require('../../../helpers/admins')
const HELPER_TOKEN = require('../../../../helpers/tokens')

/* --- REPOSITORIES --- */

const REPOSITORY_ALUNOS = require('../../../../repositories/alunos')
const REPOSITORY_TUTORES = require('../../../../repositories/tutores')
const REPOSITORY_ADMINS = require('../../../../repositories/admins')

/* --- CONSTANTS --- */

const DADOS_ALUNO = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
const DADOS_TUTOR = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
const DADOS_ADMIN = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()

/* ---- METHODS ---- */

describe('Testes de integração da rota POST /autenticacao', () => {
  jest.setTimeout(10000)

  const testeObjetoRespostaEntrar = (response, usuario) => {
    expect(response).toHaveProperty('body')

    expect(typeof response.body).toBe('string')

    expect(response.body).not.toBe('')
  }

  const testeObjetoTokenDadosComum = (dados, DADOS_USUARIO, tipo) => {
    expect(dados.usuario).toHaveProperty('_id')
    expect(dados.usuario).toHaveProperty('nome')
    expect(dados.usuario).toHaveProperty('email')
    expect(dados.usuario).toHaveProperty('dataRegistro')
    expect(dados).toHaveProperty('tipo')

    expect(typeof dados.usuario._id).toBe('string')
    expect(typeof dados.usuario.nome).toBe('string')
    expect(typeof dados.usuario.email).toBe('string')
    expect(typeof dados.usuario.dataRegistro).toBe('string')
    expect(typeof dados.tipo).toBe('string')

    expect(validator.isEmail(dados.usuario.email)).toBe(true)
    expect(dados.tipo).toMatch(tipo)
  }

  let alunoFake = {}
  let tutorFake = {}
  let adminFake = {}
  beforeAll(async () => {
    await HELPER_REGISTRAR.registrarAluno(DADOS_ALUNO)
    await HELPER_REGISTRAR.registrarTutor(DADOS_TUTOR)
    await HELPER_REGISTRAR.registrarAdministrador(DADOS_ADMIN)
    alunoFake = await REPOSITORY_ALUNOS.buscarUm({ email: DADOS_ALUNO.email })
    tutorFake = await REPOSITORY_TUTORES.buscarUm({ email: DADOS_TUTOR.email })
    adminFake = await REPOSITORY_ADMINS.buscarUm({ email: DADOS_ADMIN.email })
  })

  describe('Realizando login na conta de um aluno', () => {
    describe('Testes de validação', () => {
      test('Deve retornar 406 exigindo que o "email" seja obrigatório', async () => {
        const response = await HELPER_LOGIN.login({})
        expect(response.statusCode).toBe(406)
        expect(response.status).toBe('error')
        expect(response.body).toMatch(/email.*obrigatório/i)
      })

      test('Deve retornar 406 exigindo que o campo "email" seja do domínio @aluno.ifce.edu.br ou @ifce.edu.br', async () => {
        const response = await HELPER_LOGIN.login({ email: 'email@email.com' })
        expect(response.statusCode).toBe(406)
        expect(response.status).toBe('error')
        expect(response.body).toMatch(/email.*ifce/i)
      })

      test('Deve retornar 406 exigindo que o campo "email" seja válido', async () => {
        const response = await HELPER_LOGIN.login({ email: 123456 })
        expect(response.statusCode).toBe(406)
        expect(response.status).toBe('error')
        expect(response.body).toMatch(/email.*válido/i)
      })

      test('Deve retornar 406 exigindo que o campo "email" respeite o limite máximo de caracteres', async () => {
        const response = await HELPER_LOGIN.login({ email: `${randomstring.generate(101)}@aluno.ifce.edu.br` })
        expect(response.statusCode).toBe(406)
        expect(response.status).toBe('error')
        expect(response.body).toMatch(/email.*100/i)
      })

      test('Deve retornar 406 exigindo que o compo "senha" seja obrigatória', async () => {
        const response = await HELPER_LOGIN.login({ email: DADOS_ALUNO.email })
        expect(response.statusCode).toBe(406)
        expect(response.status).toBe('error')
        expect(response.body).toMatch(/senha.*obrigatório/i)
      })

      test('Deve retornar 406 exigindo que o campo "email" respeite o limite mínimo de caracteres', async () => {
        const response = await HELPER_LOGIN.login({ email: DADOS_ALUNO.email, senha: randomstring.generate(1) })
        expect(response.statusCode).toBe(406)
        expect(response.status).toBe('error')
        expect(response.body).toMatch(/senha.*8/i)
      })

      test('Deve retornar 406 exigindo que o compo "senha" seja uma string', async () => {
        const response = await HELPER_LOGIN.login({ email: DADOS_ALUNO.email, senha: 123123213 })
        expect(response.statusCode).toBe(406)
        expect(response.status).toBe('error')
        expect(response.body).toMatch(/senha.*string/i)
      })
    })

    describe('Acessando a conta de um aluno com sucesso', () => {
      test('Deve retornar 200 para o login de um aluno', async () => {
        const response = await HELPER_LOGIN.login(DADOS_ALUNO)

        expect(response.status).toBe('ok')
        expect(response.statusCode).toBe(200)
        testeObjetoRespostaEntrar(response, DADOS_ALUNO)
      })

      test('Deve conter os dados corretos no token de autenticação ao logar como aluno', async () => {
        const response = await HELPER_LOGIN.login(DADOS_ALUNO)
        const token = response.body
        const { usuario } = await HELPER_TOKEN.obterDadosDoToken(token, process.env.SECRET)
        testeObjetoTokenDadosComum(usuario, DADOS_ALUNO, 'aluno')

        expect(usuario.usuario).toHaveProperty('matricula')
        expect(typeof usuario.usuario.matricula).toBe('string')

        expect(usuario.usuario).toHaveProperty('emTutoria')
        expect(typeof usuario.usuario.emTutoria).toBe('boolean')
      })
    })

    describe('Testes de segurança', () => {
      test('Tentando realizar login com a senha incorreta', async () => {
        const request = await HELPER_LOGIN.login({ email: DADOS_ALUNO.email, senha: 'asdasdasd' })
        expect(request.statusCode).toBe(406)
        expect(request.status).toBe('error')
        expect(request.body).toMatch(/Email ou senha incorretos/i)
      })
    })
  })

  /* ------ */

  describe('Realizando login na conta de um tutor', () => {
    describe('Testes de validação', () => {
      test('Deve retornar 406 exigindo que o compo "senha" seja obrigatória', async () => {
        const response = await HELPER_LOGIN.login({ email: DADOS_TUTOR.email })
        expect(response.statusCode).toBe(406)
        expect(response.status).toBe('error')
        expect(response.body).toMatch(/senha.*obrigatório/i)
      })

      test('Deve retornar 406 exigindo que o campo "email" respeite o limite mínimo de caracteres', async () => {
        const response = await HELPER_LOGIN.login({ email: DADOS_TUTOR.email, senha: randomstring.generate(1) })
        expect(response.statusCode).toBe(406)
        expect(response.status).toBe('error')
        expect(response.body).toMatch(/senha.*8/i)
      })

      test('Deve retornar 406 exigindo que o compo "senha" seja uma string', async () => {
        const response = await HELPER_LOGIN.login({ email: DADOS_TUTOR.email, senha: 123123213 })
        expect(response.statusCode).toBe(406)
        expect(response.status).toBe('error')
        expect(response.body).toMatch(/senha.*string/i)
      })
    })

    describe('Acessando a conta de um tutor com sucesso', () => {
      test('Deve retornar 200 para o login de um tutor', async () => {
        const response = await HELPER_LOGIN.login(DADOS_TUTOR)
        expect(response.status).toBe('ok')
        expect(response.statusCode).toBe(200)
        testeObjetoRespostaEntrar(response, DADOS_TUTOR)
      })

      test('Deve conter os dados corretos no token de autenticação ao logar como tutor', async () => {
        const response = await HELPER_LOGIN.login(DADOS_TUTOR)
        const token = response.body
        const { usuario } = await HELPER_TOKEN.obterDadosDoToken(token, process.env.SECRET)
        testeObjetoTokenDadosComum(usuario, DADOS_TUTOR, 'tutor')

        expect(usuario.usuario).toHaveProperty('matricula')
        expect(typeof usuario.usuario.matricula).toBe('string')

        expect(usuario.usuario).toHaveProperty('emTutoria')
        expect(typeof usuario.usuario.emTutoria).toBe('boolean')
      })
    })

    describe('Testes de segurança', () => {
      test('Tentando realizar login com a senha incorreta', async () => {
        const request = await HELPER_LOGIN.login({ email: DADOS_TUTOR.email, senha: 'asdasdasd' })
        expect(request.statusCode).toBe(406)
        expect(request.status).toBe('error')
        expect(request.body).toMatch(/Email ou senha incorretos/i)
      })
    })
  })

  /* ----- */

  describe('Realizando login na conta de um administrador', () => {
    describe('Testes de validação', () => {
      test('Deve retornar 406 exigindo que o compo "senha" seja obrigatória', async () => {
        const response = await HELPER_LOGIN.login({ email: DADOS_ADMIN.email })
        expect(response.statusCode).toBe(406)
        expect(response.status).toBe('error')
        expect(response.body).toMatch(/senha.*obrigatório/i)
      })

      test('Deve retornar 406 exigindo que o campo "email" respeite o limite mínimo de caracteres', async () => {
        const response = await HELPER_LOGIN.login({ email: DADOS_ADMIN.email, senha: randomstring.generate(1) })
        expect(response.statusCode).toBe(406)
        expect(response.status).toBe('error')
        expect(response.body).toMatch(/senha.*8/i)
      })

      test('Deve retornar 406 exigindo que o compo "senha" seja uma string', async () => {
        const response = await HELPER_LOGIN.login({ email: DADOS_ADMIN.email, senha: 123123213 })
        expect(response.statusCode).toBe(406)
        expect(response.status).toBe('error')
        expect(response.body).toMatch(/senha.*string/i)
      })
    })

    describe('Acessando a conta de um administrador com sucesso', () => {
      test('Deve retornar 200 para o login de um administrador', async () => {
        const response = await HELPER_LOGIN.login(DADOS_ADMIN)
        expect(response.status).toBe('ok')
        expect(response.statusCode).toBe(200)
        testeObjetoRespostaEntrar(response, DADOS_ADMIN)
      })

      test('Deve conter os dados corretos no token de autenticação ao logar como administrador', async () => {
        const response = await HELPER_LOGIN.login(DADOS_ADMIN)
        const token = response.body
        const { usuario } = await HELPER_TOKEN.obterDadosDoToken(token, process.env.SECRET)
        testeObjetoTokenDadosComum(usuario, DADOS_ADMIN, 'admin')
      })
    })

    describe('Testes de segurança', () => {
      test('Tentando realizar login com a senha incorreta', async () => {
        const request = await HELPER_LOGIN.login({ email: DADOS_ADMIN.email, senha: 'asdasdasd' })
        expect(request.statusCode).toBe(406)
        expect(request.status).toBe('error')
        expect(request.body).toMatch(/Email ou senha incorretos/i)
      })
    })
  })
})
