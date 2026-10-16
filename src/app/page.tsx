import { Portada } from "@/game/ui/Portada";

export default function Inicio() {
  return (
    <>
      <Portada />
      <noscript>
        <div className="sin-js">
          <h1>Rodrigo Arancibia</h1>
          <p>
            Este portafolio es un pequeño juego y necesita JavaScript. Puede leerlo completo en el{" "}
            <a href="/historial">modo texto</a>: historial, casos, trayectoria y contacto.
          </p>
        </div>
      </noscript>
    </>
  );
}
