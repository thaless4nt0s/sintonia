/* ---- REQUIRES ---- */

const mongoose = require('mongoose')

/* ---- MODELS ---- */

const MODEL_TUTORES = mongoose.model('Tutores')

/* --- HELPERS --- */

const HELPER_DATE = require('../helpers/date')

/* ---- METHODS ---- */

// Busca de maneira especifica
exports.buscarUm = async (filtro, select={}) => {
  return MODEL_TUTORES.findOne(filtro).select(select)
}

// Adicionar tutor
exports.adicionar = async (body) => {
  const tutor = gerarTutor(body)
  return MODEL_TUTORES.create(tutor)
}

exports.alterarDados = async (idTutor, body) => {
  const tutorAlterado = gerarTutorAlterado(body)
  return MODEL_TUTORES.findByIdAndUpdate(idTutor, tutorAlterado)
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

function gerarTutorAlterado(dados) {
  const tutor = gerarTutor(dados)
  if (dados.idDisciplina) tutor.idDisciplina = dados.idDisciplina
  return tutor
}
