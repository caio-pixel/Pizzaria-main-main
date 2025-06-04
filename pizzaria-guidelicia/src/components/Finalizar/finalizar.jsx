import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FinalizarPedido = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const carrinho = location.state?.carrinho || [];


  const [formaPagamento, setFormaPagamento] = useState("");
  const [tipoRecebimento, setTipoRecebimento] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalCancelamento, setMostrarModalCancelamento] = useState(false);

  const taxaEntrega = 10.0;

  const confirmarCompra = () => {
    if (!tipoRecebimento) {
      alert("Por favor, selecione o tipo de recebimento.");
      return;
    }

    if (!formaPagamento) {
      alert("Por favor, selecione uma forma de pagamento.");
      return;
    }
    setMostrarModal(true); // Mostra modal de confirmação
  };

  const finalizar = () => {
    setMostrarModal(false);

    // Pega os pedidos salvos no localStorage (ou vazio)
    const pedidosSalvos = JSON.parse(localStorage.getItem("historicoPedidos")) || [];

    // Novo pedido com dados atuais
    const novoPedido = {
      id: Date.now(), // id único
      data: new Date().toLocaleString(),
      carrinho,
      formaPagamento,
      tipoRecebimento,
      total: totalFinal,
    };

    // Salva no localStorage o novo histórico com o pedido adicionado
    localStorage.setItem("historicoPedidos", JSON.stringify([...pedidosSalvos, novoPedido]));

    // Navega para a página inicial (ou outra)
    navigate("/", { replace: true });
  };

  const cancelarPedido = () => {
    setMostrarModalCancelamento(true); // Mostra modal de cancelamento
  };

  const confirmarCancelamento = () => {
    setMostrarModalCancelamento(false);
    navigate("/", { replace: true });
  };

  const fecharModalCancelamento = () => {
    setMostrarModalCancelamento(false);
  };

  const totalProdutos = carrinho.reduce((acc, item) => {
    const precoNum = parseFloat(item.preco.replace("R$", "").replace(",", "."));
    return acc + (isNaN(precoNum) ? 0 : precoNum);
  }, 0);

  const totalFinal = tipoRecebimento === "entrega" ? totalProdutos + taxaEntrega : totalProdutos;

  const formatarBRL = (valor) =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Finalizar Pedido</h1>

      {carrinho.length === 0 ? (
        <p style={styles.vazio}>Seu carrinho está vazio.</p>
      ) : (
        <>
          <div style={styles.section}>
            <h3>Resumo do Pedido</h3>
            <ul style={styles.lista}>
              {carrinho.map((item, i) => (
                <li key={i} style={styles.item}>
                  <span>{item.nome}</span>
                  <span>{item.preco}</span>
                </li>
              ))}
            </ul>
            <p>
              <strong>Total dos Produtos:</strong> {formatarBRL(totalProdutos)}
            </p>
          </div>

          <div style={styles.section}>
            <h3>Tipo de recebimento</h3>
            <select
              value={tipoRecebimento}
              onChange={(e) => setTipoRecebimento(e.target.value)}
              style={styles.select}
            >
              <option value="-">Selecione</option>
              <option value="Retirada">Retirada no Local</option>
              <option value="Entrega">
                Entrega (+{formatarBRL(taxaEntrega)})
              </option>
            </select>
          </div>

          <div style={styles.section}>
            <h3>Forma de Pagamento</h3>
            <select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
              style={styles.select}
            >
              <option value="-">Selecione</option>
              <option value="Pix">Pix</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Cartão">Cartão de Crédito/Débito</option>
            </select>
          </div>

          <div style={styles.section}>
            <p style={styles.total}>
              <strong>Total Geral:</strong> {formatarBRL(totalFinal)}
            </p>

            <div style={styles.botoes}>
              <button onClick={confirmarCompra} style={styles.botaoConfirmar}>
                Confirmar Compra
              </button>

              <button onClick={cancelarPedido} style={styles.botaoCancelar}>
                Cancelar Pedido
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal de Confirmação */}
      {mostrarModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{ marginBottom: 10 }}>Compra Confirmada!</h2>
            <p>
              Forma de pagamento: <strong>{formaPagamento}</strong>
            </p>
            <p>
              Recebimento: <strong>{tipoRecebimento}</strong>
            </p>
            <p>
              Total: <strong>{formatarBRL(totalFinal)}</strong>
            </p>
            <button onClick={finalizar} style={styles.botaoFechar}>
              OK
            </button>
          </div>
        </div>
      )}

      {/* Modal de Cancelamento */}
      {mostrarModalCancelamento && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{ marginBottom: 10 }}>Cancelar Pedido</h2>
            <p>Tem certeza que deseja cancelar seu pedido?</p>
            <div
              style={{
                marginTop: 20,
                display: "flex",
                gap: 10,
                justifyContent: "center",
              }}
            >
              <button
                onClick={confirmarCancelamento}
                style={{ ...styles.botaoFechar, backgroundColor: "#dc3545" }}
              >
                Sim, Cancelar
              </button>
              <button
                onClick={fecharModalCancelamento}
                style={{ ...styles.botaoFechar, backgroundColor: "#6c757d" }}
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: 30,
    maxWidth: 600,
    margin: "auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    position: "relative",
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  section: {
    marginBottom: 20,
  },
  lista: {
    listStyleType: "none",
    padding: 0,
    marginBottom: 10,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #ddd",
  },
  select: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  botoes: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 10,
  },
  botaoConfirmar: {
    backgroundColor: "green",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontWeight: "bold",
    flex: 1,
    fontSize: 16,
  },
  botaoCancelar: {
    backgroundColor: "#d9534f",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontWeight: "bold",
    flex: 1,
    fontSize: 16,
  },
  botaoFechar: {
    padding: "10px 20px",
    fontSize: 16,
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  total: {
    fontSize: 18,
    marginTop: 10,
  },
  vazio: {
    textAlign: "center",
    color: "#666",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 10,
    textAlign: "center",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
    maxWidth: 400,
    width: "90%",
  },
};

export default FinalizarPedido;
