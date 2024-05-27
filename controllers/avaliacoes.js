/* ---  REPOSITORIES --- */

const REPOSITORY_AVALIACOES = require('../repositories/avaliacoes')

/* --- HELPERS --- */

const HELPER_RESPONSE = require('../helpers/response')

/* --- METHODS --- */
exports.adicionar = async (req, res, next) => {
  const { idTutoria } = req.params
  const { body } = req
  try {
    await REPOSITORY_AVALIACOES.adicionar(idTutoria, body)
    HELPER_RESPONSE.success(res, 'Avaliação realizada com sucesso !')
  } catch (error) {
    next(error)
  }
}
