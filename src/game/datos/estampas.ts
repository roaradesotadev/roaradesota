// Edificios del pueblo como estampas de varios tiles. Un edificio = filas de techo + filas de pared con puerta.
import type { Estampa } from "../tipos";
import { techosDe, type Atlas } from "../motor/procedural";

type Edificio = {
  ancho: number;
  alto: number;
  filasTecho: number;
  techo: string; // color
  puerta?: string; // tile de la puerta
};

export const EDIFICIOS: Record<string, Edificio> = {
  sede_intnova: { ancho: 8, alto: 6, filasTecho: 3, techo: "#2f7d5b" },
  laboratorio: { ancho: 4, alto: 4, filasTecho: 2, techo: "#2a9d8f", puerta: "puerta_lab" },
  casa_modelo: { ancho: 6, alto: 5, filasTecho: 2, techo: "#c94a3b" },
  oficina: { ancho: 6, alto: 5, filasTecho: 2, techo: "#3d6fb5" },
  banco: { ancho: 8, alto: 6, filasTecho: 3, techo: "#55607a" },
  centro_comercial: { ancho: 7, alto: 6, filasTecho: 3, techo: "#8e4b9e" },
  universidad: { ancho: 7, alto: 6, filasTecho: 3, techo: "#8c2f2f" },
  academia: { ancho: 6, alto: 5, filasTecho: 2, techo: "#d9822b" },
};

// Columna de la puerta dentro de la estampa (la fila es la última).
export function puertaDe(nombre: string) {
  const e = EDIFICIOS[nombre];
  return { col: Math.floor(e.ancho / 2), fila: e.alto - 1 };
}

export function construirEstampas(atlas: Atlas): Record<string, Estampa> {
  const salida: Record<string, Estampa> = {};
  const pared = atlas.indice("pared");
  const ventana = atlas.indice("pared_ventana");
  for (const [nombre, e] of Object.entries(EDIFICIOS)) {
    const t = techosDe(atlas, nombre, e.techo);
    const puerta = atlas.indice(e.puerta ?? "pared_puerta");
    const { col: colPuerta } = puertaDe(nombre);
    const tiles: (number | null)[][] = [];
    const solido: boolean[][] = [];
    for (let r = 0; r < e.alto; r++) {
      const fila: (number | null)[] = [];
      for (let c = 0; c < e.ancho; c++) {
        if (r < e.filasTecho) {
          fila.push(r === 0 ? t.cima : r === e.filasTecho - 1 ? t.borde : t.cuerpo);
        } else if (r === e.alto - 1) {
          fila.push(c === colPuerta ? puerta : c % 2 === 1 ? ventana : pared);
        } else {
          fila.push(c % 2 === 1 ? ventana : pared);
        }
      }
      tiles.push(fila);
      solido.push(Array(e.ancho).fill(true));
    }
    salida[nombre] = { tiles, solido };
  }
  return salida;
}
