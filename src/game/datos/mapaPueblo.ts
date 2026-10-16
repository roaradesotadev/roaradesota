// El pueblo: 40 × 30 casillas. El suelo y los objetos se pintan por código sobre una grilla ASCII;
// los edificios, árboles y rocas entran como estampas. Coordenadas en casillas, (0,0) arriba a la izquierda.
import type { Colocacion, HotspotFijo, MapaDef, Npc } from "../tipos";
import { LEYENDA } from "./leyenda";
import { EDIFICIOS, DECORADOS, puertaDe } from "./estampas";
import { DIALOGOS } from "./dialogos";

const W = 40;
const H = 30;

type Grilla = string[][];
const grilla = (relleno: string): Grilla => Array.from({ length: H }, () => Array<string>(W).fill(relleno));

function rect(g: Grilla, x: number, y: number, w: number, h: number, ch: string) {
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (g[j]?.[i] !== undefined) g[j][i] = ch;
}
function poner(g: Grilla, puntos: [number, number][], ch: string) {
  for (const [x, y] of puntos) g[y][x] = ch;
}

const suelo = grilla(".");
const objetos = grilla(" ");
const colocaciones: Colocacion[] = [];

// --- edificios: nombre, esquina superior izquierda ---
const edificios: Colocacion[] = [
  { estampa: "sede_intnova", x: 18, y: 2, id: "intnova" },
  { estampa: "laboratorio", x: 33, y: 2, id: "laboratorio" },
  { estampa: "casa_modelo", x: 26, y: 3, id: "inmobiliaria" },
  { estampa: "oficina", x: 31, y: 10, id: "consultoria" },
  { estampa: "academia", x: 3, y: 12, id: "academia" },
  { estampa: "centro_comercial", x: 9, y: 22, id: "centro_comercial" },
  { estampa: "universidad", x: 21, y: 22, id: "universidad" },
  { estampa: "banco", x: 29, y: 20, id: "banca" },
];
colocaciones.push(...edificios);

const puerta = (id: string) => {
  const c = edificios.find((k) => k.id === id)!;
  const p = puertaDe(c.estampa);
  return { x: c.x + p.col, y: c.y + p.fila };
};
// quien atiende afuera (a la derecha de la puerta) y el letrero (a la izquierda)
const afuera = (id: string, dx: number) => {
  const p = puerta(id);
  return { x: p.x + dx, y: p.y + 1 };
};

// --- la mina: rocas y entrada, al noroeste ---
colocaciones.push(
  { estampa: "roca_grande", x: 2, y: 2 },
  { estampa: "roca_grande", x: 6, y: 2 },
  { estampa: "roca_media", x: 2, y: 6 },
  { estampa: "mina_entrada", x: 5, y: 6 },
  { estampa: "roca_chica", x: 10, y: 3 },
);

// --- árboles: borde del mapa de dos casillas y algunos grupos adentro ---
for (let x = 0; x < W; x += 2) {
  colocaciones.push({ estampa: x % 4 ? "arbol2" : "arbol", x, y: 0 });
  colocaciones.push({ estampa: x % 4 ? "arbol" : "arbol2", x, y: H - 2 });
}
for (let y = 2; y < H - 2; y += 2) {
  colocaciones.push({ estampa: y % 4 ? "arbol" : "arbol2", x: 0, y });
  colocaciones.push({ estampa: y % 4 ? "arbol2" : "arbol", x: W - 2, y });
}
colocaciones.push(
  { estampa: "arboleda", x: 11, y: 11 },
  { estampa: "arbol", x: 11, y: 6 },
  { estampa: "arbol2", x: 14, y: 3 },
  { estampa: "arbol", x: 23, y: 9 },
  { estampa: "arbol2", x: 36, y: 13 },
  { estampa: "arbol", x: 3, y: 18 },
  { estampa: "arbol2", x: 12, y: 18 },
  { estampa: "arbol", x: 26, y: 18 },
  { estampa: "arbol2", x: 35, y: 26 },
  { estampa: "arbol", x: 13, y: 26 },
  { estampa: "torii", x: 19, y: 18 },
);

