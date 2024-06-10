/* --- REQUIRES --- */

const SECRET = process.env.SECRET
/* --- HELPERS --- */

const HELPER_RESPONSE = require('../helpers/response')
const HELPER_TOKEN = require('../helpers/tokens')

/* --- REPOSITORIES --- */

const REPOSITORY_ADMINS = require('../repositories/admins')

/* --- METHODS --- */

exports.verificarExistenciaPorId = async (req, res, next) => {
  const { idAdmin } = req.params

  try {
    const admin = await REPOSITORY_ADMINS.buscarUm({ _id: idAdmin })

    if (!admin) {
      HELPER_RESPONSE.simpleError(res, 406, 'Administrador inexistente !')
      return
    }
    next()
  } catch (error) {
    next(error)
  }
}

exports.verificarAdminAutenticado = async (req, res, next) => {
  const { idAdmin } = req.params
  const token = req.headers['x-access-token']

  try {
    // pega o id do token do usuário para saber se o usuário que está acessando é o mesmo que está na URL
    const { usuario } = await HELPER_TOKEN.obterDadosDoToken(token, SECRET)
    const idUsuario = usuario.usuario._id

    if (!(idAdmin === idUsuario)) {
      HELPER_RESPONSE.simpleError(res, 406, 'Acesso não autorizado !')
      return
    }
    next()
  } catch (error) {
    next(error)
  }
}
