/* --- METHODS --- */

function registrar (mongoose) {
  require('../models/alunos')(mongoose)
  require('../models/tutores')(mongoose)
  require('../models/admins')(mongoose)
  require('../models/disciplinas')(mongoose)
  require('../models/tutorias')(mongoose)
  require('../models/avaliacoes')(mongoose)
}

module.exports = { registrar }
