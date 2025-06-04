const prisma = require('../../prisma/client'); // ajuste conforme seu client Prisma

exports.repetirPedido = async (req, res) => {
  const userId = req.user.id;
  const { itens } = req.body;

  if (!Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ error: "Itens inválidos" });
  }

  try {
    const novoPedido = await prisma.pedido.create({
      data: {
        usuarioId: userId,
        itens: itens.join(", "), // salva como string
      },
    });

    res.status(201).json({ message: "Pedido repetido com sucesso", pedido: novoPedido });
  } catch (error) {
    console.error("Erro ao repetir pedido:", error);
    res.status(500).json({ error: "Erro ao repetir pedido" });
  }
};
