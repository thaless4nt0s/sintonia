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
