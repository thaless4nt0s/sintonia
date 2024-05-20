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
