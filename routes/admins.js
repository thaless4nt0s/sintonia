/* --- REQUIRES --- */

const express = require('express')
const router = express.Router()

/* --- MIDDLEWARES --- */

const MIDDLEWARE_TOKEN = require('../middlewares/token')
const MIDDLEWARE_TUTORES = require('../middlewares/tutores')
const MIDDLEWARE_ALUNOS = require('../middlewares/alunos')
const MIDDLEWARE_IDS = require('../middlewares/ids')
const MIDDLEWARE_ADMIN = require('../middlewares/administradores')
const MIDDLEWARE = require('../middlewares/buscar')

/* --- CONTROLLERS --- */

const CONTROLLER_TUTORES = require('../controllers/tutores')
const CONTROLLER_ALUNOS = require('../controllers/alunos')
const CONTROLLER_ADMINS = require('../controllers/admins')

/* --- VALIDATIONS --- */

const VALIDATION_ADMINS = require('../validations/admins')

/* --- METHODS --- */

router.delete(
  '/tutores/:idTutor',
  MIDDLEWARE_TOKEN.acessoSomenteAdministrador,
  MIDDLEWARE_TUTORES.verificarExistenciaPorId,
  CONTROLLER_TUTORES.remover
)

router.delete(
  '/alunos/:idAluno',
  MIDDLEWARE_TOKEN.acessoSomenteAdministrador,
  MIDDLEWARE_ALUNOS.verificarExistenciaPorId,
  CONTROLLER_ALUNOS.remover
)

router.post(
  '/',
  MIDDLEWARE_TOKEN.acessoSomenteAdministrador,
  VALIDATION_ADMINS.adicionar,
  CONTROLLER_ADMINS.adicionar
)

router.get(
  '/',
  MIDDLEWARE_TOKEN.acessoPorTodosOsUsuarios,
  VALIDATION_ADMINS.receberTodos,
  CONTROLLER_ADMINS.receberTodos
)

router.patch(
  '/resetar-senha/:id',
  MIDDLEWARE_TOKEN.acessoSomenteAdministrador,
  MIDDLEWARE_IDS.verificarExistenciaDoId,
  CONTROLLER_ADMINS.resetarSenha
)

router.patch(
  '/:idAdmin',
  MIDDLEWARE_TOKEN.acessoSomenteAdministrador,
  MIDDLEWARE_ADMIN.verificarExistenciaPorId,
  MIDDLEWARE_ADMIN.verificarAdminAutenticado,
  MIDDLEWARE.buscarEmailExistente,
  VALIDATION_ADMINS.alterarDados,
  CONTROLLER_ADMINS.alterarDados
)

router.get(
  '/estatisticas',
  MIDDLEWARE_TOKEN.acessoSomenteAdministrador,
  VALIDATION_ADMINS.receberEstatisticas,
  CONTROLLER_ADMINS.receberEstatisticas
)

module.exports = router
