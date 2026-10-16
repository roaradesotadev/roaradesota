// Convierte el mapa ASCII, la leyenda y las estampas en capas listas para dibujar.
import type { Estampa, HotspotFijo, MapaDef } from "../tipos";
import type { Atlas } from "./procedural";
import type { SufijoAuto } from "./procedural";

export type MapaListo = {
  def: MapaDef;
  ancho: number;
  alto: number;
  base: Uint16Array; // pasto bajo todo (índice del atlas + 1)
  suelo: Uint16Array; // lo que va sobre el pasto; 0 = nada
  objetos: Uint16Array;
  encima: Uint16Array;
  solido: Uint8Array;
  hotspots: Map<string, HotspotFijo>;
};

export const clave = (x: number, y: number) => `${x},${y}`;

// Variante estable por posición, para que el pasto no "hierva" entre cuadros.
function variante(x: number, y: number, n: number) {
  const h = ((x * 73856093) ^ (y * 19349663) ^ 0x5bd1e995) >>> 0;
  return h % n;
}

// Qué pieza de un conjunto con bordes toca, según qué vecinos (N, E, S, O) son del mismo conjunto.
function sufijo(n: boolean, e: boolean, s: boolean, o: boolean): SufijoAuto {
  const m = (n ? 1 : 0) | (e ? 2 : 0) | (s ? 4 : 0) | (o ? 8 : 0);
  const tabla: Record<number, SufijoAuto> = {
    15: "c",
    14: "t",
    13: "r",
    11: "b",
    7: "l",
    12: "tr",
    6: "tl",
    3: "bl",
    9: "br",
    5: "v",
    10: "h",
    1: "vb",
    4: "vt",
    2: "hl",
    8: "hr",
    0: "dot",
  };
  return tabla[m];
}

export function parsearMapa(def: MapaDef, atlas: Atlas, estampas: Record<string, Estampa>): MapaListo {
  const { ancho, alto } = def;
  if (def.suelo.length !== alto || def.objetos.length !== alto) throw new Error(`Mapa ${def.id}: se esperaban ${alto} filas`);
  const n = ancho * alto;
  const base = new Uint16Array(n);
  const suelo = new Uint16Array(n);
  const objetos = new Uint16Array(n);
  const encima = new Uint16Array(n);
  const solido = new Uint8Array(n);

  const pastos = (() => {
    const d = def.leyenda["."];
    const lista = Array.isArray(d?.tile) ? d.tile : [d?.tile ?? "pasto"];
    return lista.map((nm) => atlas.indice(nm));
  })();

  const defDe = (ch: string, x: number, y: number) => {
    const d = def.leyenda[ch];
    if (!d) throw new Error(`Mapa ${def.id}: carácter sin leyenda "${ch}" en ${x},${y}`);
    return d;
  };
  const autoEn = (x: number, y: number, grupo: string) => {
    if (x < 0 || y < 0 || x >= ancho || y >= alto) return true; // fuera del mapa, el conjunto sigue
    return def.leyenda[def.suelo[y][x]]?.auto === grupo;
  };

  for (let y = 0; y < alto; y++) {
    const filaSuelo = def.suelo[y];
    const filaObj = def.objetos[y];
    if (filaSuelo.length !== ancho || filaObj.length !== ancho) throw new Error(`Mapa ${def.id}: la fila ${y} no mide ${ancho}`);
    for (let x = 0; x < ancho; x++) {
      const i = y * ancho + x;
      base[i] = pastos[variante(x, y, pastos.length)] + 1;

      const ch = filaSuelo[x];
      const d = defDe(ch, x, y);
      if (d.auto) {
        const s = sufijo(autoEn(x, y - 1, d.auto), autoEn(x + 1, y, d.auto), autoEn(x, y + 1, d.auto), autoEn(x - 1, y, d.auto));
        suelo[i] = atlas.indice(`${d.auto}_${s}`) + 1;
      } else if (ch !== "." && d.tile) {
        const nombres = Array.isArray(d.tile) ? d.tile : [d.tile];
        suelo[i] = atlas.indice(nombres[variante(x, y, nombres.length)]) + 1;
      }
      if (d.solido) solido[i] = 1;

      const co = filaObj[x];
      if (co === " ") continue;
      const o = defDe(co, x, y);
      if (!o.tile) continue;
      const nombres = Array.isArray(o.tile) ? o.tile : [o.tile];
      const idx = atlas.indice(nombres[variante(x, y, nombres.length)]) + 1;
      if (o.capa === "encima") encima[i] = idx;
      else objetos[i] = idx;
      if (o.solido) solido[i] = 1;
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

  return { def, ancho, alto, base, suelo, objetos, encima, solido, hotspots };
}
