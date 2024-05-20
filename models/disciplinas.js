/* --- REQUIRES --- */

const mongoose = require('mongoose')

/* --- CONSTS --- */

const HELPER_DATE = require('../helpers/date')

/* --- METHODS --- */

module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
    nome: {
      type: String,
      trim: true,
      required: [true, 'O campo Nome é obrigatório'],
      maxlength: 100
    },

    dataRegistro: {
      type: Date,
      immutable: true,
      default: function () { return HELPER_DATE.now() }
    }
  })

  return mongoose.model('Disciplinas', schema)
}
