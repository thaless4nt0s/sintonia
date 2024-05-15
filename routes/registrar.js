/* --- REQUIRES --- */

const express = require('express')
const router = express.Router()

/* --- CONSTANTS --- */

const CONTROLLER_ALUNOS = require('../controllers/alunos')
const CONTROLLER_TUTORES = require('../controllers/tutores')
const CONTROLLER_ADMINS = require('../controllers/admins')

const VALIDATION_ALUNOS = require('../validations/alunos')
const VALIDATION_TUTORES = require('../validations/tutores')
const VALIDATION_ADMINS = require('../validations/admins')


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

router.post(
  '/administrador',
  VALIDATION_ADMINS.adicionar,
  MIDDLEWARE.buscarEmailExistente,
  MIDDLEWARE.buscarMatriculaExistente,
  CONTROLLER_ADMINS.adicionar
)

module.exports = router
