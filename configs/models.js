/* --- METHODS --- */

function registrar (mongoose) {
  require('../models/alunos')(mongoose)
  require('../models/tutores')(mongoose)
  require('../models/admins')(mongoose)
}

module.exports = { registrar }
