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
