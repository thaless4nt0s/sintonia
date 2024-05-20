/* --- REQUIRES --- */

const jwt = require('jsonwebtoken')

/* --- HELPERS --- */

const HELPER_RESPONSE = require('../helpers/response')
const HELPER_TOKEN = require('../helpers/tokens')

/* --- CONSTANTS --- */

const SECRET = process.env.SECRET

/* --- METHODS --- */

exports.acessoPorTodosOsUsuarios = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token']
    const tokenValido = await validacaoToken(req, res, token)
    if (!tokenValido) return  // Se a validação falhar, retorne imediatamente para evitar chamar next()
    next()
  } catch (error) {
    next(error)
  }
}

exports.acessoSomenteAdministrador = async (req, res, next) => {
  try {
    const acessoValido = await verificarAcessoPorTipo(req, res, 'administrador')
    if (!acessoValido) return  // Se a validação falhar, retorne imediatamente para evitar chamar next()
    next()
  } catch (error) {
    console.error(error)
    next(error)
  }
}

exports.acessoSomenteTutor = async (req, res, next) => {
  try {
    const acessoValido = await verificarAcessoPorTipo(req, res, 'tutor')
    if (!acessoValido) return  // Se a validação falhar, retorne imediatamente para evitar chamar next()
    next()
  } catch (error) {
    next(error)
  }
}

exports.acessoSomenteAluno = async (req, res, next) => {
  try {
    const acessoValido = await verificarAcessoPorTipo(req, res, 'aluno')
    if (!acessoValido) return  // Se a validação falhar, retorne imediatamente para evitar chamar next()
    next()
  } catch (error) {
    next(error)
  }
}

/* --- AUXILIARY FUNCTIONS --- */

async function verificarTokenValido(token, secret) {
  try {
    const decoded = await HELPER_TOKEN.verificarToken(token, secret)
    return decoded
  } catch (error) {
    return null
  }
}

async function validacaoToken(req, res, token) {
  if (!token) {
    HELPER_RESPONSE.simpleError(res, 403, 'Token não fornecido.')
    return false
  }
  const tokenValido = await verificarTokenValido(token, SECRET)
  if (!tokenValido) {
    HELPER_RESPONSE.simpleError(res, 403, 'Token inválido.')
    return false
  }

  req.usuario = tokenValido
  return true
}

async function verificarAcessoPorTipo(req, res, tipo) {
  const token = req.headers['x-access-token']

  const tokenValido = await validacaoToken(req, res, token)
  if (!tokenValido) return false  // Se a validação falhar, retorne imediatamente para evitar chamar next()

  const { usuario } = await HELPER_TOKEN.obterDadosDoToken(token, SECRET)
  const tipoUsuario = usuario.tipo

  if (tipoUsuario !== tipo) {
    HELPER_RESPONSE.simpleError(res, 403, `Acesso não autorizado. Você não é um ${tipo}.`)
    return false
  }

  return true
}
