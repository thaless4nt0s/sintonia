/* --- REQUIRES --- */

const mongoose = require('mongoose')
const SECRET = process.env.SECRET

/* --- HELPERS --- */

const HELPER_RESPONSE = require('../helpers/response')
const HELPER_TOKEN = require('../helpers/tokens')

/* --- REPOSITORIES --- */

const REPOSITORY_TUTORES = require('../repositories/tutores')
const REPOSITORY_ALUNOS = require('../repositories/alunos')

/* --- METHODS --- */
exports.verificarExistenciaPorId = async (req, res, next) => {
  const { idTutor } = req.params

  try {
    const tutor = await REPOSITORY_TUTORES.buscarUm({ _id: idTutor }, { _id: 1 })
    if (!tutor){
      HELPER_RESPONSE.simpleError(res, 406, 'Tutor não encontrado !')
      return
    }
    next()
  } catch (error) {
    next(error)
  }
}

exports.verificarTutorAutenticadoParaAlterarDados = async (req, res, next) => {
  const { idTutor } = req.params
  const token = req.headers['x-access-token']

  try {
    // pega o id do token do usuário para saber se o usuário que está acessando é o mesmo que está na URL
    const { usuario } = await HELPER_TOKEN.obterDadosDoToken(token, SECRET)
    const idUsuario = usuario.usuario._id

    if (!(idTutor === idUsuario)){
      HELPER_RESPONSE.simpleError(res, 406, 'Acesso não autorizado !')
      return
    }
    next()
  } catch (error) {
    next(error)
  }
}

exports.verificarMatriculaEditada = async (req, res, next) => {
  const { idTutor } = req.params
  const { body } = req

  try {
    // Busca a matrícula atual do tutor
    const tutorAtual = await REPOSITORY_TUTORES.buscarUm({ _id: idTutor }, { matricula: 1 })
    if (!tutorAtual) {
      return HELPER_RESPONSE.simpleError(res, 404, 'Tutor não encontrado.')
    }

    // Se a matrícula que o usuário deseja atualizar é a mesma que ele já possui, prossiga
    if (tutorAtual.matricula === body.matricula) {
      return next()
    }

    // Verifica se a nova matrícula já está sendo utilizada por outro usuário
    const matriculaExistente = await REPOSITORY_TUTORES.buscarUm({ matricula: body.matricula }, { matricula: 1, _id: 1 }) || await REPOSITORY_ALUNOS.buscarUm({ matricula: body.matricula }, { matricula: 1, _id: 1 })
    if (matriculaExistente && matriculaExistente._id.toString() !== idTutor) {
      return HELPER_RESPONSE.simpleError(res, 406, 'Matrícula digitada já existente!')
    }

    next()
  } catch (error) {
    next(error)
  }
}

exports.verificarEmailEditado = async (req, res, next) => {
  const { idTutor } = req.params
  const { body } = req

  try {
    // Busca a email atual do tutor
    const tutorAtual = await REPOSITORY_TUTORES.buscarUm({ _id: idTutor }, { email: 1 })

    if (!tutorAtual) {
      return HELPER_RESPONSE.simpleError(res, 406, 'Tutor não encontrado.')
    }

    // Se a email que o usuário deseja atualizar é a mesma que ele já possui, prossiga
    if (tutorAtual.email === body.email) {
      return next()
    }

    // Verifica se a nova email já está sendo utilizada por outro usuário
    const emailExistente = await REPOSITORY_TUTORES.buscarUm({ email: body.email }, { email: 1, _id: 1 }) || await REPOSITORY_ALUNOS.buscarUm({ email: body.email }, { email: 1, _id: 1 })
    if (emailExistente && emailExistente._id.toString() !== idTutor) {
      return HELPER_RESPONSE.simpleError(res, 406, 'Email digitado já existente!')
    }

    next()
  } catch (error) {
    next(error)
  }
}
