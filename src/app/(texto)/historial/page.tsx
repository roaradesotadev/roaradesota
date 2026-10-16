import Link from "next/link";
import { IconoPixel } from "@/components/IconoPixel";
import { Historial } from "@/components/historial";

export default function Inicio() {
  return (
    <>
      <section className="portada" aria-labelledby="nombre">
        <div className="portada-riel" aria-hidden="true" />
        <div className="portada-caja">
          <h1 id="nombre">Rodrigo Arancibia</h1>
          <p className="posicion">
            Construyo sistemas que automatizan procesos, ordenan datos y ponen la IA a trabajar sobre lo que la
            empresa ya tiene. Este es mi diario de misiones: cada proyecto, con el antes y el después.
          </p>
          <div className="acciones">
            <Link className="boton" href="/hablemos">
              Conversemos 30 minutos <IconoPixel nombre="flecha_derecha" tam={2} />
            </Link>
            <a className="enlace-sec" href="/cv/CV_Rodrigo_Arancibia.pdf" download>
              <IconoPixel nombre="descargar" tam={2} /> Bajar CV
            </a>
          </div>
        </div>
      </section>
      <Historial />
    </>
  );
}
