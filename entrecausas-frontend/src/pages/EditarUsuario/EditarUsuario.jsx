import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CampoFormulario from "../../components/Form/CampoFormulario";
import Footer from "../../components/Footer/Footer";
import OngsCarrossel from "../../components/Ongs/OngsCarrossel";
import { apiFetch } from "../../services/Api.js";
import { useAuth } from "../../contexts/AuthContext.jsx";

const imagens = [
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Horizontal-Desktop.jpg",
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Vertical-Mobile.jpg",
  "../../img/carrossel/sos-animais/fotografia-SOS-Animais-Vertical-Mobile.jpg",
];

function formatarTelefone(valor) {
  const numeros = String(valor ?? "")
    .replace(/\D/g, "")
    .slice(0, 11);

  let telefone = numeros;

  if (numeros.length > 2) {
    telefone = `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  }

  if (numeros.length > 7) {
    telefone = `(${numeros.slice(0, 2)}) ${numeros.slice(
      2,
      numeros.length > 10 ? 7 : 6,
    )}-${numeros.slice(numeros.length > 10 ? 7 : 6)}`;
  }

  return telefone;
}

function EditarUsuario() {
  const navigate = useNavigate();
  const { usuario, carregando, atualizarUsuario } = useAuth();

  const [imagemAtual, setImagemAtual] = useState(0);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");

  const [foto, setFoto] = useState(null);
  const [nomeFotoAtual, setNomeFotoAtual] = useState("");

  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  // Alterna as imagens do carrossel.
  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemAtual((anterior) =>
        anterior === imagens.length - 1 ? 0 : anterior + 1,
      );
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  // Consulta os dados privados do usuário autenticado.
  useEffect(() => {
    let ativo = true;

    async function carregarPerfil() {
      if (carregando) {
        return;
      }

      if (!usuario) {
        if (ativo) {
          setErro("Você precisa entrar na sua conta para editar o perfil.");
          setCarregandoPerfil(false);
        }
        return;
      }

      try {
        if (ativo) {
          setCarregandoPerfil(true);
          setErro("");
        }

        const perfil = await apiFetch("/api/auth/perfil");

        if (!ativo) {
          return;
        }

        setNome(perfil.nome ?? "");
        setEmail(perfil.email ?? "");
        setCpf(perfil.cpfMascarado ?? "");
        setTelefone(formatarTelefone(perfil.telefone));
        setNomeFotoAtual(perfil.fotoPerfil ?? "");
      } catch (error) {
        if (ativo) {
          setErro(error.message || "Não foi possível carregar seus dados.");
        }
      } finally {
        if (ativo) {
          setCarregandoPerfil(false);
        }
      }
    }

    carregarPerfil();

    return () => {
      ativo = false;
    };
  }, [usuario, carregando]);

  // Envia somente os dados modificáveis para o backend.
  async function salvarDados(event) {
    event.preventDefault();

    if (salvando || carregandoPerfil || !usuario) {
      return;
    }

    setErro("");
    setMensagem("");

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim();
    const telefoneNumeros = telefone.replace(/\D/g, "");

    if (!nomeLimpo || !emailLimpo) {
      setErro("Preencha seu nome e e-mail.");
      return;
    }

    if (!/^\d{10,11}$/.test(telefoneNumeros)) {
      setErro("Informe um telefone válido com 10 ou 11 dígitos.");
      return;
    }

    const dados = {
      nome: nomeLimpo,
      email: emailLimpo,
      telefone: telefoneNumeros,
    };

    const formulario = new FormData();

    // O backend recebe a parte "usuario" como JSON.
    formulario.append(
      "usuario",
      new Blob([JSON.stringify(dados)], {
        type: "application/json",
      }),
    );

    // A foto é opcional.
    if (foto) {
      formulario.append("foto", foto);
    }

    try {
      setSalvando(true);

      const usuarioAtualizado = await apiFetch(
        `/api/usuarios/${usuario.idUsuario}`,
        {
          method: "PUT",
          body: formulario,
        },
      );

      // Sincroniza o Header e os demais componentes.
      atualizarUsuario(usuarioAtualizado);

      setNome(usuarioAtualizado.nome ?? nomeLimpo);
      setEmail(usuarioAtualizado.email ?? emailLimpo);
      setNomeFotoAtual(usuarioAtualizado.fotoPerfil ?? "");
      setFoto(null);

      setMensagem("Seus dados foram atualizados com sucesso.");
    } catch (error) {
      setErro(error.message || "Não foi possível salvar suas alterações.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main>
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-lg focus:bg-base-100 focus:px-4 focus:py-3 focus:text-primary focus:shadow-xl"
      >
        Pular para o conteúdo principal
      </a>

      <section
        id="conteudo-principal"
        className="relative min-h-screen overflow-hidden"
      >
        <div className="absolute inset-0" aria-hidden="true">
          {imagens.map((imagem, indice) => (
            <img
              key={imagem}
              src={imagem}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                indice === imagemAtual ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-black/65" aria-hidden="true" />

        <div className="hero relative z-10 min-h-screen px-5 py-12 sm:px-8">
          <div className="hero-content w-full max-w-6xl flex-col gap-10 lg:flex-row">
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-5 flex items-center justify-center gap-3 lg:justify-start">
                <span className="h-[3px] w-10 rounded-full bg-primary" />
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                  Meu Perfil
                </span>
              </div>

              <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                Mantenha seus dados{" "}
                <span className="text-primary">atualizados.</span>
              </h1>

              <p className="mx-auto max-w-xl py-6 text-lg leading-8 text-white/75 lg:mx-0">
                Edite suas informações pessoais de acesso ao EntreCausas.
              </p>
            </div>

            <section className="card w-full max-w-2xl shrink-0 rounded-3xl border border-white/20 bg-base-100 shadow-2xl">
              <div className="card-body p-6 sm:p-8 md:p-10">
                <div className="mb-4">
                  <h2 className="text-3xl font-black text-base-content">
                    Editar Usuário
                  </h2>

                  <p className="mt-2 text-sm text-base-content/55">
                    Atualize seus dados pessoais abaixo.
                  </p>
                </div>

                {carregandoPerfil && (
                  <div
                    role="status"
                    className="alert mb-2 border border-secondary bg-secondary/50 text-sm"
                  >
                    Carregando seus dados...
                  </div>
                )}

                <form
                  onSubmit={salvarDados}
                  className="grid gap-5 sm:grid-cols-2"
                >
                  <CampoFormulario
                    label="Nome"
                    id="nome"
                    placeholder="Seu nome completo"
                    autoComplete="name"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                    required
                  />

                  <CampoFormulario
                    label="E-mail"
                    id="email"
                    type="email"
                    placeholder="seuemail@email.com"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />

                  <div>
                    <label
                      htmlFor="cpf"
                      className="mb-2 block text-sm font-bold text-base-content"
                    >
                      CPF
                    </label>

                    <input
                      id="cpf"
                      name="cpf"
                      type="text"
                      autoComplete="off"
                      value={cpf}
                      disabled
                      aria-describedby="cpf-ajuda"
                      className="input h-12 w-full cursor-not-allowed rounded-xl border border-base-300 bg-base-200 text-base-content/60 opacity-100"
                    />

                    <p
                      id="cpf-ajuda"
                      className="mt-1 text-xs text-base-content/55"
                    >
                      O CPF não pode ser alterado.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="telefone"
                      className="mb-2 block text-sm font-bold text-base-content"
                    >
                      Telefone
                    </label>

                    <input
                      id="telefone"
                      name="telefone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="(11) 99999-9999"
                      value={telefone}
                      onChange={(event) =>
                        setTelefone(formatarTelefone(event.target.value))
                      }
                      maxLength={15}
                      required
                      className="input h-12 w-full rounded-xl border border-base-300 bg-base-100 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Foto de perfil preservada para uso futuro. */}
                  <div className="hidden sm:col-span-2">
                    <label
                      htmlFor="foto"
                      className="mb-2 block text-sm font-bold text-base-content"
                    >
                      Foto de perfil
                    </label>

                    {nomeFotoAtual && (
                      <p className="mb-2 text-xs text-base-content/60">
                        Foto atual: {nomeFotoAtual}
                      </p>
                    )}

                    <input
                      id="foto"
                      name="foto"
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(event) =>
                        setFoto(event.target.files?.[0] ?? null)
                      }
                      className="file-input file-input-bordered h-12 w-full rounded-xl"
                    />

                    <p className="mt-1 text-xs text-base-content/55">
                      Se não selecionar uma imagem, a foto atual será mantida.
                    </p>
                  </div>

                  {erro && (
                    <p
                      role="alert"
                      className="rounded-xl border border-error/30 bg-error/10 p-3 text-sm text-error sm:col-span-2"
                    >
                      {erro}
                    </p>
                  )}

                  {mensagem && (
                    <p
                      role="status"
                      className="rounded-xl border border-secondary bg-secondary/50 p-3 text-sm text-base-content sm:col-span-2"
                    >
                      {mensagem}
                    </p>
                  )}

                  <div className="flex flex-col-reverse gap-3 pt-2 sm:col-span-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="btn btn-ghost h-12 rounded-xl font-semibold"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={carregandoPerfil || salvando || !usuario}
                      className="btn btn-primary h-12 rounded-xl px-7 text-base font-bold"
                    >
                      {salvando ? "Salvando..." : "Salvar alterações"}

                      <i
                        className="fa-solid fa-arrow-right ml-2"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {imagens.map((imagem, indice) => (
            <button
              key={imagem}
              type="button"
              onClick={() => setImagemAtual(indice)}
              aria-label={`Exibir imagem ${indice + 1}`}
              aria-pressed={indice === imagemAtual}
              className={`rounded-full transition-all duration-300 ${
                indice === imagemAtual
                  ? "h-2.5 w-8 bg-primary"
                  : "h-2.5 w-2.5 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </section>

      <OngsCarrossel />
      <Footer />
    </main>
  );
}

export default EditarUsuario;