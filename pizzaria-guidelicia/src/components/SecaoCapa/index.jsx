import React, { useState, useEffect } from 'react';
import '../SecaoCapa/style.css';

const SecaoCapa = () => {
  const [showContent, setShowContent] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 100) { // Quando o usuário rolar para baixo 100px ou mais
      setShowContent(true);
    } else {
      setShowContent(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="secao-capa">
      <div className="capa">
        <div className={`texto-capa ${showContent ? 'show' : ''}`}>
          <h1>Bem-vindo à Nossa Página!</h1>
          <br></br>
          <p>Explore o conteúdo e se surpreenda com o que temos a oferecer. Descubra algo novo hoje.</p>
      
        </div>
      </div>
    </section>
  );
};

export default SecaoCapa;
