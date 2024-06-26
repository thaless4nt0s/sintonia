#### Rota de Tutores

**PATCH** `/tutores/:idTutor`

- **Descrição**: Endpoint responsável por alterar os dados de um tutor.
- **Autenticação**: Necessário.

**Query**:

| CAMPO        | TIPO   | OBRIGATÓRIO   | EXEMPLO                                  | VALORES ACEITOS            |
| ------------ | ------ | ------------- | ---------------------------------------- | -------------------------- |
| nome         | string | Não           | Carlos Henrique Leitão                   |                            |
| email        | string | Não           | carlos.henrique.leitao@aluno.ifce.edu.br | somente @aluno.ifce.edu.br |
| senha        | string | Não           | 12345678                                 | De 8 até 10 caracteres     |
| matricula    | string | Não           | 20161011060000                           |                            |
| semestre     | number | Não           | 1                                        | DE 1 até -                 |
| idDisciplina | array  | Não           | ["664b510c553bc83206f93345"]             | DE 0 até 3 itens           |

**Response**:

```
{
  "status": "ok",
  "statusCode": 200,
  "body": "Tutor alterado com sucesso !"
}
```

---

**DELETE** `/tutores/:idTutor`

- **Descrição**: Endpoint responsável por remover um tutor.
- **Autenticação**: Necessário

**Response**:

```
{
  "status": "ok",
  "statusCode": 200,
  "body": "Tutor removido com sucesso !"
}
```

---

**GET** `/tutores?alfabetoCrescente={}&mediaDecrescente={}`

- **Descrição**: Endpoint responsável por mostrar todos os tutores.
- **Autenticação**: Necessário

**QUERY**:

| CAMPO             | TIPO    | OBRIGATÓRIO   | EXEMPLO                        |
| ----------------- | ------- | ------------- | ------------------------------ |
| alfabetoCrescente | boolean | Não           | true                           |
| mediaCrescente    | boolean | Não           | true                           |

**Response**:

```
{
  "status":"ok",
  "statusCode":200,
  "body":[
    {
      "_id":"664e2e9b005e042583f69f49",
      "nome":"Mario Sérgio",
      "semestre":3,
      "email": "mario.sergio.00@aluno.ifce.edu.br",
      "matricula": "20201045050490",
      "disciplinas":[
        {
          "nome":"LIBRAS"
        },
        {
          "nome":"Lógica para computação"
        },
        {
          "nome":"Cálculo 1"
        }
      ],
      "emTutoria":"não",
      "media":"N/A"
    },
    {
      "_id":"664de15776e2a0d4310f31e9",
      "nome":"Henrique Leitão",
      "email": "henrique.leitao.01@aluno.ifce.edu.br",
      "matricula": "20201045050411",
      "semestre":1,
      "disciplinas":[
        {
          "nome":"LIBRAS"
        },
        {
          "nome":"Cálculo 1"
        }
      ],
      "emTutoria":"não",
      "media":2.7
    }
  ]
}
```

---

**GET** `/tutores/:idTutor`

- **Descrição**: Endpoint responsável por mostrar um tutor.
- **Autenticação**: Necessário

**Response**:

```
{
  "status":"ok",
  "statusCode":200,
  "body":{
    "_id":"664de15776e2a0d4310f31e9",
    "nome":"Henrique Leitão",
    "email":"henrique.leitao.01@aluno.ifce.edu.br",
    "matricula": "20201045050411",
    "semestre": 1,
    "emTutoria": "não",
    "disciplinas":[
      {
        "nome":"LIBRAS"
      },
      {
        "nome":"Cálculo 1"
      }
    ],
    "avaliacoes":[
      {
        "comentario":"Ele ensina de maneira diferenciada !",
        "nota":5,
        "dataRegistro": "22/05/2024"
      },
      {
        "comentario":"nada dms",
        "nota":3,
        "dataRegistro": "22/05/2024"
      }
    ],
    "media":4
  }
}
```
