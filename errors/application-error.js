class ApplicationError extends Error {
  constructor (status, message) {
    super(message)
    this.name = 'ApplicationError'
    this.status = status
  }
}

module.exports = {
  ApplicationError
}
