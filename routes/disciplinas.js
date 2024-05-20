/* --- REQUIRES --- */

const express = require('express')
const router = express.Router()

/* --- MIDDLEWARES --- */

const MIDDLEWARE_ADMIN = require('../middlewares/token')
const MIDDLEWARE_IDS = require('../middlewares/ids')

/* --- CONSTANTS --- */

const CONTROLLER_DISCIPLINAS = require('../controllers/disciplinas')
const VALIDATION_DISCIPLINAS = require('../validations/disciplinas')

/* --- METHODS --- */

router.post(
  '/',
  MIDDLEWARE_ADMIN.acessoSomenteAdministrador,
  VALIDATION_DISCIPLINAS.adicionar,
  CONTROLLER_DISCIPLINAS.adicionar
)

router.put(
  '/:idDisciplina',
  MIDDLEWARE_IDS.validarIds,
  MIDDLEWARE_ADMIN.acessoSomenteAdministrador,
  VALIDATION_DISCIPLINAS.adicionar,
  CONTROLLER_DISCIPLINAS.alterarDados
)

module.exports = router
