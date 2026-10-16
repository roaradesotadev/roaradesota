"use client";

import { useId, useState } from "react";
import type { Caso } from "@/content/casos";
import type { Diff } from "@/content/historial";
import { DiffProceso } from "./diff";
import { RecreacionJarvis } from "./recreacion-jarvis";

const CIRCULADOS = "①②③④⑤⑥⑦⑧⑨";

// Convierte ①…⑨ del texto en el número de pieza con el estilo del sistema.
function ConPiezas({ texto }: { texto: string }) {
  const partes = Array.from(texto);
  return (
    <>
      {partes.map((c, k) => {
        const n = CIRCULADOS.indexOf(c);
        return n === -1 ? (
          c
        ) : (
          <span key={k} className="num" aria-label={`pieza ${n + 1}`}>
            {n + 1}
          </span>
        );
      })}
    </>
  );
}

export function CasoVista({ caso, diff }: { caso: Caso; diff?: Diff }) {
  const [lado, setLado] = useState<"frente" | "reverso">("frente");
  const base = useId();
  const tabs = [
    { id: "frente" as const, texto: "Frente: el resultado" },
    { id: "reverso" as const, texto: "Reverso: cómo lo construí" },
  ];

  return (
    <>
      <div className="pestanas" role="tablist" aria-label="Lado del caso">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`${base}-${t.id}`}
            aria-selected={lado === t.id}
            aria-controls={`${base}-panel-${t.id}`}
            tabIndex={lado === t.id ? 0 : -1}
            onClick={() => setLado(t.id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                const otro = lado === "frente" ? "reverso" : "frente";
                setLado(otro);
                document.getElementById(`${base}-${otro}`)?.focus();
              }
            }}
          >
            {t.texto}
          </button>
        ))}
      </div>

      <section
        className="panel"
        role="tabpanel"
        id={`${base}-panel-frente`}
        aria-labelledby={`${base}-frente`}
        hidden={lado !== "frente"}
      >
        <h2>El problema</h2>
        <p>{caso.problema}</p>
        {diff && <DiffProceso diff={diff} />}
        <h2>Lo que cambió</h2>
        <ul className="lista-resultado">
          {caso.resultado.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        {caso.slug === "jarvis" && (
          <>
            <h2>Así se ve una orden</h2>
            <RecreacionJarvis />
          </>
        )}
      </section>

      <section
        className="panel"
        role="tabpanel"
        id={`${base}-panel-reverso`}
        aria-labelledby={`${base}-reverso`}
        hidden={lado !== "reverso"}
      >
        <h2>Las piezas</h2>
        <ol className="piezas">
          {caso.piezas.map((p) => (
            <li key={p.n}>
              <span className="num" aria-hidden="true">
                {p.n}
              </span>
              <div>
                <strong>{p.nombre}.</strong> {p.texto}
              </div>
            </li>
          ))}
        </ol>
        <h2>Las estaciones</h2>
        <ol className="estaciones">
          {caso.estaciones.map((s) => (
            <li key={s.nombre}>
              <span className="punto" aria-hidden="true" />
              <div>
                <h3>{s.nombre}</h3>
                <p>
                  <ConPiezas texto={s.texto} />
                </p>
              </div>
            </li>
          ))}
        </ol>
        <h2>Con qué</h2>
        <ul className="herramientas">
          {caso.herramientas.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <h2>Lo que aprendí</h2>
        <ul className="lista-resultado">
          {caso.aprendizajes.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
