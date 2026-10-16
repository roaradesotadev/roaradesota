"use client";

import { useState } from "react";
import { IconoPixel } from "@/components/IconoPixel";

export function Copiar({ texto }: { texto: string }) {
  const [estado, setEstado] = useState<"listo" | "copiado" | "error">("listo");
  return (
    <button
      type="button"
      className="copiar"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(texto);
          setEstado("copiado");
        } catch {
          setEstado("error");
        }
        window.setTimeout(() => setEstado("listo"), 2200);
      }}
    >
      <IconoPixel nombre={estado === "copiado" ? "check" : "copiar"} tam={2} />
      <span aria-live="polite">
        {estado === "copiado" ? "Copiado" : estado === "error" ? "No se pudo copiar: selecciónelo" : "Copiar correo"}
      </span>
    </button>
  );
}
