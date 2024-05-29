/* ---- REQUIRES ---- */

const mongoose = require('mongoose')

/* ---- MODELS ---- */

const MODEL_ADMINS = mongoose.model('Admins')

/* ---- METHODS ---- */

// buscar Um admin em específico
exports.buscarUm = async (filtro) => {
  return MODEL_ADMINS.findOne(filtro)
}

// adicionar administrador
exports.adicionar = async (body) => {
  const admin = gerarAdmin(body)
  return MODEL_ADMINS.create(admin)
}

// mostrar todos os admins
exports.receberTodos = async (query) => {
  const { alfabetoCrescente } = query
  let sort = { nome: 1 }
  if (alfabetoCrescente === 'false') {
    sort = { nome: -1 }
  }

  const select = {
    nome: 1,
    email: 1,
    dataRegistro: 1
  }
  console.log(sort)

  return MODEL_ADMINS.aggregate([
    {
      $project: select
    },
    {
      $sort: sort
    }
  ])
}

/* --- AUX FUNCTIONS --- */

function gerarAdmin(dados) {
  const { nome, email, senha} = dados
  const admin = {}

  if (nome) admin.nome = nome
  if (email) admin.email = email
  if (senha) admin.senha = senha

  return admin
}

