import { useEffect } from "react";

function UserWay() {
  useEffect(() => {
    const scriptId = "userway-widget-script";

    // Evita carregar o script mais de uma vez se o componente for remontado
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://cdn.userway.org/widget.js";
      script.async = true;
      script.setAttribute("data-account", "v1ay4b37l9");

      document.body.appendChild(script);
    }
  }, []);

  return null; // O widget do UserWay injeta a própria interface no DOM
}

export default UserWay;
