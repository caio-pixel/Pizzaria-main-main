const express = require('express');
const router = express.Router();

const authController = require('../controllers/authenticationController');
const authMiddleware = require('../middlewares/authMiddleware');
const pedidosRoutes = require('./pedidos'); // seu arquivo de rotas de pedidos

// Login (rota pública)
router.post('/login', authController.login);

// Rota protegida - exemplo simples de teste
router.get('/pedidos', authMiddleware, (req, res) => {
  res.json({ mensagem: `Bem-vindo, usuário ${req.usuario.email}` });
});

// Subrotas para pedidos
router.use('/pedidos', authMiddleware, pedidosRoutes); 
// Aqui o middleware protege todas rotas dentro de /pedidos (você pode mudar a posição se quiser rotas abertas)

// Exporta o router para usar no app principal
module.exports = router;
