/* globals request */

/* --- REQUIRES --- */

const randomstring = require('randomstring')

/* ---- METHODS ---- */

exports.gerarDadosValidosParaUmaAvaliacao = () => {
  return {
    nota: (Math.random() % 5) + 1,
    comentario: randomstring.generate(130)
  }
}

exports.adicionarAvaliacao = async (idTutoria, dados, token) => {
  const { body } = await request.post(`/avaliacoes/${idTutoria}`).send(dados).set('x-access-token', token)

  return body
}

exports.removerAvaliacao = async (idAvaliacao, token) => {
  const { body } = await request.delete(`/avaliacoes/${idAvaliacao}`).set('x-access-token', token)

  return body
}
