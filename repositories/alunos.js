/* ---- REQUIRES ---- */

const mongoose = require('mongoose')

/* ---- MODELS ---- */
const HELPER_DATE = require('../helpers/date')
const MODEL_ALUNOS = mongoose.model('Alunos')

/* ---- METHODS ---- */

// Busca de maneira especifica
exports.buscarUm = async (filtro) => {
  return MODEL_ALUNOS.findOne(filtro)
}

// Adicionar aluno
exports.adicionar = async (body) => {
  const aluno = gerarAluno(body)

  const alunoNovo = await MODEL_ALUNOS.create(aluno)
  return alunoNovo

}

/* --- AUX FUNCTIONS --- */

function gerarAluno(dados) {
  const { nome, email, matricula, senha} = dados
  const aluno = {}

  if (nome) aluno.nome = nome
  if (email) aluno.email = email
  if (matricula) aluno.matricula = matricula
  if (senha) aluno.senha = senha

  return aluno
}
