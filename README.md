# Chapter IV - Desafio 01: Testes Unitários :rocket: :purple_heart:

## :dart: Objetivo

- Fazer testes unitários

## :white_check_mark: Regras de Negócios

## Módulo de users

#### AuthenticateUser

- [x] should be able to create session
- [x] should not be able to create session for non-existent email
- [x] should not be able to create sessions for users with an incorrect password

#### CreateUser

- [x] should be able to create a new user
- [x] should not be able to create session to user already exists

#### ShowUserProfile

- [x] should be able to show the users info
- [x] should not be able to show the information if the user does not exist

## Módulo de statements

#### CreateStatement

- [x] should be able to create the deposit and withdraw operations
- [x] should not be able to create withdrawal operations if there are not sufficient funds

#### GetBalance

- [x] should be able to list the deposit and withdraw operations
- [x] should no be able to list the deposit and withdraw operations if user does not exist

#### GetStatementOperation

- [x] should be able to show the operation
- [x] should not be able to show the operation if a user does not exist

## :computer: Instalação

```bash
# Clone este repositório
$ git clone https://github.com/vladimiremi/IgniteNode-ChapterIV-Desafio01

# Entre na pasta
$ cd IgniteNode-ChapterIV-Desafio01

# Instale as dependências
$ yarn ou yarn install

# Crie o container de banco de dados
$ docker-compose up

# Execute os testes da aplicação
$ yarn test
```

## ❗ Deletando o container

Depois que executar os testes é interessante fazer a remoção do container:

```bash
# parar o container
$ docker-compose stop

# deletar o container
$ docker-compose rm
```
