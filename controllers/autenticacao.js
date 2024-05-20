/* --- CONSTANTS --- */

const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET

/* ---  REPOSITORIES --- */

const REPOSITORY_ADMINS = require('../repositories/admins')
const REPOSITORY_ALUNOS = require('../repositories/alunos')
const REPOSITORY_TUTORES = require('../repositories/tutores')

/* --- HELPERS --- */

const HELPER_RESPONSE = require('../helpers/response')
const HELPER_SENHA = require('../helpers/passwords')
const HELPER_TOKEN = require('../helpers/tokens')

/* --- METHODS --- */

exports.autenticar = async (req, res, next) => {
  const { body } = req
  try {

    const aluno = await REPOSITORY_ALUNOS.buscarUm({ email: body.email })
    const tutor = await REPOSITORY_TUTORES.buscarUm({ email: body.email })
    const administrador = await REPOSITORY_ADMINS.buscarUm({email: body.email })

    let usuario
    //  Dessa maneira, será guardado na variável usuário o valor de algum dos
    if (aluno) {
      const senhaVerificada = await HELPER_SENHA.verificarSenha(body.senha, aluno.senha)
      if (!senhaVerificada) {
        HELPER_RESPONSE.simpleError(res, 406, 'Email ou senha incorretos !')
        //  Precisa deste return true para não dar erro no código
        return true
      }
      usuario = {usuario: aluno.toObject(), tipo: 'aluno'}

    }else if (tutor) {
      const senhaVerificada = await HELPER_SENHA.verificarSenha(body.senha, tutor.senha)
      if (!senhaVerificada) {
        HELPER_RESPONSE.simpleError(res, 406, 'Email ou senha incorretos !')
        //  Precisa deste return true para não dar erro no código
        return true
      }
      delete tutor.senha
      usuario = {usuario: tutor.toObject(), tipo: 'tutor'}

    }else if (administrador) {
      const senhaVerificada = await HELPER_SENHA.verificarSenha(body.senha, administrador.senha)
      if (!senhaVerificada) {
        HELPER_RESPONSE.simpleError(res, 406, 'Email ou senha incorretos !')
        //  Precisa deste return true para não dar erro no código
        return true
      }
      usuario = {usuario: administrador.toObject(), tipo: 'administrador'}
    }

    if (!usuario) {
      HELPER_RESPONSE.simpleError(res, 406, 'Email ou senha incorretos !')
      return true
    }

    // Agora, vamos gerar o token com o tipo de usuário incluído e usando a chave secreta do arquivo .env
    delete usuario.usuario.senha
    const token = await HELPER_TOKEN.gerarToken(usuario, SECRET)
    HELPER_RESPONSE.success(res, token)
  } catch (error) {
    next(error)
  }
}
