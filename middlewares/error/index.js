/* --- CONSTS --- */

const HELPER_RESPONSE = require('../../helpers/response/')

const { ApplicationError } = require('../../errors/application-error')

/* --- METHODS --- */

module.exports = (error, req, res, _next) => {
  if (error instanceof ApplicationError) {
    return HELPER_RESPONSE.simpleError(res, 404)
  }
  return HELPER_RESPONSE.serverError(res)
}
