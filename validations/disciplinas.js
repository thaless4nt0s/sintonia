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

  const regras = {
    nome: 'required|string|min:1'
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
