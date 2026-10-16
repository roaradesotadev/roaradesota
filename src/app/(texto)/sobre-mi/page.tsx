import type { Metadata } from "next";
import Link from "next/link";
import { IconoPixel } from "@/components/IconoPixel";
import { TRAYECTORIA, TEMAS, FORMACION, DOCENCIA_INTRO, DOCENCIA_EXPERIENCIA, PERFIL_RESUMEN } from "@/content/perfil";

export const metadata: Metadata = {
  title: "Sobre mí",
  description: "Trayectoria, docencia y formación de Rodrigo Arancibia: procesos, datos e IA aplicada.",
};

export default function SobreMi() {
  return (
    <div className="pagina">
      <div className="ficha">
        <h1>Sobre mí</h1>
        <p className="bajada">{PERFIL_RESUMEN}</p>
        <div className="acciones">
          <a className="boton" href="/cv/CV_Rodrigo_Arancibia.pdf" download>
            <IconoPixel nombre="descargar" tam={2} /> Bajar CV
          </a>
          <Link className="enlace-sec" href="/hablemos">
            Conversemos <IconoPixel nombre="flecha_derecha" tam={2} />
          </Link>
        </div>

        <h2><IconoPixel nombre="cursor" tam={2} />Trayectoria</h2>
        <ul className="tabla-trayectoria">
          {TRAYECTORIA.map((t) => (
            <li key={t.rol}>
              <span className="pastilla" style={{ "--c": t.c } as React.CSSProperties} aria-hidden="true" />
              <span className="mono" style={{ fontSize: "0.85rem", color: "var(--tinta-3)" }}>
                {t.fecha}
              </span>
              <span>
                <strong>{t.rol}.</strong> {t.texto}
              </span>
            </li>
          ))}
        </ul>

        <h2><IconoPixel nombre="cursor" tam={2} />Docencia</h2>
        <p>{DOCENCIA_INTRO}</p>
        <ul className="lista-resultado">
          {TEMAS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p style={{ marginTop: 18 }}>{DOCENCIA_EXPERIENCIA}</p>

        <h2><IconoPixel nombre="cursor" tam={2} />Formación</h2>
        <ul className="lista-resultado">
          {FORMACION.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
