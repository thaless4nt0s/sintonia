/* --- REQUIRES --- */

const mongoose = require('mongoose')

/* --- CONSTS --- */

const HELPER_VALIDATION = require('../helpers/validations')
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

    email: {
      type: String,
      required: [true, 'O campo Email é obrigatório'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      maxlength: 100,
      validate: [
        HELPER_VALIDATION.validateEmailInstitucionalServidor,
        'O campo Email deve ser um email válido'
      ]
    },

    senha: {
      type: String,
      required: [true, 'O campo Senha é obrigatório'],
      trim: true,
      minlength: [8, 'O campo Senha deve ter no mínimo 8 caracteres'],
      maxlength: [8, 'O campo Senha deve ter no máximo 10 caracteres']
    },

    dataRegistro: {
      type: Date,
      immutable: true,
      default: function () { return HELPER_DATE.now() }
    }
  })

  return mongoose.model('Admins', schema)
}
