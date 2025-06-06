import React from 'react';
import './style.css';

const Sobre = () => {
    return (
        <footer id="sobre">
            <div className="sobre-container">
                <div className="sobre-info">
                    <h2 id='linksb'>Sobre Nós</h2>
                    <p>
                        Fundado em 2001, em Caraguatatuba - São Paulo, a pizzaria GuiDelícia 
                        começou com o objetivo de oferecer qualidade e preço justo. Hoje, 
                        contamos com mais de 10 filiais pelo Brasil, sempre prezando pelo 
                        melhor atendimento.
                    </p>
                </div>

                <div className="sobre-links">
                    <h4>Links Úteis</h4>
                    <ul>
                        <li><a href="#">Nossa História</a></li>
                        <li><a href="#">Filiais</a></li>
                        <li><a href="#">Contato</a></li>
                        <li><a href="#">Trabalhe Conosco</a></li>
                    </ul>
                </div>

                <div className="sobre-contato">
                    <h4 id='linkct'>Fale Conosco</h4>
                    <p>Email: contatoguidelicia@gmail.com</p>
                    <p>Telefone: (12) 3456-7890</p>
                    <p>Endereço: Rua das Pizzas, 123 - Caraguatatuba, SP, Brasil</p>
                </div>
            </div>

            <div className="maps">
                <img src="/assets/mapspizzaria.png" alt="maps" />
            </div>

            <div className="footer-bottom">
                <p>&copy; 2025 GuiDelícia. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}

export default Sobre;
