/* globals request */
/* ---- REQUIRES ---- */

const randomstring = require('randomstring')

/* ---- HELPERS --- */

const { faker } = require('@faker-js/faker')

/* ---- Methods ---- */

exports.gerarDadosValidosParaCriarTutor = () => {
  return {
    nome: faker.internet.userName(),
    matricula: randomstring.generate(14).toLowerCase(),
    email: `${randomstring.generate(12).toLowerCase()}@aluno.ifce.edu.br`,
    semestre: faker.string.numeric({ exclude: ['0'] }),
    senha: '12345678'
  }
}

exports.gerarDadosValidosParaEditarTutor = (dados, idDisciplina) => {
  const tutorEditado = {}
  if (dados.nome) tutorEditado.nome = dados.nome
  if (dados.email) tutorEditado.email = dados.email
  if (dados.senha) tutorEditado.senha = dados.senha
  if (dados.matricula) tutorEditado.matricula = dados.matricula
  if (dados.semestre) tutorEditado.semestre = dados.semestre
  if (idDisciplina) tutorEditado.idDisciplina = idDisciplina

  return tutorEditado
}

exports.alterarDados = async (idTutor, dados, token) => {
  const { body } = await request.patch(`/tutores/${idTutor}`).send(dados).set('x-access-token', token)

  return body
}

exports.remover = async (idTutor, token) => {
  const { body } = await request.delete(`/tutores/${idTutor}`).set('x-access-token', token)

  return body
}

exports.receberPorId = async (idTutor, token) => {
  const { body } = await request.get(`/tutores/${idTutor}`).set('x-access-token', token)

  return body
}

exports.receberTodos = async (token) => {
  const { body } = await request.get('/tutores').set('x-access-token', token)

  return body
}
