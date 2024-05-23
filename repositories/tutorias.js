/* ---- REQUIRES ---- */

const mongoose = require('mongoose')

/* ---- MODELS ---- */

const MODEL_TUTORIAS = mongoose.model('Tutorias')
const MODEL_ALUNOS = mongoose.model('Alunos')
const MODEL_TUTORES = mongoose.model('Tutores')

/* --- HELPERS --- */

const HELPER_DATE = require('../helpers/date')

/* ---- METHODS ---- */

exports.iniciarTutoria = async (idAluno, idTutor, idDisciplina, body) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  const { titulo } = body
  try {
    const tutoriaInicial = gerarTutoriaInicial(idAluno, idTutor, idDisciplina, titulo)
    await MODEL_TUTORIAS.create([tutoriaInicial], { session })

    const alunoAtualizado = await MODEL_ALUNOS.findByIdAndUpdate(
      idAluno,
      { emTutoria: true },
      { new: true }
    )

    const tutorAtualizado = await MODEL_TUTORES.findByIdAndUpdate(
      idTutor,
      { emTutoria: true },
      { new: true }
    )
    await session.commitTransaction()
  } catch (error) {
    await session.abortTransaction()
    next(error)
  }finally {
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
