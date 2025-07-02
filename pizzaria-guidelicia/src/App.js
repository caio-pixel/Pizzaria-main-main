import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "./App.css";
import Header from "./components/header";
import SecaoCapa from "./components/SecaoCapa";
import Sobre from "./components/Sobre";
import Comprar from "./components/Comprar";
import Create from "./components/createcheck";
import Logar from "./components/entrar";
import ScrollToTopButton from './components/TopButton/ScrollToTopButton';
import Account from "./components/principal/p";
import FinalizarPedido from "./components/Finalizar/finalizar"; // ajuste o caminho conforme sua pasta
import Admin from "./components/Admin"; // nova página admin (você cria essa página)
import Cardapio from "./components/cardapio/Cardapio";

function ScrollToHashElement() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  return null;
}

function App() {
  const [carrinho, setCarrinho] = useState([]);

  return (
    <Router>
      <div className="App">
        <ScrollToHashElement />
        <Header />
        <ScrollToTopButton />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <SecaoCapa />
                <Sobre />
              </>
            }
          />
      <Route path="/cardapio" element={<Cardapio />} />

          <Route path="/" element={<Admin />} />
          <Route path="/createcheck" element={<Create />} />
          <Route path="/entrar" element={<Logar />} />
          <Route path="/Comprar" element={<Comprar />} />
          <Route path="/principal" element={<Account />} />
          <Route path="/finalizar" element={<FinalizarPedido carrinho={carrinho} setCarrinho={setCarrinho} />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