// --- suelo ---
rect(suelo, 19, 7, 2, 20, "="); // camino principal, de la sede al sur
rect(suelo, 5, 16, 32, 2, "="); // camino este-oeste
rect(suelo, 8, 26, 26, 1, "="); // camino del sur, frente a los edificios
rect(suelo, 6, 8, 13, 1, "="); // camino de la mina
rect(suelo, 27, 6, 1, 10, "="); // de la casa modelo al camino
rect(suelo, 32, 13, 1, 3, "="); // de la oficina al camino
rect(suelo, 15, 11, 10, 7, "p"); // la plaza
rect(suelo, 2, 21, 5, 6, "~"); // el estanque
rect(suelo, 10, 3, 4, 4, "*");
rect(suelo, 24, 8, 3, 3, "+");
rect(suelo, 35, 17, 3, 3, "%");
rect(suelo, 2, 17, 3, 3, ",");
rect(suelo, 35, 7, 3, 2, ",");
rect(suelo, 13, 19, 3, 2, "*");
rect(suelo, 26, 20, 3, 2, "+");
rect(suelo, 8, 23, 2, 2, "%");

// --- objetos sueltos ---
rect(objetos, 22, 8, 4, 1, "-"); // cerca de la sede
poner(objetos, [[14, 10], [25, 10], [14, 18], [25, 18], [8, 19], [34, 8], [37, 22]], "b");
poner(objetos, [[10, 9], [3, 10], [36, 6], [36, 27], [9, 21]], "o");

// --- personajes ---
const npcs: Npc[] = [
  { id: "rodrigo", nombre: "Rodrigo", sprite: "rodrigo", x: 20, y: 12, dir: "abajo", dialogo: DIALOGOS.rodrigoPlaza },
  { id: "jarvis", nombre: "Jarvis", sprite: "jarvis", ...afuera("intnova", 1), dir: "abajo", dialogo: DIALOGOS.jarvis },
  { id: "jefa", nombre: "Jefa de procesos", sprite: "jefa", x: 9, y: 7, dir: "abajo", dialogo: DIALOGOS.jefa },
  { id: "analista", nombre: "Analista de la inmobiliaria", sprite: "analista", ...afuera("inmobiliaria", 1), dir: "abajo", dialogo: DIALOGOS.analista },
  { id: "keyuser", nombre: "Key user de SAP", sprite: "keyuser", ...afuera("consultoria", 1), dir: "abajo", dialogo: DIALOGOS.keyuser },
  { id: "steward", nombre: "Data steward", sprite: "steward", ...afuera("banca", 1), dir: "abajo", dialogo: DIALOGOS.steward },
  { id: "coordinador", nombre: "Coordinador de innovación", sprite: "coordinador", ...afuera("centro_comercial", 1), dir: "abajo", dialogo: DIALOGOS.coordinador },
  { id: "profesor", nombre: "Profesor", sprite: "profesor", ...afuera("universidad", 1), dir: "abajo", dialogo: DIALOGOS.profesor },
  { id: "facilitador", nombre: "Facilitador", sprite: "facilitador", ...afuera("academia", 1), dir: "abajo", dialogo: DIALOGOS.facilitador },
];

