/* --- REQUIRES --- */

const express = require('express')
const router = express.Router()

/* --- HELPERS --- */

const HELPER_RESPONSE = require('../helpers/response')

/* --- METHODS --- */

router.use('/', (_req, res) => {
  HELPER_RESPONSE.simpleError(res, 404, 'Rota inexistente.')
})

module.exports = router
