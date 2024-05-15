/* ---- REQUIRES ---- */

const mongoose = require('mongoose')

/* ---- MODELS ---- */

const MODEL_TUTORES = mongoose.model('Tutores')

/* --- HELPERS --- */

const HELPER_DATE = require('../helpers/date')

/* ---- METHODS ---- */

// Busca de maneira especifica
exports.buscarUm = async (filtro) => {
  return MODEL_TUTORES.findOne(filtro)
}

// Adicionar tutor
exports.adicionar = async (body) => {
  const tutor = gerarTutor(body)
  return MODEL_TUTORES.create(tutor)
}

/* --- AUX FUNCTIONS --- */

function gerarTutor(dados) {
  const { nome, email, matricula, senha, semestre} = dados
  const tutor = {}

  if (nome) tutor.nome = nome
  if (email) tutor.email = email
  if (matricula) tutor.matricula = matricula
  if (senha) tutor.senha = senha
  if (semestre) tutor.semestre = semestre

  return tutor
}
