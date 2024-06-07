/* globals request */
/* ---- REQUIRES ---- */

const randomstring = require('randomstring')

/* ---- Methods ---- */

exports.gerarDadosValidosParaCriarTutoria = () => {
  return {
    titulo: randomstring.generate(30)
  }
}

exports.gerarDadosValidosParaEncerrarTutoria = () => {
  return {
    resumo: randomstring.generate(150)
  }
}

exports.iniciarTutoria = async (idAluno, idTutor, dados, token) => {
  const { body } = await request.post(`/tutorias/${idAluno}/${idTutor}`).send(dados).set('x-access-token', token)

  return body
}

exports.encerrarTutoria = async (idTutoria, idAluno, idTutor, dados, token) => {
  const { body } = await request.patch(`/tutorias/${idTutoria}/${idAluno}/${idTutor}`).send(dados).set('x-access-token', token)

  return body
}

exports.historicoAluno = async (idAluno, token) => {
  const { body } = await request.get(`/tutorias/historico/aluno/${idAluno}`).set('x-access-token', token)

  return body
}
