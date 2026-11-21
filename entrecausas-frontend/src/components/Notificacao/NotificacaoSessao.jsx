import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function NotificacaoSessao() {
  const { mensagemSessao, setMensagemSessao } = useAuth();
  const navigate = useNavigate();

  if (!mensagemSessao) {
    return null;
  }

  // Fecha a notificação sem alterar a navegação.
  function fecharNotificacao() {
    setMensagemSessao(null);
  }

  // Direciona o usuário para realizar um novo login.
  function entrarNovamente() {
    setMensagemSessao(null);
    navigate("/login");
  }

  return (
    <div className="toast toast-top toast-end z-[9999]">
      <div role="alert" className="alert alert-warning shadow-lg max-w-md">
        <i className="fa-solid fa-shield-halved text-xl"></i>

        <div>
          <h3 className="font-bold">Sessão encerrada</h3>

          <p className="text-sm">{mensagemSessao}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={entrarNovamente}
              className="btn btn-sm btn-primary"
            >
              Entrar novamente
            </button>

            <button
              type="button"
              onClick={fecharNotificacao}
              className="btn btn-sm btn-ghost"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}