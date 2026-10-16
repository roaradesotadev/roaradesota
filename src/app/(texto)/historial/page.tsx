import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { Historial } from "@/components/historial";

export default function Inicio() {
  return (
    <>
      <section className="portada" aria-labelledby="nombre">
        <div className="portada-riel" aria-hidden="true" />
        <div>
          <h1 id="nombre">Rodrigo Arancibia</h1>
          <p className="posicion">
            Construyo sistemas que automatizan procesos, ordenan datos y ponen la IA a trabajar sobre lo que la
            empresa ya tiene. Este es el historial: cada proyecto, con el antes y el después.
          </p>
          <div className="acciones">
            <Link className="boton" href="/hablemos">
              Conversemos 30 minutos <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </Link>
            <a className="enlace-sec" href="/cv/CV_Rodrigo_Arancibia.pdf" download>
              <Download size={17} strokeWidth={2} aria-hidden="true" /> Bajar CV
            </a>
          </div>
        </div>
      </section>
      <Historial />
    </>
  );
}
