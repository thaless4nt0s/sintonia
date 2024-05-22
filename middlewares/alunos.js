/* --- REQUIRES --- */

const mongoose = require('mongoose')
const SECRET = process.env.SECRET
/* --- HELPERS --- */

const HELPER_RESPONSE = require('../helpers/response')
const HELPER_TOKEN = require('../helpers/tokens')

/* --- REPOSITORIES --- */

const REPOSITORY_ALUNOS = require('../repositories/alunos')



/* --- METHODS --- */

exports.verificarExistenciaPorId = async (req, res, next) => {
  const { idAluno } = req.params

  try {
    const aluno = await REPOSITORY_ALUNOS.buscarUm({ _id: idAluno })

    if (!aluno) {
      HELPER_RESPONSE.simpleError(res, 406, 'Aluno inexistente !')
      return
    }
    next()
  } catch (error) {
    next(error)
  }
}

exports.verificarAlunoAutenticado = async (req, res, next) => {
  const { idAluno } = req.params
  const token = req.headers['x-access-token']

  try {
    // pega o id do token do usuário para saber se o usuário que está acessando é o mesmo que está na URL
    const { usuario } = await HELPER_TOKEN.obterDadosDoToken(token, SECRET)
    const idUsuario = usuario.usuario._id

    if (!(idAluno === idUsuario)){
      HELPER_RESPONSE.simpleError(res, 406, 'Acesso não autorizado !')
      return
    }
    next()
  } catch (error) {
    next(error)
  }
}

exports.verificarMatriculaEditada = async (req, res, next) => {
  const { idAluno } = req.params
  const { body } = req

  try {
    // Busca a matrícula atual do aluno
    const alunoAtual = await REPOSITORY_ALUNOS.buscarUm({ _id: idAluno }, { matricula: 1 })
    if (!alunoAtual) {
      return HELPER_RESPONSE.simpleError(res, 404, 'Aluno não encontrado.')
    }

    // Se a matrícula que o usuário deseja atualizar é a mesma que ele já possui, prossiga
    if (alunoAtual.matricula === body.matricula) {
      return next()
    }

    // Verifica se a nova matrícula já está sendo utilizada por outro usuário
    const matriculaExistente = await REPOSITORY_ALUNOS.buscarUm({ matricula: body.matricula }, { matricula: 1, _id: 1 }) || await REPOSITORY_TUTORES.buscarUm({ matricula: body.matricula }, { matricula: 1, _id: 1 })
    if (matriculaExistente && matriculaExistente._id.toString() !== idAluno) {
      return HELPER_RESPONSE.simpleError(res, 406, 'Matrícula digitada já existente!')
    }

    next()
  } catch (error) {
    next(error)
  }
}

exports.verificarEmailEditado = async (req, res, next) => {
  const { idAluno } = req.params
  const { body } = req

  try {
    // Busca a email atual do aluno
    const alunoAtual = await REPOSITORY_ALUNOS.buscarUm({ _id: idAluno }, { email: 1 })
    if (!alunoAtual) {
      return HELPER_RESPONSE.simpleError(res, 406, 'Aluno não encontrado.')
    }

    // Se a email que o usuário deseja atualizar é a mesma que ele já possui, prossiga
    if (alunoAtual.email === body.email) {
      return next()
    }

    // Verifica se a nova email já está sendo utilizada por outro usuário
    const emailExistente = await REPOSITORY_ALUNOS.buscarUm({ email: body.email }, { email: 1, _id: 1 }) || await REPOSITORY_TUTORES.buscarUm({ email: body.email }, { email: 1, _id: 1 })
    if (emailExistente && emailExistente._id.toString() !== idAluno) {
      return HELPER_RESPONSE.simpleError(res, 406, 'Email digitado já existente!')
    }

    next()
  } catch (error) {
    next(error)
  }
}
