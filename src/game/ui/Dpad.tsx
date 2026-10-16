"use client";

import { useRef } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import type { Puente } from "../puente";
import type { Direccion } from "../tipos";

const FLECHAS: { dir: Direccion; Icono: typeof ChevronUp; etiqueta: string }[] = [
  { dir: "arriba", Icono: ChevronUp, etiqueta: "Arriba" },
  { dir: "izquierda", Icono: ChevronLeft, etiqueta: "Izquierda" },
  { dir: "derecha", Icono: ChevronRight, etiqueta: "Derecha" },
  { dir: "abajo", Icono: ChevronDown, etiqueta: "Abajo" },
];

// Cruceta y botones A/B para pantallas táctiles. Mantener pulsado camina; deslizar el pulgar cambia de dirección.
export function Dpad({ puente }: { puente: Puente }) {
  const presion = useRef<Direccion | null>(null);

  const fijar = (dir: Direccion | null) => {
    if (presion.current === dir) return;
    presion.current = dir;
    puente.emit("entrada:dpad", { dir });
  };

  const alBajar = (e: React.PointerEvent<HTMLButtonElement>, dir: Direccion) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    fijar(dir);
  };

  const alMover = (e: React.PointerEvent) => {
    if (!presion.current) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const dir = el?.closest("[data-dpad]")?.getAttribute("data-dpad") as Direccion | null | undefined;
    if (dir) fijar(dir);
  };

  const soltar = () => fijar(null);

  return (
    <div className="mando" role="group" aria-label="Mando táctil">
      <div className="cruceta" onPointerMove={alMover} onPointerUp={soltar} onPointerCancel={soltar}>
        {FLECHAS.map(({ dir, Icono, etiqueta }) => (
          <button
            key={dir}
            type="button"
            data-dpad={dir}
            aria-label={etiqueta}
            onPointerDown={(e) => alBajar(e, dir)}
            onContextMenu={(e) => e.preventDefault()}
          >
            <Icono size={28} strokeWidth={3} aria-hidden="true" />
          </button>
        ))}
        <span className="cruceta-centro" aria-hidden="true" />
      </div>
      <div className="botones">
        <button
          type="button"
          className="boton-b"
          aria-label="Correr (mantener pulsado)"
          onPointerDown={(e) => {
            e.preventDefault();
            puente.emit("entrada:correr", { activo: true });
          }}
          onPointerUp={() => puente.emit("entrada:correr", { activo: false })}
          onPointerCancel={() => puente.emit("entrada:correr", { activo: false })}
          onContextMenu={(e) => e.preventDefault()}
        >
          B
        </button>
        <button
          type="button"
          className="boton-a"
          aria-label="Hablar o avanzar"
          onPointerDown={(e) => {
            e.preventDefault();
            puente.emit("entrada:accion", undefined);
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          A
        </button>
      </div>
    </div>
  );
}
