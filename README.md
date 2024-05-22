# sintonia

## O que é o sintonia ?

consiste em um projeto para o apoio da tutoria facilitando a implantação da metodologia de aprendizagem colaborativa e contribuindo para a permanência e êxito, minimizando a evasão escolar no curso de ciência da computação

## Instalação

1. Baixando o projeto:

```
git clone https://github.com/thaless4nt0s/sintonia.git
```

2. Instalando as dependências:

```
cd ./sintonia
pnpm install
```

3. Executando a aplicação:

```
cd ./sintonia
pnpm dev
```
---

# Documentações

| Rotas                                         |
| --------------------------------------------- |
| [Index](endpoints/index.md)                   |
| [Error](endpoints/error.md)                   |
| [Registrar](endpoints/registrar.md)           |
| [Autenticar](endpoints/autenticacao.md)       |
| [Disciplinas](endpoints/disciplinas.md)       |
| [Alunos](endpoints/alunos.md)                 |
| [Tutores](endpoints/tutores.md)               |
| [Administradores](endpoints/admins.md)        |

---

# ENDPOINTS

<li>O header da requisição deve seguir o seguinte formato:</li>

```
{
  "Accept": "application/json",
  "Content-Type": "application/json"
}
```

<li>As requisições que exigem autenticação devem seguir o seguinte formato:</li>

```
{
  "x-access-token": "{token}"
}
```

---
