/* --- REQUIRES --- */
const mongoose = require('mongoose')

/* --- HELPERS --- */
const HELPER_RESPONSE = require('../helpers/response')

/* --- METHODS --- */

// Middleware para validar ObjectId do MongoDB
exports.validarIds = (req, res, next) => {
  const invalidIds = []

  for (const [key, value] of Object.entries(req.params)) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      invalidIds.push(key)
    }
  }

  if (invalidIds.length > 0) {
    return HELPER_RESPONSE.simpleError(res, 406, 'Contém Id(s) inválido(s) !')
  }

  next()
}
