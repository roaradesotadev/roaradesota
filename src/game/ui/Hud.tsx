"use client";

import Link from "next/link";
import { IconoPixel } from "@/components/IconoPixel";
import type { Puente } from "../puente";
import { useEstadoJuego } from "./usePuente";

export function Hud({ puente }: { puente: Puente }) {
  const estado = useEstadoJuego(puente);
  return (
    <div className="hud">
      <div className="hud-acciones">
        {estado.fase === "jugando" && (
          <button
            type="button"
            className="hud-boton"
            aria-pressed={estado.tactil}
            onClick={() => puente.actualizar({ tactil: !estado.tactil })}
            title={estado.tactil ? "Ocultar el mando" : "Mostrar el mando táctil"}
          >
            <IconoPixel nombre="mando" tam={2} />
            <span className="sr-only">Mando táctil</span>
          </button>
        )}
        <Link className="hud-enlace" href="/historial">
          <IconoPixel nombre="libro" tam={2} />
          Modo texto
        </Link>
      </div>
    </div>
  );
}
