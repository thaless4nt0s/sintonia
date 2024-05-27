/* --- REQUIRES --- */

const mongoose = require('mongoose')
const SECRET = process.env.SECRET

/* --- HELPERS --- */

const HELPER_RESPONSE = require('../helpers/response')
const HELPER_TOKEN = require('../helpers/tokens')

/* --- REPOSITORIES --- */

const REPOSITORY_AVALIACOES = require('../repositories/avaliacoes')
const REPOSITORY_TUTORIAS = require('../repositories/tutorias')

/* --- METHODS --- */
exports.verificarSeAlunoLogadoPertenceATutoria = async (req, res, next) => {
  const { idTutoria } = req.params
  const token = req.headers['x-access-token']
  try {

    const { usuario } = await HELPER_TOKEN.obterDadosDoToken(token, SECRET)
    idAluno = usuario.usuario._id
    const dadosAlunoViaTutoria = await REPOSITORY_TUTORIAS.buscarUm({idAluno}, { nome: 1})
    if (!dadosAlunoViaTutoria){
      HELPER_RESPONSE.simpleError(res, 406, 'O aluno não pertence a tutoria')
      return
    }
    next()
  } catch (error) {
    next(error)
  }
}

exports.verificarSeJaExisteAlgumaAvaliacaoParaEstaTutoria = async (req, res, next) => {
  const { idTutoria } = req.params
  try {
    const avaliacaoExistente = await REPOSITORY_AVALIACOES.buscarUm({ idTutoria }, { comentario: 1 })
    if (avaliacaoExistente) {
      HELPER_RESPONSE.simpleError(res, 406, 'A tutoria já foi avaliada !')
      return
    }
    next()
  } catch (error) {
    next(error)
  }
}
