/* ---- REQUIRES ---- */

const mongoose = require('mongoose')

/* ---- MODELS ---- */

const MODEL_TUTORES = mongoose.model('Tutores')
const MODEL_TUTORIAS = mongoose.model('Tutorias')

/* ---- METHODS ---- */

// Busca de maneira especifica
exports.buscarUm = async (filtro, select = {}) => {
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
  const { alfabetoCrescente, mediaDecrescente } = query
  let sort = { nome: 1 }

  if (alfabetoCrescente === 'false') {
    sort = { nome: -1 }
  }

  if (mediaDecrescente === 'true') {
    sort = { media: -1 }
  }

  const select = {
    nome: 1,
    semestre: 1,
    email: 1,
    matricula: 1,
    'disciplinas.nome': 1,
    emTutoria: 1,
    media: 1
  }

  const tutores = await MODEL_TUTORES.aggregate([
    {
      $lookup: {
        from: 'disciplinas',
        localField: 'idDisciplina',
        foreignField: '_id',
        as: 'disciplinas'
      }
    },
    {
      $lookup: {
        from: 'tutorias',
        localField: '_id',
        foreignField: 'idTutor',
        as: 'tutorias'
      }
    },
    {
      $unwind: {
        path: '$tutorias',
        preserveNullAndEmptyArrays: true // Preservar documentos sem tutorias
      }
    },
    {
      $lookup: {
        from: 'avaliacoes',
        localField: 'tutorias._id',
        foreignField: 'idTutoria',
        as: 'avaliacoes'
      }
    },
    {
      $unwind: {
        path: '$avaliacoes',
        preserveNullAndEmptyArrays: true // Preservar documentos sem avaliações
      }
    },
    {
      $group: {
        _id: '$_id',
        nome: { $first: '$nome' },
        semestre: { $first: '$semestre' },
        email: { $first: '$email' },
        matricula: { $first: '$matricula' },
        disciplinas: { $first: '$disciplinas' },
        emTutoria: { $first: '$emTutoria' },
        avaliacoes: { $push: '$avaliacoes' },
        media: { $avg: '$avaliacoes.nota' } // Calculando a média das notas
      }
    },
    {
      $addFields: {
        emTutoria: {
          $cond: { if: '$emTutoria', then: 'sim', else: 'não' }
        },
        media: { $round: ['$media', 1] } // Substituir média nula por "N/A"
      }
    },
    {
      $addFields: {
        media: { $ifNull: ['$media', 'N/A'] } // Substituir média nula por "N/A"
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

// Mostrar historico
exports.mostrarHistorico = async (idTutor) => {
  const filtros = {
    idTutor: new mongoose.Types.ObjectId(idTutor)
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
    'avaliacoes.nota': 1,
    'avaliacoes.comentario': 1,
    'avaliacoes.dataRegistro': 1
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
      $lookup: {
        from: 'avaliacoes',
        localField: '_id',
        foreignField: 'idTutoria',
        as: 'avaliacoes'
      }
    },
    {
      $unwind: {
        path: '$avaliacoes',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        emTutoria: {
          $cond: { if: '$emTutoria', then: 'Em andamento', else: 'Finalizada' }
        },
        dataRegistro: {
          $dateToString: {
            date: '$dataRegistro',
            format: '%d/%m/%Y'
          }
        },
        dataEncerramento: {
          $dateToString: {
            date: '$dataEncerramento',
            format: '%d/%m/%Y'
          }
        },
        'avaliacoes.dataRegistro': {
          $dateToString: {
            date: '$dataRegistro',
            format: '%d/%m/%Y'
          }
        }
      }
    },
    {
      $project: select
    },
    {
      $sort: { dataEncerramento: -1 }
    }
  ])
}

// exibe os dados de somente um tutor
exports.receberPorId = async (idTutor) => {
  const filtros = {
    _id: new mongoose.Types.ObjectId(idTutor)
  }

  const select = {
    nome: 1,
    email: 1,
    semestre: 1,
    matricula: 1,
    emTutoria: 1,
    'disciplinas.nome': 1,
    'avaliacoes.comentario': 1,
    'avaliacoes.dataRegistro': 1,
    'avaliacoes.nota': 1,
    media: 1
  }

  return MODEL_TUTORES.aggregate([
    {
      $match: filtros
    },
    {
      $lookup: {
        from: 'disciplinas',
        localField: 'idDisciplina',
        foreignField: '_id',
        as: 'disciplinas'
      }
    },
    {
      $lookup: {
        from: 'avaliacoes',
        localField: '_id',
        foreignField: 'idTutor',
        as: 'avaliacoes'
      }
    },
    {
      $addFields: {
        media: { $round: [{ $avg: '$avaliacoes.nota' }, 1] },
        'avaliacoes.dataRegistro': {
          $dateToString: {
            date: '$dataRegistro',
            format: '%d/%m/%Y'
          }
        },
        emTutoria: {
          $cond: { if: '$emTutoria', then: 'sim', else: 'não' }
        }
      }
    },
    {
      $project: select
    }
  ])
}

/* --- AUX FUNCTIONS --- */

function gerarTutor (dados) {
  const { nome, email, matricula, senha, semestre } = dados
  const tutor = {}

  if (nome) tutor.nome = nome
  if (email) tutor.email = email
  if (matricula) tutor.matricula = matricula
  if (senha) tutor.senha = senha
  if (semestre) tutor.semestre = semestre

  return tutor
}

function gerarTutorAlterado (dados) {
  const tutor = gerarTutor(dados)
  if (dados.idDisciplina) tutor.idDisciplina = dados.idDisciplina
  return tutor
}
