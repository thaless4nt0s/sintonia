/* --- REQUIRES --- */

const mongoose = require('mongoose')

/* --- HELPERS --- */

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
      max: 100,
      validate: [
        HELPER_VALIDATION.validateEmailInstitucionalDeAlunoOuTutor,
        'O campo Email deve ser um email válido'
      ]
    },

    matricula: {
      type: String,
      trim: true,
      required: [true, 'O campo Matricula é obrigatório'],
      unique: true,
    },

    senha: {
      type: String,
      required: [true, 'O campo Senha é obrigatório'],
      trim: true,
      minlength: [8, 'O campo Senha deve ter no mínimo 8 caracteres']
    },

    semestre: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: 'O campo Semestre deve ser um número inteiro'
      },
      min: [1, 'O campo Semestre deve ser maior ou igual a 1']
    },

    dataRegistro: {
      type: Date,
      immutable: true,
      default: function () { return HELPER_DATE.now() }
    },

    emTutoria: {
      type: Boolean,
      default: false
    },

    idDisciplina: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Disciplinas',
      index: true
    }]
  })

  // Middleware de pré-validação para limitar o número de disciplinas
  schema.pre('validate', function (next) {
    if (this.idDisciplina.length > 3) {
      return next(new Error('Um tutor pode ter no máximo 3 disciplinas.'))
    }
    next()
  })

  return mongoose.model('Tutores', schema)
}

