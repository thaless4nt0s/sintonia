/* ---- REQUIRES ---- */

const morgan = require('morgan')
const cors = require('cors')
const compression = require('compression')

/* ---- CONSTS ---- */

const morganOptions = { skip: () => process.env.NODE_ENV === 'TEST' }
const urlEncodedOptions = { extended: false }
const jsonOptions = { limit: '500kb' }

/* ---- METHODS ---- */

function iniciar (app, express) {
  app.use(cors())
  app.use(morgan('common', morganOptions))
  app.use(compression())
  app.use(express.json(jsonOptions))
  app.use(express.urlencoded(urlEncodedOptions))
}

function erro (app) {
  const MIDDLEWARE_ERROR = require('../middlewares/error/')
  app.use(MIDDLEWARE_ERROR)
}

module.exports = {
  iniciar,
  erro
}
