/* ---- REQUIRES ---- */

const randomstring = require('randomstring')

/* ---- HELPERS --- */

const { faker } = require('@faker-js/faker')

/* ---- Methods ---- */

exports.gerarDadosValidosParaCriarAdmin = () => {
  return {
    nome: faker.internet.userName(),
    matricula: randomstring.generate(14).toLowerCase(),
    email: `${randomstring.generate(12).toLowerCase()}@ifce.edu.br`,
    senha: '12345678'
  }
}
