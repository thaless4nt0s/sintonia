/* --- REQUIRES --- */

const Validator = require('validatorjs')

/* --- VALIDATIONS --- */

const VALIDATION_LANGUAGE = require('../helpers/validations/pt_BR')
const VALIDATOR_ERROR = require('../helpers/validations/errors')

/* --- HELPERS --- */

const HELPER_RESPONSE = require('../helpers/response')
const HELPER_VALIDATIONS = require('../helpers/validations')

/* --- METHODS --- */

Validator.setMessages('en', VALIDATION_LANGUAGE)

exports.adicionar = async (req, res, next) => {
  const { body } = req

  // Defina a função de validação personalizada para o email
  Validator.register('emailAlunoIFCE',
                    value => HELPER_VALIDATIONS.validateEmailInstitucionalDeAlunoOuTutor(value),
                    'O campo :attribute deve ser um email do domínio @aluno.ifce.edu.br'
                  )

  const regras = {
      nome: 'required|string|max:100',
      email: 'required|email|emailAlunoIFCE',
      matricula: 'required|string|max:14',
      senha: 'required|string|min:8|max:10',
      semestre: 'required|numeric|min:1'
  }

  // Validações
  const validacao = new Validator(body, regras, VALIDATION_LANGUAGE)

  if (!validacao.fails()) {
      next()
      return
  }

  // Lidar com erro
  const erro = VALIDATOR_ERROR.first(validacao)
  HELPER_RESPONSE.simpleError(res, 406, erro)
}

exports.alterarDados = async (req, res, next) => {
  const { body } = req

  // Defina a função de validação personalizada para o email
  Validator.register('emailAlunoIFCE',
                    value => HELPER_VALIDATIONS.validateEmailInstitucionalDeAlunoOuTutor(value),
                    'O campo :attribute deve ser um email do domínio @aluno.ifce.edu.br'
                  )

  const regras = {
      nome: 'string|max:100',
      email: 'email|emailAlunoIFCE',
      matricula: 'string|max:14',
      senha: 'string|min:8|max:10',
      semestre: 'numeric|min:1',
      idDisciplina: 'array|max:3',
  }

  // Validações
  const validacao = new Validator(body, regras, VALIDATION_LANGUAGE)

  if (!validacao.fails()) {
      next()
      return
  }

  // Lidar com erro
  const erro = VALIDATOR_ERROR.first(validacao)
  HELPER_RESPONSE.simpleError(res, 406, erro)
}

exports.mostrarTodos = async (req, res, next) => {
  const { query } = req

  const regras = {
    alfabetoCrescente: 'boolean',
  }

  // Validações
  const validacao = new Validator(query, regras, VALIDATION_LANGUAGE)

  if (!validacao.fails()) {
      next()
      return
  }

  // Lidar com erro
  const erro = VALIDATOR_ERROR.first(validacao)
  HELPER_RESPONSE.simpleError(res, 406, erro)
}
