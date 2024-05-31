/* ---- Requires ---- */

require('dotenv/config')
const request = require('supertest')

process.env.MONGO_STRING = process.env.MONGO_STRING_TEST
const app = require('../app')

global.request = request(app)
