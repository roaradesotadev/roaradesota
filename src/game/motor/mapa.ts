// Convierte el mapa ASCII, la leyenda y las estampas en capas listas para dibujar.
import type { Estampa, HotspotFijo, MapaDef } from "../tipos";
import type { Atlas } from "./procedural";

export type Animado = { x: number; y: number; frames: number[] };

export type MapaListo = {
  def: MapaDef;
  ancho: number;
  alto: number;
  suelo: Uint16Array; // índice del atlas + 1; 0 = vacío
  objetos: Uint16Array;
  encima: Uint16Array;
  solido: Uint8Array;
  animados: Animado[];
  hotspots: Map<string, HotspotFijo>;
};

export const clave = (x: number, y: number) => `${x},${y}`;

// Variante estable por posición, para que el pasto no "hierva" entre cuadros.
function variante(x: number, y: number, n: number) {
  const h = ((x * 73856093) ^ (y * 19349663) ^ 0x5bd1e995) >>> 0;
  return h % n;
}

export function parsearMapa(def: MapaDef, atlas: Atlas, estampas: Record<string, Estampa>): MapaListo {
  const { ancho, alto } = def;
  if (def.suelo.length !== alto || def.objetos.length !== alto) {
    throw new Error(`Mapa ${def.id}: se esperaban ${alto} filas`);
  }
  const n = ancho * alto;
  const suelo = new Uint16Array(n);
  const objetos = new Uint16Array(n);
  const encima = new Uint16Array(n);
  const solido = new Uint8Array(n);
  const animados: Animado[] = [];

  const resolver = (ch: string, x: number, y: number) => {
    const d = def.leyenda[ch];
    if (!d) throw new Error(`Mapa ${def.id}: carácter sin leyenda "${ch}" en ${x},${y}`);
    const nombres = Array.isArray(d.tile) ? d.tile : [d.tile];
    const nombre = nombres[variante(x, y, nombres.length)];
    return { d, idx: atlas.indice(nombre) };
  };

  for (let y = 0; y < alto; y++) {
    const filaSuelo = def.suelo[y];
    const filaObj = def.objetos[y];
    if (filaSuelo.length !== ancho || filaObj.length !== ancho) {
      throw new Error(`Mapa ${def.id}: la fila ${y} no mide ${ancho}`);
    }
    for (let x = 0; x < ancho; x++) {
      const i = y * ancho + x;
      const s = resolver(filaSuelo[x], x, y);
      suelo[i] = s.idx + 1;
      if (s.d.solido) solido[i] = 1;
      if (s.d.anim) animados.push({ x, y, frames: s.d.anim.map((nm) => atlas.indice(nm)) });

      const ch = filaObj[x];
      if (ch === " ") continue;
      const o = resolver(ch, x, y);
      if (o.d.capa === "encima") encima[i] = o.idx + 1;
      else objetos[i] = o.idx + 1;
      if (o.d.solido) solido[i] = 1;
    }
  }

  for (const c of def.colocaciones) {
    const e = estampas[c.estampa];
    if (!e) throw new Error(`Mapa ${def.id}: estampa desconocida "${c.estampa}"`);
    e.tiles.forEach((fila, r) =>
      fila.forEach((t, col) => {
        const x = c.x + col;
        const y = c.y + r;
        if (x < 0 || y < 0 || x >= ancho || y >= alto) return;
        const i = y * ancho + x;
        if (t !== null) objetos[i] = t + 1;
        const enc = e.encima?.[r]?.[col];
        if (enc !== undefined && enc !== null) encima[i] = enc + 1;
        if (e.solido[r]?.[col]) solido[i] = 1;
      }),
    );
  }

  const hotspots = new Map<string, HotspotFijo>();
  for (const h of def.hotspots) hotspots.set(clave(h.x, h.y), h);

  return { def, ancho, alto, suelo, objetos, encima, solido, animados, hotspots };
}
