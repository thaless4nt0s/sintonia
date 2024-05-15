/* --- REPOSITORIES --- */

const REPOSITORY_ALUNOS = require('../../repositories/alunos')
const REPOSITORY_TUTORES = require('../../repositories/tutores')
const REPOSITORY_ADMINS = require('../../repositories/admins')

/* --- HELPERS --- */

const HELPER_RESPONSE = require('../../helpers/response')

/* --- METHODS --- */

exports.buscarEmailExistente = async (req, res, next) => {
  const { body } = req

  try {
    const aluno = await REPOSITORY_ALUNOS.buscarUm({email: body.email})
    const tutor = await REPOSITORY_TUTORES.buscarUm({email: body.email})
    const admin = await REPOSITORY_ADMINS.buscarUm({email: body.email})
    if (aluno || tutor || admin){
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
    const tutor = await REPOSITORY_TUTORES.buscarUm({matricula: body.matricula})
    if (aluno || tutor){
      return HELPER_RESPONSE.simpleError(res, 406, 'Matricula digitada existente !')
    }
    next()
  } catch (error) {
    next(error)
  }
}
