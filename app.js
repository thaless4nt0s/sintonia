/* --- REQUIRES --- */

require('dotenv/config')
const express = require('express')
const mongoose = require('mongoose')

const app = express()
const configs = require('./configs')

/* --- CONFIGS --- */

configs.mongoose.conectar(mongoose)
configs.middlewares.iniciar(app, express)
configs.models.registrar(mongoose)
configs.routes.registrar(app)
configs.middlewares.erro(app)

module.exports = app
