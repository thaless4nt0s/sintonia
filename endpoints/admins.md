### Rota de Administradores

**DELETE** `/administradores/tutores/:idTutor`

- **Descrição**: Endpoint responsável por remover um tutor via administrador.
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

**DELETE** `/administradores/alunos/:idAluno`

- **Descrição**: Endpoint responsável por remover um aluno via administrador.
- **Autenticação**: Necessário

**Response**:

```
{
  "status": "ok",
  "statusCode": 200,
  "body": "Aluno removido com sucesso !"
}
```

---

**POST** `/administradores`

- **Descrição**: Endpoint responsável por registrar um administrador.
- **Autenticação**: Necessário.

**Query**:

| CAMPO        | TIPO   | OBRIGATÓRIO   | EXEMPLO                        | VALORES ACEITOS                |
| ------------ | ------ | ------------- | ------------------------------ | ------------------------------ |
| nome         | string | Sim           | Neymar jr                      |                                |
| email        | string | Sim           | neymar.jr.00@aluno.ifce.edu.br | somente @ifce.edu.br           |
| senha        | string | Sim           | 12345678                       | De 8 até - caracteres          |

**Response**:

```
  {
    "status": "ok",
    "statusCode": 200,
    "body": "Um administrador foi adicionado com sucesso !"
  }

```

---

**GET** `/administradores`

- **Descrição**: Endpoint responsável por mostrar todos os administradores do sistema.
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
    "body": "Um tutor foi adicionado com sucesso !"
  }

```

---
