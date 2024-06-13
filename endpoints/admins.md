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
| senha        | string | Sim           | 12345678                       | De 8 até 10 caracteres         |

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
  "status":"ok",
  "statusCode":200,
  "body":[
    {
      "_id":"66450d5d4fe9b14e91d48d73",
      "nome":"Fábio José",
      "email":"fabio.jose@ifce.edu.br",
      "dataRegistro":"2024-05-15T19:30:37.000Z"
    },
    {
      "_id":"66576e1a1f6b6f51ae7e7cdb",
      "nome":"thales da silva santos",
      "email":"thales.silva.santos@ifce.edu.br",
      "dataRegistro":"2024-05-29T18:04:10.000Z"
    }
  ]
}

```

---

**PATCH** `/administradores/resetar-senha/:id`

- **Descrição**: Endpoint responsável por resetar a senha de qualquer usuário (administrador, tutor ou aluno).
- **Autenticação**: Necessário

**Response**:

```
{
  "status": "ok",
  "statusCode": 200,
  "body": "Senha resetada para 12345678"
}
```

---

**PATCH** `/administradores/:{idAdmin}`

- **Descrição**: Endpoint responsável por atualizar os dados de um administrador.
- **Autenticação**: Necessário.

**Query**:

| CAMPO        | TIPO   | OBRIGATÓRIO   | EXEMPLO                        | VALORES ACEITOS                |
| ------------ | ------ | ------------- | ------------------------------ | ------------------------------ |
| nome         | string | Não           | Neymar jr                      |                                |
| email        | string | Não           | neymar.jr.00@aluno.ifce.edu.br | somente @ifce.edu.br           |
| senha        | string | Não           | 12345678                       | De 8 até 10 caracteres         |

**Response**:

```
  {
    "status": "ok",
    "statusCode": 200,
    "body": "Um administrador foi alterado com sucesso !"
  }

```

---

**GET** `/administradores/estatisticas?dataInicial={}&dataFinal={}`

- **Descrição**: Endpoint responsável por mostrar as estatísticas em um determinado período.
- **Autenticação**: Necessário.
- **Observação**: Os campos dataInicial e dataFinal devem seguir o formato que é apresentado na tabela abaixo, no caso da dataFinal, o começo do dia se dá as 03:00 do fuso do GMT 0, que é 00:00 no GMT -3 (horário de brasília) o fim do dia se dá as 02:59 da manhã do GMT 0, que é exatamente as 23:59 no GTM -3 (horário de brasília)

**Query**:

| CAMPO             | TIPO    | OBRIGATÓRIO   | EXEMPLO                        |
| ----------------- | ------- | ------------- | ------------------------------ |
| dataInicial       | Data    | Sim           | 2024-05-01T03:00:00.000Z       |
| dataFinal         | Data    | Sim           | 2024-06-01T02:59:00.000Z       |


**Response**:

```
{
  "status":"ok",
  "statusCode":200,
  "body":{
    "estatisticas":[
      {
        "nome":"Henrique Leitão",
        "tutoriasRealizadas":5,
        "tutoriaPendente":0,
        "idTutor":"664de15776e2a0d4310f31e9",
        "quantidadeAlunos":2
      },
      {
        "nome":"Mario Sérgio",
        "tutoriasRealizadas":4,
        "tutoriaPendente":1,
        "idTutor":"664e2e9b005e042583f69f49",
        "quantidadeAlunos":3
      }
    ],
    "novosAlunos":6,
    "novosTutores":4,
    "totalDeTutoriasRealizadasNoPeriodo":10
  }
}

```

---
