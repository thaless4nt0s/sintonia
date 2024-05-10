/* --- REQUIRES --- */

require('dotenv/config')
const express = require('express')
const mongoose = require('mongoose')

const app = express()
const configs = require('./configs')

/* --- CONFIGS --- */

configs.routes.registrar(app)

module.exports = app
