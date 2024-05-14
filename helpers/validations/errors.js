/* ---- METHODS ---- */

module.exports = {
  first: (validation) => {
    const errors = validation.errors.all()
    return Object.values(errors)[0][0]
  }
}
