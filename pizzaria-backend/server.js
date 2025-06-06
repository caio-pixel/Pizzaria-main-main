require('dotenv').config({ path: '.env.backend' });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;
app.use(cors());
app.use(express.json());

// Middlewares globais
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Rotas
const SECRET = "segredo_supersecreto";
const usersRoutes = require('./src/routes/users');
const authenticationRouter = require('./src/routes/authentication');
const produtosRouter = require("./src/routes/produtos");
const routes = require('./src/routes/routes');
const pedidosRoutes = require("./src/routes/pedidos");

app.use(express.json());
app.use("/produtos", require("./src/routes/produtos"));
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

// Usuários fixos só para exemplo (você pode usar banco)
const usuarios = [
  { id: 1, email: "admin@exemplo.com", senha: "1234" },
];

// Login - rota pública
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

// Produtos - exemplo simples armazenados em memória
let produtos = [
  { id: 1, nome: "Pizza Salgada", preco: "R$ 7,00", descricao: "Pizza sabor salgado", imagem: "urlimagem" },
];

// Rotas de produtos
const produtosRouter = require("./routes/produtos");
app.use("/api/produtos", autenticarJWT, produtosRouter);


module.exports = app;
