/* --- HELPERS --- */

const HELPER_RESPONSE = require('../helpers/response')

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

exports.verificarExistenciaPorId = async (req, res, next) => {
  const { idTutoria } = req.params
  try {
    const tutoria = await REPOSITORY_TUTORIAS.buscarUm({ _id: idTutoria }, { __v: 0 })
    if (!tutoria) {
      HELPER_RESPONSE.simpleError(res, 406, 'Tutoria inexistente !')
      return
    }
    next()
  } catch (error) {
    next(error)
  }
}

exports.verificarSeTutorEAlunoSaoDaMesmaTutoriaAtiva = async (req, res, next) => {
  const { idAluno, idTutor, idTutoria } = req.params
  try {
    const tutoria = await REPOSITORY_TUTORIAS.buscarUm({ _id: idTutoria, idAluno, idTutor, tutoriaEncerrada: false }, { __v: 0 })
    if (!tutoria) {
      HELPER_RESPONSE.simpleError(res, 406, 'O aluno ou tutor não pertencem a tutoria !')
      return
    }
    next()
  } catch (error) {
    next(error)
  }
}

exports.verificaSeTutoriaEstaAtiva = async (req, res, next) => {
  const { idTutoria } = req.params
  try {
    const { tutoriaEncerrada, idTutor } = await REPOSITORY_TUTORIAS.buscarUm({ _id: idTutoria }, { tutoriaEncerrada: 1, idTutor: 1 })
    if (!tutoriaEncerrada) {
      HELPER_RESPONSE.simpleError(res, 406, 'A tutoria não está encerrada !')
      return
    }
    res.locals.idTutor = idTutor
    next()
  } catch (error) {
    next(error)
  }
}

/* --- AUX FUNCTIONS --- */
function compararDisciplinasDeAlunosComTutores (idDisciplinaAluno, idDisciplinaTutor) {
  // Transformar idDisciplinaAluno em String caso não seja um array
  const disciplinasAluno = Array.isArray(idDisciplinaAluno) ? idDisciplinaAluno.map(String) : [String(idDisciplinaAluno)]
  return idDisciplinaTutor.some(disciplina => disciplinasAluno.includes(String(disciplina)))
}
