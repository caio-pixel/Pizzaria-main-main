let produtos = [
    { id: 1, nome: "Pizza Salgada", preco: "R$ 7,00", descricao: "Pizza sabor salgado", imagem: "urlimagem" },
  ];
  
  let proximoId = 2;
  
  exports.listarProdutos = (req, res) => {
    res.json(produtos);
  };
  
  exports.adicionarProduto = (req, res) => {
    const { nome, preco, descricao, imagem } = req.body;
  
    if (!nome || !preco) {
      return res.status(400).json({ mensagem: "Nome e preço são obrigatórios" });
    }
  
    const novoProduto = {
      id: proximoId++,
      nome,
      preco,
      descricao: descricao || "",
      imagem: imagem || "",
    };
  
    produtos.push(novoProduto);
  
    res.status(201).json(novoProduto);
  };
  
  exports.deletarProduto = (req, res) => {
    const id = parseInt(req.params.id);
    const index = produtos.findIndex((p) => p.id === id);
  
    if (index === -1) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }
  
    produtos.splice(index, 1);
    res.json({ mensagem: "Produto deletado com sucesso" });
  };
  