import { useEffect } from "react";

function VLibras() {
  useEffect(() => {
    const scriptId = "vlibras-script";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
      script.async = true;
      script.onload = () => {
        if (window.VLibras) {
          new window.VLibras.Widget("https://vlibras.gov.br/app");
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="enabled" {...{ vw: "" }}>
      <div className="active" {...{ "vw-access-button": "" }}></div>
      <div {...{ "vw-plugin-wrapper": "" }}>
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
}

export default VLibras;
