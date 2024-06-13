const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

const router = express.Router();

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Verifica se o usuário existe no banco de dados
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    // Verifica se a senha é correta
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    // Se as credenciais estiverem corretas, gera um token JWT
    const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    // Retorna o token como resposta
    res.json({ token });
  } catch (error) {
    // Em caso de erro interno no servidor, retorna um erro 500
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

module.exports = router;
