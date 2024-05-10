/* --- REQUIRES --- */

const routes = require('./routes')
const mongoose = require('./mongoose')
const middlewares = require('./middlewares')
const models = require('./models')

module.exports = {
  routes,
  mongoose,
  middlewares,
  models
}
