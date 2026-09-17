import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import Ongs from "../../components/Ongs/Ongs";
import Impacto from "../../components/Impacto/Impacto";
import Footer from "../../components/Footer/Footer";
import BackToTop from "../../components/Acessibilidade/BackToTop";
import VLibras from "../../components/Acessibilidade/VLibras";
import UserWay from "../../components/Acessibilidade/UserWay";
import QuemSomos from "../../components/QuemSomos/quemSomos";

function Home() {
  return (
    <div id="site">
      <Header />
      <main>
        <Hero />
        <QuemSomos />
        <Ongs />
        <Impacto />
      </main>

      <Footer />
      <BackToTop />
      <VLibras />
      <UserWay />
    </div>
  );
}

export default Home;

/*

<>
      <a href="#conteudo-principal" className="skip-link">
        Pular para o conteúdo principal
      </a>
      <div id="site">
        <Header />
        <div id="nav-hover-zone" aria-hidden="true"></div>
        <main id="conteudo-principal">
          <Hero />
          <Ongs />
          <Impacto />
        </main>
        <Footer />
        <BackToTop />
        <VLibras />
        <UserWay />
      </div>
    </>

*/
