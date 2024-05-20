/* --- REQUIRES --- */

const mongoose = require('mongoose')

/* --- HELPERS --- */

const HELPER_RESPONSE = require('../helpers/response')

/* --- REPOSITORIES --- */

const REPOSITORY_DISCIPLINAS = require('../repositories/disciplinas')

/* --- METHODS --- */

exports.verificarExistenciaPorId = async (req, res, next) => {
  const { idDisciplina } = req.params

  try {
    const disciplina = await REPOSITORY_DISCIPLINAS.buscarUm({ _id: idDisciplina })

    if (!disciplina) {
      HELPER_RESPONSE.simpleError(res, 406, 'Disciplina inexistente !')
      return
    }
    next()
  } catch (error) {
    next(error)
  }
}
