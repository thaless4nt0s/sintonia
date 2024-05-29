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

// mostrar todos os admins
exports.receberTodos = async (req, res, next) => {
  const { query } = req
  try {
    const admins = await REPOSITORY_ADMINS.receberTodos(query)
    HELPER_RESPONSE.success(res, admins)
  } catch (error) {
    next(error)
  }
}
