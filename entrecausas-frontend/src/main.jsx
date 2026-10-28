import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./styles/style.css";

import { AuthProvider } from "./context/AuthContext.jsx";
import RotaProtegida from "./routes/RotaProtegida.jsx";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import Detalhes from "./pages/Detalhes/Detalhes";
import Impacto from "./pages/Impacto/impacto";
import Login from "./pages/Login/Login";
import FormularioPost from "./styles/FormularioPost/FormularioPost";
import FormularioOng from "./pages/FormularioOng/FormularioOng";
import Feed from "./pages/DescobrirOngs/Feed";
import CadastroUsuario from "./pages/CadastroUsuario/CadastroUsuario";
import EditarOng from "./pages/EditarOng/EditarOng";
import EditarUsuario from "./pages/EditarUsuario/EditarUsuario";
import AlterarSenha from "./pages/AlterarSenha/AlterarSenha";
import SolicitacaoExclusaoOng from "./pages/SolicitacaoExclusaoOng/SolicitacaoExclusaoOng";
import {
  AdminSolicitacoesLayout,
  AdminSolicitacoesPage,
} from "./pages/AdminSolicitacoes/AdminSolicitacoes";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/detalhes" element={<Detalhes />} />
            <Route path="/minha-organizacao" element={<Detalhes />} />
            <Route path="/impacto" element={<Impacto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/formulario-post" element={<FormularioPost />} />
            <Route
              path="/formulario-ong"
              element={
                <RotaProtegida>
                  <FormularioOng />
                </RotaProtegida>
              }
            />
            <Route path="/Cadastro" element={<CadastroUsuario />} />
            <Route path="/editar-ong" element={<EditarOng />} />
            <Route path="/editar-usuario" element={<EditarUsuario />} />
            <Route path="/alterar-senha" element={<AlterarSenha />} />
            <Route
              path="/solicitacao-exclusao-ong"
              element={<SolicitacaoExclusaoOng />}
            />
            <Route
              path="/admin/solicitacoes"
              element={<AdminSolicitacoesLayout />}
            >
              <Route
                index
                element={<AdminSolicitacoesPage status="pendente" />}
              />
              <Route
                path="aprovadas"
                element={<AdminSolicitacoesPage status="aprovada" />}
              />
              <Route
                path="reprovadas"
                element={<AdminSolicitacoesPage status="reprovada" />}
              />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
