// Gráficos del paquete "Ninja Adventure" (CC0, pixel-boy y AAA): hojas de tiles y personajes en /public/juego.
// Aquí se eligen los recortes que forman el pueblo; los nombres coinciden con los del atlas procedural.
import type { Celda, Direccion, HojaPersonaje } from "../tipos";
import { Atlas, SUFIJOS_AUTO, pintarAviso, pintarBuzon, pintarLetrero, type SufijoAuto } from "./procedural";

export const BASE = "/juego";

export type Hojas = {
  ripples: HTMLImageElement; // 4 cuadros de ondas, se dibujan sobre el agua
  field: HTMLImageElement;
  floor: HTMLImageElement;
  water: HTMLImageElement;
  nature: HTMLImageElement;
  house: HTMLImageElement;
};

export function cargarImagen(url: string): Promise<HTMLImageElement> {
  return new Promise((resolver, rechazar) => {
    const img = new Image();
    img.onload = () => resolver(img);
    img.onerror = () => rechazar(new Error(`No cargó ${url}`));
    img.src = url;
  });
}

export async function cargarHojas(): Promise<Hojas> {
  const [field, floor, water, nature, house, ripples] = await Promise.all(
    ["TilesetField", "TilesetFloor", "TilesetWater", "TilesetNature", "TilesetHouse", "Ripples"].map((n) => cargarImagen(`${BASE}/hojas/${n}.png`)),
  );
  return { field, floor, water, nature, house, ripples };
}

// Un conjunto con bordes: la posición del bloque de 3 × 3 y, si existen, las tiras y el punto suelto.
type ConjuntoAuto = {
  hoja: keyof Hojas;
  bloque: [number, number]; // esquina superior izquierda del 3 × 3 (col, fila)
  tiras?: { v: [number, number]; h: [number, number]; dot: [number, number] }; // v: tope de la tira vertical; h: cabo izquierdo de la horizontal
};

const CONJUNTOS: Record<string, ConjuntoAuto> = {
  camino: { hoja: "floor", bloque: [0, 7], tiras: { v: [3, 7], h: [0, 10], dot: [3, 10] } },
  agua: { hoja: "water", bloque: [0, 6], tiras: { v: [3, 6], h: [0, 9], dot: [3, 9] } },
  plaza: { hoja: "field", bloque: [0, 0] },
};

function registrarConjunto(atlas: Atlas, hojas: Hojas, nombre: string, c: ConjuntoAuto) {
  const img = hojas[c.hoja];
  const [bx, by] = c.bloque;
  const pos: Record<SufijoAuto, [number, number]> = {
    tl: [bx, by],
    t: [bx + 1, by],
    tr: [bx + 2, by],
    l: [bx, by + 1],
    c: [bx + 1, by + 1],
    r: [bx + 2, by + 1],
    bl: [bx, by + 2],
    b: [bx + 1, by + 2],
    br: [bx + 2, by + 2],
    // sin tiras, las tiras se parecen a los bordes
    vt: c.tiras ? c.tiras.v : [bx + 1, by],
    v: c.tiras ? [c.tiras.v[0], c.tiras.v[1] + 1] : [bx + 1, by + 1],
    vb: c.tiras ? [c.tiras.v[0], c.tiras.v[1] + 2] : [bx + 1, by + 2],
    hl: c.tiras ? c.tiras.h : [bx, by + 1],
    h: c.tiras ? [c.tiras.h[0] + 1, c.tiras.h[1]] : [bx + 1, by + 1],
    hr: c.tiras ? [c.tiras.h[0] + 2, c.tiras.h[1]] : [bx + 2, by + 1],
    dot: c.tiras ? c.tiras.dot : [bx + 1, by + 1],
  };
  for (const s of SUFIJOS_AUTO) atlas.registrarRecorte(`${nombre}_${s}`, img, pos[s][0], pos[s][1]);
  atlas.alias(nombre, `${nombre}_c`);
}

// Tiles sueltos: nombre → hoja y casilla.
const SUELTOS: Record<string, [keyof Hojas, number, number]> = {
  pasto: ["floor", 0, 12],
  pasto2: ["floor", 1, 12],
  pasto3: ["floor", 3, 12],
  pasto4: ["floor", 4, 12],
  pasto_alto: ["nature", 7, 11],
  flores_rosa: ["nature", 3, 11],
  flores_amar: ["nature", 0, 11],
  flores_azul: ["nature", 6, 11],
  arbusto: ["nature", 1, 10],
  roca: ["nature", 15, 9],
  cerca_h: ["house", 12, 7],
  cerca_v: ["house", 14, 5],
  arbol: ["nature", 1, 10],
  muro: ["nature", 17, 11],
  cueva: ["house", 1, 9],
};

export function crearAtlasReal(hojas: Hojas): Atlas {
  const atlas = new Atlas();
  for (const [nombre, [hoja, col, fila]] of Object.entries(SUELTOS)) atlas.registrarRecorte(nombre, hojas[hoja], col, fila);
  for (const [nombre, c] of Object.entries(CONJUNTOS)) registrarConjunto(atlas, hojas, nombre, c);
  atlas.registrar("buzon", pintarBuzon);
  atlas.registrar("letrero", pintarLetrero); // el paquete no trae un letrero de pie
  atlas.registrar("aviso", pintarAviso);
  return atlas;
}

// ---------- Personajes del paquete ----------

// Hoja Walk.png: 4 columnas = direcciones (abajo, arriba, izquierda, derecha); 4 filas = pasos.
const COL_DIR: Record<Direccion, number> = { abajo: 0, arriba: 1, izquierda: 2, derecha: 3 };

export const PERSONAJES_REALES: Record<string, string> = {
  visitante: "Boy",
  rodrigo: "Villager3",
  jarvis: "RobotGrey",
  jefa: "Village6",
  analista: "Villager4",
  keyuser: "Inspector",
  steward: "Noble",
  coordinador: "Hunter",
  profesor: "Master",
  facilitador: "Villager5",
};

export async function cargarHojaReal(clave: string): Promise<HojaPersonaje> {
  const imagen = await cargarImagen(`${BASE}/personajes/${clave}.png`);
  const celda = (dir: Direccion, moviendo: boolean, t: number): Celda => {
    const paso = moviendo ? Math.floor((t % 1) * 4) % 4 : 0;
    return { sx: COL_DIR[dir] * 16, sy: paso * 16, w: 16, h: 16 };
  };
  return { imagen, offsetY: 1, celda };
}

export function retratoDe(clave: string) {
  return `${BASE}/caras/${clave}.png`;
}
