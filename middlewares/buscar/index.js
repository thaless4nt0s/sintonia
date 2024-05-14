/* --- REPOSITORIES --- */

const REPOSITORY_ALUNOS = require('../../repositories/alunos')

/* --- HELPERS --- */

const HELPER_RESPONSE = require('../../helpers/response')

/* --- METHODS --- */

exports.buscarEmailExistente = async (req, res, next) => {
  const { body } = req

  try {
    const aluno = await REPOSITORY_ALUNOS.buscarUm({email: body.email})
    if (aluno){
      return HELPER_RESPONSE.simpleError(res, 406, 'Email digitado existente !')
    }
    next()
  } catch (error) {
    next(error)
  }
}

exports.buscarMatriculaExistente = async (req, res, next) => {
  const { body } = req

  try {
    const aluno = await REPOSITORY_ALUNOS.buscarUm({matricula: body.matricula})
    if (aluno){
      return HELPER_RESPONSE.simpleError(res, 406, 'Matricula digitada existente !')
    }
    next()
  } catch (error) {
    next(error)
  }
}
