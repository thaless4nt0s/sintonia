/* globals describe, test, expect, jest */

/* --- REQUIRES --- */

const randomstring = require('randomstring')

/* ---- HELPERS ---- */

const HELPER_REGISTRAR = require('../../../helpers/registrar')
const HELPER_ALUNOS = require('../../../helpers/alunos')
const HELPER_TUTORES = require('../../../helpers/tutores')
const HELPER_ADMINS = require('../../../helpers/admins')

/* ---- METHODS ---- */

describe('Testes de integração da rota POST /registrar/', () => {
  jest.setTimeout(10000)
  describe('Testes da rota POST /registrar/{aluno ou administrador ou tutor}', () => {
    describe('Criar uma conta', () => {
      test('Deve registrar o aluno com todos os dados preenchidos corretamente', async () => {
        const dados = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
        const response = await HELPER_REGISTRAR.registrarAluno(dados)

        expect(response.body).toMatch(/aluno.*sucesso/i)
        expect(response.status).toBe('ok')
        expect(response.statusCode).toBe(200)
      })

      test('Deve registrar o tutor com todos os dados preenchidos corretamente', async () => {
        const dados = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
        const response = await HELPER_REGISTRAR.registrarTutor(dados)

        expect(response.body).toMatch(/tutor.*sucesso/i)
        expect(response.status).toBe('ok')
        expect(response.statusCode).toBe(200)
      })

      test('Deve registrar o administrador com todos os dados preenchidos corretamente', async () => {
        const dados = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
        const response = await HELPER_REGISTRAR.registrarAdministrador(dados)

        expect(response.body).toMatch(/administrador.*sucesso/i)
        expect(response.status).toBe('ok')
        expect(response.statusCode).toBe(200)
      })
    })

    describe('Validações da requisição para alunos', () => {
      test('Deve retornar 406 exigindo que o campo "nome" seja uma string', async () => {
        const dados = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
        dados.nome = 123456
        const response = await HELPER_REGISTRAR.registrarAluno(dados)

        expect(response.body).toMatch(/nome.*string/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "nome" seja obrigatório', async () => {
        const dados = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
        delete dados.nome
        const response = await HELPER_REGISTRAR.registrarAluno(dados)

        expect(response.body).toMatch(/nome.*obrigatório/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "nome" respeite o limite de caracteres', async () => {
        const dados = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
        dados.nome = randomstring.generate(101)
        const response = await HELPER_REGISTRAR.registrarAluno(dados)

        expect(response.body).toMatch(/nome.*100/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "email" tenha um endereço válido', async () => {
        const dados = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
        dados.email = 123456
        const response = await HELPER_REGISTRAR.registrarAluno(dados)
        expect(response.body).toMatch(/email.*válido/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "email" seja obrigatório', async () => {
        const dados = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
        delete dados.email
        const response = await HELPER_REGISTRAR.registrarAluno(dados)

        expect(response.body).toMatch(/email.*obrigatório/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "email" respeite o limite de caracteres', async () => {
        const dados = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
        dados.email = `${randomstring.generate(201)}@aluno.ifce.edu.br`
        const response = await HELPER_REGISTRAR.registrarAluno(dados)

        expect(response.body).toMatch(/email.*100/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "email" tenha o dominio @aluno.ifce.edu.br', async () => {
        const dados = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
        dados.email = `${randomstring.generate(20)}@email.com`
        const response = await HELPER_REGISTRAR.registrarAluno(dados)
        expect(response.body).toMatch(/email.*domínio/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "email" já utiliza a email de alguém', async () => {
        const dados = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
        const dados2 = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()

        dados2.email = dados.email
        await HELPER_REGISTRAR.registrarAluno(dados)
        const response2 = await HELPER_REGISTRAR.registrarAluno(dados2)

        expect(response2.body).toMatch(/email.*existente/i)
        expect(response2.status).toBe('error')
        expect(response2.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "matricula" seja obrigatório', async () => {
        const dados = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
        delete dados.matricula
        const response = await HELPER_REGISTRAR.registrarAluno(dados)

        expect(response.body).toMatch(/matricula.*obrigatório/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "matricula" seja uma string', async () => {
        const dados = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
        dados.matricula = 21334
        const response = await HELPER_REGISTRAR.registrarAluno(dados)

        expect(response.body).toMatch(/matricula.*string/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "matricula" respeite o limite de caracteres', async () => {
        const dados = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
        dados.matricula = randomstring.generate(29)
        const response = await HELPER_REGISTRAR.registrarAluno(dados)

        expect(response.body).toMatch(/matricula.*14/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "matricula" já utiliza a matricula de alguém', async () => {
        const dados = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
        const dados2 = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()

        dados2.matricula = dados.matricula
        await HELPER_REGISTRAR.registrarAluno(dados)
        const response2 = await HELPER_REGISTRAR.registrarAluno(dados2)

        expect(response2.body).toMatch(/matricula.*existente/i)
        expect(response2.status).toBe('error')
        expect(response2.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "senha" respeite o limite de caracteres', async () => {
        const dados = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
        dados.senha = randomstring.generate(29)
        const response = await HELPER_REGISTRAR.registrarAluno(dados)

        expect(response.body).toMatch(/senha.*10/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "senha" respeite o limite mínimo de caracteres', async () => {
        const dados = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
        dados.senha = randomstring.generate(3)
        const response = await HELPER_REGISTRAR.registrarAluno(dados)

        expect(response.body).toMatch(/senha.*8/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "senha" seja obrigatório', async () => {
        const dados = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
        delete dados.senha
        const response = await HELPER_REGISTRAR.registrarAluno(dados)

        expect(response.body).toMatch(/senha.*obrigatório/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "senha" seja uma string', async () => {
        const dados = HELPER_ALUNOS.gerarDadosValidosParaCriarAluno()
        dados.senha = 1234566
        const response = await HELPER_REGISTRAR.registrarAluno(dados)

        expect(response.body).toMatch(/senha.*string/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })
    })

    describe('Validações da requisição para tutores', () => {
      test('Deve retornar 406 exigindo que o campo "nome" seja uma string', async () => {
        const dados = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
        dados.nome = 123456
        const response = await HELPER_REGISTRAR.registrarTutor(dados)

        expect(response.body).toMatch(/nome.*string/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "nome" seja obrigatório', async () => {
        const dados = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
        delete dados.nome
        const response = await HELPER_REGISTRAR.registrarTutor(dados)

        expect(response.body).toMatch(/nome.*obrigatório/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "nome" respeite o limite de caracteres', async () => {
        const dados = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
        dados.nome = randomstring.generate(101)
        const response = await HELPER_REGISTRAR.registrarTutor(dados)

        expect(response.body).toMatch(/nome.*100/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "email" tenha um endereço válido', async () => {
        const dados = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
        dados.email = 12
        const response = await HELPER_REGISTRAR.registrarTutor(dados)
        expect(response.body).toMatch(/email.*válido/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "email" seja obrigatório', async () => {
        const dados = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
        delete dados.email
        const response = await HELPER_REGISTRAR.registrarTutor(dados)

        expect(response.body).toMatch(/email.*obrigatório/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "email" respeite o limite de caracteres', async () => {
        const dados = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
        dados.email = `${randomstring.generate(201)}@aluno.ifce.edu.br`
        const response = await HELPER_REGISTRAR.registrarTutor(dados)

        expect(response.body).toMatch(/email.*100/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "email" tenha o dominio @aluno.ifce.edu.br', async () => {
        const dados = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
        dados.email = `${randomstring.generate(20)}@email.com`
        const response = await HELPER_REGISTRAR.registrarTutor(dados)
        expect(response.body).toMatch(/email.*domínio/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "email" já utiliza a email de alguém', async () => {
        const dados = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
        const dados2 = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

        dados2.email = dados.email
        await HELPER_REGISTRAR.registrarTutor(dados)
        const response2 = await HELPER_REGISTRAR.registrarTutor(dados2)

        expect(response2.body).toMatch(/email.*existente/i)
        expect(response2.status).toBe('error')
        expect(response2.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "matricula" seja obrigatório', async () => {
        const dados = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
        delete dados.matricula
        const response = await HELPER_REGISTRAR.registrarTutor(dados)

        expect(response.body).toMatch(/matricula.*obrigatório/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "matricula" seja uma string', async () => {
        const dados = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
        dados.matricula = 21334
        const response = await HELPER_REGISTRAR.registrarTutor(dados)

        expect(response.body).toMatch(/matricula.*string/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "matricula" respeite o limite de caracteres', async () => {
        const dados = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
        dados.matricula = randomstring.generate(29)
        const response = await HELPER_REGISTRAR.registrarTutor(dados)

        expect(response.body).toMatch(/matricula.*14/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "matricula" já utiliza a matricula de alguém', async () => {
        const dados = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
        const dados2 = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()

        dados2.matricula = dados.matricula
        await HELPER_REGISTRAR.registrarTutor(dados)
        const response2 = await HELPER_REGISTRAR.registrarTutor(dados2)

        expect(response2.body).toMatch(/matricula.*existente/i)
        expect(response2.status).toBe('error')
        expect(response2.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "senha" respeite o limite de caracteres', async () => {
        const dados = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
        dados.senha = randomstring.generate(29)
        const response = await HELPER_REGISTRAR.registrarTutor(dados)

        expect(response.body).toMatch(/senha.*10/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "senha" respeite o limite mínimo de caracteres', async () => {
        const dados = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
        dados.senha = randomstring.generate(3)
        const response = await HELPER_REGISTRAR.registrarTutor(dados)

        expect(response.body).toMatch(/senha.*8/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "senha" seja obrigatório', async () => {
        const dados = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
        delete dados.senha
        const response = await HELPER_REGISTRAR.registrarTutor(dados)

        expect(response.body).toMatch(/senha.*obrigatório/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "senha" seja uma string', async () => {
        const dados = HELPER_TUTORES.gerarDadosValidosParaCriarTutor()
        dados.senha = 1234566
        const response = await HELPER_REGISTRAR.registrarTutor(dados)

        expect(response.body).toMatch(/senha.*string/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })
    })

    describe('Validações da requisição para administradores', () => {
      test('Deve retornar 406 exigindo que o campo "nome" seja uma string', async () => {
        const dados = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
        dados.nome = 123456
        const response = await HELPER_REGISTRAR.registrarAdministrador(dados)

        expect(response.body).toMatch(/nome.*string/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "nome" seja obrigatório', async () => {
        const dados = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
        delete dados.nome
        const response = await HELPER_REGISTRAR.registrarAdministrador(dados)

        expect(response.body).toMatch(/nome.*obrigatório/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "nome" respeite o limite de caracteres', async () => {
        const dados = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
        dados.nome = randomstring.generate(101)
        const response = await HELPER_REGISTRAR.registrarAdministrador(dados)

        expect(response.body).toMatch(/nome.*100/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "email" tenha um endereço válido', async () => {
        const dados = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
        dados.email = 12
        const response = await HELPER_REGISTRAR.registrarAdministrador(dados)
        expect(response.body).toMatch(/email.*válido/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "email" seja obrigatório', async () => {
        const dados = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
        delete dados.email
        const response = await HELPER_REGISTRAR.registrarAdministrador(dados)

        expect(response.body).toMatch(/email.*obrigatório/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "email" respeite o limite de caracteres', async () => {
        const dados = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
        dados.email = `${randomstring.generate(201)}@ifce.edu.br`
        const response = await HELPER_REGISTRAR.registrarAdministrador(dados)

        expect(response.body).toMatch(/email.*100/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "email" tenha o dominio @ifce.edu.br', async () => {
        const dados = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
        dados.email = `${randomstring.generate(20)}@email.com`
        const response = await HELPER_REGISTRAR.registrarAdministrador(dados)
        expect(response.body).toMatch(/email.*domínio/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "email" já utiliza a email de alguém', async () => {
        const dados = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
        const dados2 = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()

        dados2.email = dados.email
        await HELPER_REGISTRAR.registrarAdministrador(dados)
        const response2 = await HELPER_REGISTRAR.registrarAdministrador(dados2)

        expect(response2.body).toMatch(/email.*existente/i)
        expect(response2.status).toBe('error')
        expect(response2.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "senha" respeite o limite de caracteres', async () => {
        const dados = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
        dados.senha = randomstring.generate(29)
        const response = await HELPER_REGISTRAR.registrarAdministrador(dados)

        expect(response.body).toMatch(/senha.*10/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "senha" respeite o limite mínimo de caracteres', async () => {
        const dados = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
        dados.senha = randomstring.generate(3)
        const response = await HELPER_REGISTRAR.registrarAdministrador(dados)

        expect(response.body).toMatch(/senha.*8/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "senha" seja obrigatório', async () => {
        const dados = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
        delete dados.senha
        const response = await HELPER_REGISTRAR.registrarAdministrador(dados)

        expect(response.body).toMatch(/senha.*obrigatório/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })

      test('Deve retornar 406 exigindo que o campo "senha" seja uma string', async () => {
        const dados = HELPER_ADMINS.gerarDadosValidosParaCriarAdmin()
        dados.senha = 1234566
        const response = await HELPER_REGISTRAR.registrarAdministrador(dados)

        expect(response.body).toMatch(/senha.*string/i)
        expect(response.status).toBe('error')
        expect(response.statusCode).toBe(406)
      })
    })
  })
})
