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

exports.verificarExistenciaPorParametro = async (req, res, next) => {
  const { idDisciplina } = req.body

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

exports.verificarExistenciaEmArrayPorParametro = async (req, res, next) => {
  const { idDisciplina } = req.body

  try {
      if (idDisciplina){
      const promises = idDisciplina.map(async (element) => {
        const disciplina = await REPOSITORY_DISCIPLINAS.buscarUm({ _id: element })
        if (!disciplina) {
          throw new Error('Há pelo menos uma disciplina inválida, selecione-a(s) novamente!')
        }
      })
      await Promise.all(promises)
    }
    next()
  } catch (error) {
    HELPER_RESPONSE.simpleError(res, 406, error.message)
  }
}
