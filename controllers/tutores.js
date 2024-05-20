/* ---  REPOSITORIES --- */

const REPOSITORY_TUTORES = require('../repositories/tutores')

/* --- HELPERS --- */

const HELPER_RESPONSE = require('../helpers/response')
const HELPER_SENHA = require('../helpers/passwords')

/* --- METHODS --- */

// adicionar tutor
exports.adicionar = async (req, res, next) => {
  const { body } = req

  try {
    body.senha = await HELPER_SENHA.criptografarSenha(body.senha)
    await REPOSITORY_TUTORES.adicionar(body)
    HELPER_RESPONSE.success(res, 'Um tutor foi adicionado com sucesso !')
  } catch (error) {
    next(error)
  }
}
