/* --- CONSTS --- */

const moment = require('moment')

/* --- METHODS --- */

function now () {
  return moment().format() // Retorna a data e hora atuais no formato especificado pelo Moment.js
}

module.exports = {
  now
}
