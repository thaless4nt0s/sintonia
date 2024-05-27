/* ---- REQUIRES ---- */

const mongoose = require('mongoose')

/* ---- MODELS ---- */

const MODEL_AVALIACOES = mongoose.model('Avaliacoes')

/* --- HELPERS --- */

const HELPER_DATE = require('../helpers/date')

/* ---- METHODS ---- */

// buscar uma avaliacao em especifico
exports.buscarUm = async (filtros, select = {}) => {
  return MODEL_AVALIACOES.findOne(filtros).select(select)
}


// adicionar
exports.adicionar = async (idTutoria, body) => {
  const avaliacao = gerarAvaliacao(idTutoria, body)
  return MODEL_AVALIACOES.create(avaliacao)
}

/* --- AUXILIARY FUNCTIONS --- */
function gerarAvaliacao (idTutoria, dados) {
  const avaliacao = {}
  avaliacao.idTutoria = idTutoria

  if (dados.comentario) avaliacao.comentario = dados.comentario
  if (dados.nota) avaliacao.nota = dados.nota

  return avaliacao
}
