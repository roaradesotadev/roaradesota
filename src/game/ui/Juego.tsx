"use client";

import { useEffect, useRef } from "react";
import { Juego as Motor } from "../motor/juego";
import { MAPA_PUEBLO } from "../datos/mapaPueblo";
import type { Puente } from "../puente";

export function Juego({ puente }: { puente: Puente }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!contenedor.current || !canvas.current) return;
    const q = new URLSearchParams(window.location.search);
    const motor = new Motor(contenedor.current, canvas.current, puente, MAPA_PUEBLO, { debug: q.has("debug"), grilla: q.has("grilla") });
    motor.iniciar();
    return () => motor.destruir();
  }, [puente]);

  return (
    <div
      className="lienzo"
      ref={contenedor}
      tabIndex={0}
      role="application"
      aria-label="Pueblo de Rodrigo Arancibia. Flechas para caminar, Espacio para hablar con los personajes."
    >
      <canvas ref={canvas} />
    </div>
  );
}
