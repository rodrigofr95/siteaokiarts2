const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const { pool, connectDB } = require('./config/db');
const app = express();

// Conecta ao banco de dados
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views', 'theme')));

// Configuração da sessão
app.use(session({
  secret: 'your_secret_key', // Substitua por uma chave secreta segura
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Configure como true se estiver usando HTTPS
}));

// Rotas para servir páginas estáticas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'theme', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'theme', 'about.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'theme', 'login.html'));
});

// Rota de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '1234') {
    req.session.user = { username };
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Middleware de autenticação
const authenticateUser = (req, res, next) => {
  if (req.session.user && req.session.user.username === 'admin') {
    next(); // Permitir acesso às rotas protegidas
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Rota protegida
app.get('/protected-route', authenticateUser, (req, res) => {
  res.status(200).json({ message: 'Access granted to protected route' });
});

// Rotas adicionais para páginas
app.get('/alerts', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'theme', 'alerts.html'));
});

app.get('/buttons', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'theme', 'buttons.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'theme', 'cart.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'theme', 'checkout.html'));
});

app.get('/confirmation', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'theme', 'confirmation.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'theme', 'contact.html'));
});

app.get('/contaexcluida', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'theme', 'contaexcluida.html'));
});

app.get('/empty-cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'theme', 'empty-cart.html'));
});

app.get('/excluir', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'theme', 'excluir.html'));
});

app.get('/forget-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'theme', 'forget-password.html'));
});

app.get('/shop', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'theme', 'shop.html'));
});

app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'theme', 'signin.html'));
});

app.get('/signinsuccess', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'theme', 'signinsuccess.html'));
});

// Rota para obter todos os usuários
app.get('/users', (req, res) => {
  pool.query('SELECT * FROM Users', (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(results);
  });
});

// Rota para criar um novo usuário
app.post('/users', (req, res) => {
  const { username, email, password } = req.body;
  pool.query(
    'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(201).json({ id: results.insertId, username, email });
    }
  );
});

// Rota para tratar 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', 'theme', '404.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
