import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Produto = ({ nome, preco, imagem, descricao, onComprar }) => (
  <div className="produto">
    <img src={imagem} alt={nome} />

    <div className="descricao-e-preco">
      <h2>{nome}</h2>
      {descricao && <p>{descricao}</p>}
      <p className="preco">{preco}</p>
    </div>

    <button className="btn-comprar" onClick={onComprar}>
      Comprar
    </button>
  </div>
);

const Produtos = () => {
  const navigate = useNavigate();

  const [mostrarSalgadas, setMostrarSalgadas] = useState(false);
  const [mostrarDoces, setMostrarDoces] = useState(false);
  const [mostrarBebidas, setMostrarBebidas] = useState(false);

  const [carrinho, setCarrinho] = useState([]);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
  const [mensagemCarrinho, setMensagemCarrinho] = useState("");

  const adicionarAoCarrinho = (produto) => {
    setCarrinho([...carrinho, produto]);
    setMensagemCarrinho(`${produto.nome} foi adicionado ao carrinho!`);
    setTimeout(() => setMensagemCarrinho(""), 2500);
  };

  const removerDoCarrinho = (index) => {
    setCarrinho(carrinho.filter((_, i) => i !== index));
  };

  const finalizarPedido = () => {
    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }
    navigate("/finalizar", { state: { carrinho } });
  };

  const abrirAdmin = () => {
    // redireciona para página do admin
    navigate("/admin");
  };


  const precoParaNumero = (precoStr) =>
    parseFloat(precoStr.replace("R$", "").replace(",", ".").trim()) || 0;

  const total = carrinho.reduce((acc, item) => acc + precoParaNumero(item.preco), 0);
  const totalFormatado = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="produtos-container">
      {mensagemCarrinho && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#4caf50",
            color: "white",
            padding: "12px 20px",
            borderRadius: 8,
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            zIndex: 2000,
            fontWeight: "bold",
          }}
        >
          {mensagemCarrinho}
        </div>
      )}

      <div
        className="carrinho-topo"
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          cursor: "pointer",
          background: "#eee",
          padding: "10px 15px",
          borderRadius: "5px",
          zIndex: 1000,
          boxShadow: "0 0 5px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onClick={() => setMostrarCarrinho(!mostrarCarrinho)}
      >
        <span className="material-icons" style={{ fontSize: 24, color: "#333" }}>
          shopping_cart
        </span>
        <span>{carrinho.length}</span>
      </div>

      {mostrarCarrinho && (
        <div
          className="painel-carrinho"
          style={{
            position: "fixed",
            top: 60,
            right: 20,
            width: 320,
            maxHeight: "70vh",
            overflowY: "auto",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 15,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            zIndex: 999,
          }}
        >
          <h3>Seu Carrinho</h3>
          {carrinho.length === 0 ? (
            <p>O carrinho está vazio.</p>
          ) : (
            <>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {carrinho.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                      borderBottom: "1px solid #eee",
                      paddingBottom: 8,
                    }}
                  >
                    <div>
                      <strong>{item.nome}</strong>
                      <p style={{ margin: 0 }}>{item.preco}</p>
                    </div>
                    <button
                      onClick={() => removerDoCarrinho(index)}
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        padding: "4px 8px",
                        cursor: "pointer",
                      }}
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>

              <div
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  marginBottom: 15,
                  textAlign: "right",
                  color: "#2980b9",
                }}
              >
                Total: {totalFormatado}
              </div>

              <button
                onClick={finalizarPedido}
                style={{
                  width: "100%",
                  background: "green",
                  color: "white",
                  padding: "10px",
                  border: "none",
                  borderRadius: 5,
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Finalizar Pedido
              </button>
            </>
          )}
        </div>
      )}

      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />

      <div className="product-section">
        <h1 id="linkpdt">NOSSOS PRODUTOS</h1>
        <p>
          Trabalhamos com pizzas artesanais, preparadas com ingredientes frescos e
          selecionados...
        </p>

        <div className="botoes-categorias">
          <button
            onClick={() => {
              setMostrarSalgadas(!mostrarSalgadas);
              setMostrarDoces(false);
              setMostrarBebidas(false);
            }}
          >
            {mostrarSalgadas ? "Ocultar" : "Mostrar"} Pizzas Salgadas
          </button>

          <button
            onClick={() => {
              setMostrarDoces(!mostrarDoces);
              setMostrarSalgadas(false);
              setMostrarBebidas(false);
            }}
          >
            {mostrarDoces ? "Ocultar" : "Mostrar"} Pizzas Doces
          </button>

          <button
            onClick={() => {
              setMostrarBebidas(!mostrarBebidas);
              setMostrarSalgadas(false);
              setMostrarDoces(false);
            }}
          >
            {mostrarBebidas ? "Ocultar" : "Mostrar"} Bebidas
          </button>
        </div>

        <div className="produtos-grid">
          {mostrarSalgadas && (
            <>
              <Produto
                nome="Pizza de Portuguesa"
                preco="R$45,00"
                imagem="/assets/pizza_portuguesa.png"
                descricao="Clássica e saborosa, com molho, mussarela, presunto, ovos, cebola, azeitonas e ervilhas."
                onComprar={() =>
                  adicionarAoCarrinho({ nome: "Pizza de Portuguesa", preco: "R$45,00" })
                }
              />
              <Produto
                nome="6 queijos"
                preco="R$52,00"
                imagem="/assets/pizza6queijos.png"
                descricao="Uma explosão cremosa de sabor com mussarela, provolone, gorgonzola, parmesão, catupiry e queijo prato."
                onComprar={() =>
                  adicionarAoCarrinho({ nome: "Pizza de 6 queijos", preco: "R$52,00" })
                }
              />
              <Produto
                nome="Pizza de Bauru"
                preco="R$43,00"
                imagem="/assets/pizza_bauru.png"
                descricao="Deliciosa combinação de queijo, presunto, tomate e orégano, inspirada no tradicional sanduíche paulista."
                onComprar={() =>
                  adicionarAoCarrinho({ nome: "Pizza de Bauru", preco: "R$43,00" })
                }
              />
              <Produto
                nome="Pizza de Brócolis"
                preco="R$40,00"
                imagem="/assets/pizza_brocolis.png"
                descricao="Leve e nutritiva, com brócolis frescos, molho branco e queijo mussarela."
                onComprar={() =>
                  adicionarAoCarrinho({ nome: "Pizza de Brócolis", preco: "R$40,00" })
                }
              />
              <Produto
                nome="Pizza de Frango com catupiry"
                preco="R$47,00"
                imagem="/assets/pizza_frango.png"
                descricao="Recheio cremoso de frango desfiado com catupiry, um verdadeiro clássico da pizza brasileira."
                onComprar={() =>
                  adicionarAoCarrinho({ nome: "Pizza de Frango com catupiry", preco: "R$47,00" })
                }
              />
              <Produto
                nome="Pizza de Marguerita"
                preco="R$42,00"
                imagem="/assets/pizzamarguerita.png"
                descricao="Simples e irresistível, com molho de tomate, mussarela, manjericão fresco e um toque de azeite."
                onComprar={() =>
                  adicionarAoCarrinho({ nome: "Pizza de Marguerita", preco: "R$42,00" })
                }
              />
              <Produto
                nome="Pizza de Pepperoni"
                preco="R$47,00"
                imagem="/assets/pizzapepperoni.png"
                descricao="Picante e crocante, com fatias generosas de pepperoni e queijo mussarela derretido."
                onComprar={() =>
                  adicionarAoCarrinho({ nome: "Pizza de Pepperoni", preco: "R$47,00" })
                }
              />
              <Produto
                nome="Pizza de Frango com Bacon"
                preco="R$49,00"
                imagem="/assets/pizza_strogonoff.png"
                descricao="Sabor intenso do frango combinado com bacon crocante, cobertos com muito queijo."
                onComprar={() =>
                  adicionarAoCarrinho({ nome: "Pizza de Frango com Bacon", preco: "R$49,00" })
                }
              />
              <Produto
                nome="Pizza de Calabresa"
                preco="R$43,00"
                imagem="/assets/pizzacalabresaoficial.png"
                descricao="Tradicional e muito saborosa, com fatias de calabresa, cebola e queijo mussarela."
                onComprar={() =>
                  adicionarAoCarrinho({ nome: "Pizza de Calabresa", preco: "R$43,00" })
                }
              />
            </>
          )}

          {mostrarDoces && (
            <>
              <Produto
                nome="Pizza de Prestígio"
                preco="R$48,00"
                imagem="/assets/pizzaprestigiooficial.png"
                descricao="Massa macia coberta com creme de chocolate ao leite e generosa camada de coco ralado, uma combinação clássica que conquista paladares."
                onComprar={() =>
                  adicionarAoCarrinho({ nome: "Pizza de Prestígio", preco: "R$48,00" })
                }
              />
              <Produto
                nome="Pizza de Brigadeiro"
                preco="R$45,00"
                imagem="/assets/pizzabrigadeiro.png"
                descricao="Deliciosa massa recheada com brigadeiro cremoso e finalizada com granulados de chocolate, um doce irresistível para os amantes de chocolate."
                onComprar={() =>
                  adicionarAoCarrinho({ nome: "Pizza de Brigadeiro", preco: "R$45,00" })
                }
              />
              <Produto
                nome="Pizza de Romeu e Julieta"
                preco="R$47,00"
                imagem="/assets/pizza_romeuejulieta.png"
                descricao="Combinação perfeita de goiabada cremosa e queijo derretido, uma tradição brasileira que mistura doce e salgado na medida certa."
                onComprar={() =>
                  adicionarAoCarrinho({ nome: "Pizza de Romeu e Julieta", preco: "R$47,00" })
                }
              />
              <Produto
                nome="Pizza de doce de leite"
                preco="R$46,00"
                imagem="/assets/pizzadocedeleite.png"
                descricao="Massa leve com cobertura generosa de doce de leite cremoso, trazendo aquele sabor clássico e reconfortante."
                onComprar={() =>
                  adicionarAoCarrinho({ nome: "Pizza de Doce de Leite", preco: "R$46,00" })
                }
              />
              <Produto
                nome="Pizza de chocolate com morango"
                preco="R$50,00"
                imagem="/assets/pizzachoco_morango.png"
                descricao=" Camada de chocolate ao leite acompanhada de morangos fresquinhos, uma mistura que une sabor e frescor em cada pedaço."
                onComprar={() =>
                  adicionarAoCarrinho({ nome: "Pizza de Chocolate com morango", preco: "R$50,00" })
                }
              />
              <Produto
                nome="Pizza de Bis"
                preco="R$52,00"
                imagem="/assets/pizza_bis.png"
                descricao="Massa coberta com creme de chocolate, pedaços crocantes de Bis e uma pitada de chocolate derretido, para quem ama textura e sabor intensos."
                onComprar={() =>
                  adicionarAoCarrinho({ nome: "Pizza de Bis", preco: "R$52,00" })
                }
              />
            </>
          )}

          {mostrarBebidas && (
            <>
    <Produto
      nome="Lata de Coca-Cola 350ml"
      preco="R$6,00"
      imagem="/assets/coca.png"
      onComprar={() =>
        adicionarAoCarrinho({ nome: "Lata de Coca-Cola 350ml", preco: "R$6,00" })
      }
    />
    <Produto
      nome="Pepsi Cola de 2 litros"
      preco="R$12,00"
      imagem="/assets/pepsi2l.png"
      onComprar={() =>
        adicionarAoCarrinho({ nome: "Pepsi Cola de 2 litros", preco: "R$12,00" })
      }
    />
    <Produto
      nome="Água Mineral 500ml"
      preco="R$4,00"
      imagem="/assets/agua.png"
      onComprar={() =>
        adicionarAoCarrinho({ nome: "Água Mineral 500ml", preco: "R$4,00" })
      }
    />
    <Produto
      nome="Guaraná Antartida de 2 litros"
      preco="R$12,00" 
      imagem="/assets/guarana2litros.png"
      onComprar={() =>
        adicionarAoCarrinho({ nome: "Guaraná Antartida de 2 litros", preco: "R$12,00" })
      }
    />
    <Produto
      nome="Fanta Laranja de 2 litros"
      preco="R$11,00" 
      imagem="/assets/fanta2l.png"
      onComprar={() =>
        adicionarAoCarrinho({ nome: "Fanta Laranja de 2 litros", preco: "R$11,00" })
      }
    />
    <Produto
      nome="Suco Del Valle sabor uva"
      preco="R$14,00"  
      imagem="/assets/suco_uva.png"
      onComprar={() =>
        adicionarAoCarrinho({ nome: "Suco Del Valle sabor uva", preco: "R$14,00" })
      }
    />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Produtos;
