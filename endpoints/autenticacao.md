#### Rota de Autenticação

**POST** `/autenticacao`

- **Descrição**: Endpoint responsável por realizar a autenticação do usuário.
- **Autenticação**: Não é necessário.

**Query**:

| CAMPO        | TIPO   | OBRIGATÓRIO   | EXEMPLO                        | VALORES ACEITOS                                      |
| ------------ | ------ | ------------- | ------------------------------ | ---------------------------------------------------- |
| email        | string | Sim           | neymar.jr.00@aluno.ifce.edu.br | somente @ifce.edu.br ou @aluno.ifce.edu.br           |
| senha        | string | Sim           | 12345678                       | De 8 até - caracteres                                |

**Response**:

```
{
  "status": "ok",
  "statusCode": 200,
  "body": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7InVzdWFyaW8iOnsiX2lkIjoiNjY0NTBkNWQ0ZmU5YjE0ZTkxZDQ4ZDczIiwibm9tZSI6IkbDoWJpbyBKb3PDqSIsImVtYWlsIjoiZmFiaW8uam9zZUBpZmNlLmVkdS5iciIsImRhdGFSZWdpc3RybyI6IjIwMjQtMDUtMTVUMTk6MzA6MzcuMDAwWiIsIl9fdiI6MH0sInRpcG8iOiJhZG1pbmlzdHJhZG9yIn0sImlhdCI6MTcxNTk0NzgyNSwiZXhwIjoxNzE2NTUyNjI1fQ.2Ajb2fnuG-ntKDGWjuOnRAsvFNGTezOhKNaTxQBsqJw"
}
```

---
