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
  console.log(idDisciplina)
  const { body } = await request.delete(`/disciplinas/${idDisciplina}`).set('x-access-token', token)

  return body
}
