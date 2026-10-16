import Link from "next/link";
import { IconoPixel } from "@/components/IconoPixel";
import { HISTORIAL, RAMAS, carrilesActivos, type Entrada, type RamaId } from "@/content/historial";
import { DiffProceso } from "./diff";
import { LogVivo } from "./log-vivo";

const X0 = 22;
const X1 = 52;
const NY = 30;

// Un tramo del grafo por fila: rieles verticales, curvas de fork/merge y el nodo.
function Grafo({ entrada, i, ultimo }: { entrada: Entrada; i: number; ultimo: boolean }) {
  const activos = carrilesActivos(i);
  const lateral = activos.find((r) => r !== "main") as RamaId | undefined;
  const esHead = i === 0;
  const enLateral = entrada.rama !== "main" && entrada.tipo === "cambio";
  const cx = enLateral ? X1 : X0;

  return (
    <div className="fila-grafo" aria-hidden="true">
      <svg>
        {/* riel principal */}
        <line className="riel r-main" x1={X0} x2={X0} y1={esHead ? NY : 0} y2={ultimo ? NY : "100%"} />
        {/* rama lateral */}
        {lateral && entrada.tipo === "cambio" && (
          <line className={`riel r-${lateral}`} x1={X1} x2={X1} y1={0} y2="100%" />
        )}
        {entrada.tipo === "merge" && (
          <>
            <path className={`riel r-${entrada.rama}`} d={`M ${X1} ${NY + 34} C ${X1} ${NY + 14}, ${X0} ${NY + 18}, ${X0} ${NY}`} />
            <line className={`riel r-${entrada.rama}`} x1={X1} x2={X1} y1={NY + 34} y2="100%" />
          </>
        )}
        {entrada.tipo === "fork" && (
          <path className={`riel r-${entrada.rama}`} d={`M ${X0} ${NY} C ${X0} ${NY - 16}, ${X1} ${NY - 12}, ${X1} 0`} />
        )}
        {entrada.tipo === "cambio" ? (
          <circle
            className={`nodo r-${entrada.rama} ${esHead ? "nodo-head" : ""}`}
            cx={cx}
            cy={NY}
            r={esHead ? 7 : 6}
          />
        ) : (
          <circle className={`nodo r-${entrada.rama}`} cx={X0} cy={NY} r={4} />
        )}
      </svg>
    </div>
  );
}

function Fila({ entrada, i, ultimo }: { entrada: Entrada; i: number; ultimo: boolean }) {
  const compacta = entrada.tipo !== "cambio";
  const rama = RAMAS[entrada.rama];
  const esHead = i === 0;
  return (
    <li
      className={`fila ${compacta ? "fila-compacta" : ""} ${esHead ? "fila-head" : ""}`}
      data-rama={entrada.rama}
      id={entrada.id}
    >
      <Grafo entrada={entrada} i={i} ultimo={ultimo} />
      <div className="fila-cuerpo">
        {compacta ? (
          <p className="titulo-commit">
            {entrada.titulo} · {entrada.fecha}
          </p>
        ) : (
          <>
            {esHead ? (
              <h2 className="titulo-commit">{entrada.titulo}</h2>
            ) : (
              <h3 className="titulo-commit">{entrada.titulo}</h3>
            )}
            <div className="meta-commit">
              {esHead && <span className="ref">Lo más reciente · </span>}
              {entrada.rama === "main" ? entrada.fecha : `${entrada.fecha} · ${rama.sector}`}
            </div>
            {entrada.detalle && <p className="detalle-commit">{entrada.detalle}</p>}
            {entrada.diff && <DiffProceso diff={entrada.diff} />}
            {entrada.caso && (
              <Link className="ver-caso" href={`/casos/${entrada.caso}`}>
                Ver el caso completo <IconoPixel nombre="flecha_derecha" tam={2} />
              </Link>
            )}
          </>
        )}
      </div>
    </li>
  );
}

export function Historial() {
  return (
    <LogVivo>
      {HISTORIAL.map((e, i) => (
        <Fila key={e.id} entrada={e} i={i} ultimo={i === HISTORIAL.length - 1} />
      ))}
    </LogVivo>
  );
}
