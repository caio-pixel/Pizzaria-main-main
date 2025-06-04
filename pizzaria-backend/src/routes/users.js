const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'suachavesecreta123';

// Função auxiliar para extrair email do token
function getEmailFromToken(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.email; // supondo que o token tenha o email no payload
  } catch (error) {
    return null;
  }
}

// Rota POST para criar usuário
router.post('/', async (req, res) => {
  const { nome, email, senha, telefone, endereco } = req.body;

  if (!nome || !email || !senha || !telefone || !endereco) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  try {
    const usuarioExistente = await prisma.user.findUnique({ where: { email } });
    if (usuarioExistente) {
      return res.status(409).json({ erro: 'Email já cadastrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novoUsuario = await prisma.user.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        telefone,
        endereco,
      },
    });

    const token = jwt.sign({ email, nome }, JWT_SECRET, { expiresIn: '1h' });

    console.log('Usuário cadastrado:', novoUsuario);
    return res.status(201).json({
      mensagem: 'Usuário criado com sucesso!',
      token,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
    });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    return res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// Rota GET para buscar dados do usuário
router.get('/', async (req, res) => {
  const email = getEmailFromToken(req);
  if (!email) {
    return res.status(401).json({ erro: 'Não autorizado' });
  }

  try {
    const usuario = await prisma.user.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    return res.json({
      nome: usuario.nome,
      balance: "R$ 1.000,00" // Aqui você pode mudar para um campo real no banco se quiser
    });
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// Rota PUT para atualizar dados do usuário
router.put('/', async (req, res) => {
  const email = getEmailFromToken(req);
  if (!email) {
    return res.status(401).json({ erro: 'Não autorizado' });
  }

  const { nome, senha } = req.body;
  if (!nome && !senha) {
    return res.status(400).json({ erro: 'Nada para atualizar' });
  }

  try {
    const dadosAtualizados = {};
    if (nome) dadosAtualizados.nome = nome;
    if (senha) {
      const salt = await bcrypt.genSalt(10);
      dadosAtualizados.senha = await bcrypt.hash(senha, salt);
    }

    const usuarioAtualizado = await prisma.user.update({
      where: { email },
      data: dadosAtualizados,
    });

    return res.json({ nome: usuarioAtualizado.nome });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// Rota DELETE para deletar usuário
router.delete('/', async (req, res) => {
  const email = getEmailFromToken(req);
  if (!email) {
    return res.status(401).json({ erro: 'Não autorizado' });
  }

  try {
    await prisma.user.delete({ where: { email } });
    return res.json({ mensagem: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

module.exports = router;
