/* --- REQUIRES --- */

const express = require('express')
const router = express.Router()

/* --- CONTROLLERS --- */

const CONTROLLER_AUTENTICACAO = require('../controllers/autenticacao')

/* --- VALIDATIONS --- */

const VALIDATION_AUTENTICACAO = require('../validations/autenticacao')

/* --- METHODS --- */

router.post(
  '/',
  VALIDATION_AUTENTICACAO.autenticar,
  CONTROLLER_AUTENTICACAO.autenticar
)

module.exports = router
