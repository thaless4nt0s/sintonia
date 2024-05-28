const mongoose = require('mongoose')

/* --- CONSTS --- */

const HELPER_VALIDATION = require('../helpers/validations')
const HELPER_DATE = require('../helpers/date')

/* ---  METHODS --- */

module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
    idTutoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tutoria',
      index: true,
      required: [true, 'É necessário ter uma tutoria para avaliar']
    },

    idTutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tutores',
      required: [true, 'É necessário ter uma tutoria para avaliar']
    },

    comentario: {
      type: String,
      trim: true,
      max: 200,
      required: [true, 'É necessário escrever um comentário para avaliar']
    },

    nota: {
      type: Number,
      required: [true, 'O campo Nota é obrigatório'],
      min: 1,
      max: 5
    },

    dataRegistro: {
      type: Date,
      immutable: true,
      default: function () { return HELPER_DATE.now() }
    }
  })

  return mongoose.model('Avaliacoes', schema)
}
