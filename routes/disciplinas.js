/* --- REQUIRES --- */

const express = require('express')
const router = express.Router()

/* --- MIDDLEWARES --- */

const MIDDLEWARE_TOKEN = require('../middlewares/token')
const MIDDLEWARE_IDS = require('../middlewares/ids')
const MIDDLEWARE_DISCIPLINAS = require('../middlewares/disciplinas')

/* --- CONSTANTS --- */

const CONTROLLER_DISCIPLINAS = require('../controllers/disciplinas')
const VALIDATION_DISCIPLINAS = require('../validations/disciplinas')

/* --- METHODS --- */

router.post(
  '/',
  MIDDLEWARE_TOKEN.acessoSomenteAdministrador,
  VALIDATION_DISCIPLINAS.adicionar,
  CONTROLLER_DISCIPLINAS.adicionar
)

router.put(
  '/:idDisciplina',
  MIDDLEWARE_IDS.validarIds,
  MIDDLEWARE_TOKEN.acessoSomenteAdministrador,
  MIDDLEWARE_DISCIPLINAS.verificarExistenciaPorId,
  VALIDATION_DISCIPLINAS.adicionar,
  CONTROLLER_DISCIPLINAS.alterarDados
)

router.delete(
  '/:idDisciplina',
  MIDDLEWARE_IDS.validarIds,
  MIDDLEWARE_DISCIPLINAS.verificarExistenciaPorId,
  MIDDLEWARE_TOKEN.acessoSomenteAdministrador,
  CONTROLLER_DISCIPLINAS.remover
)

router.get(
  '/',
  MIDDLEWARE_TOKEN.acessoPorTodosOsUsuarios,
  VALIDATION_DISCIPLINAS.buscarDisciplinas,
  CONTROLLER_DISCIPLINAS.mostrarTodos
)

module.exports = router
