"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

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
      {estado === "copiado" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      <span aria-live="polite">
        {estado === "copiado" ? "Copiado" : estado === "error" ? "No se pudo copiar: selecciónelo" : "Copiar correo"}
      </span>
    </button>
  );
}
