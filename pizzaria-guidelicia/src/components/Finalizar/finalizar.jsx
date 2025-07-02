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
  const [precisaTroco, setPrecisaTroco] = useState(false);
  const [valorTroco, setValorTroco] = useState("");
  const [endereco, setEndereco] = useState("");

  const taxaEntrega = 10.0;

  const confirmarCompra = () => {
    if (!tipoRecebimento) {
      alert("Por favor, selecione o tipo de recebimento.");
      return;
    }

    if (tipoRecebimento === "Entrega" && endereco.trim() === "") {
      alert("Por favor, informe o endereço para entrega.");
      return;
    }

    if (!formaPagamento) {
      alert("Por favor, selecione uma forma de pagamento.");
      return;
    }

    if (formaPagamento === "Dinheiro" && precisaTroco && !valorTroco) {
      alert("Por favor, informe o valor para o troco.");
      return;
    }

    setMostrarModal(true);
  };

  const finalizar = () => {
    setMostrarModal(false);
    alert("Obrigado pela sua preferência!");

    const pedidosSalvos = JSON.parse(localStorage.getItem("historicoPedidos")) || [];

    const novoPedido = {
      id: Date.now(),
      data: new Date().toLocaleString(),
      carrinho,
      formaPagamento,
      tipoRecebimento,
      endereco: tipoRecebimento === "Entrega" ? endereco : "Retirada no local",
      total: totalFinal,
      trocoPara: formaPagamento === "Dinheiro" && precisaTroco ? valorTroco : "Não precisa",
    };

    localStorage.setItem("historicoPedidos", JSON.stringify([...pedidosSalvos, novoPedido]));

    navigate("/", { replace: true });
  };

  const cancelarPedido = () => {
    setMostrarModalCancelamento(true);
  };

  const confirmarCancelamento = () => {
    setMostrarModalCancelamento(false);
    navigate("/", { replace: true });
  };

  const fecharModalCancelamento = () => {
    setMostrarModalCancelamento(false);
  };

  const handleFormaPagamentoChange = (e) => {
    const selected = e.target.value;
    setFormaPagamento(selected);
    if (selected !== "Dinheiro") {
      setPrecisaTroco(false);
      setValorTroco("");
    }
  };

  const totalProdutos = carrinho.reduce((acc, item) => {
    const preco = parseFloat(item.preco.replace("R$", "").replace(",", "."));
    return acc + (isNaN(preco) ? 0 : preco);
  }, 0);

  const totalFinal = tipoRecebimento === "Entrega" ? totalProdutos + taxaEntrega : totalProdutos;

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
              <option value="">Selecione</option>
              <option value="Retirada">Retirada no Local</option>
              <option value="Entrega">Entrega (+{formatarBRL(taxaEntrega)})</option>
            </select>
            {tipoRecebimento === "Entrega" && (
              <input
                type="text"
                placeholder="Digite o endereço para entrega"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                style={{ ...styles.input, marginTop: 10 }}
              />
            )}
          </div>

          <div style={styles.section}>
            <h3>Forma de Pagamento</h3>
            <select
              value={formaPagamento}
              onChange={handleFormaPagamentoChange}
              style={styles.select}
            >
              <option value="Cartão">Selecione</option>
              <option value="Pix">Pix</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Cartão">Cartão de Crédito/Débito</option>
            </select>

            {formaPagamento === "Pix" && (
              <div style={styles.pixInfo}>
                <strong>Chave Pix para pagamento:</strong>
                <p style={styles.pixChave}>contatoguidelicia@gmail.com</p>
              </div>
            )}

            {formaPagamento === "Dinheiro" && (
              <div style={styles.changeQuestion}>
                <p>Precisa de troco?</p>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="precisaTroco"
                      value="sim"
                      checked={precisaTroco === true}
                      onChange={() => {
                        setPrecisaTroco(true);
                        setValorTroco("");
                      }}
                      style={styles.radioInput}
                    />{" "}
                    Sim
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="precisaTroco"
                      value="nao"
                      checked={precisaTroco === false}
                      onChange={() => setPrecisaTroco(false)}
                      style={styles.radioInput}
                    />{" "}
                    Não
                  </label>
                </div>
                {precisaTroco && (
                  <input
                    type="number"
                    placeholder="Valor para o troco"
                    value={valorTroco}
                    onChange={(e) => setValorTroco(e.target.value)}
                    style={styles.trocoInput}
                    min={totalFinal}
                  />
                )}
              </div>
            )}
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
            {tipoRecebimento === "Entrega" && (
              <p>
                Endereço: <strong>{endereco}</strong>
              </p>
            )}
            {formaPagamento === "Dinheiro" && (
              <p>
                Troco para:{" "}
                <strong>
                  {precisaTroco ? formatarBRL(parseFloat(valorTroco)) : "Não precisa"}
                </strong>
              </p>
            )}
            <p>
              Total: <strong>{formatarBRL(totalFinal)}</strong>
            </p>
            <button onClick={finalizar} style={styles.botaoFechar}>
              OK
            </button>
          </div>
        </div>
      )}

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
  input: {
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
  changeQuestion: {
    marginTop: 15,
    padding: 10,
    border: "1px solid #eee",
    borderRadius: 5,
    backgroundColor: "#f2f2f2",
  },
  radioGroup: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  radioInput: {
    marginRight: 5,
  },
  trocoInput: {
    width: "calc(100% - 22px)",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  pixInfo: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#e0f7fa",
    borderRadius: 5,
    textAlign: "center",
  },
  pixChave: {
    marginTop: 5,
    fontSize: 18,
    color: "#00796b",
  },
};

export default FinalizarPedido;
