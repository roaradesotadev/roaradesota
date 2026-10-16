"use client";

import { useEffect, useRef, useState } from "react";
import { RAMAS, HISTORIAL, type RamaId } from "@/content/historial";

const PERIODO: Record<RamaId, string> = {
  main: "2017 – hoy",
  banca: "2024 – 2026",
  inmobiliaria: "2024",
  consultoria: "2024",
  mineria: "2022 – 2024",
};
const ORDEN: RamaId[] = ["main", "banca", "inmobiliaria", "consultoria", "mineria"];

// La fila que cruza la franja de lectura queda en primer plano y enciende su rama;
// su diff se "escribe" la primera vez que llega ahí. Sin JS, todo se ve completo.
export function LogVivo({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);
  const [activa, setActiva] = useState<string>("main");

  useEffect(() => {
    const log = ref.current;
    if (!log) return;
    const filas = Array.from(log.querySelectorAll<HTMLLIElement>(".fila"));
    const movimiento = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    log.classList.add("vivo");
    if (movimiento) log.classList.add("anima");

    const marcar = (fila: HTMLLIElement) => {
      filas.forEach((f) => f.classList.toggle("leyendo", f === fila));
      fila.classList.add("vista");
      setActiva(fila.dataset.rama ?? "main");
    };

    // HEAD se escribe al cargar.
    const t = window.setTimeout(() => filas[0] && marcar(filas[0]), 350);

    const io = new IntersectionObserver(
      (entradas) => {
        const visibles = entradas.filter((e) => e.isIntersecting);
        if (visibles.length) marcar(visibles[0].target as HTMLLIElement);
      },
      { rootMargin: "-38% 0px -52% 0px" },
    );
    filas.forEach((f) => io.observe(f));
    return () => {
      window.clearTimeout(t);
      io.disconnect();
    };
  }, []);

  return (
    <div className="historial-grid">
      <div className="panel-texto">
        <ol className="log" ref={ref} data-activa={activa} aria-label="Historial de proyectos y trayectoria">
          {children}
        </ol>
      </div>
      <aside className="ramas" aria-label="Ramas de la trayectoria">
        <h2>Ramas</h2>
        <ul>
          {ORDEN.map((id) => {
            const r = RAMAS[id];
            const destino = id === "main" ? HISTORIAL[0].id : `merge-${id}`;
            return (
              <li key={id}>
                <a
                  href={`#${destino}`}
                  aria-current={activa === id ? "true" : undefined}
                  style={{ "--c": r.color } as React.CSSProperties}
                >
                  <span className="punto-rama" aria-hidden="true" />
                  <span className="nombre-rama">{id === "main" ? "Rama principal" : r.sector}</span>
                  <span className="sector-rama">{id === "main" ? `Rodrigo Arancibia, ${PERIODO[id]}` : PERIODO[id]}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
