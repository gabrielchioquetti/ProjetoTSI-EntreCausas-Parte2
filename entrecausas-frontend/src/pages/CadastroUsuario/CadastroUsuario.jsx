import { useEffect, useState } from "react";

import CampoFormulario from "../../components/Form/CampoFormulario";
import CampoDocumento from "../../components/Form/CampoDocumento";
import CampoTelefone from "../../components/Form/CampoTelefone";

import Header from "../../components/Header/Header";
import OngsCarrosel from "../../components/Ongs/OngsCarrossel";
import Footer from "../../components/Footer/Footer";

import { cadastrarUsuario } from "../../services/UsuarioService";

const imagens = [
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Horizontal-Desktop.jpg",
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Vertical-Mobile.jpg",
  "../../img/carrossel/sos-animais/fotografia-SOS-Animais-Vertical-Mobile.jpg",
];

function CadastroUsuario() {
  const [imagemAtual, setImagemAtual] = useState(0);

  // Armazena os dados preenchidos no formulário.
  const [formulario, setFormulario] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  });

  // Armazena os erros retornados pelo backend.
  const [erros, setErros] = useState({});

  // Armazena a mensagem geral do formulário.
  const [mensagem, setMensagem] = useState("");

  // Define se a mensagem geral é de sucesso ou erro.
  const [tipoMensagem, setTipoMensagem] = useState("");

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemAtual((imagemAnterior) =>
        imagemAnterior === imagens.length - 1
          ? 0
          : imagemAnterior + 1,
      );
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  // Atualiza os valores dos campos.
  function handleChange(event) {
    const { id, value } = event.target;

    setFormulario((formularioAnterior) => ({
      ...formularioAnterior,
      [id]: value,
    }));

    // Remove o erro do campo quando o usuário altera seu valor.
    setErros((errosAnteriores) => ({
      ...errosAnteriores,
      [id]: "",
    }));

    // Remove a mensagem geral ao alterar o formulário.
    setMensagem("");
    setTipoMensagem("");
  }

  // Remove máscaras antes de enviar os dados.
  function somenteDigitos(valor) {
    return valor.replace(/\D/g, "");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Limpa mensagens anteriores.
    setErros({});
    setMensagem("");
    setTipoMensagem("");

    // A confirmação da senha é uma validação da interface.
    if (formulario.senha !== formulario.confirmarSenha) {
      setErros({
        confirmarSenha: "As senhas não coincidem.",
      });

      setMensagem("Verifique os dados informados.");
      setTipoMensagem("erro");

      return;
    }

    // Monta os dados no formato esperado pelo backend.
    const dados = {
      nome: formulario.nome,
      email: formulario.email,
      senha: formulario.senha,

      // CPF é enviado sem máscara.
      cpf: somenteDigitos(formulario.cpf),

      // Telefone é enviado sem máscara.
      telefone: somenteDigitos(formulario.telefone),
    };

    try {
      await cadastrarUsuario(dados);

      // Exibe mensagem de sucesso.
      setMensagem("Cadastro realizado com sucesso!");
      setTipoMensagem("sucesso");

      // Limpa o formulário após o cadastro.
      setFormulario({
        nome: "",
        email: "",
        cpf: "",
        telefone: "",
        senha: "",
        confirmarSenha: "",
      });
    } catch (erro) {
      // Exibe a mensagem geral enviada pelo backend.
      setMensagem(
        erro.message ||
          "Não foi possível realizar o cadastro.",
      );

      setTipoMensagem("erro");

      // Exibe os erros específicos de cada campo.
      setErros(erro.detalhes || {});
    }
  }

  return (
    <main>
      <Header />

      <section className="relative min-h-screen overflow-hidden">
        {/* ========================= */}
        {/* CARROSSEL DE FUNDO */}
        {/* ========================= */}
        <div className="absolute inset-0">
          {imagens.map((imagem, index) => (
            <img
              key={imagem}
              src={imagem}
              alt=""
              aria-hidden="true"
              className={`
                absolute
                inset-0
                h-full
                w-full
                object-cover
                transition-opacity
                duration-1000
                ${index === imagemAtual ? "opacity-100" : "opacity-0"}
              `}
            />
          ))}
        </div>

        {/* ESCURECIMENTO */}
        <div className="absolute inset-0 bg-black/65"></div>

        {/* ========================= */}
        {/* CONTEÚDO */}
        {/* ========================= */}
        <div
          className="
            hero
            relative
            z-10
            min-h-screen
            px-6
          "
        >
          <div
            className="
              hero-content
              w-full
              max-w-6xl
              flex-col
              gap-5
              items-start
            "
          >
            {/* ========================= */}
            {/* CARD CADASTRO */}
            {/* ========================= */}
            <div
              className="
                hero
                relative
                z-10
                min-h-screen
                px-3
              "
            >
              <div
                className="
                  hero-content
                  w-full
                  max-w-7xl
                  flex-col
                  items-center
                  justify-center
                  gap-5
                "
              >
                {/* ========================= */}
                {/* TEXTO */}
                {/* ========================= */}
                <div
                  className="
                    w-full
                    max-w-4xl
                    px-6
                    text-center
                    md:px-10
                  "
                >
                  <div className="mb-5 flex items-center justify-center gap-3">
                    <span className="h-[3px] w-10 rounded-full bg-primary"></span>

                    <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                      Área de cadastro
                    </span>
                  </div>

                  <h1
                    className="
                      text-4xl
                      font-black
                      leading-tight
                      tracking-tight
                      text-white
                      md:text-5xl
                      lg:text-6xl
                    "
                  >
                    Faça parte do{" "}
                    <span className="text-primary">
                      EntreCausas.
                    </span>
                  </h1>

                  <p
                    className="
                      mx-auto
                      max-w-xl
                      py-6
                      text-lg
                      leading-8
                      text-white/75
                      lg:m
                    "
                  >
                    Crie sua conta para acessar a plataforma, conhecer
                    organizações, acompanhar conteúdos e se aproximar de causas
                    que transformam a comunidade.
                  </p>
                </div>

                {/* ========================= */}
                {/* CARD CADASTRO */}
                {/* ========================= */}
                <div
                  className="
                    card
                    w-full
                    max-w-4xl
                    rounded-3xl
                    border
                    border-white/20
                    bg-base-100
                    shadow-2x
                  "
                >
                  <div className="card-body p-8 md:p-10 lg:p-12">
                    <div className="mb-6">
                      <h2 className="text-3xl font-black text-base-content">
                        Cadastrar
                      </h2>

                      <p className="mt-2 text-sm text-base-content/55">
                        Informe seus dados para continuar.
                      </p>
                    </div>

                    {/* ========================= */}
                    {/* MENSAGEM GERAL */}
                    {/* ========================= */}
                    {mensagem && (
                      <div
                        role="alert"
                        className={`
                          mb-6
                          rounded-xl
                          border
                          p-4
                          text-sm
                          font-medium
                          ${
                            tipoMensagem === "sucesso"
                              ? "border-success/30 bg-success/10 text-success"
                              : "border-error/30 bg-error/10 text-error"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <i
                            className={
                              tipoMensagem === "sucesso"
                                ? "fa-solid fa-circle-check"
                                : "fa-solid fa-circle-exclamation"
                            }
                            aria-hidden="true"
                          ></i>

                          <span>{mensagem}</span>
                        </div>
                      </div>
                    )}

                    {/* ========================= */}
                    {/* FORMULÁRIO */}
                    {/* ========================= */}
                    <form
                      className="grid grid-cols-1 gap-6 md:grid-cols-2"
                      onSubmit={handleSubmit}
                    >
                      {/* NOME */}
                      <div className="md:col-span-2">
                        <CampoFormulario
                          label="Nome"
                          id="nome"
                          type="text"
                          placeholder="Maria Souza"
                          autoComplete="name"
                          required
                          value={formulario.nome}
                          onChange={handleChange}
                          erro={erros.nome}
                        />
                      </div>

                      {/* E-MAIL */}
                      <div className="md:col-span-2">
                        <CampoFormulario
                          label="E-mail"
                          id="email"
                          type="email"
                          placeholder="seuemail@email.com"
                          autoComplete="email"
                          required
                          value={formulario.email}
                          onChange={handleChange}
                          erro={erros.email}
                        />
                      </div>

                      {/* CPF */}
                      <CampoDocumento
                        tipo="cpf"
                        required
                        value={formulario.cpf}
                        onChange={handleChange}
                        erro={erros.cpf}
                      />

                      {/* TELEFONE */}
                      <CampoTelefone
                        required
                        value={formulario.telefone}
                        onChange={handleChange}
                        erro={erros.telefone}
                      />

                      {/* SENHA */}
                      <CampoFormulario
                        label="Senha"
                        id="senha"
                        type="password"
                        placeholder="Digite sua senha"
                        autoComplete="new-password"
                        required
                        value={formulario.senha}
                        onChange={handleChange}
                        erro={erros.senha}
                      />

                      {/* CONFIRMAR SENHA */}
                      <CampoFormulario
                        label="Confirmar senha"
                        id="confirmarSenha"
                        type="password"
                        placeholder="Digite sua senha novamente"
                        autoComplete="new-password"
                        required
                        value={formulario.confirmarSenha}
                        onChange={handleChange}
                        erro={erros.confirmarSenha}
                      />

                      {/* BOTÃO */}
                      <button
                        type="submit"
                        className="
                          btn
                          btn-primary
                          h-12
                          w-full
                          rounded-xl
                          text-base
                          font-bold
                          md:col-span-2
                        "
                      >
                        Cadastrar

                        <i
                          className="fa-solid fa-arrow-right ml-2"
                          aria-hidden="true"
                        ></i>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* INDICADORES DO CARROSSEL */}
        {/* ========================= */}
        <div
          className="
            absolute
            bottom-6
            left-1/2
            z-20
            flex
            -translate-x-1/2
            gap-2
          "
        >
          {imagens.map((imagem, index) => (
            <button
              key={imagem}
              type="button"
              onClick={() => setImagemAtual(index)}
              aria-label={`Exibir imagem ${index + 1}`}
              className={`
                rounded-full
                transition-all
                duration-300
                ${
                  index === imagemAtual
                    ? "h-2.5 w-8 bg-primary"
                    : "h-2.5 w-2.5 bg-white/50 hover:bg-white"
                }
              `}
            />
          ))}
        </div>
      </section>

      <OngsCarrosel />

      <Footer />
    </main>
  );
}

export default CadastroUsuario;