const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3005;

// Middleware para parsear JSON e dados de formulários
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'banco123',
  database: 'siteaokiarts'
});

// Conexão ao banco de dados MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conectado ao MySQL');
  
  // Criação da tabela 'usuarios' (se ainda não existir)
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      senha VARCHAR(255) NOT NULL
    )
  `;
  
  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Erro ao criar tabela usuarios:', err);
    } else {
      console.log('Tabela usuarios criada (se ainda não existia)');
    }
  });
});

// Servir arquivos estáticos da pasta 'views/theme'
app.use(express.static(path.join(__dirname, 'views/theme')));

// Rota para enviar 'index.html' na raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/theme', 'index.html'));
});

// Rota para processar o formulário de cadastro
app.post('/cadastro', (req, res) => {
  const { nome, email, password } = req.body;
  console.log('Dados recebidos:', nome, email, password);

  // Insere os dados na tabela 'usuarios'
  const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
  db.query(sql, [nome, email, password], (err, result) => {
    if (err) {
      console.log('Erro ao inserir usuário:', err);
      return res.status(500).send('Erro ao realizar o cadastro.');
    }
    console.log('Usuário cadastrado com sucesso');
    res.redirect('/signinsuccess.html'); // Redireciona para a página de sucesso de cadastro
  });
});

// Rota para processar o formulário de login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Email:', email);
  console.log('Senha:', password);

  // Consulta SQL para verificar as credenciais
  const sql = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Erro ao executar a consulta:', err);
      return res.status(500).send('Erro ao realizar o login.');
    }
    
    if (results.length > 0) {
      // Usuário encontrado, redireciona para a página inicial
      res.redirect('/index.html');
    } else {
      // Credenciais inválidas, redireciona para a página de login
      res.redirect('/login.html');
    }
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
