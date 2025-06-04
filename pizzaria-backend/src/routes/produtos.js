const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET - Listar produtos
router.get("/", async (req, res) => {
  const produtos = await prisma.produto.findMany();
  res.json(produtos);
});

// POST - Criar produto
router.post("/", async (req, res) => {
  const { nome, preco, imagem, descricao } = req.body;
  const novoProduto = await prisma.produto.create({
    data: { nome, preco: parseFloat(preco), imagem, descricao },
  });
  res.json(novoProduto);
});

// PUT - Editar produto
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, preco, imagem, descricao } = req.body;
  const produtoAtualizado = await prisma.produto.update({
    where: { id: Number(id) },
    data: { nome, preco: parseFloat(preco), imagem, descricao },
  });
  res.json(produtoAtualizado);
});

// DELETE - Deletar produto
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.produto.delete({ where: { id: Number(id) } });
  res.json({ mensagem: "Produto deletado com sucesso" });
});

module.exports = router;
