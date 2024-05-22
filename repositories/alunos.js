/* ---- REQUIRES ---- */

const mongoose = require('mongoose')

/* ---- MODELS ---- */

const MODEL_ALUNOS = mongoose.model('Alunos')

/* --- HELPERS --- */

const HELPER_DATE = require('../helpers/date')

/* ---- METHODS ---- */

// Busca de maneira especifica
exports.buscarUm = async (filtro, select = {}) => {
  return MODEL_ALUNOS.findOne(filtro).select(select)
}

// Adicionar aluno
exports.adicionar = async (body) => {
  const aluno = gerarAluno(body)

  const alunoNovo = await MODEL_ALUNOS.create(aluno)
  return alunoNovo
}

// alterar dados de um aluno
exports.alterarDados = async (idAluno, body) => {
  const alunoEditado = gerarAlunoEditado(body)
  return MODEL_ALUNOS.findOneAndUpdate({_id: idAluno}, alunoEditado).catch(error => { throw error })
}

// remover um aluno
exports.remover = async (idAluno) => {
  return MODEL_ALUNOS.findByIdAndDelete(idAluno)
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

function gerarAlunoEditado(dados) {
  const aluno = gerarAluno(dados)
  if (dados.idDisciplina) aluno.idDisciplina = dados.idDisciplina

  return aluno
}
