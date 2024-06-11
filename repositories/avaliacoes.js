/* ---- REQUIRES ---- */

const mongoose = require('mongoose')

/* ---- MODELS ---- */

const MODEL_AVALIACOES = mongoose.model('Avaliacoes')

/* ---- METHODS ---- */

// buscar uma avaliacao em especifico
exports.buscarUm = async (filtros, select = {}) => {
  return MODEL_AVALIACOES.findOne(filtros).select(select)
}

// adicionar
exports.adicionar = async (idTutoria, idTutor, body) => {
  const avaliacao = gerarAvaliacao(idTutoria, idTutor, body)
  return MODEL_AVALIACOES.create(avaliacao)
}

// remover uma avaliacao
exports.remover = async (idAvaliacao) => {
  return MODEL_AVALIACOES.findByIdAndDelete(idAvaliacao)
}

/* --- AUXILIARY FUNCTIONS --- */
function gerarAvaliacao (idTutoria, idTutor, dados) {
  const avaliacao = {}
  avaliacao.idTutoria = idTutoria
  avaliacao.idTutor = idTutor
  if (dados.comentario) avaliacao.comentario = dados.comentario
  if (dados.nota) avaliacao.nota = dados.nota

  return avaliacao
}
