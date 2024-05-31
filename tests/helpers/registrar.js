/* globals request */

/* ---- REPOSITORIES ---- */

/* ---- HELPERS ---- */

/* ---- METHODS ---- */

exports.registrarAluno = async (dados) => {
  const { body } = await request.post('/registrar/aluno').send(dados)
  return body
}

exports.registrarTutor = async (dados) => {
  const { body } = await request.post('/registrar/tutor').send(dados)
  return body
}

exports.registrarAdministrador = async (dados) => {
  const { body } = await request.post('/registrar/administrador').send(dados)
  return body
}
