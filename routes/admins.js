/* --- REQUIRES --- */

const express = require('express')
const router = express.Router()

/* --- MIDDLEWARES --- */

const MIDDLEWARE_TOKEN = require('../middlewares/token')
const MIDDLEWARE_TUTORES = require('../middlewares/tutores')

/* --- CONTROLLERS --- */

const CONTROLLER_TUTORES = require('../controllers/tutores')

/* --- METHODS --- */

router.delete(
  '/tutores/:idTutor',
  MIDDLEWARE_TOKEN.acessoSomenteAdministrador,
  MIDDLEWARE_TUTORES.verificarExistenciaPorId,
  CONTROLLER_TUTORES.remover
)

module.exports = router
