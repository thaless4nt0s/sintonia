/* ---- REQUIRES ---- */

const mongoose = require('mongoose')

/* ---- MODELS ---- */

const MODEL_TUTORIAS = mongoose.model('Tutorias')
const MODEL_ALUNOS = mongoose.model('Alunos')
const MODEL_TUTORES = mongoose.model('Tutores')

/* --- HELPERS --- */

const HELPER_DATE = require('../helpers/date')

/* ---- METHODS ---- */

// buscar uma tutoria em especifico
exports.buscarUm = async (filtros, select = {}) => {
  return MODEL_TUTORIAS.findOne(filtros, select)
}

// iniciar uma tutoria
exports.iniciarTutoria = async (idAluno, idTutor, idDisciplina, body) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  const { titulo } = body
  try {
    const tutoriaInicial = gerarTutoriaInicial(idAluno, idTutor, idDisciplina, titulo)
    await MODEL_TUTORIAS.create([tutoriaInicial], { session })

    await MODEL_ALUNOS.findByIdAndUpdate(
      idAluno,
      { emTutoria: true },
      { new: true }
    )

    await MODEL_TUTORES.findByIdAndUpdate(
      idTutor,
      { emTutoria: true },
      { new: true }
    )
    await session.commitTransaction()
  } catch (error) {
    await session.abortTransaction()
  } finally {
    session.endSession()
  }
}

// encerra uma tutoria
exports.encerrarTutoria = async (idTutoria, idAluno, idTutor, body) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  const { resumo } = body

  try {
    const tutoriaEncerrada = gerarTutoriaEncerrada(resumo)
    await MODEL_TUTORIAS.findByIdAndUpdate(idTutoria, tutoriaEncerrada, { session })

    await MODEL_ALUNOS.findByIdAndUpdate(
      idAluno,
      { emTutoria: false },
      { new: true }
    )

    await MODEL_TUTORES.findByIdAndUpdate(
      idTutor,
      { emTutoria: false },
      { new: true }
    )
    await session.commitTransaction()
  } catch (error) {
    await session.abortTransaction()
  } finally {
    session.endSession()
  }
}

/* --- AUXILIARY METHODS --- */
function gerarTutoriaInicial (idAluno, idTutor, idDisciplina, titulo) {
  const tutoria = {}

  if (idAluno) tutoria.idAluno = idAluno
  if (idAluno) tutoria.idTutor = idTutor
  if (idAluno) tutoria.idDisciplina = idDisciplina
  if (idAluno) tutoria.titulo = titulo

  return tutoria
}

function gerarTutoriaEncerrada (resumo) {
  const tutoria = {}

  if (resumo) tutoria.resumo = resumo
  tutoria.dataEncerramento = HELPER_DATE.now()
  tutoria.tutoriaEncerrada = true

  return tutoria
}
