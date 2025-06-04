require('dotenv').config({ path: '.env.backend' });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

// Middlewares globais
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Rotas
const usersRoutes = require('./src/routes/users');
const authenticationRouter = require('./src/routes/authentication');
const produtosRouter = require("./src/routes/produtos");
const routes = require('./src/routes/routes');
const pedidosRoutes = require("./src/routes/pedidos");

app.use('/api/users', usersRoutes);
app.use('/api/authentication', authenticationRouter);
app.use('/api/produtos', produtosRouter);
app.use('/api/pedidos', pedidosRoutes); // ← Agora com JSON funcionando
app.use('/api', routes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

// Verificação de variável de ambiente
console.log('JWT_SECRET:', process.env.JWT_SECRET); // Deve mostrar: suachavesecreta123

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
