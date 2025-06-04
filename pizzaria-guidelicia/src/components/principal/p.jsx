import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Account.css";

const Account = () => {
  const navigate = useNavigate();
  const historicoRef = useRef(null);

  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [pontos, setPontos] = useState(0);
  const [pedidos, setPedidos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newNome, setNewNome] = useState("");
  const [newSenha, setNewSenha] = useState("");
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedNome = localStorage.getItem("nome");
    const token = localStorage.getItem("token");

    if (!storedEmail || !token) {
      setError("Usuário não autenticado");
      navigate("/entrar");
      return;
    }

    setEmail(storedEmail);
    setNome(storedNome);

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/users", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Erro ao buscar dados do usuário");

        const data = await response.json();
        setNome(data.nome);
        setPontos(data.pontos || 120);
        setPedidos(data.pedidos || []);
      } catch (error) {
        setError("Erro ao buscar informações da conta.");
      }
    };

    const fetchProdutos = async () => {
      try {
        const response = await axios.get("http://localhost:3002/api/produtos");
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchUserData();
    fetchProdutos();
  }, [navigate]);

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3002/api/users", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Erro ao deletar conta");

      localStorage.clear();
      navigate("/");
    } catch (error) {
      alert("Erro ao deletar conta: " + error.message);
    }
  };

  const handleEditAccount = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3002/api/users", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: newNome || nome,
          senha: newSenha,
        }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar informações.");

      const updatedUser = await response.json();
      setNome(updatedUser.nome);
      setShowEditModal(false);
      alert("Informações atualizadas com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar informações: " + error.message);
    }
  };

  const handleRepetirPedido = async () => {
    const token = localStorage.getItem("token");
    const ultimoPedido = pedidos[0];

    if (!ultimoPedido || !ultimoPedido.itens || ultimoPedido.itens.length === 0) {
      alert("Nenhum pedido anterior para repetir.");
      return;
    }

    const nomesItensPedido = ultimoPedido.itens.map((item) =>
      typeof item === "string" ? item : item.nome
    );

    const itensComPreco = nomesItensPedido.map((nome) => {
      const produto = produtos.find((p) => p.nome === nome);
      return produto
        ? { nome: produto.nome, preco: produto.preco }
        : { nome, preco: "R$ 0,00" };
    });

    try {
      const response = await fetch("http://localhost:3002/api/pedidos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itens: nomesItensPedido }),
      });

      if (!response.ok) throw new Error("Erro ao repetir pedido");

      alert("Pedido repetido com sucesso!");

      navigate("/finalizar", {
        state: {
          carrinho: itensComPreco,
        },
      });
    } catch (error) {
      alert("Erro ao repetir pedido: " + error.message);
    }
  };

  const toggleActions = () => {
    setShowActions((prev) => !prev);
  };

  const scrollToHistorico = () => {
    historicoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="account-container">
      <div className="account-header">
        <div className="topImage">
          <h2>Área do Cliente - Bem-vindo(a), {nome}!</h2>
          <button className="show-actions-btn" onClick={toggleActions}>≡</button>
        </div>

        {error ? (
          <p>{error}</p>
        ) : (
          <div className="account-info">
            <div className="account-balance">
              <h3>Seus Pontos de Fidelidade:</h3>
              <p className="balance-amount">{pontos} pontos</p>
              <button className="toggle-button">Usar Pontos</button>
            </div>
            <div className="pix-info">
              <h3>Último Pedido:</h3>
              <p>
                {pedidos[0]?.data} -{" "}
                {Array.isArray(pedidos[0]?.itens)
                  ? pedidos[0].itens.join(", ")
                  : "Nenhum item"}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className={`action-buttons-container ${showActions ? "show" : ""}`}>
        <h3>Menu Rápido</h3>
        <div className="action-buttons">
          <button className="action-button" onClick={() => navigate("/cardapio")}>Ver Cardápio</button>
          <button className="action-button" onClick={() => navigate("/cardapio")}>Pedir Agora</button>
          <button className="action-button" onClick={handleRepetirPedido}>Repetir Último Pedido</button>
          <button className="action-button" onClick={scrollToHistorico}>Histórico de Pedidos</button>
        </div>
        <button onClick={handleDeleteAccount} className="delete-account-button">Deletar Conta</button>
        <button onClick={() => setShowEditModal(true)} className="edit-account-button">Editar Informações</button>
      </div>

      {pedidos.length > 0 && (
        <div className="order-history" ref={historicoRef}>
          <h3>Histórico de Pedidos</h3>
          <ul>
            {pedidos.map((pedido) => (
              <li key={pedido.id}>
                <strong>{pedido.data}</strong>:{" "}
                {Array.isArray(pedido.itens)
                  ? pedido.itens.join(", ")
                  : "Nenhum item"}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Informações</h3>
            <label>
              Novo Nome:
              <input type="text" value={newNome} onChange={(e) => setNewNome(e.target.value)} />
            </label>
            <label>
              Nova Senha:
              <input type="password" value={newSenha} onChange={(e) => setNewSenha(e.target.value)} />
            </label>
            <div className="modal-actions">
              <button onClick={handleEditAccount}>Salvar</button>
              <button onClick={() => setShowEditModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Account;
