/* globals request */

exports.index = async () => {
  const { body } = await request.get('/')

  return body
}
