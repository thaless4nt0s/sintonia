/* ---- REQUIRES ---- */

const mongoose = require('mongoose')

/* ---- MODELS ---- */

const MODEL_TUTORES = mongoose.model('Tutores')
const MODEL_TUTORIAS = mongoose.model('Tutorias')

/* --- HELPERS --- */

const HELPER_DATE = require('../helpers/date')
const disciplinas = require('../models/disciplinas')

/* ---- METHODS ---- */

// Busca de maneira especifica
exports.buscarUm = async (filtro, select={}) => {
  return MODEL_TUTORES.findOne(filtro).select(select)
}

// Adicionar tutor
exports.adicionar = async (body) => {
  const tutor = gerarTutor(body)
  return MODEL_TUTORES.create(tutor)
}

// alterar dados
exports.alterarDados = async (idTutor, body) => {
  const tutorAlterado = gerarTutorAlterado(body)
  return MODEL_TUTORES.findByIdAndUpdate(idTutor, tutorAlterado)
}

// remover tutor
exports.remover = async (idTutor) => {
  return MODEL_TUTORES.findByIdAndDelete(idTutor)
}

// mostrar todos os tutores
exports.mostrarTodos = async (query) => {
  const { alfabetoCrescente } = query
  let sort = { nome: 1 }

  if (alfabetoCrescente === 'false') {
    sort = { nome: -1 }
  }

  const select = {
    nome: 1,
    semestre: 1,
    'disciplinas.nome': 1,
    emTutoria: 1
  }

  const tutores = await MODEL_TUTORES.aggregate([
    {
      $lookup:{
        from: 'disciplinas',
        localField: 'idDisciplina',
        foreignField: '_id',
        as: 'disciplinas'
      }
    },
    {
      $addFields: {
        emTutoria: {
          $cond: { if: "$emTutoria", then: "sim", else: "não" }
        }
      }
    },
    {
      $sort: sort
    },
    {
      $project: select
    }
  ])

  return tutores
}

//Mostrar historico
exports.mostrarHistorico = async (idTutor) => {
  const filtros = {
    idTutor: new mongoose.Types.ObjectId(idTutor),
  }

  const select = {
    titulo: 1,
    resumo: 1,
    emTutoria: 1,
    dataRegistro: 1,
    dataEncerramento: 1,
    'disciplina.nome': 1,
    'tutor.nome': 1,
    'aluno.nome': 1,
  }

  return MODEL_TUTORIAS.aggregate([
    {
      $match: filtros
    },
    {
      $lookup: {
        from: 'tutores',
        localField: 'idTutor',
        foreignField: '_id',
        as: 'tutor'
      }
    },
    {
      $unwind: '$tutor'
    },
    {
      $lookup: {
        from: 'alunos',
        localField: 'idAluno',
        foreignField: '_id',
        as: 'aluno'
      }
    },
    {
      $unwind: '$aluno'
    },
    {
      $lookup: {
        from: 'disciplinas',
        localField: 'idDisciplina',
        foreignField: '_id',
        as: 'disciplina'
      }
    },
    {
      $unwind: '$disciplina'
    },
    {
      $addFields: {
        emTutoria: {
          $cond: { if: "$emTutoria", then: "Em andamento", else: "Finalizada" }
        }
      }
    },
    {
      $project: select
    },
    {
      $sort: {dataEncerramento: -1}
    }
  ])
}



/* --- AUX FUNCTIONS --- */

function gerarTutor(dados) {
  const { nome, email, matricula, senha, semestre} = dados
  const tutor = {}

  if (nome) tutor.nome = nome
  if (email) tutor.email = email
  if (matricula) tutor.matricula = matricula
  if (senha) tutor.senha = senha
  if (semestre) tutor.semestre = semestre

  return tutor
}

function gerarTutorAlterado(dados) {
  const tutor = gerarTutor(dados)
  if (dados.idDisciplina) tutor.idDisciplina = dados.idDisciplina
  return tutor
}
