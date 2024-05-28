/* ---  REPOSITORIES --- */

const REPOSITORY_AVALIACOES = require('../repositories/avaliacoes')

/* --- HELPERS --- */

const HELPER_RESPONSE = require('../helpers/response')

/* --- METHODS --- */

//adicionar uma avaliacao
exports.adicionar = async (req, res, next) => {
  const { idTutoria } = req.params
  const { body } = req
  const { idTutor } = res.locals
  try {
    await REPOSITORY_AVALIACOES.adicionar(idTutoria, idTutor, body)
    HELPER_RESPONSE.success(res, 'Avaliação realizada com sucesso !')
  } catch (error) {
    next(error)
  }
}

// remover uma avaliacao
exports.remover = async (req, res, next) => {
  const { idAvaliacao } = req.params
  try {
    await REPOSITORY_AVALIACOES.remover(idAvaliacao)
    HELPER_RESPONSE.success(res, 'Avaliacao removida com sucesso !')
  } catch (error) {
    next(error)
  }
}
