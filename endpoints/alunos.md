#### Rota de Alunos

**PATCH** `/alunos/:idAluno`

- **Descrição**: Endpoint responsável por alterar os dados de um aluno.
- **Autenticação**: Necessário.

**Query**:

| CAMPO        | TIPO   | OBRIGATÓRIO   | EXEMPLO                                  | VALORES ACEITOS            |
| ------------ | ------ | ------------- | ---------------------------------------- | -------------------------- |
| nome         | string | Não           | Carlos Henrique Leitão                   |                            |
| email        | string | Não           | carlos.henrique.leitao@aluno.ifce.edu.br | somente @aluno.ifce.edu.br |
| senha        | string | Não           | 12345678                                 | De 8 até - caracteres      |
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
