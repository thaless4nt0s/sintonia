# Rotas

#### Error
- **URL**: Qualquer endpoint inválido.
- **Descrição**: Sempre que um endpoint não é reconhecido esse endpoint é chamado.
- **Autenticação**: Não é necessário.

**Response**:
```
{
  "status": "error",
  "statusCode": 404,
  "body": "Rota inexistente."
}
```
