/* --- Methods --- */

function registrar (app) {
  index(app)
  paginas(app)
  erro(app)
}

function paginas (app) {
  // CONSTANTS

  const ROUTES_ALUNOS = require('../routes/alunos')
  const ROUTES_REGISTRAR = require('../routes/registrar')
  const ROUTES_AUTENTICAR = require('../routes/autenticacao')
  const ROUTES_DISCIPLINAS = require('../routes/disciplinas')
  const ROUTES_TUTORES = require('../routes/tutores')
  const ROUTES_ADMINS = require('../routes/admins')
  const ROUTES_TUTORIAS = require('../routes/tutorias')
  const ROUTES_AVALIACOES = require('../routes/avaliacoes')

  // APP.USE

  app.use('/alunos', ROUTES_ALUNOS)
  app.use('/registrar', ROUTES_REGISTRAR)
  app.use('/autenticacao', ROUTES_AUTENTICAR)
  app.use('/disciplinas', ROUTES_DISCIPLINAS)
  app.use('/tutores', ROUTES_TUTORES)
  app.use('/administradores', ROUTES_ADMINS)
  app.use('/tutorias', ROUTES_TUTORIAS)
  app.use('/avaliacoes', ROUTES_AVALIACOES)
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
