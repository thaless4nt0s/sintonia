/* --- REQUIRES --- */

const express = require('express')
const router = express.Router()

/* --- METHODS --- */

router.get('/', (req, res, next) => {
    return res.status(200).json({message: 'sadasd'})
  }
)

module.exports = router
