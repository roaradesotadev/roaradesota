// El pueblo: 40 × 30 casillas. El suelo y los objetos se pintan por código sobre una grilla ASCII,
// y los edificios entran como estampas. Coordenadas en casillas, (0,0) arriba a la izquierda.
import type { HotspotFijo, MapaDef, Npc } from "../tipos";
import { LEYENDA } from "./leyenda";
import { EDIFICIOS, puertaDe } from "./estampas";
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

// --- suelo ---
rect(suelo, 19, 8, 2, 20, "="); // camino principal, de la sede al sur
rect(suelo, 5, 16, 32, 2, "="); // camino este-oeste
rect(suelo, 8, 27, 27, 1, "="); // camino del sur, frente a los edificios
rect(suelo, 6, 9, 13, 1, "="); // camino de la mina
rect(suelo, 29, 8, 1, 8, "="); // de la casa modelo al camino
rect(suelo, 15, 11, 10, 7, "p"); // la plaza
rect(suelo, 1, 20, 7, 8, "s"); // orilla del estanque
rect(suelo, 2, 21, 5, 6, "~"); // el estanque
rect(suelo, 10, 3, 5, 4, "*");
rect(suelo, 25, 8, 3, 3, "+");
rect(suelo, 36, 17, 3, 3, "%");
rect(suelo, 1, 17, 4, 3, ",");
rect(suelo, 36, 8, 3, 2, ",");
rect(suelo, 13, 18, 3, 2, "*");
rect(suelo, 26, 18, 3, 2, "+");

// --- objetos ---
rect(objetos, 0, 0, W, 1, "T"); // borde de árboles
rect(objetos, 0, H - 1, W, 1, "T");
rect(objetos, 0, 0, 1, H, "T");
rect(objetos, W - 1, 0, 1, H, "T");
rect(objetos, 1, 1, 9, 8, "#"); // la montaña de la mina
rect(objetos, 1, 1, 9, 1, "^");
poner(objetos, [[6, 8]], "C"); // entrada de la mina
rect(objetos, 21, 9, 4, 1, "-"); // cerca de la sede
poner(objetos, [[12, 12], [13, 13], [27, 12], [28, 13], [10, 18], [31, 18], [16, 28], [36, 28], [3, 28], [11, 1], [24, 1], [33, 7], [37, 11], [38, 14]], "T");
poner(objetos, [[14, 10], [25, 10], [14, 18], [25, 18], [2, 15], [37, 21], [37, 26]], "b");
poner(objetos, [[3, 10], [8, 11], [37, 3], [36, 6]], "o");

// --- edificios: nombre, esquina superior izquierda ---
const colocaciones = [
  { estampa: "sede_intnova", x: 16, y: 2, id: "intnova" },
  { estampa: "laboratorio", x: 33, y: 2, id: "laboratorio" },
  { estampa: "casa_modelo", x: 26, y: 3, id: "inmobiliaria" },
  { estampa: "oficina", x: 31, y: 10, id: "consultoria" },
  { estampa: "academia", x: 3, y: 11, id: "academia" },
  { estampa: "centro_comercial", x: 8, y: 20, id: "centro_comercial" },
  { estampa: "universidad", x: 21, y: 20, id: "universidad" },
  { estampa: "banco", x: 30, y: 20, id: "banca" },
];

const puerta = (id: string) => {
  const c = colocaciones.find((k) => k.id === id)!;
  const p = puertaDe(c.estampa);
  return { x: c.x + p.col, y: c.y + p.fila };
};

