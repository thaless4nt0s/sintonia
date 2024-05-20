/* ---- REQUIRES ---- */

const mongoose = require('mongoose')

/* ---- MODELS ---- */

const MODEL_DISCIPLINAS = mongoose.model('Disciplinas')

/* --- HELPERS --- */

const HELPER_DATE = require('../helpers/date')

/* ---- METHODS ---- */

//Buscar um
exports.buscarUm = async (filtros) => {
  return MODEL_DISCIPLINAS.findOne(filtros)
}

// Adiciona uma disciplina
exports.adicionar = async (body) => {
  const disciplina = gerarDisciplina(body)
  return MODEL_DISCIPLINAS.create(disciplina)
}

// Alterar dados
exports.alterarDados = async (idDisciplina, body) => {
  const disciplina = gerarDisciplina(body)
  return MODEL_DISCIPLINAS.findByIdAndUpdate(idDisciplina, disciplina)
}

// Remover uma disciplina
exports.remover = async (idDisciplina) => {
  return MODEL_DISCIPLINAS.findByIdAndDelete(idDisciplina).catch(error => { throw error })
}

/* --- AUXILIARY FUNCTIONS --- */

function gerarDisciplina (dados) {
  const disciplina = {}
  if (dados.nome) disciplina.nome = dados.nome

  return disciplina
}
