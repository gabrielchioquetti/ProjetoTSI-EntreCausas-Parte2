import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./styles/style.css";

import Home from "./pages/Home";
import Detalhes from "./pages/Detalhes/detalhes";
import Impacto from "./pages/Impacto/impacto";
import Login from "./pages/Login/Login";
import FormularioPost from "./pages/FormularioPost/FormularioPost";
import Feed from "./pages/DescobrirOngs/Feed";
import CadastroUsuario from "./pages/CadastroUsuario/CadastroUsuario";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/detalhes" element={<Detalhes />} />

        <Route path="/impacto" element={<Impacto />} />

        <Route path="/login" element={<Login />} />

        <Route path="/feed" element={<Feed />} />

        <Route path="/formulario-post" element={<FormularioPost />} />

        <Route path="/Cadastro" element={<CadastroUsuario />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
