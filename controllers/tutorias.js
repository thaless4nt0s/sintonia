/* ---  REPOSITORIES --- */

const REPOSITORY_TUTORIAS = require('../repositories/tutorias')

/* --- HELPERS --- */

const HELPER_RESPONSE = require('../helpers/response')

/* --- METHODS --- */

// iniciar tutoria
exports.iniciarTutoria = async (req, res, next) => {
  const { idDisciplina } = res.locals
  const { idAluno, idTutor } = req.params
  const { body } = req
  try {
    await REPOSITORY_TUTORIAS.iniciarTutoria(idAluno, idTutor, idDisciplina, body)
    HELPER_RESPONSE.success(res, 'Tutoria inicializada com sucesso !')
  } catch (error) {
    next(error)
  }
}

// encerrar tutoria
exports.encerrarTutoria = async (req, res, next) => {
  const { idAluno, idTutor, idTutoria } = req.params
  const { body } = req
  try {
    await REPOSITORY_TUTORIAS.encerrarTutoria(idTutoria, idAluno, idTutor, body)
    HELPER_RESPONSE.success(res, 'Tutoria encerrada com sucesso !')
  } catch (error) {
    next(error)
  }
}
