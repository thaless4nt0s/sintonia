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
