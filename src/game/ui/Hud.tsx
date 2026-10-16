"use client";

import Link from "next/link";
import { BookOpen, Gamepad2 } from "lucide-react";
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
            <Gamepad2 size={18} strokeWidth={2.5} aria-hidden="true" />
            <span className="sr-only">Mando táctil</span>
          </button>
        )}
        <Link className="hud-enlace" href="/historial">
          <BookOpen size={18} strokeWidth={2.5} aria-hidden="true" />
          Modo texto
        </Link>
      </div>
    </div>
  );
}
