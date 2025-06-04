const app = require('../app');
const http = require('http');
const debug = require('debug')('pizzaria-backend:server');

const port = process.env.PORT || 3002;
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});