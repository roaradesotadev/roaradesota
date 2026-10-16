// Edificios, árboles y rocas como estampas de varios tiles. Con el paquete se recortan de sus hojas;
// sin él, se arman con los tiles procedurales (mismo tamaño y misma puerta).
import type { Estampa } from "../tipos";
import { techosDe, type Atlas } from "../motor/procedural";
import type { Hojas } from "../motor/recursos";

type DefEdificio = {
  ancho: number;
  alto: number;
  puertaCol: number; // columna de la puerta dentro de la estampa (la fila es la última)
  hoja: [keyof Hojas, number, number]; // recorte en el paquete (hoja, col, fila)
  techo: string; // color del plan B
  filasTecho: number;
};

export const EDIFICIOS: Record<string, DefEdificio> = {
  sede_intnova: { ancho: 4, alto: 5, puertaCol: 2, hoja: ["house", 25, 7], techo: "#2f7d5b", filasTecho: 3 },
  laboratorio: { ancho: 3, alto: 3, puertaCol: 1, hoja: ["house", 23, 0], techo: "#2a9d8f", filasTecho: 1 },
  casa_modelo: { ancho: 4, alto: 3, puertaCol: 1, hoja: ["house", 0, 0], techo: "#c94a3b", filasTecho: 1 },
  oficina: { ancho: 4, alto: 3, puertaCol: 1, hoja: ["house", 4, 0], techo: "#3d6fb5", filasTecho: 1 },
  banco: { ancho: 4, alto: 5, puertaCol: 1, hoja: ["house", 25, 14], techo: "#55607a", filasTecho: 3 },
  centro_comercial: { ancho: 3, alto: 3, puertaCol: 1, hoja: ["house", 16, 0], techo: "#8e4b9e", filasTecho: 1 },
  universidad: { ancho: 4, alto: 3, puertaCol: 1, hoja: ["house", 12, 0], techo: "#8c2f2f", filasTecho: 1 },
  academia: { ancho: 4, alto: 3, puertaCol: 2, hoja: ["house", 19, 0], techo: "#d9822b", filasTecho: 1 },
};

type DefDecorado = {
  ancho: number;
  alto: number;
  hoja: [keyof Hojas, number, number];
  relleno: string; // tile procedural del plan B
  solido?: boolean[][]; // por defecto, todo sólido
};

export const DECORADOS: Record<string, DefDecorado> = {
  arbol: { ancho: 2, alto: 2, hoja: ["nature", 0, 0], relleno: "arbol" },
  arbol2: { ancho: 2, alto: 2, hoja: ["nature", 18, 0], relleno: "arbol" },
  arboleda: { ancho: 3, alto: 3, hoja: ["nature", 16, 2], relleno: "arbol" },
  roca_grande: { ancho: 4, alto: 3, hoja: ["nature", 17, 10], relleno: "muro" },
  roca_media: { ancho: 3, alto: 3, hoja: ["nature", 12, 5], relleno: "muro" },
  roca_chica: { ancho: 2, alto: 2, hoja: ["nature", 13, 8], relleno: "muro" },
  mina_entrada: { ancho: 3, alto: 2, hoja: ["house", 0, 8], relleno: "cueva" },
  torii: {
    ancho: 3,
    alto: 2,
    hoja: ["house", 0, 5],
    relleno: "cerca_v",
    solido: [
      [true, false, true],
      [true, false, true],
    ],
  },
};

export function puertaDe(nombre: string) {
  const e = EDIFICIOS[nombre];
  return { col: e.puertaCol, fila: e.alto - 1 };
}

const lleno = (ancho: number, alto: number) => Array.from({ length: alto }, () => Array<boolean>(ancho).fill(true));

function recortar(atlas: Atlas, hojas: Hojas, nombre: string, hoja: keyof Hojas, c0: number, f0: number, ancho: number, alto: number) {
  const tiles: (number | null)[][] = [];
  for (let r = 0; r < alto; r++) {
    const fila: (number | null)[] = [];
    for (let c = 0; c < ancho; c++) fila.push(atlas.registrarRecorte(`${nombre}_${r}_${c}`, hojas[hoja], c0 + c, f0 + r));
    tiles.push(fila);
  }
  return tiles;
}

export function construirEstampas(atlas: Atlas, hojas?: Hojas): Record<string, Estampa> {
  const salida: Record<string, Estampa> = {};

  for (const [nombre, e] of Object.entries(EDIFICIOS)) {
    if (hojas) {
      salida[nombre] = { tiles: recortar(atlas, hojas, nombre, e.hoja[0], e.hoja[1], e.hoja[2], e.ancho, e.alto), solido: lleno(e.ancho, e.alto) };
      continue;
    }
    // plan B: techo de color, paredes con ventanas y una puerta
    const t = techosDe(atlas, nombre, e.techo);
    const pared = atlas.indice("pared");
    const ventana = atlas.indice("pared_ventana");
    const puerta = atlas.indice("pared_puerta");
    const tiles: (number | null)[][] = [];
    for (let r = 0; r < e.alto; r++) {
      const fila: (number | null)[] = [];
      for (let c = 0; c < e.ancho; c++) {
        if (r < e.filasTecho) fila.push(r === 0 ? t.cima : r === e.filasTecho - 1 ? t.borde : t.cuerpo);
        else if (r === e.alto - 1) fila.push(c === e.puertaCol ? puerta : c % 2 === 1 ? ventana : pared);
        else fila.push(c % 2 === 1 ? ventana : pared);
      }
      tiles.push(fila);
    }
    salida[nombre] = { tiles, solido: lleno(e.ancho, e.alto) };
  }

  for (const [nombre, d] of Object.entries(DECORADOS)) {
    const solido = d.solido ?? lleno(d.ancho, d.alto);
    if (hojas) {
      salida[nombre] = { tiles: recortar(atlas, hojas, nombre, d.hoja[0], d.hoja[1], d.hoja[2], d.ancho, d.alto), solido };
    } else {
      const idx = atlas.indice(d.relleno);
      salida[nombre] = { tiles: Array.from({ length: d.alto }, () => Array<number | null>(d.ancho).fill(idx)), solido };
    }
  }
  return salida;
}
