/* --- REQUIRES --- */

const express = require('express')
const router = express.Router()

/* --- CONSTANTS --- */

const CONTROLLER_ALUNOS = require('../controllers/alunos')
const CONTROLLER_TUTORES = require('../controllers/tutores')

const VALIDATION_ALUNOS = require('../validations/alunos')
const VALIDATION_TUTORES = require('../validations/tutores')


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

// Adicionar tutor
router.post(
  '/tutor',
  VALIDATION_TUTORES.adicionar,
  MIDDLEWARE.buscarEmailExistente,
  MIDDLEWARE.buscarMatriculaExistente,
  CONTROLLER_TUTORES.adicionar
)

module.exports = router
