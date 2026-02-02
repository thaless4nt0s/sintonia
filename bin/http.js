/* ---- REQUIRES ---- */

const app = require('../app')
const http = require('http')

/* ---- CONSTS ---- */

const PORT = process.env.PORT || 3000

/* ---- SERVER ---- */

app.set('port', PORT)
const server = http.createServer(app)

server.listen(PORT)
server.on('error', onError)
server.on('listening', onListening)

/* ---- Events ---- */

function onError (error) {
  if (error.syscall !== 'listen') throw error

  if (error.code === 'EACCES') {
    console.error(PORT, 'sem permissão')
    process.exit(1)
  }

  if (error.code === 'EADDRINUSE') {
    console.error(PORT, 'já está em uso')
    process.exit(1)
  }

  throw error
}

function onListening () {
  console.info('# Servidor Iniciado!')
  console.info('# Escutando na porta', PORT, '...')
}

// App Error Handler
process.on('unhandledRejection', (error) => {
  console.log('Motivo:', error)
})
