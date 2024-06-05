/* ---  REPOSITORIES --- */

const REPOSITORY_ALUNOS = require('../repositories/alunos')

/* --- HELPERS --- */

const HELPER_RESPONSE = require('../helpers/response')
const HELPER_SENHA = require('../helpers/passwords')

/* --- METHODS --- */

// adicionar aluno
exports.adicionar = async (req, res, next) => {
  const { body } = req

  try {
    body.senha = await HELPER_SENHA.criptografarSenha(body.senha)
    await REPOSITORY_ALUNOS.adicionar(body)
    HELPER_RESPONSE.success(res, 'Um aluno foi adicionado com sucesso !')
  } catch (error) {
    next(error)
  }
}

// Altera dados de um aluno
exports.alterarDados = async (req, res, next) => {
  const { idAluno } = req.params
  const { body } = req

  try {
    if (body.senha) {
      body.senha = await HELPER_SENHA.criptografarSenha(body.senha)
    }
    await REPOSITORY_ALUNOS.alterarDados(idAluno, body)
    HELPER_RESPONSE.success(res, 'Dados do Aluno alterados com sucesso !')
  } catch (error) {
    next(error)
  }
}

// remover aluno
exports.remover = async (req, res, next) => {
  const { idAluno } = req.params

  try {
    await REPOSITORY_ALUNOS.remover(idAluno)
    HELPER_RESPONSE.success(res, 'Aluno removido com sucesso !')
  } catch (error) {
    next(error)
  }
}

// mostrar historico
exports.mostrarHistorico = async (req, res, next) => {
  const { idAluno } = req.params
  try {
    const historico = await REPOSITORY_ALUNOS.mostrarHistorico(idAluno)
    HELPER_RESPONSE.success(res, historico)
  } catch (error) {
    next(error)
  }
}

// mostrar um aluno em especifico
exports.receberPorId = async (req, res, next) => {
  const { idAluno } = req.params

  try {
    const [aluno] = await REPOSITORY_ALUNOS.receberPorId(idAluno)
    HELPER_RESPONSE.success(res, aluno)
  } catch (error) {
    next(error)
  }
}

// mostrar todos os alunos cadastrados
exports.receberTodos = async (req, res, next) => {
  try {
    const alunos = await REPOSITORY_ALUNOS.receberTodos()
    HELPER_RESPONSE.success(res, alunos)
  } catch (error) {
    next(error)
  }
}
