
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
    const aluno = await REPOSITORY_ALUNOS.adicionar(body)
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
