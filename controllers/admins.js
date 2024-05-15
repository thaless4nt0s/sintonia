/* ---  REPOSITORIES --- */

const REPOSITORY_ADMINS = require('../repositories/admins')

/* --- HELPERS --- */

const HELPER_RESPONSE = require('../helpers/response')
const HELPER_SENHA = require('../helpers/passwords')

/* --- METHODS --- */

// adicionar admin
exports.adicionar = async (req, res, next) => {
  const { body } = req

  try {
    body.senha = await HELPER_SENHA.criptografarSenha(body.senha)
    await REPOSITORY_ADMINS.adicionar(body)
    HELPER_RESPONSE.success(res, 'Um administrador foi adicionado com sucesso !')
  } catch (error) {
    next(error)
  }
}
