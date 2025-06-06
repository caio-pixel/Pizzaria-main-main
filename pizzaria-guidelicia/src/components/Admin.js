import React, { useState, useEffect } from "react";

const Admin = () => {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setErro("Você precisa estar logado para acessar esta página.");
      return;
    }
    fetch("http://localhost:3002/api/produtos", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar produtos");
        return res.json();
      })
      .then(setProdutos)
      .catch((e) => setErro(e.message));
  }, [token]);

  const adicionarProduto = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!nome || !preco) {
      setErro("Nome e preço são obrigatórios.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3002/api/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, preco, descricao, imagem }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.mensagem || "Erro ao adicionar produto");
      }

      const novoProduto = await res.json();
      setProdutos((prev) => [...prev, novoProduto]);
      setSucesso("Produto adicionado com sucesso!");
      setNome("");
      setPreco("");
      setDescricao("");
      setImagem("");
    } catch (error) {
      setErro(error.message);
    }
  };

  const deletarProduto = async (id) => {
    try {
      const res = await fetch(`http://localhost:3002/api/produtos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao deletar produto");

      setProdutos(produtos.filter((p) => p.id !== id));
    } catch (error) {
      setErro(error.message);
    }
  };

  if (!token) {
    return <p style={{ padding: 20 }}>Você precisa fazer login para acessar o Admin.</p>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", padding: 20 }}>
      <h2>Painel Administrativo</h2>

      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}

      <form onSubmit={adicionarProduto} style={{ marginBottom: 20 }}>
        <div>
          <label>Nome:</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
          />
        </div>
        <div>
          <label>Preço:</label>
          <input
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
          />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
          />
        </div>
        <div>
          <label>Imagem (URL):</label>
          <input
            value={imagem}
            onChange={(e) => setImagem(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
          />
        </div>
        <button type="submit" style={{ padding: 10, width: "100%" }}>
          Adicionar Produto
        </button>
      </form>

      <h3>Produtos cadastrados</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {produtos.map((p) => (
          <li
            key={p.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
              borderBottom: "1px solid #ddd",
              paddingBottom: 8,
            }}
          >
            <div>
              <strong>{p.nome}</strong> - {p.preco}
              <br />
              <small>{p.descricao}</small>
            </div>
            <button
              onClick={() => deletarProduto(p.id)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                borderRadius: 4,
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
