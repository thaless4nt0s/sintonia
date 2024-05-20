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

// Alterar dados de uma disciplina
exports.alterarDados = async (req, res, next) => {
  const { idDisciplina } = req.params
  const { body } = req

  try {
    await REPOSITORY_DISCIPLINAS.alterarDados(idDisciplina, body)
    HELPER_RESPONSE.success(res, 'Uma disciplina foi alterada com sucesso !')
  } catch (error) {
    next(error)
  }
}

// remover uma disciplina
exports.remover = async (req, res, next) => {
  const { idDisciplina } = req.params

  try {
    await REPOSITORY_DISCIPLINAS.remover(idDisciplina)
    HELPER_RESPONSE.success(res, 'Uma disciplina foi excluida com sucesso !')
  } catch (error) {
    next(error)
  }
}

// Mostrar todas as disciplinas
exports.mostrarTodos = async (req, res, next) => {
  const { alfabetoCrescente } = req.query

  try {
    const disciplinas = await REPOSITORY_DISCIPLINAS.mostrarTodos(alfabetoCrescente)
    HELPER_RESPONSE.success(res, disciplinas)
  } catch (error) {
    next(error)
  }
}
