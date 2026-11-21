import { Link } from "react-router";
import BackToTop from "../../components/Acessibilidade/BackToTop";
import UserWay from "../../components/Acessibilidade/UserWay";
import VLibras from "../../components/Acessibilidade/VLibras";
import Footer from "../../components/Footer/Footer";

const equipe = [
  {
    nome: "Gabriel Leme",
    iniciais: "GL",
    linkedin: "https://www.linkedin.com/in/gabriel-leme-644b4b261",
  },
  {
    nome: "Gabriel Chioquetti",
    iniciais: "GC",
    linkedin:
      "https://www.linkedin.com/in/gabriel-chioquetti-5962883b4?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  {
    nome: "Pedrinho Bevbe",
    iniciais: "PB",
    linkedin: "https://www.linkedin.com/",
  },
];

const tecnologias = [
  { nome: "React", icone: "fa-brands fa-react" },
  { nome: "Java", icone: "fa-brands fa-java" },
  { nome: "Spring Boot", icone: "fa-solid fa-leaf" },
  { nome: "MySQL", icone: "fa-solid fa-database" },
  { nome: "Tailwind CSS", icone: "fa-solid fa-wind" },
  { nome: "Git & GitHub", icone: "fa-brands fa-github" },
];

function Autoria() {
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
        <section className="bg-base-200/60 px-6 py-12 md:py-16 lg:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <header className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
              <div>
                <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
                  <i className="fa-solid fa-heart" aria-hidden="true" />
                  Sobre o projeto
                </span>

                <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl">
                  Sobre o Projeto
                  <br />
                  e <span className="text-primary">Autoria</span>
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-base-content/65 md:text-lg md:leading-8">
                  Conheça quem desenvolveu o EntreCausas e o propósito por trás
                  desta iniciativa de tecnologia e impacto social.
                </p>

                <a
                  href="#equipe"
                  className="btn btn-primary mt-7 rounded-xl px-6 font-bold"
                >
                  Conheça nossa equipe
                  <i className="fa-solid fa-arrow-down" aria-hidden="true" />
                </a>
              </div>

              <figure className="overflow-hidden rounded-3xl border border-base-300 bg-neutral shadow-xl">
                <img
                  src="/img/equipe/entrecausas-equipe.png"
                  alt="Ilustração da equipe EntreCausas: três integrantes reunidos em torno de símbolos de conexão e solidariedade."
                  className="aspect-square w-full object-contain"
                />
              </figure>
            </header>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-xl text-primary">
                  <i className="fa-solid fa-people-group" aria-hidden="true" />
                </div>
                <h2 className="mb-3 text-xl font-black">Quem Somos?</h2>
                <p className="leading-7 text-base-content/65">
                  Somos estudantes do IFSP Campus Itapetininga. Criamos o
                  EntreCausas como um projeto acadêmico para aproximar
                  organizações sociais das pessoas que querem apoiar suas
                  iniciativas.
                </p>
              </article>

              <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-xl text-primary">
                  <i className="fa-solid fa-bullseye" aria-hidden="true" />
                </div>
                <h2 className="mb-3 text-xl font-black">Nosso Objetivo</h2>
                <p className="leading-7 text-base-content/65">
                  Dar visibilidade às causas locais e facilitar o encontro entre
                  ONGs, voluntários e apoiadores, tornando mais simples
                  descobrir formas de participar.
                </p>
                <blockquote className="mt-5 rounded-2xl bg-primary/10 p-4 text-center font-semibold italic leading-6 text-primary">
                  “Tecnologia a serviço de pessoas e de uma sociedade mais
                  solidária.”
                </blockquote>
              </article>

              <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm md:col-span-2 xl:col-span-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-xl text-primary">
                  <i className="fa-solid fa-laptop-code" aria-hidden="true" />
                </div>
                <h2 className="mb-4 text-xl font-black">
                  Tecnologias Utilizadas
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {tecnologias.map((tecnologia) => (
                    <li
                      key={tecnologia.nome}
                      className="inline-flex items-center gap-2 rounded-full bg-base-200 px-3 py-2 text-sm font-semibold"
                    >
                      <i
                        className={`${tecnologia.icone} text-primary`}
                        aria-hidden="true"
                      />
                      {tecnologia.nome}
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <section
              id="equipe"
              aria-labelledby="titulo-equipe"
              className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(260px,1fr)]"
            >
              <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm md:p-8">
                <div className="mb-6">
                  <div className="mb-3 flex items-center gap-3 text-primary">
                    <i
                      className="fa-solid fa-people-group text-2xl"
                      aria-hidden="true"
                    />
                    <h2
                      id="titulo-equipe"
                      className="text-2xl font-black text-base-content md:text-3xl"
                    >
                      Nossa Equipe
                    </h2>
                  </div>
                  <p className="leading-7 text-base-content/65">
                    Um grupo de estudantes unido pelo propósito de aprender,
                    desenvolver e fazer a diferença.
                  </p>
                </div>

                <ul className="grid gap-3 md:grid-cols-3">
                  {equipe.map((integrante) => (
                    <li key={integrante.nome}>
                      <a
                        href={integrante.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex h-full items-center gap-3 rounded-2xl border border-base-300 p-4 transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <span
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-black text-primary"
                          aria-hidden="true"
                        >
                          {integrante.iniciais}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-bold leading-5">
                            {integrante.nome}
                          </span>
                          <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                            LinkedIn
                            <i
                              className="fa-solid fa-arrow-up-right-from-square text-xs"
                              aria-hidden="true"
                            />
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="flex flex-col items-center justify-center rounded-3xl bg-primary/10 p-7 text-center">
                <i
                  className="fa-solid fa-heart text-3xl text-primary"
                  aria-hidden="true"
                />
                <h2 className="mt-3 text-2xl font-black text-primary">
                  EntreCausas
                </h2>
                <p className="mt-3 leading-6 text-base-content/70">
                  Mais do que um projeto acadêmico, uma iniciativa para conectar
                  pessoas a causas que transformam comunidades.
                </p>
                <a
                  href="https://github.com/GabrielPLeme/EstanteWeb---Web3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary mt-5 rounded-xl"
                >
                  <i className="fa-brands fa-github" aria-hidden="true" />
                  Acesse nosso repositório
                </a>
                <Link
                  to="/feed"
                  className="mt-4 text-sm font-bold text-primary hover:underline"
                >
                  Descobrir ONGs
                </Link>
              </aside>
            </section>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
      <VLibras />
      <UserWay />
    </div>
  );
}

export default Autoria;
