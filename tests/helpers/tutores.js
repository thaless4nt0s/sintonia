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
