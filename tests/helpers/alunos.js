/* globals request */
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

exports.gerarDadosValidosParaEditarAluno = (dados, idDisciplina) => {
  const alunoEditado = {}

  if (dados.nome) alunoEditado.nome = dados.nome
  if (dados.email) alunoEditado.email = dados.email
  if (dados.senha) alunoEditado.senha = dados.senha
  if (dados.matricula) alunoEditado.matricula = dados.matricula
  if (idDisciplina) alunoEditado.idDisciplina = idDisciplina

  return alunoEditado
}

exports.alterarDados = async (idAluno, dados, token) => {
  const { body } = await request.patch(`/alunos/${idAluno}`).send(dados).set('x-access-token', token)

  return body
}
