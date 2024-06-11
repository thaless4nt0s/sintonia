/* --- REQUIRES --- */

const express = require('express')
const router = express.Router()

/* --- MIDDLEWARES --- */

const MIDDLEWARE_TOKEN = require('../middlewares/token')
const MIDDLEWARE_ALUNOS = require('../middlewares/alunos')
const MIDDLEWARE_TUTORES = require('../middlewares/tutores')
const MIDDLEWARE_TUTORIAS = require('../middlewares/tutorias')

/* --- CONTROLLERS --- */

const CONTROLLER_TUTORIAS = require('../controllers/tutorias')
const CONTROLLER_TUTORES = require('../controllers/tutores')
const CONTROLLER_ALUNOS = require('../controllers/alunos')

/* --- VALIDATIONS --- */

const VALIDATION_TUTORIAS = require('../validations/tutorias')

/* --- METHODS --- */

router.post(
  '/:idAluno/:idTutor',
  MIDDLEWARE_TOKEN.acessoSomenteAluno,
  MIDDLEWARE_ALUNOS.verificarExistenciaPorId,
  MIDDLEWARE_TUTORES.verificarExistenciaPorId,
  MIDDLEWARE_ALUNOS.verificarAlunoAutenticado,
  MIDDLEWARE_TUTORIAS.verificarDisciplinaDoAlunoJuntoComTutor,
  MIDDLEWARE_TUTORES.verificarSeTutorEstaEmTutoria,
  MIDDLEWARE_ALUNOS.verificarSeAlunoEstaEmTutoria,
  VALIDATION_TUTORIAS.validarTutoriaIniciada,
  CONTROLLER_TUTORIAS.iniciarTutoria
)

router.patch(
  '/:idTutoria/:idAluno/:idTutor',
  MIDDLEWARE_TOKEN.acessoSomenteTutor,
  MIDDLEWARE_ALUNOS.verificarExistenciaPorId,
  MIDDLEWARE_TUTORES.verificarExistenciaPorId,
  MIDDLEWARE_TUTORIAS.verificarExistenciaPorId,
  MIDDLEWARE_TUTORES.verificarTutorAutenticado,
  MIDDLEWARE_TUTORIAS.verificarDisciplinaDoAlunoJuntoComTutor,
  MIDDLEWARE_TUTORIAS.verificarSeTutorEAlunoSaoDaMesmaTutoriaAtiva,
  VALIDATION_TUTORIAS.validarTutoriaEncerrada,
  CONTROLLER_TUTORIAS.encerrarTutoria
)

router.get(
  '/historico/tutor/:idTutor',
  MIDDLEWARE_TOKEN.acessoPorTodosOsUsuarios,
  MIDDLEWARE_TUTORES.verificarExistenciaPorId,
  CONTROLLER_TUTORES.mostrarHistorico
)

router.get(
  '/historico/aluno/:idAluno',
  MIDDLEWARE_TOKEN.acessoPorTodosOsUsuarios,
  MIDDLEWARE_ALUNOS.verificarExistenciaPorId,
  CONTROLLER_ALUNOS.mostrarHistorico
)

module.exports = router
