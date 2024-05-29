#### Rota de Tutorias

**POST** `/tutorias/:idAluno/:idTutor`

- **Descrição**: Endpoint responsável por criar uma tutoria.
- **Autenticação**: Necessário.

**Query**:

| CAMPO        | TIPO   | OBRIGATÓRIO   | EXEMPLO                        |
| ------------ | ------ | ------------- | ------------------------------ |
| titulo       | string | Sim           | Cálculo de integrais           |

**Response**:

```
{
  "status": "ok",
  "statusCode": 200,
  "body": "Tutoria inicializada com sucesso !"
}
```

---

**PATCH** `/tutorias/:idTutoria/:idAluno/:idTutor`

- **Descrição**: Endpoint responsável por encerrar uma tutoria.
- **Autenticação**: Necessário.

**Query**:

| CAMPO        | TIPO   | OBRIGATÓRIO   | EXEMPLO                          |
| ------------ | ------ | ------------- | -------------------------------- |
| resumo       | string | Sim           | Vimos como calcular uma integral |

**Response**:

```
{
  "status": "ok",
  "statusCode": 200,
  "body": "Tutoria encerrada com sucesso !"
}
```

---

**GET** `/tutorias/historico/tutor/:idTutoria`

- **Descrição**: Endpoint responsável por mostrar o histórico de tutorias de um tutor.
- **Autenticação**: Necessário.

**Response**:

```
{
  "status":"ok",
  "statusCode":200,
  "body":[
    {
      "_id":"664f4d5f2bd9148dd930afd7",
      "titulo":"duvidas sobre integral",
      "dataRegistro":"2024-05-23T14:06:23.000Z",
      "resumo":"Nesta tutoria foi mostrado ao aluno como é possivel  utilizar os calculos de integrais no dia a dia",
      "dataEncerramento":"2024-05-26T19:17:33.000Z",
      "tutor":{
        "nome":"Henrique Leitão"
      },
      "aluno":{
        "nome":"Neymar jr"
      },
      "disciplina":{
        "nome":"LIBRAS"
      },
      "emTutoria":"Finalizada"
    },
    {
      "_id":"664f95d60dbc7dac9435a8f5",
      "titulo":"Como fazer a letra A ?",
      "dataRegistro":"2024-05-23T19:15:34.000Z",
      "resumo":"Nesta tutoria ensinei como fazer a letra A em LIBRAS",
      "dataEncerramento":"2024-05-26T19:17:33.000Z",
      "tutor":{
        "nome":"Henrique Leitão"
      },
      "aluno":{
        "nome":"Neymar jr"
      },
      "disciplina":{
        "nome":"Cálculo 1"
      },
      "emTutoria":"Finalizada"
    }
  ]
}
```

---

**GET** `/tutorias/historico/aluno/:idAluno`

- **Descrição**: Endpoint responsável por mostrar o histórico de tutorias de um aluno.
- **Autenticação**: Necessário.

**Response**:

```
{
  "status":"ok",
  "statusCode":200,
  "body":[
    {
      "_id":"6656134ea58b8b0c7850f6a0",
      "titulo":"Como fazer a letra d ?",
      "dataRegistro":"28/05/2024",
      "resumo":"Fizemos muita coisa nessa tutoria !",
      "tutor":{
        "nome":"Mario Sérgio"
      },
      "aluno":{
        "nome":"Neymar jr"
      },
      "disciplina":{
        "nome":"Cálculo 1"
      },
      "avaliacoes":{
        "comentario":"Ele ensina muito bem !",
        "nota":4,
        "dataRegistro":"28/05/2024"
      },
      "emTutoria":"Finalizada",
      "dataEncerramento":"28/05/2024"
    },
    {
      "_id":"664f4d5f2bd9148dd930afd7",
      "titulo":"duvidas sobre integral",
      "dataRegistro":"23/05/2024",
      "resumo":"Nesta tutoria foi mostrado ao aluno como é possivel  utilizar os calculos de integrais no dia a dia",
      "tutor":{
        "nome":"Henrique Leitão"
      },
      "aluno":{
        "nome":"Neymar jr"
      },
      "disciplina":{
        "nome":"LIBRAS"
      },
      "avaliacoes":{
        "comentario":"Ele ensina de maneira diferenciada !",
        "nota":5,
        "dataRegistro":"23/05/2024"
      },
      "emTutoria":"Finalizada",
      "dataEncerramento":"26/05/2024"
    }
  ]
}
```

---