// --- letreros, buzón, puertas ---
const letreros: { x: number; y: number; dialogo: () => ReturnType<typeof DIALOGOS.letreroPlaza> }[] = [
  { x: 18, y: 12, dialogo: DIALOGOS.letreroPlaza },
  { ...afuera("intnova", -2), dialogo: () => DIALOGOS.letreroEdificio("intnova", "2026 – hoy") },
  { x: 5, y: 8, dialogo: () => DIALOGOS.letreroEdificio("mineria", "2022 – 2024") },
  { ...afuera("academia", -1), dialogo: () => DIALOGOS.letreroEdificio("academia", "2026") },
  { ...afuera("inmobiliaria", -1), dialogo: () => DIALOGOS.letreroEdificio("inmobiliaria", "2024") },
  { ...afuera("consultoria", -1), dialogo: () => DIALOGOS.letreroEdificio("consultoria", "2024") },
  { ...afuera("banca", -1), dialogo: () => DIALOGOS.letreroEdificio("banca", "2024 – 2026") },
  { ...afuera("centro_comercial", -1), dialogo: () => DIALOGOS.letreroEdificio("main", "Centro comercial de Lima · 2025") },
  { ...afuera("universidad", 2), dialogo: () => DIALOGOS.letreroEdificio("universidad", "2017 – 2022") },
  { ...afuera("laboratorio", -1), dialogo: () => DIALOGOS.letreroEdificio("laboratorio", "próximamente") },
];
poner(objetos, letreros.map((l) => [l.x, l.y]), "S");
poner(objetos, [[23, 7]], "M");

const hotspots: HotspotFijo[] = [
  ...letreros.map((l) => ({ tipo: "letrero" as const, x: l.x, y: l.y, dialogo: l.dialogo })),
  { tipo: "buzon", x: 23, y: 7, dialogo: DIALOGOS.buzon },
  { tipo: "objeto", x: 6, y: 7, dialogo: DIALOGOS.cueva },
  { tipo: "objeto", x: 7, y: 7, dialogo: DIALOGOS.cueva },
  { tipo: "puerta", ...puerta("intnova"), dialogo: () => DIALOGOS.puertaCerrada("Jarvis") },
  { tipo: "puerta", ...puerta("laboratorio"), dialogo: DIALOGOS.laboratorio },
  { tipo: "puerta", ...puerta("inmobiliaria"), dialogo: () => DIALOGOS.puertaCerrada("La analista") },
  { tipo: "puerta", ...puerta("consultoria"), dialogo: () => DIALOGOS.puertaCerrada("El key user") },
  { tipo: "puerta", ...puerta("academia"), dialogo: () => DIALOGOS.puertaCerrada("El facilitador") },
  { tipo: "puerta", ...puerta("centro_comercial"), dialogo: () => DIALOGOS.puertaCerrada("El coordinador") },
  { tipo: "puerta", ...puerta("universidad"), dialogo: () => DIALOGOS.puertaCerrada("El profesor") },
  { tipo: "puerta", ...puerta("banca"), dialogo: () => DIALOGOS.puertaCerrada("El data steward") },
];

// Comprobación en desarrollo: ningún personaje ni letrero dentro de una estampa sólida.
const tam = (nombre: string) => EDIFICIOS[nombre] ?? DECORADOS[nombre];
const mascaraDe = (nombre: string): boolean[][] | undefined => DECORADOS[nombre]?.solido;
for (const p of [...npcs, ...letreros, { x: 20, y: 15 }]) {
  for (const c of colocaciones) {
    const e = tam(c.estampa);
    const dentro = p.x >= c.x && p.x < c.x + e.ancho && p.y >= c.y && p.y < c.y + e.alto;
    const mascara = mascaraDe(c.estampa);
    const solido = !mascara || !!mascara[p.y - c.y]?.[p.x - c.x];
    if (dentro && solido) throw new Error(`(${p.x},${p.y}) cae dentro de ${c.estampa} en ${c.x},${c.y}`);
  }
}

export const MAPA_PUEBLO: MapaDef = {
  id: "pueblo",
  ancho: W,
  alto: H,
  suelo: suelo.map((f) => f.join("")),
  objetos: objetos.map((f) => f.join("")),
  leyenda: LEYENDA,
  colocaciones,
  hotspots,
  npcs,
  inicio: { x: 20, y: 15, dir: "arriba" },
};
