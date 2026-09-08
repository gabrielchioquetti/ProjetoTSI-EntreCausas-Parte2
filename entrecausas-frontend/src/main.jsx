import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/style.css";

import Home from "./pages/Home";
import Detalhes from "./pages/Detalhes/detalhes";
import Impacto from "./pages/Impacto/impacto";

const caminho = window.location.pathname;

const pagina = caminho.startsWith("/detalhes") ? (
  <Detalhes />
) : caminho.startsWith("/impacto") ? (
  <Impacto />
) : (
  <Home />
);

createRoot(document.getElementById("root")).render(
  <StrictMode>{pagina}</StrictMode>,
);
