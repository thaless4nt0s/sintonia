/* ---- REQUIRES ---- */

const mongoose = require('mongoose')

/* ---- MODELS ---- */

const MODEL_DISCIPLINAS = mongoose.model('Disciplinas')

/* --- HELPERS --- */

const HELPER_DATE = require('../helpers/date')

/* ---- METHODS ---- */

// Busca de maneira especifica
exports.adicionar = async (body) => {
  const disciplina = gerarDisciplina(body)
  return MODEL_DISCIPLINAS.create(disciplina)
}

/* --- Alterar dados --- */
exports.alterarDados = async (idDisciplina, body) => {
  const disciplina = gerarDisciplina(body)
  return MODEL_DISCIPLINAS.findByIdAndUpdate(idDisciplina, disciplina)
}

/* --- AUXILIARY FUNCTIONS --- */

function gerarDisciplina (dados) {
  const disciplina = {}
  if (dados.nome) disciplina.nome = dados.nome

  return disciplina
}
