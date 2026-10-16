"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Play } from "lucide-react";
import type { Puente } from "../puente";
import type { EstadoDialogo, Opcion } from "../tipos";
import { useEstadoJuego } from "./usePuente";
import { useMaquinaEscribir } from "./useMaquinaEscribir";

const TECLAS_AVANCE = new Set(["Space", "Enter", "KeyZ"]);
const SIN_OPCIONES: Opcion[] = [];

export function CajaDialogo({ puente }: { puente: Puente }) {
  const estado = useEstadoJuego(puente);
  const d = estado.dialogo;
  if (!d) return null;
  // Una clave por página: cada página monta su propia caja, con la máquina de escribir y la selección en cero.
  return <Caja key={`${d.npcId ?? "x"}:${d.indice}:${d.dialogo.paginas.length}`} puente={puente} d={d} />;
}

function Caja({ puente, d }: { puente: Puente; d: EstadoDialogo }) {
  const router = useRouter();
  const [sel, setSel] = useState(0);
  const pagina = d.dialogo.paginas[d.indice] ?? "";
  const ultima = d.indice >= d.dialogo.paginas.length - 1;
  const opciones = d.dialogo.opciones ?? SIN_OPCIONES;
  const { visible, completo, completar } = useMaquinaEscribir(pagina);
  const mostrarOpciones = ultima && completo && opciones.length > 0;

  const cerrar = useCallback(() => puente.actualizar({ dialogo: null }), [puente]);

  const avanzar = useCallback(() => {
    if (!completo) {
      completar();
      return;
    }
    if (!ultima) {
      puente.actualizar({ dialogo: { ...d, indice: d.indice + 1 } });
      return;
    }
    if (opciones.length) return; // espera una elección
    cerrar();
  }, [completo, completar, ultima, opciones.length, puente, d, cerrar]);

  const elegir = useCallback(
    (op: Opcion) => {
      cerrar();
      if (op.accion.tipo === "ir") router.push(op.accion.href);
      else if (op.accion.tipo === "enlace") {
        if (op.accion.href.startsWith("mailto:")) window.location.href = op.accion.href;
        else window.open(op.accion.href, "_blank", "noopener");
      }
    },
    [cerrar, router],
  );

  useEffect(() => {
    const n = opciones.length;
    const alTecla = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        e.preventDefault();
        cerrar();
        return;
      }
      // si el foco está en un botón del menú, Enter y Espacio los maneja el propio botón
      const enBoton = document.activeElement?.closest(".dialogo-opciones") != null;
      if (mostrarOpciones) {
        if (e.code === "ArrowDown" || e.code === "KeyS") {
          e.preventDefault();
          setSel((s) => (s + 1) % n);
        } else if (e.code === "ArrowUp" || e.code === "KeyW") {
          e.preventDefault();
          setSel((s) => (s - 1 + n) % n);
        } else if (TECLAS_AVANCE.has(e.code) && !enBoton) {
          e.preventDefault();
          if (!e.repeat) elegir(opciones[sel]);
        }
        return;
      }
      if (TECLAS_AVANCE.has(e.code) && !enBoton) {
        e.preventDefault();
        if (!e.repeat) avanzar();
      }
    };
    window.addEventListener("keydown", alTecla);
    const quitarAccion = puente.on("entrada:accion", () => (mostrarOpciones ? elegir(opciones[sel]) : avanzar()));
    const quitarDpad = puente.on("entrada:dpad", ({ dir }) => {
      if (!mostrarOpciones || !dir) return;
      if (dir === "abajo") setSel((s) => (s + 1) % n);
      if (dir === "arriba") setSel((s) => (s - 1 + n) % n);
    });
    return () => {
      window.removeEventListener("keydown", alTecla);
      quitarAccion();
      quitarDpad();
    };
  }, [mostrarOpciones, opciones, sel, avanzar, elegir, cerrar, puente]);

  return (
    <div
      className="dialogo"
      role="dialog"
      aria-label={d.dialogo.hablante ?? "Mensaje"}
      onClick={() => {
        if (!mostrarOpciones) avanzar();
      }}
    >
      {d.dialogo.hablante && <div className="dialogo-nombre">{d.dialogo.hablante}</div>}
      <p className="dialogo-texto" aria-hidden="true">
        {visible}
      </p>
      <p className="sr-only" aria-live="polite">
        {pagina}
      </p>
      {!mostrarOpciones && completo && (
        <span className="dialogo-flecha" aria-hidden="true">
          <ChevronDown size={22} strokeWidth={3} />
        </span>
      )}
      {mostrarOpciones && (
        <ul className="dialogo-opciones" role="menu" aria-label="Opciones">
          {opciones.map((op, i) => (
            <li key={op.texto} role="none">
              <button
                type="button"
                role="menuitem"
                className={i === sel ? "activa" : undefined}
                onMouseEnter={() => setSel(i)}
                onClick={(e) => {
                  e.stopPropagation();
                  elegir(op);
                }}
              >
                {i === sel && <Play className="cursor" size={14} fill="currentColor" strokeWidth={0} aria-hidden="true" />}
                {op.texto}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
