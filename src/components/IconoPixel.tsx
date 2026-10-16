// Iconos dibujados en píxeles (SVG con bordes duros), para que la interfaz hable el mismo idioma que el juego.
const GLIFOS = {
  chevron_abajo: ["X.....X", ".X...X.", "..X.X..", "...X..."],
  chevron_arriba: ["...X...", "..X.X..", ".X...X.", "X.....X"],
  chevron_izquierda: ["...X", "..X.", ".X..", "X...", ".X..", "..X.", "...X"],
  chevron_derecha: ["X...", ".X..", "..X.", "...X", "..X.", ".X..", "X..."],
  cursor: ["X...", "XX..", "XXX.", "XXXX", "XXX.", "XX..", "X..."],
  flecha_derecha: ["....X..", ".....X.", "XXXXXXX", ".....X.", "....X.."],
  flecha_izquierda: ["..X....", ".X.....", "XXXXXXX", ".X.....", "..X...."],
  descargar: ["...X...", "...X...", "...X...", ".X.X.X.", "..XXX..", "...X...", "XXXXXXX"],
  copiar: ["XXXXX..", "X...X..", "X.XXXXX", "X.X.X.X", "XXX.X.X", "..X...X", "..XXXXX"],
  check: [".....X", "....X.", "X..X..", ".XX...", "..X..."],
  mando: [".XXXXXXXXX.", "X.X.XXXXX.X", "XXXXX.X.XXX", "X.X.XXXXX.X", ".XXXXXXXXX.", "XX.......XX"],
  libro: ["XXXX.XXXX", "X..X.X..X", "X..X.X..X", "X..X.X..X", "X..X.X..X", "XXXX.XXXX", "....X...."],
} as const;

export type NombreIcono = keyof typeof GLIFOS;

export function IconoPixel({ nombre, tam = 2, className }: { nombre: NombreIcono; tam?: number; className?: string }) {
  const filas = GLIFOS[nombre];
  const ancho = filas[0].length;
  const alto = filas.length;
  return (
    <svg
      className={`icono-pixel${className ? ` ${className}` : ""}`}
      width={ancho * tam}
      height={alto * tam}
      viewBox={`0 0 ${ancho} ${alto}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {filas.flatMap((fila, y) =>
        Array.from(fila).map((c, x) => (c === "X" ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" /> : null)),
      )}
    </svg>
  );
}
