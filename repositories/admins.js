/* ---- REQUIRES ---- */

const mongoose = require('mongoose')

/* ---- HELPERS ---- */

const HELPER_SENHA = require('../helpers/passwords')

/* ---- MODELS ---- */

const MODEL_ADMINS = mongoose.model('Admins')
const MODEL_TUTORES = mongoose.model('Tutores')
const MODEL_ALUNOS = mongoose.model('Alunos')

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

exports.resetarSenha = async (id, tipoUsuario) => {

  const MODELS = {
    aluno: MODEL_ALUNOS,
    tutor: MODEL_TUTORES,
    admiin: MODEL_ADMINS
  }

  const model = MODELS[tipoUsuario]
  const novaSenha = await HELPER_SENHA.criptografarSenha('12345678')
  const atualizado = await model.findByIdAndUpdate(id, {senha: novaSenha}, { new: true } )
  console.log(atualizado)
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
