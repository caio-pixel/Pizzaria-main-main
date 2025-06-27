require('dotenv').config({ path: '.env.backend' });
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3002;
const SECRET = "segredo_supersecreto";

// Middlewares globais
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Rotas importadas
const usersRoutes = require('./src/routes/users');
const authenticationRouter = require('./src/routes/authentication');
const produtosRouter = require("./src/routes/produtos");
const pedidosRoutes = require("./src/routes/pedidos");
const routes = require('./src/routes/routes');

// Middleware de autenticação
function autenticarJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ mensagem: "Token inválido" });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ mensagem: "Token não fornecido" });
  }
}

// Rotas
app.use('/api/users', usersRoutes);
app.use('/api/authentication', authenticationRouter);
app.use('/api/produtos', autenticarJWT, produtosRouter);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api', routes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

// Login de exemplo (sem banco de dados)
const usuarios = [
  { id: 1, email: "admin@exemplo.com", senha: "1234" },
];

app.post("/api/authentication/login", (req, res) => {
  const { email, senha } = req.body;

  const usuario = usuarios.find((u) => u.email === email && u.senha === senha);

  if (usuario) {
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ mensagem: "Email ou senha incorretos" });
  }
});

// Verificação de variável de ambiente
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
