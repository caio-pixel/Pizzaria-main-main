import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./create.css";
import "./create.css";

const Create = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    endereco: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allFieldsFilled = Object.values(formData).every(
      (field) => field.trim() !== ""
    );

    if (!allFieldsFilled) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar conta");
      }
      const data = await response.json();
localStorage.setItem("nome", data.nome);
localStorage.setItem("email", data.email);
localStorage.setItem("token", data.token);
console.log("Conta criada com sucesso");
navigate("/entrar");

    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setFormData({
        nome: "",
        email: "",
        senha: "",
        telefone: "",
        endereco: "",
      });
    }
  };

  return (
    <main className="corpo">
      <div className="container">
        <h1>Criar Conta</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="nome">Nome completo:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="endereco">Endereço:</label>
          <input
            type="text"
            id="endereco"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            required
          />

          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required
          />

          <label htmlFor="telefone">Telefone:</label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            required
          />

          <button type="submit">Criar</button>
        </form>
      </div>
    </main>
    
  );
};

export default Create;