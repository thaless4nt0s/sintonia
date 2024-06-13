/* ---- REQUIRES ---- */

const mongoose = require('mongoose')

/* ---- MODELS ---- */

const MODEL_ALUNOS = mongoose.model('Alunos')
const MODEL_TUTORIAS = mongoose.model('Tutorias')

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
  return MODEL_ALUNOS.findOneAndUpdate({ _id: idAluno }, alunoEditado).catch(error => { throw error })
}

// remover um aluno
exports.remover = async (idAluno) => {
  return MODEL_ALUNOS.findByIdAndDelete(idAluno)
}

// mostrar historico de um aluno
exports.mostrarHistorico = async (idAluno) => {
  const filtros = {
    idAluno: new mongoose.Types.ObjectId(idAluno)
  }

  const select = {
    titulo: 1,
    resumo: 1,
    emTutoria: 1,
    dataRegistro: 1,
    dataEncerramento: {
      $dateToString: {
        date: '$dataEncerramento',
        format: '%d/%m/%Y'
      }
    },
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
        'avaliacoes.dataRegistro': {
          $dateToString: {
            date: '$avaliacoes.dataRegistro',
            format: '%d/%m/%Y'
          }
        },
        dataRegistro: {
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

// mostrar um aluno em especifico
exports.receberPorId = async (idAluno) => {
  const filtros = {
    _id: new mongoose.Types.ObjectId(idAluno)
  }

  const select = {
    nome: 1,
    email: 1,
    matricula: 1,
    'disciplina.nome': 1,
    emTutoria: {
      $cond: { if: '$emTutoria', then: 'Em tutoria', else: 'Não está em tutoria no momento' }
    },
    'tutorias.titulo': 1,
    'tutorias.dataRegistro': 1,
    'tutorias.status': 1
  }

  return MODEL_ALUNOS.aggregate([
    {
      $match: filtros
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
      $unwind: {
        path: '$disciplina',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'tutorias',
        localField: '_id',
        foreignField: 'idAluno',
        as: 'tutorias'
      }
    },
    {
      $addFields: {
        'tutorias.status': {
          $cond: { if: '$tutorias.tutoriaEncerrada', then: 'Finalizada', else: 'Em andamento' }
        },
        'tutorias.dataRegistro': {
          $dateToString: {
            date: '$dataRegistro',
            format: '%d/%m/%Y'
          }
        }
      }
    },
    {
      $group: {
        _id: '$_id',
        nome: { $first: '$nome' },
        email: { $first: '$email' },
        matricula: { $first: '$matricula' },
        disciplina: { $first: '$disciplina' },
        emTutoria: { $first: '$emTutoria' },
        tutorias: { $push: '$tutorias' }
      }
    },
    {
      $project: select
    }
  ])
}

// mostrar todos os alunos
exports.receberTodos = async () => {
  const select = {
    nome: 1,
    email: 1,
    matricula: 1,
    'disciplina.nome': 1,
    dataRegistro: 1,
    emTutoria: {
      $cond: { if: '$emTutoria', then: 'Em tutoria', else: 'Não está em tutoria no momento' }
    },
    'tutorias._id': 1,
    'tutorias.titulo': 1,
    'tutorias.dataRegistro': 1,
    'tutorias.status': 1
  }

  return MODEL_ALUNOS.aggregate([
    {
      $lookup: {
        from: 'disciplinas',
        localField: 'idDisciplina',
        foreignField: '_id',
        as: 'disciplina'
      }
    },
    {
      $unwind: {
        path: '$disciplina',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'tutorias',
        localField: '_id',
        foreignField: 'idAluno',
        as: 'tutorias'
      }
    },
    {
      $addFields: {
        'tutorias.status': {
          $cond: { if: '$tutorias.tutoriaEncerrada', then: 'Finalizada', else: 'Em andamento' }
        },
        'tutorias.dataRegistro': {
          $dateToString: {
            date: '$dataRegistro',
            format: '%d/%m/%Y'
          }
        },
        dataRegistro: {
          $dateToString: {
            date: '$dataRegistro',
            format: '%d/%m%Y'
          }
        }
      }
    },
    {
      $group: {
        _id: '$_id',
        nome: { $first: '$nome' },
        email: { $first: '$email' },
        matricula: { $first: '$matricula' },
        disciplina: { $first: '$disciplina' },
        emTutoria: { $first: '$emTutoria' },
        dataRegistro: { $first: '$dataRegistro' },
        tutorias: { $push: '$tutorias' }
      }
    },
    {
      $project: select
    }
  ])
}

/* --- AUX FUNCTIONS --- */

function gerarAluno (dados) {
  const { nome, email, matricula, senha } = dados
  const aluno = {}

  if (nome) aluno.nome = nome
  if (email) aluno.email = email
  if (matricula) aluno.matricula = matricula
  if (senha) aluno.senha = senha

  return aluno
}

function gerarAlunoEditado (dados) {
  const aluno = gerarAluno(dados)
  if (dados.idDisciplina) aluno.idDisciplina = dados.idDisciplina

  return aluno
}
