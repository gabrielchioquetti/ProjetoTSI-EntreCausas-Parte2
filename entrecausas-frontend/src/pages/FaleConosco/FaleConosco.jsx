import Footer from "../../components/Footer/Footer";
import OngsCarrossel from "../../components/Ongs/OngsCarrossel";
import BackToTop from "../../components/Acessibilidade/BackToTop";
import VLibras from "../../components/Acessibilidade/VLibras";
import UserWay from "../../components/Acessibilidade/UserWay";

const duvidasFrequentes = [
  {
    pergunta: "Como cadastrar uma ONG na plataforma?",
    resposta:
      "Envie seus dados pelo formulário e selecione a opção de cadastro. A equipe pode retornar para validar informações antes da publicação.",
  },
  {
    pergunta: "Posso me voluntariar mesmo sem experiência prévia?",
    resposta:
      "Sim! Muitas organizações recebem voluntários sem experiência e oferecem atividades de acordo com o seu tempo e interesses.",
  },
  {
    pergunta: "Quanto tempo demora para receber retorno?",
    resposta:
      "Nossa equipe procura responder em até dois dias úteis. Em períodos de maior movimento, o retorno pode levar um pouco mais.",
  },
];

function FaleConosco() {
  function enviarMensagem(event) {
    event.preventDefault();

    const dados = new FormData(event.currentTarget);
    const assunto = `Contato EntreCausas: ${dados.get("assunto")}`;
    const corpo = [
      `Nome: ${dados.get("nome")}`,
      `E-mail: ${dados.get("email")}`,
      `Como podemos ajudar: ${dados.get("assunto")}`,
      "",
      "Mensagem:",
      dados.get("mensagem"),
    ].join("\n");

    window.location.href = `mailto:contato@entrecausas.org.br?subject=${encodeURIComponent(
      assunto,
    )}&body=${encodeURIComponent(corpo)}`;
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <a
        href="#conteudo-principal"
        className="
          sr-only
          focus:not-sr-only
          focus:fixed
          focus:left-4
          focus:top-4
          focus:z-[9999]
          focus:rounded-lg
          focus:bg-base-100
          focus:px-4
          focus:py-3
          focus:text-primary
          focus:shadow-xl
        "
      >
        Pular para o conteúdo principal
      </a>

      <main id="conteudo-principal">
        <section
          aria-labelledby="titulo-contato"
          className="bg-base-200/60 px-6 py-16 md:py-20 lg:px-10 lg:py-24"
        >
          <div className="mx-auto w-full max-w-7xl">
            <header className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">
                Estamos aqui para ajudar
              </p>
              <h1
                id="titulo-contato"
                className="text-4xl font-black leading-tight tracking-tight md:text-5xl"
              >
                Fale <span className="text-primary">Conosco</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-base-content/65 md:text-lg md:leading-8">
                Tem uma dúvida, quer cadastrar uma organização ou fazer parte de
                uma causa? Envie sua mensagem. Vamos adorar conversar com você.
              </p>
            </header>

            <div className="grid gap-8 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm md:p-8 lg:grid-cols-2 lg:gap-10 lg:p-10">
              <section aria-labelledby="titulo-duvidas">
                <div className="mb-7">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-xl text-primary">
                    <i className="fa-solid fa-circle-question" aria-hidden="true" />
                  </div>
                  <h2
                    id="titulo-duvidas"
                    className="text-2xl font-black md:text-3xl"
                  >
                    Dúvidas Frequentes
                  </h2>
                  <p className="mt-2 leading-7 text-base-content/60">
                    Reunimos respostas rápidas para reduzir atrito e deixar o
                    contato mais objetivo.
                  </p>
                </div>

                <div className="space-y-3">
                  {duvidasFrequentes.map((duvida, indice) => (
                    <details
                      key={duvida.pergunta}
                      open={indice === 0}
                      className="group rounded-2xl border border-base-300 bg-base-100 p-4 transition-colors open:border-primary/30 open:bg-base-200/50"
                    >
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-bold leading-6 marker:content-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                        {duvida.pergunta}
                        <span
                          className="shrink-0 text-xl leading-6 text-primary"
                          aria-hidden="true"
                        >
                          +
                        </span>
                      </summary>
                      <p className="mt-3 pr-7 text-sm leading-6 text-base-content/65">
                        {duvida.resposta}
                      </p>
                    </details>
                  ))}
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-2xl bg-base-200/70 p-4">
                    <i
                      className="fa-regular fa-clock mt-1 text-primary"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-bold">Retorno em até 2 dias úteis</p>
                      <p className="mt-1 text-sm text-base-content/60">
                        A gente responde assim que possível.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl bg-base-200/70 p-4">
                    <i
                      className="fa-solid fa-location-dot mt-1 text-primary"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-bold">Itapetininga - SP</p>
                      <p className="mt-1 text-sm text-base-content/60">
                        Conectando causas locais e pessoas.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section
                aria-labelledby="titulo-formulario"
                className="border-t border-base-300 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
              >
                <div className="mb-7">
                  <p className="mb-2 text-sm font-bold uppercase tracking-[0.14em] text-primary">
                    Mande uma mensagem
                  </p>
                  <h2
                    id="titulo-formulario"
                    className="text-2xl font-black md:text-3xl"
                  >
                    Como podemos ajudar?
                  </h2>
                  <p className="mt-2 leading-7 text-base-content/60">
                    Preencha os campos e sua mensagem será preparada no
                    aplicativo de e-mail.
                  </p>
                </div>

                <form onSubmit={enviarMensagem} className="space-y-5">
                  <div>
                    <label
                      htmlFor="contato-nome"
                      className="mb-2 block text-sm font-bold"
                    >
                      Nome
                    </label>
                    <input
                      id="contato-nome"
                      name="nome"
                      type="text"
                      autoComplete="name"
                      placeholder="Digite seu nome"
                      className="input input-bordered w-full rounded-xl bg-base-100 focus:border-primary focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contato-email"
                      className="mb-2 block text-sm font-bold"
                    >
                      E-mail
                    </label>
                    <input
                      id="contato-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Digite seu endereço de e-mail"
                      className="input input-bordered w-full rounded-xl bg-base-100 focus:border-primary focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contato-assunto"
                      className="mb-2 block text-sm font-bold"
                    >
                      Como podemos ajudar?
                    </label>
                    <select
                      id="contato-assunto"
                      name="assunto"
                      defaultValue=""
                      className="select select-bordered w-full rounded-xl bg-base-100 focus:border-primary focus:outline-none"
                      required
                    >
                      <option value="" disabled>
                        Selecione uma opção
                      </option>
                      <option value="Cadastro de ONG">Cadastro de ONG</option>
                      <option value="Voluntariado">Voluntariado</option>
                      <option value="Parcerias e apoio">Parcerias e apoio</option>
                      <option value="Dúvidas sobre a plataforma">
                        Dúvidas sobre a plataforma
                      </option>
                      <option value="Outro">Outro assunto</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contato-mensagem"
                      className="mb-2 block text-sm font-bold"
                    >
                      Mensagem
                    </label>
                    <textarea
                      id="contato-mensagem"
                      name="mensagem"
                      rows="5"
                      placeholder="Escreva sua mensagem para nós"
                      className="textarea textarea-bordered w-full resize-y rounded-xl bg-base-100 leading-6 focus:border-primary focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary h-13 w-full rounded-xl border-none text-base font-bold"
                  >
                    Enviar mensagem
                    <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                  </button>
                  <p className="text-xs leading-5 text-base-content/50">
                    O envio depende de um aplicativo de e-mail configurado no
                    seu dispositivo.
                  </p>
                </form>
              </section>
            </div>
          </div>
        </section>
        <OngsCarrossel />
      </main>

      <Footer />
      <BackToTop />
      <VLibras />
      <UserWay />
    </div>
  );
}

export default FaleConosco;
