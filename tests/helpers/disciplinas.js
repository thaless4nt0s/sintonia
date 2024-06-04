/* globals request */

/* ---- REQUIRES ---- */

const randomstring = require('randomstring')

/* ---- Methods ---- */

exports.gerarDadosValidosParaCriarDisciplina = () => {
  return {
    nome: randomstring.generate(10)
  }
}

exports.adicionarDisciplina = async (dados, token) => {
  const { body } = await request.post('/disciplinas').send(dados).set('x-access-token', token)

  return body
}

exports.alterarDados = async (idDisciplina, dados, token) => {
  const { body } = await request.put(`/disciplinas/${idDisciplina}`).send(dados).set('x-access-token', token)

  return body
}

exports.remover = async (idDisciplina, token) => {
  const { body } = await request.delete(`/disciplinas/${idDisciplina}`).set('x-access-token', token)

  return body
}

exports.receberPorId = async (idDisciplina, token) => {
  const { body } = await request.get(`/disciplinas/${idDisciplina}`).set('x-access-token', token)

  return body
}

exports.receberTodos = async (token) => {
  const { body } = await request.get('/disciplinas').set('x-access-token', token)

  return body
}
