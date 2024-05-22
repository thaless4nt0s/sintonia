#### Rota de Disciplinas

**POST** `/disciplinas`

- **Descrição**: Endpoint responsável por adicionar uma disciplina.
- **Autenticação**: Necessário.

**Query**:

| CAMPO        | TIPO   | OBRIGATÓRIO   | EXEMPLO                        |
| ------------ | ------ | ------------- | ------------------------------ |
| nome         | string | Sim           | Cálculo 2                      |

**Response**:

```
{
  "status": "ok",
  "statusCode": 200,
  "body": "Uma disciplina foi adicionada com sucesso !"
}
```

---

**PUT** `/disciplinas/:idDisciplina`

- **Descrição**: Endpoint responsável por atualizar uma disciplina.
- **Autenticação**: Necessário.

**Query**:

| CAMPO        | TIPO   | OBRIGATÓRIO   | EXEMPLO                        |
| ------------ | ------ | ------------- | ------------------------------ |
| nome         | string | Sim           | Cálculo 2                      |

**Response**:

```
{
  "status": "ok",
  "statusCode": 200,
  "body": "Uma disciplina foi atualizada com sucesso !"
}
```

---

**DELETE** `/disciplinas/:idDisciplina`

- **Descrição**: Endpoint responsável por remover uma disciplina.
- **Autenticação**: Necessário.

**Response**:

```
{
  "status": "ok",
  "statusCode": 200,
  "body": "Uma disciplina foi excluida com sucesso !"
}
```

---

**GET** `/disciplinas?alfabetoCrescente={}`

- **Descrição**: Endpoint responsável por mostrar todas as disciplinas.
- **Autenticação**: Necessário.

**Query**:

| CAMPO             | TIPO    | OBRIGATÓRIO   | EXEMPLO                        |
| ----------------- | ------- | ------------- | ------------------------------ |
| alfabetoCrescente | boolean | Não           | true                           |

**Response**:

```
{
  "status": "ok",
  "statusCode": 200,
  "body": [
    {
      "_id": "664b9a18ff5d958dbc432397",
      "nome": "Cálculo 1"
    },
    {
      "_id": "664b9a21ff5d958dbc432399",
      "nome": "Física 2"
    },
    {
      "_id": "664b510c553bc83206f93345",
      "nome": "LIBRAS"
    }
  ]
}
```

---

**GET** `/disciplinas/:idDisciplina`

- **Descrição**: Endpoint responsável por mostrar uma disciplina.
- **Autenticação**: Necessário.

**Response**:

```
{
  "status": "ok",
  "statusCode": 200,
  "body": {
    "_id": "664b510c553bc83206f93345",
    "nome": "LIBRAS"
  }
}

```

---
