import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./styles/style.css";

import { AuthProvider } from "./contexts/AuthContext.jsx";
import RotaProtegida from "./routes/RotaProtegida.jsx";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import Detalhes from "./pages/Detalhes/detalhes";
import Impacto from "./pages/Impacto/impacto";
import FaleConosco from "./pages/FaleConosco/FaleConosco";
import Autoria from "./pages/Autoria/Autoria";
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

import ListaUsuarios from "./pages/ListaUsuarios/ListaUsuarios";
import HistoricoAuditoria from "./pages/HistoricoAuditoria/HistoricoAuditoria";
import RecuperarSenha from "./pages/RecuperarSenha/RecuperarSenha";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            {/* Páginas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/detalhes" element={<Detalhes />} />
            <Route path="/impacto" element={<Impacto />} />
            <Route path="/fale-conosco" element={<FaleConosco />} />
            <Route path="/autoria" element={<Autoria />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-senha" element={<RecuperarSenha />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/formulario-post" element={<FormularioPost />} />
            <Route path="/Cadastro" element={<CadastroUsuario />} />

            {/* Páginas exclusivas do usuário comum */}
            <Route
              path="/minha-organizacao"
              element={
                <RotaProtegida funcoesPermitidas={["USUARIO"]}>
                  <Detalhes />
                </RotaProtegida>
              }
            />

            <Route
              path="/formulario-ong"
              element={
                <RotaProtegida funcoesPermitidas={["USUARIO"]}>
                  <FormularioOng />
                </RotaProtegida>
              }
            />

            <Route
              path="/editar-ong"
              element={
                <RotaProtegida funcoesPermitidas={["USUARIO"]}>
                  <EditarOng />
                </RotaProtegida>
              }
            />

            <Route
              path="/solicitacao-exclusao-ong"
              element={
                <RotaProtegida funcoesPermitidas={["USUARIO"]}>
                  <SolicitacaoExclusaoOng />
                </RotaProtegida>
              }
            />

            {/* Páginas disponíveis para qualquer usuário autenticado */}
            <Route
              path="/editar-usuario"
              element={
                <RotaProtegida>
                  <EditarUsuario />
                </RotaProtegida>
              }
            />

            <Route
              path="/alterar-senha"
              element={
                <RotaProtegida>
                  <AlterarSenha />
                </RotaProtegida>
              }
            />

            {/* Área administrativa: ADMINISTRADOR e MASTER */}
            <Route
              path="/admin/solicitacoes"
              element={
                <RotaProtegida allowedRoles={["ADMINISTRADOR", "MASTER"]}>
                  <AdminSolicitacoesLayout />
                </RotaProtegida>
              }
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

            {/* Listagem de usuários: exclusiva do MASTER */}
            <Route
              path="/admin/usuarios"
              element={
                <RotaProtegida
                  allowedRoles={["MASTER"]}
                  allowPreview
                >
                  <ListaUsuarios />
                </RotaProtegida>
              }
            />

            {/* Histórico de auditoria demonstrativo, exclusivo do MASTER */}
            <Route
              path="/admin/historico"
              element={
                <RotaProtegida
                  allowedRoles={["MASTER"]}
                  allowPreview
                >
                  <HistoricoAuditoria />
                </RotaProtegida>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
