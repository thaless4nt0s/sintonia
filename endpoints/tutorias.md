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
