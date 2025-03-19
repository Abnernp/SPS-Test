/**
* Função para gerenciar autenticação e manipulação de usuários no servidor.
*
* Esta função configura o servidor Express para realizar as operações de login, cadastro, atualização e remoção de usuários.
* 
* Além disso, utiliza JWT para autenticação, validando os tokens enviados nas requisições para acessar as rotas protegidas.
* 
* O servidor também lê e grava os dados dos usuários em um arquivo JSON para persistência.
* 
* O servidor também implementa CORS para permitir a comunicação com o frontend, além de gerenciar erros de autenticação e credenciais. 
*/

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  
  allowedHeaders: ["Content-Type", "Authorization"],  
  credentials: true,  
  preflightContinue: false,  
  optionsSuccessStatus: 200, 
};

app.use(cors(corsOptions));

app.use(express.json());

const PORT = process.env.PORT || 5001;
const SECRET_KEY = process.env.SECRET_KEY || "secret_key";
// console.log(SECRET_KEY);

const usersFilePath = path.join(__dirname, "data", "users.json");

const readUsers = () => {
  const data = fs.readFileSync(usersFilePath);
  return JSON.parse(data);
};

const writeUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = user;
    next();
  });
};

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const token = jwt.sign({ email: user.email, type: user.type }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

app.get("/users", authenticateToken, (req, res) => {
  const users = readUsers();
  res.json(users);
});

app.post("/users", authenticateToken, (req, res) => {
  const { name, email, type, password } = req.body;
  const users = readUsers();

  if (users.some((user) => user.email === email)) {
    return res.status(400).json({ error: "E-mail já cadastrado" });
  }

  users.push({ name, email, type, password });
  writeUsers(users);
  res.status(201).json({ message: "Usuário cadastrado com sucesso" });
});

app.delete("/users/:email", authenticateToken, (req, res) => {
  let users = readUsers();
  users = users.filter((user) => user.email !== req.params.email);
  writeUsers(users);
  res.json({ message: "Usuário removido com sucesso" });
});

app.put("/users/:email", authenticateToken, (req, res) => {
  const { name, type, password } = req.body;
  const users = readUsers();
  const user = users.find((user) => user.email === req.params.email);

  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

  user.name = name || user.name;
  user.type = type || user.type;
  user.password = password || user.password;

  writeUsers(users);
  res.json({ message: "Usuário atualizado com sucesso" });
});

app.listen(PORT, () => {
  // console.log(`Servidor rodando na porta ${PORT}`);
});
