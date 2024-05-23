/* --- REQUIRES --- */

const mongoose = require('mongoose')
const SECRET = process.env.SECRET

/* --- HELPERS --- */

const HELPER_RESPONSE = require('../helpers/response')
const HELPER_TOKEN = require('../helpers/tokens')

/* --- REPOSITORIES --- */

const REPOSITORY_TUTORES = require('../repositories/tutores')
const REPOSITORY_ALUNOS = require('../repositories/alunos')
const REPOSITORY_TUTORIAS = require('../repositories/tutorias')

/* --- METHODS --- */

exports.verificarDisciplinaDoAlunoJuntoComTutor = async (req, res, next) => {
  const { idAluno, idTutor } = req.params

  try {
    const aluno = await REPOSITORY_ALUNOS.buscarUm({ _id: idAluno }, { idDisciplina: 1 })
    const tutor = await REPOSITORY_TUTORES.buscarUm({ _id: idTutor }, { idDisciplina: 1 })

    const disciplinaCompativel = compararDisciplinasDeAlunosComTutores(aluno.idDisciplina, tutor.idDisciplina)

    if (!disciplinaCompativel) {
      return HELPER_RESPONSE.simpleError(res, 406, 'A disciplina do aluno não corresponde a nenhuma das disciplinas do tutor.')
    }

    res.locals.idDisciplina = aluno.idDisciplina
    next()
  } catch (error) {
    next(error)
  }
}

/* --- AUX FUNCTIONS --- */
function compararDisciplinasDeAlunosComTutores(idDisciplinaAluno, idDisciplinaTutor) {
  // Transformar idDisciplinaAluno em String caso não seja um array
  const disciplinasAluno = Array.isArray(idDisciplinaAluno) ? idDisciplinaAluno.map(String) : [String(idDisciplinaAluno)]
  return idDisciplinaTutor.some(disciplina => disciplinasAluno.includes(String(disciplina)))
}