// --- personajes ---
const npcs: Npc[] = [
  { id: "rodrigo", nombre: "Rodrigo", sprite: "rodrigo", x: 20, y: 12, dir: "abajo", dialogo: DIALOGOS.rodrigoPlaza },
  { id: "jarvis", nombre: "Jarvis", sprite: "jarvis", x: 19, y: 8, dir: "abajo", dialogo: DIALOGOS.jarvis },
  { id: "jefa", nombre: "Jefa de procesos", sprite: "jefa", x: 7, y: 9, dir: "abajo", dialogo: DIALOGOS.jefa },
  { id: "analista", nombre: "Analista de la inmobiliaria", sprite: "analista", x: 28, y: 8, dir: "abajo", dialogo: DIALOGOS.analista },
  { id: "keyuser", nombre: "Key user de SAP", sprite: "keyuser", x: 33, y: 15, dir: "abajo", dialogo: DIALOGOS.keyuser },
  { id: "steward", nombre: "Data steward", sprite: "steward", x: 33, y: 26, dir: "abajo", dialogo: DIALOGOS.steward },
  { id: "coordinador", nombre: "Coordinador de innovación", sprite: "coordinador", x: 12, y: 26, dir: "abajo", dialogo: DIALOGOS.coordinador },
  { id: "profesor", nombre: "Profesor", sprite: "profesor", x: 25, y: 26, dir: "abajo", dialogo: DIALOGOS.profesor },
  { id: "facilitador", nombre: "Facilitador", sprite: "facilitador", x: 7, y: 16, dir: "izquierda", dialogo: DIALOGOS.facilitador },
];

// --- letreros, buzón, puertas ---
const letreros: { x: number; y: number; dialogo: () => ReturnType<typeof DIALOGOS.letreroPlaza> }[] = [
  { x: 18, y: 12, dialogo: DIALOGOS.letreroPlaza },
  { x: 18, y: 8, dialogo: () => DIALOGOS.letreroEdificio("intnova", "2026 – hoy") },
  { x: 4, y: 9, dialogo: () => DIALOGOS.letreroEdificio("mineria", "2022 – 2024") },
  { x: 3, y: 16, dialogo: () => DIALOGOS.letreroEdificio("academia", "2026") },
  { x: 30, y: 8, dialogo: () => DIALOGOS.letreroEdificio("inmobiliaria", "2024") },
  { x: 35, y: 15, dialogo: () => DIALOGOS.letreroEdificio("consultoria", "2024") },
  { x: 31, y: 26, dialogo: () => DIALOGOS.letreroEdificio("banca", "2024 – 2026") },
  { x: 9, y: 26, dialogo: () => DIALOGOS.letreroEdificio("main", "Centro comercial de Lima · 2025") },
  { x: 22, y: 26, dialogo: () => DIALOGOS.letreroEdificio("universidad", "2017 – 2022") },
  { x: 33, y: 6, dialogo: () => DIALOGOS.letreroEdificio("laboratorio", "próximamente") },
];
poner(objetos, letreros.map((l) => [l.x, l.y]), "S");
poner(objetos, [[25, 8]], "M");

const hotspots: HotspotFijo[] = [
  ...letreros.map((l) => ({ tipo: "letrero" as const, x: l.x, y: l.y, dialogo: l.dialogo })),
  { tipo: "buzon", x: 25, y: 8, dialogo: DIALOGOS.buzon },
  { tipo: "objeto", x: 6, y: 8, dialogo: DIALOGOS.cueva },
  { tipo: "puerta", ...puerta("intnova"), dialogo: () => DIALOGOS.puertaCerrada("Jarvis") },
  { tipo: "puerta", ...puerta("laboratorio"), dialogo: DIALOGOS.laboratorio },
  { tipo: "puerta", ...puerta("inmobiliaria"), dialogo: () => DIALOGOS.puertaCerrada("La analista") },
  { tipo: "puerta", ...puerta("consultoria"), dialogo: () => DIALOGOS.puertaCerrada("El key user") },
  { tipo: "puerta", ...puerta("academia"), dialogo: () => DIALOGOS.puertaCerrada("El facilitador") },
  { tipo: "puerta", ...puerta("centro_comercial"), dialogo: () => DIALOGOS.puertaCerrada("El coordinador") },
  { tipo: "puerta", ...puerta("universidad"), dialogo: () => DIALOGOS.puertaCerrada("El profesor") },
  { tipo: "puerta", ...puerta("banca"), dialogo: () => DIALOGOS.puertaCerrada("El data steward") },
];

// Comprobación en desarrollo: ningún personaje sobre un edificio.
for (const n of npcs) {
  for (const c of colocaciones) {
    const e = EDIFICIOS[c.estampa];
    if (n.x >= c.x && n.x < c.x + e.ancho && n.y >= c.y && n.y < c.y + e.alto) {
      throw new Error(`El personaje ${n.id} está dentro de ${c.estampa}`);
    }
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
