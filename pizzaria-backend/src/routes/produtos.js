const express = require("express");
const router = express.Router();
const produtosController = require("../controllers/produtosController");

// GET todos produtos (público, mas aqui protegido pelo middleware do app.js)
router.get("/", produtosController.listarProdutos);

// POST adicionar produto (somente admin logado)
router.post("/", produtosController.adicionarProduto);

// DELETE produto por id
router.delete("/:id", produtosController.deletarProduto);

module.exports = router;
