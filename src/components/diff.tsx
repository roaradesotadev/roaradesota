import type { Diff } from "@/content/historial";

export function DiffProceso({ diff }: { diff: Diff }) {
  return (
    <figure className="diff" aria-label="El proceso antes y después">
      <figcaption className="diff-cabeza mono">
        <span>proceso: antes → después</span>
        {diff.ilustrativo && <span>ejemplo ilustrativo</span>}
      </figcaption>
      <ol>
        {diff.antes.map((t, k) => (
          <li key={`a${k}`} className="diff-menos" style={{ "--i": k } as React.CSSProperties}>
            <span className="signo mono" aria-hidden="true">−</span>
            <span className="texto">
              <span className="sr-only">Antes: </span>
              <span className="tachado">{t}</span>
            </span>
          </li>
        ))}
        {diff.despues.map((t, k) => (
          <li key={`d${k}`} className="diff-mas" style={{ "--i": diff.antes.length + k } as React.CSSProperties}>
            <span className="signo mono" aria-hidden="true">+</span>
            <span className="texto">
              <span className="sr-only">Después: </span>
              {t}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
