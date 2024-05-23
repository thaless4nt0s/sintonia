/* --- REQUIRES --- */

const express = require('express')
const router = express.Router()

/* --- MIDDLEWARES --- */

const MIDDLEWARE_TOKEN = require('../middlewares/token')
const MIDDLEWARE_ALUNOS = require('../middlewares/alunos')
const MIDDLEWARE_TUTORES = require('../middlewares/tutores')
const MIDDLEWARE_DISCIPLINAS = require('../middlewares/disciplinas')
const MIDDLEWARE_TUTORIAS = require('../middlewares/tutorias')

/* --- CONTROLLERS --- */

const CONTROLLER_TUTORIAS = require('../controllers/tutorias')

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

module.exports = router
