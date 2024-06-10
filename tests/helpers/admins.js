/* globals request */

/* ---- REQUIRES ---- */

const randomstring = require('randomstring')

/* ---- HELPERS --- */

const { faker } = require('@faker-js/faker')

/* ---- Methods ---- */

exports.gerarDadosValidosParaCriarAdmin = () => {
  return {
    nome: faker.internet.userName(),
    email: `${randomstring.generate(12).toLowerCase()}@ifce.edu.br`,
    senha: '12345678'
  }
}

exports.alterarDados = async (idAdmin, dados, token) => {
  const { body } = await request.patch(`/administradores/${idAdmin}`).send(dados).set('x-access-token', token)

  return body
}

exports.removerAluno = async (idAluno, token) => {
  const { body } = await request.delete(`/administradores/alunos/${idAluno}`).set('x-access-token', token)

  return body
}
