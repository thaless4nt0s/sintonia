/* --- REQUIRES --- */

const express = require('express')
const router = express.Router()

/* --- MIDDLEWARES --- */

const MIDDLEWARE_TOKEN = require('../middlewares/token')
const MIDDLEWARE_TUTORES = require('../middlewares/tutores')
const MIDDLEWARE_DISCIPLINAS = require('../middlewares/disciplinas')

/* --- CONTROLLERS --- */

const CONTROLLER_TUTORES = require('../controllers/tutores')

/* --- VALIDATIONS --- */

const VALIDATION_TUTORES = require('../validations/tutores')

/* --- METHODS --- */

router.patch(
  '/:idTutor',
  MIDDLEWARE_TOKEN.acessoSomenteTutor,
  MIDDLEWARE_TUTORES.verificarExistenciaPorId,
  MIDDLEWARE_TUTORES.verificarTutorAutenticado,
  VALIDATION_TUTORES.alterarDados,
  MIDDLEWARE_DISCIPLINAS.verificarExistenciaEmArrayPorParametro,
  MIDDLEWARE_TUTORES.verificarEmailEditado,
  MIDDLEWARE_TUTORES.verificarMatriculaEditada,
  CONTROLLER_TUTORES.alterarDados
)

router.delete(
  '/:idTutor',
  MIDDLEWARE_TOKEN.acessoSomenteTutor,
  MIDDLEWARE_TUTORES.verificarExistenciaPorId,
  MIDDLEWARE_TUTORES.verificarTutorAutenticado,
  CONTROLLER_TUTORES.remover
)

module.exports = router
