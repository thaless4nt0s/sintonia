/* ---  REPOSITORIES --- */

const REPOSITORY_DISCIPLINAS = require('../repositories/disciplinas')

/* --- HELPERS --- */

const HELPER_RESPONSE = require('../helpers/response')

/* --- METHODS --- */

// adicionar disciplina
exports.adicionar = async (req, res, next) => {
  const { body } = req

  try {
    await REPOSITORY_DISCIPLINAS.adicionar(body)
    HELPER_RESPONSE.success(res, 'Uma disciplina foi adicionada com sucesso !')
  } catch (error) {
    next(error)
  }
}
