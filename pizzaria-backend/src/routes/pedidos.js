// src/routes/pedidos.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const verifyToken = require("../middlewares/verifyToken");

// Rota para repetir pedido
router.post("/", verifyToken, async (req, res) => {
  const { itens } = req.body;
  const userId = req.userId;

  if (!Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ message: "Itens inválidos." });
  }

  try {
    const novoPedido = await prisma.pedido.create({
      data: {
        itens: JSON.stringify(itens), // ← aqui o ajuste
        usuarioId: userId,
        data: new Date(),
      },
    });

    res.status(201).json(novoPedido);
  } catch (error) {
    console.error("Erro ao repetir pedido:", error);
    res.status(500).json({ message: "Erro interno ao criar pedido." });
  }
});

module.exports = router;
