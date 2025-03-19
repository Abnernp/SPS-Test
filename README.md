# Projeto de Autenticação e Gerenciamento de Usuários

Este projeto é uma API backend simples construída com **Node.js** e **Express**. Ele oferece funcionalidades de login de usuários, autenticação baseada em token JWT, e gerenciamento de usuários, como criação, atualização e exclusão.

## Funcionalidades

- **Login de usuário**: Autenticação via e-mail e senha, com geração de token JWT.
- **Gerenciamento de usuários**:
  - Listagem de usuários.
  - Criação de novos usuários.
  - Atualização de dados de usuários.
  - Exclusão de usuários.
- **Autenticação baseada em JWT**: Protege as rotas com validação de token.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Express**: Framework para construção de APIs.
- **JWT (JSON Web Token)**: Sistema de autenticação baseado em tokens.
- **Cors**: Middleware para permitir requisições entre diferentes origens.
- **Filesystem (fs)**: Manipulação de arquivos para armazenar dados localmente.

## Configuração do Ambiente

### Instalar Dependências

Clone o repositório e instale as dependências do projeto:


git clone https://github.com/Abnernp/SPS-Test.git

- **No terminal terminal**:
- cd test-sps-server
- npm install dotenv
- node server.js
- cd ..
- cd test-sps-client
- npm install
- cd ..
- npm install concurrently --save-dev

### Rodar o Projeto
- npm start

