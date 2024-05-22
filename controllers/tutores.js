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

// alterar dados de um tutor
exports.alterarDados = async (req, res, next) => {
  const { idTutor } = req.params
  const { body } = req

  try {
    if (body.senha) body.senha = await HELPER_SENHA.criptografarSenha(body.senha)
    await REPOSITORY_TUTORES.alterarDados(idTutor, body)
    HELPER_RESPONSE.success(res, 'Tutor alterado com sucesso !')
  } catch (error) {
    next(error)
  }
}

// remove um tutor
exports.remover = async (req, res, next) => {
  const { idTutor } = req.params

  try {
    await REPOSITORY_TUTORES.remover(idTutor)
    HELPER_RESPONSE.success(res, 'Tutor removido com sucesso !')
  } catch (error) {
    next(error)
  }
}

// mostrar todos os tutores
exports.mostrarTodos = async (req, res, next) => {
  const { query } = req
  try {
    const tutores = await REPOSITORY_TUTORES.mostrarTodos(query)
    HELPER_RESPONSE.success(res, tutores)
  } catch (error) {
    next(error)
  }
}
