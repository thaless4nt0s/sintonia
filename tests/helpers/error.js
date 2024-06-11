/* globals request */

exports.error = async () => {
  const { body } = await request.get('/a')

  return body
}
