/* --- METHODS --- */

function registrar (mongoose) {
  require('../models/alunos')(mongoose)
}

module.exports = { registrar }
