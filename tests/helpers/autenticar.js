/* globals request */

exports.login = async (dados) => {
  const { body } = await request.post('/autenticacao').send(dados)

  return body
}
