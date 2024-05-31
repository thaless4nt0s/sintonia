/* ---- REQUIRES ---- */

const randomstring = require('randomstring')

/* ---- HELPERS --- */

const { faker } = require('@faker-js/faker')

/* ---- Methods ---- */

exports.gerarDadosValidosParaCriarAluno = () => {
  return {
    nome: faker.internet.userName(),
    matricula: randomstring.generate(14).toLowerCase(),
    email: `${randomstring.generate(12).toLowerCase()}@aluno.ifce.edu.br`,
    senha: '12345678'
  }
}
