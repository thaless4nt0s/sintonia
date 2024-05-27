#### Rota de Avaliações

**POST** `/avaliacoes/:idTutoria`

- **Descrição**: Endpoint responsável por adicionar uma avaliação.
- **Autenticação**: Necessário.

**Query**:

| CAMPO        | TIPO   | OBRIGATÓRIO   | EXEMPLO                        | VALORES ACEITOS  |
| ------------ | ------ | ------------- | ------------------------------ | ---------------- |
| comentario   | string | Sim           | Cálculo 2                      |                  |
| nota         | number | Sim           | 3                              | de 1 a 5         |

**Response**:

```
{
  "status": "ok",
  "statusCode": 200,
  "body": "Avaliação realizada com sucesso !"
}
```

---
