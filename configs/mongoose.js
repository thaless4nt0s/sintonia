/* ---- METHODS ---- */

async function conectar (mongoose) {
  const mode = process.env.MODE
  const connectionString = process.env.MONGO_STRING

  const options = {}
  options.serverSelectionTimeoutMS = 5000
  options.dbName = 'sintonia'

  mongoose.set('strictQuery', true)

  mongoose.connect(connectionString, options)
    .then(conectado)
    .catch(erro)
}

function conectado () {
  console.info('A conexão com o banco de dados foi estabelecida.')
}

function erro (error) {
  console.error('A conexão com o banco de dados foi encerrada.')
  setTimeout(() => process.exit(0), 5000)
}

module.exports = { conectar }
