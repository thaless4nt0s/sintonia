/* --- REQUIRES --- */

const mongoose = require('mongoose')

/* --- HELPERS --- */

const HELPER_DATE = require('../helpers/date')

/* --- METHODS --- */

module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
    idAluno: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Alunos',
      index: true,
      required: [true, 'É necessário ter um aluno para realizar uma tutoria']
    },

    idTutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tutores',
      index: true,
      required: [true, 'É necessário ter um tutor para realizar uma tutoria']
    },

    idDisciplina: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Disciplinas',
      index: true,
      required: [true, 'É necessário ter uma disciplina para realizar uma tutoria']
    },

    titulo: {
      type: String,
      trim: true,
      required: [true, 'O campo Título é obrigatório'],
      maxlength: 100
    },

    resumo: {
      type: String,
      trim: true,
      maxlength: 200
    },

    tutoriaEncerrada: {
      type: Boolean,
      default: false
    },

    dataRegistro: {
      type: Date,
      immutable: true,
      default: function () { return HELPER_DATE.now() }
    }
  })

  return mongoose.model('Tutorias', schema)
}

