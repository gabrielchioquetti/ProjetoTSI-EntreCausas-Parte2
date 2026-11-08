/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiFetch } from "../services/Api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Consulta o usuário associado à sessão HTTP atual.
  const verificarSessao = useCallback(async () => {
    try {
      const dados = await apiFetch("/api/auth/me");

      setUsuario(dados);
      return dados;
    } catch {
      // Uma sessão inválida significa usuário desconectado.
      setUsuario(null);
      return null;
    } finally {
      setCarregando(false);
    }
  }, []);

  // Verifica a sessão quando a aplicação é iniciada.
  useEffect(() => {
    let ativo = true;

    async function carregarSessao() {
      try {
        const dados = await apiFetch("/api/auth/me");

        if (ativo) {
          setUsuario(dados);
        }
      } catch {
        if (ativo) {
          // Não existe uma sessão autenticada válida.
          setUsuario(null);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarSessao();

    // Evita atualizar o estado após desmontar o componente.
    return () => {
      ativo = false;
    };
  }, []);

  // Atualiza os dados do usuário após editar o perfil.
  const atualizarUsuario = useCallback((dadosAtualizados) => {
    if (!dadosAtualizados) {
      return;
    }

    setUsuario((usuarioAtual) => {
      if (!usuarioAtual) {
        return usuarioAtual;
      }

      return {
        ...usuarioAtual,
        ...dadosAtualizados,
      };
    });
  }, []);

  // Encerra a sessão no backend antes de limpar o usuário.
  const sair = useCallback(async () => {
    await apiFetch("/api/auth/logout", {
      method: "POST",
    });

    setUsuario(null);
  }, []);

  // Compartilha o estado de autenticação com a aplicação.
  const valor = useMemo(
    () => ({
      usuario,
      setUsuario,
      carregando,
      verificarSessao,
      atualizarUsuario,
      sair,
    }),
    [usuario, carregando, verificarSessao, atualizarUsuario, sair],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

// Permite acessar a autenticação em qualquer componente.
export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth deve ser utilizado dentro de AuthProvider.");
  }

  return contexto;
}