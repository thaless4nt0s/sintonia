#### Registrar Aluno

**POST** `/registrar/alunos`

- **Descrição**: Endpoint responsável por registrar um aluno.
- **Autenticação**: Não é necessário.

**Query**:

| CAMPO        | TIPO   | OBRIGATÓRIO   | EXEMPLO                        | VALORES ACEITOS                |
| ------------ | ------ | ------------- | ------------------------------ | ------------------------------ |
| nome         | string | Sim           | Neymar jr                      |                                |
| email        | string | Sim           | neymar.jr.00@aluno.ifce.edu.br | somente @aluno.ifce.edu.br     |
| matricula    | string | Sim           | 20241045050000                 |                                |
| senha        | string | Sim           | 12345678                       | De 8 até - caracteres          |

**Response**:

```
  {
    "status": "ok",
    "statusCode": 200,
    "body": "Um aluno foi adicionado com sucesso !"
  }

```

---
