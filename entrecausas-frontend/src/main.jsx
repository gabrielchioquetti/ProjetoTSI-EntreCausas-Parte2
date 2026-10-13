import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import "./styles/style.css";

import { AuthProvider } from "./context/AuthContext.jsx";
import RotaProtegida from "./routes/RotaProtegida.jsx";

import Home from "./pages/Home";
import Detalhes from "./pages/Detalhes/detalhes";
import Impacto from "./pages/Impacto/impacto";
import Login from "./pages/Login/Login";
import FormularioPost from "./pages/FormularioPost/FormularioPost";
import FormularioOng from "./pages/FormularioOng/FormularioOng";
import Feed from "./pages/DescobrirOngs/Feed";
import CadastroUsuario from "./pages/CadastroUsuario/CadastroUsuario";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Páginas públicas. */}
          <Route path="/" element={<Home />} />

          <Route path="/detalhes" element={<Detalhes />} />

          <Route path="/impacto" element={<Impacto />} />

          <Route path="/login" element={<Login />} />

          <Route path="/feed" element={<Feed />} />

          <Route path="/Cadastro" element={<CadastroUsuario />} />

          <Route path="/formulario-post" element={<FormularioPost />} />

          {/* O cadastro de ONG exige autenticação. */}
          <Route
            path="/formulario-ong"
            element={
              <RotaProtegida>
                <FormularioOng />
              </RotaProtegida>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
