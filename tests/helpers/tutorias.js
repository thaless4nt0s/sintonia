/* globals request */
/* ---- REQUIRES ---- */

const randomstring = require('randomstring')

/* ---- Methods ---- */

exports.gerarDadosValidosParaCriarTutoria = () => {
  return {
    titulo: randomstring.generate(30)
  }
}

exports.iniciarTutoria = async (idAluno, idTutor, dados, token) => {
  const { body } = await request.post(`/tutorias/${idAluno}/${idTutor}`).send(dados).set('x-access-token', token)

  return body
}
