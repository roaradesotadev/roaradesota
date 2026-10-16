"use client";

import Link from "next/link";
import type { Puente } from "../puente";
import { useEstadoJuego } from "./usePuente";

// Pantalla de título: se renderiza en el servidor (nombre y texto indexables) y da el primer gesto del usuario.
export function PantallaTitulo({ puente }: { puente: Puente }) {
  const estado = useEstadoJuego(puente);
  const jugar = () => {
    puente.actualizar({ fase: "jugando" });
    puente.emit("juego:fase", { fase: "jugando" });
  };
  return (
    <div className="titulo">
      <div className="titulo-caja">
        <h1>Rodrigo Arancibia</h1>
        <p>
          Automatización de procesos, datos e IA aplicada. Este portafolio es un pueblo: cada edificio es un lugar donde
          trabajé, y la gente le cuenta qué hice ahí.
        </p>
        <button type="button" className="titulo-jugar" onClick={jugar} autoFocus>
          Jugar
        </button>
        <p className="titulo-ayuda parpadeo" aria-hidden="true">
          {estado.tactil ? "Cruceta para caminar · A para hablar" : "Flechas para caminar · Espacio para hablar"}
        </p>
        <Link className="titulo-texto" href="/historial">
          Prefiero leer: modo texto →
        </Link>
      </div>
    </div>
  );
}
