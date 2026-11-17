import { useEffect, useState } from "react";

import Footer from "../../components/Footer/Footer.jsx";

import {
  listarUsuarios,
  promoverUsuario,
} from "../../services/UsuarioService.js";

function nomeFuncao(funcao) {
  switch (funcao?.toUpperCase()) {
    case "MASTER":
      return "Master";

    case "ADMINISTRADOR":
    case "ADM":
      return "Administrador";

    default:
      return "Usuário";
  }
}

function classePerfil(funcao) {
  switch (funcao?.toUpperCase()) {
    case "MASTER":
      return "border-primary/30 bg-primary/10 text-primary";

    case "ADMINISTRADOR":
      return "border-secondary/40 bg-secondary/15 text-base-content";

    default:
      return "border-base-300 bg-base-200 text-base-content/70";
  }
}

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [promovendo, setPromovendo] = useState(false);
  const [erroPromocao, setErroPromocao] = useState("");
  const [notificacao, setNotificacao] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarUsuarios() {
      setCarregando(true);
      setErro("");

      try {
        const resultado = await listarUsuarios();

        if (ativo) {
          setUsuarios(resultado);
        }
      } catch (error) {
        if (ativo) {
          setErro(error.message || "Não foi possível carregar os usuários.");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarUsuarios();

    return () => {
      ativo = false;
    };
  }, []);

  function abrirAlteracaoPerfil(usuario) {
    if (usuario.funcaoNome?.toUpperCase() !== "USUARIO") {
      return;
    }

    setUsuarioSelecionado(usuario);
    setErroPromocao("");
    setNotificacao("");
  }

  function fecharAlteracaoPerfil() {
    if (promovendo) {
      return;
    }

    setUsuarioSelecionado(null);
    setErroPromocao("");
  }

  async function confirmarAlteracao(event) {
    event.preventDefault();

    if (!usuarioSelecionado || promovendo) {
      return;
    }

    if (usuarioSelecionado.funcaoNome?.toUpperCase() !== "USUARIO") {
      return;
    }

    setPromovendo(true);
    setErroPromocao("");

    try {
      const usuarioAtualizado = await promoverUsuario(
        usuarioSelecionado.idUsuario,
      );

      // Atualiza a tabela com o retorno da API.
      setUsuarios((atuais) =>
        atuais.map((usuario) =>
          usuario.idUsuario === usuarioSelecionado.idUsuario
            ? usuarioAtualizado
            : usuario,
        ),
      );

      setNotificacao(
        `${usuarioSelecionado.nome} foi promovido a administrador com sucesso.`,
      );

      setUsuarioSelecionado(null);
    } catch (error) {
      setErroPromocao(error.message || "Não foi possível promover o usuário.");
    } finally {
      setPromovendo(false);
    }
  }

  return (
    <>
      <main className="relative min-h-[calc(100vh-5rem)] overflow-hidden px-4 py-10 sm:px-6 lg:px-10">
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src="../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Horizontal-Desktop.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-black/65" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <header className="mb-7">
            <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-primary">
              <span className="h-[3px] w-8 rounded-full bg-primary" />
              Painel administrativo
            </p>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Listagem de Usuários
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/75 sm:text-base">
              Consulte os perfis cadastrados e promova usuários comuns a
              administradores.
            </p>
          </header>

          {notificacao && (
            <div
              role="status"
              className="alert mb-5 border border-info/40 bg-base-100 text-sm text-base-content"
            >
              <i
                className="fa-solid fa-circle-check text-primary"
                aria-hidden="true"
              />

              <span>{notificacao}</span>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                aria-label="Fechar aviso"
                onClick={() => setNotificacao("")}
              >
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            </div>
          )}

          <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
            <div className="border-b border-base-300 px-5 py-4">
              <h2 className="font-bold text-base-content">
                Usuários{" "}
                <span className="font-normal text-base-content/55">
                  ({usuarios.length})
                </span>
              </h2>

              <p className="mt-1 text-xs text-base-content/55">
                Somente o MASTER pode promover usuários comuns a
                administradores.
              </p>
            </div>

            {carregando ? (
              <p role="status" className="p-6 text-sm text-base-content/70">
                Carregando usuários...
              </p>
            ) : erro ? (
              <p role="alert" className="p-6 text-sm text-error">
                {erro}
              </p>
            ) : usuarios.length === 0 ? (
              <p className="p-6 text-sm text-base-content/70">
                Ainda não há usuários cadastrados.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra min-w-[860px]">
                  <thead className="bg-base-200 text-xs uppercase tracking-wide text-base-content/70">
                    <tr>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>Perfil atual</th>
                      <th className="text-right">Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.idUsuario} className="hover">
                        <td className="font-semibold">{usuario.nome}</td>

                        <td>{usuario.email}</td>

                        <td>
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${classePerfil(usuario.funcaoNome)}`}
                          >
                            {nomeFuncao(usuario.funcaoNome)}
                          </span>
                        </td>

                        <td className="text-right">
                          {usuario.funcaoNome?.toUpperCase() === "USUARIO" ? (
                            <button
                              type="button"
                              onClick={() => abrirAlteracaoPerfil(usuario)}
                              className="btn btn-sm rounded-lg border-base-300 bg-base-100"
                            >
                              <i
                                className="fa-solid fa-user-shield"
                                aria-hidden="true"
                              />
                              Promover a administrador
                            </button>
                          ) : usuario.funcaoNome?.toUpperCase() === "MASTER" ? (
                            <span className="text-xs font-semibold text-primary">
                              Perfil Master
                            </span>
                          ) : (
                            <span className="text-xs text-base-content/50">
                              Administrador
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />

      {usuarioSelecionado && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-3 sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              fecharAlteracaoPerfil();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="alterar-perfil-titulo"
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/20 bg-base-100 shadow-2xl"
          >
            <form
              onSubmit={confirmarAlteracao}
              className="card-body p-6 sm:p-8 md:p-10"
            >
              <header className="mb-2 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-[3px] w-10 rounded-full bg-primary" />

                    <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                      Gerenciamento de acesso
                    </span>
                  </div>

                  <h2
                    id="alterar-perfil-titulo"
                    className="text-3xl font-black leading-tight tracking-tight text-base-content sm:text-4xl"
                  >
                    Promover usuário
                  </h2>

                  <p className="mt-3 max-w-lg text-sm leading-6 text-base-content/65 sm:text-base">
                    Confirme a promoção de{" "}
                    <strong>{usuarioSelecionado.nome}</strong> para o perfil de
                    administrador.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fecharAlteracaoPerfil}
                  disabled={promovendo}
                  aria-label="Fechar alteração de perfil"
                  title="Fechar"
                  className="btn btn-ghost btn-sm btn-square shrink-0"
                >
                  <i className="fa-solid fa-xmark" aria-hidden="true" />
                </button>
              </header>

              <div className="my-4 rounded-2xl border border-base-300 bg-base-200/50 p-4 sm:p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-base-content/50">
                  Conta selecionada
                </p>

                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-base-content">
                      {usuarioSelecionado.nome}
                    </p>

                    <p className="truncate text-sm text-base-content/60">
                      {usuarioSelecionado.email}
                    </p>
                  </div>

                  <span
                    className={`w-fit shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${classePerfil(usuarioSelecionado.funcaoNome)}`}
                  >
                    Perfil atual: {nomeFuncao(usuarioSelecionado.funcaoNome)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="w-full">
                  <label
                    htmlFor="novo-perfil"
                    className="mb-2 block text-sm font-bold text-base-content"
                  >
                    Novo perfil
                  </label>

                  <select
                    id="novo-perfil"
                    className="select select-bordered h-12 w-full rounded-xl border-base-300 bg-base-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value="ADMINISTRADOR"
                    disabled
                  >
                    <option value="ADMINISTRADOR">Administrador</option>
                  </select>
                </div>
              </div>

              <div
                role="note"
                className="alert mt-6 border border-secondary bg-base-100 text-sm text-base-content"
              >
                <i
                  className="fa-solid fa-circle-info text-primary"
                  aria-hidden="true"
                />

                <span>
                  Esta ação concederá permissões administrativas ao usuário. A
                  alteração será salva no banco de dados.
                </span>
              </div>

              {erroPromocao && (
                <div
                  role="alert"
                  className="alert mt-4 border border-error/30 bg-base-100 text-sm text-error"
                >
                  <i
                    className="fa-solid fa-circle-exclamation"
                    aria-hidden="true"
                  />
                  <span>{erroPromocao}</span>
                </div>
              )}

              <footer className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={fecharAlteracaoPerfil}
                  disabled={promovendo}
                  className="btn btn-ghost rounded-xl"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn btn-primary rounded-xl"
                  disabled={promovendo}
                >
                  {promovendo ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Promovendo...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-check" aria-hidden="true" />
                      Confirmar promoção
                    </>
                  )}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </>
  );
}