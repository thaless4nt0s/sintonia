/* --- REQUIRES --- */

const dotenv = require('dotenv').config()
const morgan = require('morgan')
const PORT = process.env.PORT

/* --- Methods --- */

function registrar(app) {
  index(app)
  paginas(app)
  erro(app)
}

function paginas (app) {
  // CONSTANTS

  const ROUTES_ALUNOS = require('../routes/alunos')

  // APP.USE
  app.use('/alunos', ROUTES_ALUNOS)
}


function index (app) {
  const ROUTE_INDEX = require('../routes/index')
  app.use('/', ROUTE_INDEX)
}

function erro (app) {
  const ROUTE_ERROR = require('../routes/error')
  app.use('/', ROUTE_ERROR)
}

module.exports = { registrar }
