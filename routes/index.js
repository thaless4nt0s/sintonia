/* --- REQUIRES --- */

const express = require('express')
const router = express.Router()
const packageJson = require('../package.json')

/* --- CONSTS --- */

const HELPER_RESPONSE = require('../helpers/response')

/* --- METHODS --- */

router.get('/', (req, res) =>{
    const { version, name } = packageJson
    HELPER_RESPONSE.success(res, `Bem vindo ao ${name} (${version})`)
  }
)



module.exports = router
