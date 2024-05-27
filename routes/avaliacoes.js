/* --- REQUIRES --- */

const express = require('express')
const router = express.Router()

/* --- MIDDLEWARES --- */

const MIDDLEWARE_TOKEN = require('../middlewares/token')
const MIDDLEWARE_TUTORIAS = require('../middlewares/tutorias')
const MIDDLEWARE_AVALIACOES = require('../middlewares/avaliacoes')
const MIDDLEWARE_IDS = require('../middlewares/ids')

/* --- CONSTANTS --- */

const CONTROLLER_AVALIACOES = require('../controllers/avaliacoes')
const VALIDATION_AVALIACOES = require('../validations/avaliacoes')

/* --- METHODS --- */

router.post(
  '/:idTutoria',
  MIDDLEWARE_TOKEN.acessoSomenteAluno,
  MIDDLEWARE_TUTORIAS.verificarExistenciaPorId,
  MIDDLEWARE_AVALIACOES.verificarSeAlunoLogadoPertenceATutoria,
  MIDDLEWARE_AVALIACOES.verificarSeJaExisteAlgumaAvaliacaoParaEstaTutoria,
  MIDDLEWARE_TUTORIAS.verificaSeTutoriaEstaAtiva,
  VALIDATION_AVALIACOES.adicionar,
  CONTROLLER_AVALIACOES.adicionar
)

module.exports = router
