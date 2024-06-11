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

// resetar a senha de um usuário
exports.resetarSenha = async (req, res, next) => {
  const { id } = req.params
  const { tipoUsuario } = res.locals
  try {
    await REPOSITORY_ADMINS.resetarSenha(id, tipoUsuario)
    HELPER_RESPONSE.success(res, 'Senha resetada para 12345678')
  } catch (error) {
    next(error)
  }
}

// alterar dados do administrador
exports.alterarDados = async (req, res, next) => {
  const { idAdmin } = req.params
  const { body } = req

  try {
    if (body.senha) body.senha = await HELPER_SENHA.criptografarSenha(body.senha)
    await REPOSITORY_ADMINS.alterarDados(idAdmin, body)
    HELPER_RESPONSE.success(res, 'Um administrador foi alterado com sucesso !')
  } catch (error) {
    next(error)
  }
}
