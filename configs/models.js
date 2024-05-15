/* --- METHODS --- */

function registrar (mongoose) {
  require('../models/alunos')(mongoose)
  require('../models/tutores')(mongoose)
}

module.exports = { registrar }
