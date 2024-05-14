/* --- REQUIRES --- */

const express = require('express')
const router = express.Router()

/* --- CONSTANTS --- */

const CONTROLLER_ALUNOS = require('../controllers/alunos')
const VALIDATION_ALUNOS = require('../validations/alunos')


/* --- MIDDLEWARES --- */

const MIDDLEWARE = require('../middlewares/buscar')

/* --- METHODS --- */

//Adicionar aluno
router.post(
  '/aluno',
  VALIDATION_ALUNOS.adicionar,
  MIDDLEWARE.buscarEmailExistente,
  MIDDLEWARE.buscarMatriculaExistente,
  CONTROLLER_ALUNOS.adicionar
)

module.exports = router
