/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { apiFetch } from "../services/Api.js";

const AuthContext = createContext(null);

const INTERVALO_VERIFICACAO = 60_000;

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagemSessao, setMensagemSessao] = useState(null);

  // Identifica alterações na autenticação para evitar respostas antigas.
  const versaoAutenticacao = useRef(0);

  // Impede verificações automáticas simultâneas.
  const verificacaoEmAndamento = useRef(false);

  // Consulta o usuário associado à sessão HTTP atual.
  const verificarSessao = useCallback(async () => {
    const versaoAtual = versaoAutenticacao.current;

    try {
      const dados = await apiFetch("/api/auth/me");

      if (versaoAtual === versaoAutenticacao.current) {
        setUsuario(dados);
      }

      return dados;
    } catch (erro) {
      if (versaoAtual === versaoAutenticacao.current) {
        if (erro.status === 401) {
          // Uma sessão inválida significa usuário desconectado.
          setUsuario(null);
        }
      }

      return null;
    } finally {
      if (versaoAtual === versaoAutenticacao.current) {
        setCarregando(false);
      }
    }
  }, []);

  // Verifica a sessão quando a aplicação é iniciada.
  useEffect(() => {
    let ativo = true;

    async function carregarSessao() {
      const versaoAtual = versaoAutenticacao.current;

      try {
        const dados = await apiFetch("/api/auth/me");

        if (ativo && versaoAtual === versaoAutenticacao.current) {
          setUsuario(dados);
        }
      } catch {
        if (ativo && versaoAtual === versaoAutenticacao.current) {
          // Não existe uma sessão autenticada válida.
          setUsuario(null);
        }
      } finally {
        if (ativo && versaoAtual === versaoAutenticacao.current) {
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

  // Reconhece quando o backend invalida a sessão.
  useEffect(() => {
    function tratarSessaoExpirada(evento) {
      // Invalida respostas de verificações anteriores.
      versaoAutenticacao.current += 1;

      setUsuario(null);
      setCarregando(false);

      setMensagemSessao(
        evento.detail?.mensagem ||
          "Sua sessão foi encerrada por segurança. Entre novamente na sua conta.",
      );
    }

    window.addEventListener("sessao-expirada", tratarSessaoExpirada);

    return () => {
      window.removeEventListener("sessao-expirada", tratarSessaoExpirada);
    };
  }, []);

  // Verifica automaticamente a sessão enquanto o usuário está conectado.
  useEffect(() => {
    if (!usuario) {
      return;
    }

    let ativo = true;

    async function consultarSessao() {
      if (!ativo || document.visibilityState !== "visible") {
        return;
      }

      if (verificacaoEmAndamento.current) {
        return;
      }

      verificacaoEmAndamento.current = true;

      try {
        await verificarSessao();
      } finally {
        verificacaoEmAndamento.current = false;
      }
    }

    // Verifica a sessão a cada 60 segundos.
    const intervalo = window.setInterval(
      consultarSessao,
      INTERVALO_VERIFICACAO,
    );

    // Verifica quando o usuário retorna à aba.
    function verificarVisibilidade() {
      if (document.visibilityState === "visible") {
        consultarSessao();
      }
    }

    document.addEventListener("visibilitychange", verificarVisibilidade);

    return () => {
      ativo = false;

      window.clearInterval(intervalo);

      document.removeEventListener("visibilitychange", verificarVisibilidade);
    };
  }, [usuario, verificarSessao]);

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

  // Limpa a autenticação local sem realizar outra requisição ao backend.
  // Utilizado quando a conta já foi excluída e a sessão invalidada.
  const encerrarSessaoLocal = useCallback(() => {
    // Impede respostas antigas de restaurarem o usuário.
    versaoAutenticacao.current += 1;

    setUsuario(null);
    setMensagemSessao(null);
    setCarregando(false);
  }, []);

  // Encerra a sessão no backend antes de limpar o usuário.
  const sair = useCallback(async () => {
    try {
      await apiFetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      versaoAutenticacao.current += 1;

      setUsuario(null);
      setMensagemSessao(null);
      setCarregando(false);
    }
  }, []);

  // Compartilha o estado de autenticação com a aplicação.
  const valor = useMemo(
    () => ({
      usuario,
      setUsuario,
      carregando,
      verificarSessao,
      atualizarUsuario,
      encerrarSessaoLocal,
      sair,
      mensagemSessao,
      setMensagemSessao,
    }),
    [
      usuario,
      carregando,
      verificarSessao,
      atualizarUsuario,
      encerrarSessaoLocal,
      sair,
      mensagemSessao,
    ],
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