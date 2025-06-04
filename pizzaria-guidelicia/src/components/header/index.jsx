import React from "react";
import { Link } from "react-router-dom"; // Importando Link
import "./style.css";

const Header = () => {
  return (
    <header>
      <div className="header center">
        <picture>
          <Link to="/">
          <img
            src="./assets/Desde1987.png"
            alt="logo pizzaria"
            width="100px"
            height="100px"
          />
          </Link>
        </picture>

        <nav>
          <ul>
            <li>
              <Link to="/#linkpdt" className="red">Produtos</Link>
            </li>
            <li>
              <Link to="/#linksb" className="red">Sobre</Link>
            </li>
            <li>
              <Link to="/#linkct" className="red">Contato</Link>
            </li>
            <li>
              <Link to="/createcheck" className="red">Cadastre-se</Link>
            </li>
            <li>
              <Link to="/entrar" className="red">Entrar</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
