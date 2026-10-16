import type { Metadata } from "next";
import { Copiar } from "@/components/copiar";
import { IconoPixel } from "@/components/IconoPixel";

export const metadata: Metadata = {
  title: "Hablemos",
  description: "Escríbale a Rodrigo Arancibia para conversar 30 minutos sobre un proceso, un curso o un proyecto.",
};

const CORREO = "roarancibia733@gmail.com";
const ASUNTO = encodeURIComponent("Conversemos 30 minutos");

export default function Hablemos() {
  return (
    <div className="pagina">
      <div className="ficha">
        <h1>Conversemos 30 minutos</h1>
        <p className="bajada">
          Cuénteme qué proceso le quita más tiempo a su equipo, qué curso necesita o qué quiere construir.
        </p>
        <div className="correo">
          <a className="direccion" href={`mailto:${CORREO}?subject=${ASUNTO}`}>
            {CORREO}
          </a>
          <Copiar texto={CORREO} />
        </div>
        <h2><IconoPixel nombre="cursor" tam={2} />Otras formas</h2>
        <ul className="lista-resultado">
          <li>
            Por LinkedIn: <a href="https://www.linkedin.com/in/hirodrigoarancibia" rel="noopener">linkedin.com/in/hirodrigoarancibia</a>
          </li>
          <li>
            Si escribe por su empresa: <a href="https://www.intnovaconsulting.com" rel="noopener">INTNOVA Consulting</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
