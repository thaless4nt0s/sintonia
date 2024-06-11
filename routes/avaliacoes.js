/* --- REQUIRES --- */

const express = require('express')
const router = express.Router()

/* --- MIDDLEWARES --- */

const MIDDLEWARE_TOKEN = require('../middlewares/token')
const MIDDLEWARE_TUTORIAS = require('../middlewares/tutorias')
const MIDDLEWARE_AVALIACOES = require('../middlewares/avaliacoes')

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

router.delete(
  '/:idAvaliacao',
  MIDDLEWARE_TOKEN.acessoSomenteAdministrador,
  MIDDLEWARE_AVALIACOES.verificarExistenciaPorId,
  CONTROLLER_AVALIACOES.remover
)

module.exports = router
