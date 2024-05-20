/* --- METHODS --- */

function registrar (mongoose) {
  require('../models/alunos')(mongoose)
  require('../models/tutores')(mongoose)
  require('../models/admins')(mongoose)
  require('../models/disciplinas')(mongoose)
}

module.exports = { registrar }
