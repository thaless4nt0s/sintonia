/* ---- REQUIRES ---- */

const mongoose = require('mongoose')

/* ---- HELPERS ---- */

const HELPER_SENHA = require('../helpers/passwords')

/* ---- MODELS ---- */

const MODEL_ADMINS = mongoose.model('Admins')
const MODEL_TUTORES = mongoose.model('Tutores')
const MODEL_ALUNOS = mongoose.model('Alunos')
const MODEL_TUTORIAS = mongoose.model('Tutorias')

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
    admin: MODEL_ADMINS
  }

  const model = MODELS[tipoUsuario]
  const novaSenha = await HELPER_SENHA.criptografarSenha('12345678')
  await model.findByIdAndUpdate(id, { senha: novaSenha }, { new: true })
}

// alterar dados
exports.alterarDados = async (idAdmin, body) => {
  const dadosAdmin = gerarAdmin(body)
  await MODEL_ADMINS.findByIdAndUpdate(idAdmin, dadosAdmin, { new: true })
}

// receber estatisticas
exports.receberEstatisticas = async (query) => {
  const { dataInicial, dataFinal } = query

  // Converte as datas para objetos Date
  const periodoInicial = new Date(dataInicial)
  const periodoFinal = new Date(dataFinal)

  const filtroData = {
    dataRegistro: {
      $gte: periodoInicial,
      $lte: periodoFinal
    }
  }

  const estatisticas = await MODEL_TUTORIAS.aggregate([
    {
      $match: filtroData
    },
    {
      $project: {
        dataRegistro: 1,
        idTutor: 1,
        idAluno: 1,
        tutoriaEncerrada: 1
      }
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
      $group: {
        _id: '$idTutor',
        nome: { $first: '$tutor.nome' },
        alunosDistintos: { $addToSet: '$idAluno' },
        tutoriasRealizadas: {
          $sum: {
            $cond: [{ $eq: ['$tutoriaEncerrada', true] }, 1, 0]
          }
        },
        tutoriaPendente: {
          $sum: {
            $cond: [{ $eq: ['$tutoriaEncerrada', false] }, 1, 0]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        idTutor: '$_id',
        nome: 1,
        quantidadeAlunos: { $size: '$alunosDistintos' },
        tutoriasRealizadas: 1,
        tutoriaPendente: 1
      }
    }
  ])

  const novosAlunos = await MODEL_ALUNOS.countDocuments(filtroData)
  const novosTutores = await MODEL_TUTORES.countDocuments(filtroData)
  const totalDeTutoriasRealizadasNoPeriodo = await MODEL_TUTORIAS.countDocuments(filtroData)

  return {
    estatisticas,
    novosAlunos,
    novosTutores,
    totalDeTutoriasRealizadasNoPeriodo
  }
}

/* --- AUX FUNCTIONS --- */

function gerarAdmin (dados) {
  const { nome, email, senha } = dados
  const admin = {}

  if (nome) admin.nome = nome
  if (email) admin.email = email
  if (senha) admin.senha = senha

  return admin
}

// fazer mais testes e ver se falta mais algum dado
