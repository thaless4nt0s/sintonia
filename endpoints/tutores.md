#### Rota de Tutores

**PATCH** `/tutores/:idTutor`

- **Descrição**: Endpoint responsável por alterar os dados de um tutor.
- **Autenticação**: Necessário.

**Query**:

| CAMPO        | TIPO   | OBRIGATÓRIO   | EXEMPLO                                  | VALORES ACEITOS            |
| ------------ | ------ | ------------- | ---------------------------------------- | -------------------------- |
| nome         | string | Não           | Carlos Henrique Leitão                   |                            |
| email        | string | Não           | carlos.henrique.leitao@aluno.ifce.edu.br | somente @aluno.ifce.edu.br |
| senha        | string | Não           | 12345678                                 | De 8 até - caracteres      |
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

**GET** `/tutores?alfabetoCrescente={}`

- **Descrição**: Endpoint responsável por mostrar todos os tutores.
- **Autenticação**: Necessário

**QUERY**:

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
      "_id": "664e2e9b005e042583f69f49",
      "nome": "Mario Sérgio",
      "semestre": 3,
      "emTutoria": "não",
      "disciplinas": [
        {
            "nome": "Lógica para computação"
        },
        {
            "nome": "Cálculo 1"
        },
        {
            "nome": "LIBRAS"
        }
      ]
    },
    {
      "_id": "664de15776e2a0d4310f31e9",
      "nome": "Henrique Leitão",
      "semestre": 1,
      "emTutoria": "sim",
      "disciplinas": [
        {
            "nome": "Cálculo 1"
        },
        {
            "nome": "LIBRAS"
        }
      ]
    }
  ]
}
```

---
