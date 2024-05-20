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

exports.autenticar = async (req, res, next) => {
  const { body } = req

  // Defina a função de validação personalizada para o email
  Validator.register('emailServidorIFCE',
                    value =>
                      HELPER_VALIDATIONS.validateEmailInstitucionalServidor(value) ||
                      HELPER_VALIDATIONS.validateEmailInstitucionalDeAlunoOuTutor(value),
                    'O campo :attribute deve ser um email do domínio @ifce.edu.br ou @aluno.ifce.edu.br'
                  )

  const regras = {
      email: 'required|email|emailServidorIFCE',
      senha: 'required|string|min:8|max:10',
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
