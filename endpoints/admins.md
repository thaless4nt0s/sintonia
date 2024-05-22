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
