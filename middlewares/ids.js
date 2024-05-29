/* --- REQUIRES --- */
const mongoose = require('mongoose')

/* --- HELPERS --- */
const HELPER_RESPONSE = require('../helpers/response')

/* --- REPOSITORIEs --- */

const REPOSITORY_ALUNOS =  require('../repositories/alunos')
const REPOSITORY_TUTORES = require('../repositories/tutores')
const REPOSITORY_ADMINS = require('../repositories/admins')

/* --- METHODS --- */

// Middleware para validar ObjectId do MongoDB
exports.validarIds = (req, res, next) => {
  const invalidIds = []

  for (const [key, value] of Object.entries(req.params)) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      invalidIds.push(key)
    }
  }

  if (invalidIds.length > 0) {
    return HELPER_RESPONSE.simpleError(res, 406, 'Contém Id(s) inválido(s) !')
  }

  next()
}

// verifica se o ID existe
exports.verificarExistenciaDoId = async (req, res, next) => {
  const { id } = req.params

  try {
    // Definindo as consultas e seus tipos correspondentes
    const consultas = [
      { tipo: 'admin', query: REPOSITORY_ADMINS.buscarUm({ _id: id }) },
      { tipo: 'aluno', query: REPOSITORY_ALUNOS.buscarUm({ _id: id }) },
      { tipo: 'tutor', query: REPOSITORY_TUTORES.buscarUm({ _id: id }) }
    ]

    // Executando todas as consultas em paralelo
    const resultados = await Promise.all(consultas.map(c => c.query))

    // Encontrando a primeira consulta bem-sucedida
    const usuarioEncontrado = consultas.find((_, index) => resultados[index] !== null)

    if (!usuarioEncontrado) {
      return HELPER_RESPONSE.simpleError(res, 406, 'Usuário não encontrado')
    }

    // Passando o tipo de usuário para o próximo middleware
    res.locals.tipoUsuario = usuarioEncontrado.tipo
    next()
  } catch (error) {
    next(error)
  }
}
