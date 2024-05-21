/* --- REQUIRES --- */

const express = require('express')
const router = express.Router()

/* --- MIDDLEWARES --- */

const MIDDLEWARE_TOKEN = require('../middlewares/token')
const MIDDLEWARE_ALUNOS = require('../middlewares/alunos')
const MIDDLEWARE_DISCIPLINAS = require('../middlewares/disciplinas')

/* --- CONTROLLERS --- */

const CONTROLLER_ALUNOS = require('../controllers/alunos')

/* --- VALIDATIONS --- */

const VALIDATION_ALUNOS = require('../validations/alunos')

/* --- METHODS --- */

router.patch(
  '/:idAluno',
  MIDDLEWARE_TOKEN.acessoSomenteAluno,
  MIDDLEWARE_ALUNOS.verificarExistenciaPorId,
  MIDDLEWARE_ALUNOS.verificarAlunoAutenticadoParaAlterarDados,
  MIDDLEWARE_DISCIPLINAS.verificarExistenciaPorParametro,
  MIDDLEWARE_ALUNOS.verificarMatriculaEditada,
  MIDDLEWARE_ALUNOS.verificarEmailEditado,
  VALIDATION_ALUNOS.alterarDados,
  CONTROLLER_ALUNOS.alterarDados
)

module.exports = router
