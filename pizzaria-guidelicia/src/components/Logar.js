import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Logar = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const response = await fetch("http://localhost:3002/api/authentication/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        throw new Error("Usuário ou senha incorretos.");
      }

      const data = await response.json();

      // salvar token no localStorage (ou cookie, conforme preferência)
      localStorage.setItem("token", data.token);

      // redirecionar para página principal (ou admin, se preferir)
      navigate("/principal");
    } catch (error) {
      setErro(error.message || "Erro ao tentar logar.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "30px auto", padding: 20, border: "1px solid #ddd" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 10 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <button type="submit" style={{ padding: 10, width: "100%" }}>
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Logar;
