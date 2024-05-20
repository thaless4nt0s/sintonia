/* --- CONSTANTS --- */

const jwt = require('jsonwebtoken')

/* --- METHODS --- */

exports.gerarToken = async (usuario, secret) => {
  return jwt.sign(
    {usuario},
    secret,
    {expiresIn: '7d'}
  )
}

exports.obterDadosDoToken = async (token, secret) => {
  return jwt.verify(token, secret)
}

exports.verificarToken = async (token, secret) => {
  return new Promise((resolve) => {
    jwt.verify(token, secret, (error) => {
      if (error) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

exports.verificarTipoToken = async (token, secret) => {
  const { usuario } = await this.obterDadosDoToken(token, secret)
  return usuario.tipo
}
