#### Rota de Alunos

**PATCH** `/alunos/:idAluno`

- **Descrição**: Endpoint responsável por alterar os dados de um aluno.
- **Autenticação**: Necessário.

**Query**:

| CAMPO        | TIPO   | OBRIGATÓRIO   | EXEMPLO                                  | VALORES ACEITOS            |
| ------------ | ------ | ------------- | ---------------------------------------- | -------------------------- |
| nome         | string | Não           | Carlos Henrique Leitão                   |                            |
| email        | string | Não           | carlos.henrique.leitao@aluno.ifce.edu.br | somente @aluno.ifce.edu.br |
| senha        | string | Não           | 12345678                                 | De 8 até 10 caracteres     |
| matricula    | string | Não           | 20161011060000                           |                            |
| idDisciplina | string | Não           | 664b510c553bc83206f93345                 |                            |

**Response**:

```
{
  "status": "ok",
  "statusCode": 200,
  "body": "Dados do Aluno alterados com sucesso !"
}
```

---

**DELETE** `/alunos/:idAluno`

- **Descrição**: Endpoint responsável por remover um aluno.
- **Autenticação**: Necessário

**Response**:

```
{
  "status": "ok",
  "statusCode": 200,
  "body": "Aluno removido com sucesso !"
}
```

---

**GET** `/alunos/:idAluno`

- **Descrição**: Endpoint responsável por mostrar os dados de um aluno.
- **Autenticação**: Necessário.

**Response**:

```
{
  "status":"ok",
  "statusCode":200,
  "body":[
    {
      "_id":"6643b7e345413309bb82ffc5",
      "nome":"Neymar jr",
      "email":"neymar.jr.00@aluno.ifce.edu.br",
      "matricula":"20241045050000",
      "disciplina":{
        "nome":"Cálculo 1"
      },
      "tutorias":[
        [
          {
            "titulo":"duvidas sobre integral",
            "dataRegistro":"14/05/2024",
            "status":"Finalizada"
          },
          {
            "titulo":"Como fazer a letra A ?",
            "dataRegistro":"14/05/2024",
            "status":"Finalizada"
          },
          {
            "titulo":"Como fazer a letra C ?",
            "dataRegistro":"14/05/2024",
            "status":"Finalizada"
          },
          {
            "titulo":"Como fazer a letra W ?",
            "dataRegistro":"14/05/2024",
            "status":"Finalizada"
          },
          {
            "titulo":"Como fazer a letra d ?",
            "dataRegistro":"14/05/2024",
            "status":"Finalizada"
          }
        ]
      ],
      "emTutoria":"Não está em tutoria no momento"
    }
  ]
}
```

---

**GET** `/alunos/:idAluno`

- **Descrição**: Endpoint responsável por mostrar os dados de todos os alunos.
- **Autenticação**: Necessário.

**Response**:

```
{
  "status":"ok",
  "statusCode":200,
  "body":[
    {
      "_id":"6643b7e345413309bb82ffc5",
      "nome":"Neymar jr",
      "email":"neymar.jr.00@aluno.ifce.edu.br",
      "matricula":"20241045050000",
      "disciplina":{
        "nome":"Cálculo 1"
      },
      "dataRegistro":"14/052024",
      "tutorias":[
        [
          {
            "_id":"664f4d5f2bd9148dd930afd7",
            "titulo":"duvidas sobre integral",
            "dataRegistro":"14/05/2024",
            "status":"Finalizada"
          },
          {
            "_id":"664f95d60dbc7dac9435a8f5",
            "titulo":"Como fazer a letra A ?",
            "dataRegistro":"14/05/2024",
            "status":"Finalizada"
          },
          {
            "_id":"665388c10c701b59015ebd4d",
            "titulo":"Como fazer a letra C ?",
            "dataRegistro":"14/05/2024",
            "status":"Finalizada"
          },
          {
            "_id":"6655d960031ed778e5f974a9",
            "titulo":"Como fazer a letra W ?",
            "dataRegistro":"14/05/2024",
            "status":"Finalizada"
          },
          {
            "_id":"6656134ea58b8b0c7850f6a0",
            "titulo":"Como fazer a letra d ?",
            "dataRegistro":"14/05/2024",
            "status":"Finalizada"
          }
        ]
      ],
      "emTutoria":"Não está em tutoria no momento"
    },
    {
      "_id":"665738faf06d59ea7da01c15",
      "nome":"José Leandro Alberto",
      "email":"jose.leandro.alberto.00@aluno.ifce.edu.br",
      "matricula":"20241045050002",
      "dataRegistro":"29/052024",
      "tutorias":[
        [

        ]
      ],
      "emTutoria":"Não está em tutoria no momento"
    }
  ]
}
```

---
