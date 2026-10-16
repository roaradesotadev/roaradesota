// Gráficos dibujados en código: el atlas de tiles y las hojas de personajes.
// Son el marcador de posición mientras no haya un paquete CC0 aprobado, y el plan B si no lo hay.
import { TILE } from "../tipos";

const PAL = {
  pasto: "#8cd46c",
  pastoOsc: "#5fb04a",
  pastoClaro: "#a6e088",
  camino: "#e4d29a",
  caminoPunto: "#b89f66",
  piedra: "#cfd3cc",
  piedraOsc: "#aab0a8",
  arena: "#efe3b4",
  agua: "#5aa8f0",
  aguaClara: "#a4d8fb",
  tronco: "#7a5230",
  copa: "#3f8f3a",
  copaOsc: "#2c6b2b",
  copaClara: "#5cb04c",
  muro: "#9c7a5a",
  muroOsc: "#6f5138",
  muroClaro: "#c2a07e",
  roca: "#a8a29a",
  rocaOsc: "#6f6a63",
  madera: "#b4824c",
  maderaOsc: "#7d5a33",
  pared: "#f3ecd6",
  paredOsc: "#d6cdb1",
  ventana: "#7ec3f0",
  ventanaOsc: "#3c6aa8",
  puerta: "#8a5a32",
  puertaOsc: "#5e3c1e",
  metal: "#9aa5ad",
  metalOsc: "#5d6870",
  tinta: "#2a2320",
  flor1: "#f07aa8",
  flor2: "#f6c343",
  flor3: "#8ea0f0",
};

class Pincel {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private ox: number,
    private oy: number,
  ) {}
  rect(x: number, y: number, w: number, h: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(this.ox + x, this.oy + y, w, h);
  }
  px(x: number, y: number, color: string) {
    this.rect(x, y, 1, 1, color);
  }
  fondo(color: string) {
    this.rect(0, 0, TILE, TILE, color);
  }
  // Puntos pseudoaleatorios pero estables (misma semilla, mismo dibujo).
  motas(color: string, n: number, semilla: number) {
    let s = semilla * 7919 + 13;
    for (let i = 0; i < n; i++) {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      const x = s % TILE;
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      const y = s % TILE;
      this.px(x, y, color);
    }
  }
}

export class Atlas {
  imagen: HTMLCanvasElement;
  readonly columnas = 16;
  private ctx: CanvasRenderingContext2D;
  private nombres = new Map<string, number>();
  private n = 0;

  constructor(capacidad = 256) {
    this.imagen = document.createElement("canvas");
    this.imagen.width = TILE * this.columnas;
    this.imagen.height = TILE * Math.ceil(capacidad / this.columnas);
    this.ctx = this.imagen.getContext("2d")!;
  }

  registrar(nombre: string, pintor: (p: Pincel) => void): number {
    const previo = this.nombres.get(nombre);
    if (previo !== undefined) return previo;
    const idx = this.n++;
    if ((idx + 1) * TILE > this.imagen.height * this.columnas) this.crecer();
    pintor(new Pincel(this.ctx, (idx % this.columnas) * TILE, Math.floor(idx / this.columnas) * TILE));
    this.nombres.set(nombre, idx);
    return idx;
  }

  tiene(nombre: string) {
    return this.nombres.has(nombre);
  }

  indice(nombre: string): number {
    const i = this.nombres.get(nombre);
    if (i === undefined) throw new Error(`Tile desconocido en el atlas: ${nombre}`);
    return i;
  }

  dibujar(ctx: CanvasRenderingContext2D, idx: number, x: number, y: number) {
    ctx.drawImage(
      this.imagen,
      (idx % this.columnas) * TILE,
      Math.floor(idx / this.columnas) * TILE,
      TILE,
      TILE,
      x,
      y,
      TILE,
      TILE,
    );
  }

  private crecer() {
    const nuevo = document.createElement("canvas");
    nuevo.width = this.imagen.width;
    nuevo.height = this.imagen.height * 2;
    nuevo.getContext("2d")!.drawImage(this.imagen, 0, 0);
    this.imagen = nuevo;
    this.ctx = nuevo.getContext("2d")!;
  }
}

function flores(p: Pincel, color: string, puntos: [number, number][]) {
  p.fondo(PAL.pasto);
  p.motas(PAL.pastoOsc, 3, 9);
  for (const [x, y] of puntos) {
    p.rect(x, y, 2, 2, color);
    p.px(x + 2, y + 2, PAL.pastoOsc);
    p.px(x - 1, y + 2, PAL.pastoOsc);
  }
}

function techo(p: Pincel, color: string, oscuro: string, claro: string, parte: "cima" | "cuerpo" | "borde") {
  p.fondo(color);
  for (let y = 3; y < TILE; y += 4) {
    p.rect(0, y, TILE, 1, oscuro);
    for (let x = (y / 4) % 2 ? 2 : 6; x < TILE; x += 8) p.px(x, y - 1, oscuro);
  }
  if (parte === "cima") p.rect(0, 0, TILE, 3, claro);
  if (parte === "borde") p.rect(0, 13, TILE, 3, oscuro);
}

function sombrear(hex: string, factor: number): string {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * factor)));
  const r = c((n >> 16) & 255);
  const g = c((n >> 8) & 255);
  const b = c(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export function crearAtlasProcedural(): Atlas {
  const a = new Atlas();
  a.registrar("pasto", (p) => {
    p.fondo(PAL.pasto);
    p.motas(PAL.pastoOsc, 4, 1);
  });
  a.registrar("pasto2", (p) => {
    p.fondo(PAL.pasto);
    p.motas(PAL.pastoOsc, 6, 2);
    p.motas(PAL.pastoClaro, 2, 3);
  });
  a.registrar("pasto3", (p) => {
    p.fondo(PAL.pasto);
    p.motas(PAL.pastoOsc, 3, 4);
  });
  a.registrar("pasto_alto", (p) => {
    p.fondo(PAL.pasto);
    for (const c of [1, 5, 9, 13]) {
      p.rect(c, 8, 1, 5, PAL.pastoOsc);
      p.rect(c + 1, 6, 1, 6, PAL.copaOsc);
      p.rect(c + 2, 9, 1, 4, PAL.pastoOsc);
    }
  });
  a.registrar("flores_rosa", (p) => flores(p, PAL.flor1, [[3, 3], [10, 5], [6, 11]]));
  a.registrar("flores_amar", (p) => flores(p, PAL.flor2, [[2, 9], [9, 2], [11, 11]]));
  a.registrar("flores_azul", (p) => flores(p, PAL.flor3, [[4, 4], [11, 7], [5, 12]]));
  a.registrar("camino", (p) => {
    p.fondo(PAL.camino);
    p.motas(PAL.caminoPunto, 5, 5);
  });
  a.registrar("piso_plaza", (p) => {
    p.fondo("#dfe4dd");
    p.rect(0, 7, TILE, 1, "#c9d0c8");
    p.rect(7, 0, 1, 8, "#c9d0c8");
    p.rect(3, 8, 1, 8, "#c9d0c8");
    p.rect(11, 8, 1, 8, "#c9d0c8");
    p.rect(0, 15, TILE, 1, "#c9d0c8");
    p.px(2, 3, "#eef2ec");
    p.px(12, 11, "#eef2ec");
  });
  a.registrar("arena", (p) => {
    p.fondo(PAL.arena);
    p.motas(PAL.caminoPunto, 3, 6);
  });
  a.registrar("agua", (p) => {
    p.fondo(PAL.agua);
    p.rect(2, 4, 4, 1, PAL.aguaClara);
    p.rect(9, 10, 5, 1, PAL.aguaClara);
  });
  a.registrar("agua2", (p) => {
    p.fondo(PAL.agua);
    p.rect(3, 5, 4, 1, PAL.aguaClara);
    p.rect(8, 11, 5, 1, PAL.aguaClara);
    p.px(13, 2, PAL.aguaClara);
  });
  // Objetos con fondo transparente: se posan sobre cualquier suelo.
  a.registrar("arbol", (p) => {
    p.rect(6, 11, 4, 5, PAL.tronco);
    p.rect(2, 3, 12, 9, PAL.copa);
    p.rect(4, 1, 8, 3, PAL.copa);
    p.rect(1, 5, 14, 5, PAL.copa);
    p.rect(4, 2, 4, 3, PAL.copaClara);
    p.rect(3, 9, 10, 3, PAL.copaOsc);
    p.rect(6, 4, 2, 2, PAL.copaClara);
  });
  a.registrar("arbusto", (p) => {
    p.rect(2, 6, 12, 8, PAL.copa);
    p.rect(4, 4, 8, 3, PAL.copa);
    p.rect(3, 11, 10, 3, PAL.copaOsc);
    p.rect(5, 5, 3, 2, PAL.copaClara);
  });
  a.registrar("roca", (p) => {
    p.rect(3, 6, 10, 7, PAL.roca);
    p.rect(5, 4, 6, 3, PAL.roca);
    p.rect(3, 11, 10, 2, PAL.rocaOsc);
    p.rect(6, 5, 2, 1, "#d6d1c9");
  });
  a.registrar("muro", (p) => {
    p.fondo(PAL.muro);
    p.rect(0, 4, 10, 1, PAL.muroOsc);
    p.rect(6, 9, 10, 1, PAL.muroOsc);
    p.rect(0, 13, 12, 1, PAL.muroOsc);
    p.motas(PAL.muroClaro, 3, 7);
  });
  a.registrar("muro_cima", (p) => {
    p.fondo(PAL.muro);
    p.rect(0, 0, TILE, 6, PAL.muroClaro);
    p.rect(0, 6, TILE, 2, PAL.muroOsc);
    p.rect(2, 2, 3, 1, "#e0c8a8");
    p.rect(9, 3, 4, 1, "#e0c8a8");
  });
  a.registrar("cueva", (p) => {
    p.fondo(PAL.muro);
    p.rect(3, 5, 10, 11, PAL.tinta);
    p.rect(5, 3, 6, 2, PAL.tinta);
    p.rect(2, 4, 1, 12, PAL.muroOsc);
    p.rect(13, 4, 1, 12, PAL.muroOsc);
  });
  a.registrar("cerca_h", (p) => {
    p.rect(0, 6, TILE, 2, PAL.madera);
    p.rect(0, 10, TILE, 2, PAL.madera);
    p.rect(2, 4, 2, 10, PAL.maderaOsc);
    p.rect(12, 4, 2, 10, PAL.maderaOsc);
  });
  a.registrar("cerca_v", (p) => {
    p.rect(7, 0, 2, TILE, PAL.madera);
    p.rect(5, 2, 6, 2, PAL.maderaOsc);
    p.rect(5, 10, 6, 2, PAL.maderaOsc);
  });
  a.registrar("letrero", (p) => {
    p.rect(7, 9, 2, 7, PAL.maderaOsc);
    p.rect(2, 3, 12, 7, PAL.madera);
    p.rect(2, 3, 12, 1, PAL.maderaOsc);
    p.rect(2, 9, 12, 1, PAL.maderaOsc);
    p.rect(4, 5, 8, 1, PAL.maderaOsc);
    p.rect(4, 7, 6, 1, PAL.maderaOsc);
  });
  a.registrar("buzon", (p) => {
    p.rect(7, 10, 2, 6, PAL.maderaOsc);
    p.rect(3, 3, 10, 8, "#3c6aa8");
    p.rect(3, 3, 10, 2, "#2a4a80");
    p.rect(5, 7, 6, 1, "#dce8f8");
  });
  a.registrar("pared", (p) => {
    p.fondo(PAL.pared);
    p.rect(0, 5, TILE, 1, PAL.paredOsc);
    p.rect(0, 11, TILE, 1, PAL.paredOsc);
    p.px(4, 2, PAL.paredOsc);
    p.px(11, 8, PAL.paredOsc);
  });
  a.registrar("pared_ventana", (p) => {
    p.fondo(PAL.pared);
    p.rect(0, 5, TILE, 1, PAL.paredOsc);
    p.rect(0, 11, TILE, 1, PAL.paredOsc);
    p.rect(4, 4, 8, 8, PAL.ventanaOsc);
    p.rect(5, 5, 6, 6, PAL.ventana);
    p.rect(8, 5, 1, 6, PAL.ventanaOsc);
    p.rect(5, 8, 6, 1, PAL.ventanaOsc);
  });
  a.registrar("pared_puerta", (p) => {
    p.fondo(PAL.pared);
    p.rect(0, 5, TILE, 1, PAL.paredOsc);
    p.rect(4, 3, 8, 13, PAL.puertaOsc);
    p.rect(5, 4, 6, 12, PAL.puerta);
    p.px(9, 10, "#f0d060");
  });
  a.registrar("puerta_lab", (p) => {
    p.fondo(PAL.pared);
    p.rect(4, 3, 8, 13, PAL.metalOsc);
    p.rect(5, 4, 6, 12, PAL.metal);
    p.rect(7, 4, 2, 12, PAL.metalOsc);
    p.px(8, 8, "#ff5050");
  });
  return a;
}

// Techo de un color: tres tiles (cima, cuerpo y borde inferior). Devuelve sus índices.
export function techosDe(atlas: Atlas, clave: string, color: string) {
  const oscuro = sombrear(color, 0.72);
  const claro = sombrear(color, 1.22);
  return {
    cima: atlas.registrar(`techo_cima_${clave}`, (p) => techo(p, color, oscuro, claro, "cima")),
    cuerpo: atlas.registrar(`techo_${clave}`, (p) => techo(p, color, oscuro, claro, "cuerpo")),
    borde: atlas.registrar(`techo_borde_${clave}`, (p) => techo(p, color, oscuro, claro, "borde")),
  };
}

// ---------- Personajes ----------

export type AparienciaPersonaje = {
  piel?: string;
  pelo: string;
  ropa: string;
  pantalon?: string;
  robot?: boolean;
};

// Hoja de 3 cuadros (quieto, paso A, paso B) por 4 direcciones; celdas de 16 × 20 px.
export type HojaPersonaje = { imagen: HTMLCanvasElement; ancho: 16; alto: 20 };

export const FILA_DIR = { abajo: 0, arriba: 1, izquierda: 2, derecha: 3 } as const;

export function crearHojaPersonaje(ap: AparienciaPersonaje): HojaPersonaje {
  const imagen = document.createElement("canvas");
  imagen.width = 16 * 3;
  imagen.height = 20 * 4;
  const ctx = imagen.getContext("2d")!;
  const piel = ap.piel ?? "#f6cfa5";
  const pantalon = ap.pantalon ?? "#2f4b7c";
  const zapato = "#2e2a26";

  const pintar = (p: Pincel, dir: "abajo" | "arriba" | "izquierda", cuadro: number) => {
    // piernas: el cuadro 1 adelanta la izquierda, el 2 la derecha
    const izqY = cuadro === 1 ? 14 : 15;
    const derY = cuadro === 2 ? 14 : 15;
    const colorPierna = ap.robot ? PAL.metalOsc : pantalon;
    p.rect(5, izqY, 2, 4, colorPierna);
    p.rect(9, derY, 2, 4, colorPierna);
    p.rect(5, izqY + 3, 2, 1, zapato);
    p.rect(9, derY + 3, 2, 1, zapato);
    if (ap.robot) {
      p.rect(4, 9, 8, 7, PAL.metal);
      p.rect(4, 9, 8, 1, PAL.metalOsc);
      p.rect(7, 11, 2, 2, "#4fd1c5");
      p.rect(3, 10, 1, 4, PAL.metalOsc);
      p.rect(12, 10, 1, 4, PAL.metalOsc);
      p.rect(4, 3, 8, 6, PAL.metalOsc);
      p.rect(5, 4, 6, 4, PAL.metal);
      p.rect(7, 1, 2, 2, PAL.metalOsc);
      p.px(8, 0, "#ff5050");
      if (dir === "abajo") p.rect(5, 5, 6, 2, "#4fd1c5");
      if (dir === "izquierda") p.rect(4, 5, 3, 2, "#4fd1c5");
      return;
    }
    // cuerpo
    p.rect(4, 10, 8, 6, ap.ropa);
    if (dir === "izquierda") {
      p.rect(6, 11, 1, 4, piel);
    } else {
      p.rect(3, 11, 1, 4, piel);
      p.rect(12, 11, 1, 4, piel);
    }
    // cabeza
    p.rect(4, 4, 8, 7, piel);
    p.rect(3, 2, 10, 4, ap.pelo);
    if (dir === "abajo") {
      p.rect(3, 5, 1, 3, ap.pelo);
      p.rect(12, 5, 1, 3, ap.pelo);
      p.px(6, 7, PAL.tinta);
      p.px(9, 7, PAL.tinta);
    } else if (dir === "arriba") {
      p.rect(3, 2, 10, 8, ap.pelo);
    } else {
      p.rect(10, 5, 3, 5, ap.pelo);
      p.px(5, 7, PAL.tinta);
    }
  };

  const dirs: ("abajo" | "arriba" | "izquierda" | "derecha")[] = ["abajo", "arriba", "izquierda", "derecha"];
  dirs.forEach((dir, fila) => {
    for (let cuadro = 0; cuadro < 3; cuadro++) {
      ctx.save();
      if (dir === "derecha") {
        // la derecha es la izquierda en espejo
        ctx.translate(cuadro * 16 + 16, fila * 20);
        ctx.scale(-1, 1);
        pintar(new Pincel(ctx, 0, 0), "izquierda", cuadro);
      } else {
        pintar(new Pincel(ctx, cuadro * 16, fila * 20), dir, cuadro);
      }
      ctx.restore();
    }
  });
  contornear(imagen, 16, 20);
  return { imagen, ancho: 16, alto: 20 };
}

// Contorno oscuro de 1 px alrededor de cada figura, sin cruzar los bordes de su celda (como los sprites de GBA).
function contornear(canvas: HTMLCanvasElement, celdaW: number, celdaH: number, color: [number, number, number] = [0x1c, 0x1a, 0x17]) {
  const ctx = canvas.getContext("2d")!;
  const { width: w, height: h } = canvas;
  const origen = ctx.getImageData(0, 0, w, h).data;
  const salida = ctx.createImageData(w, h);
  salida.data.set(origen);
  const opaco = (x: number, y: number) => origen[(y * w + x) * 4 + 3] > 0;
  const vecinos = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (origen[i + 3] > 0) continue;
      for (const [dx, dy] of vecinos) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        if (Math.floor(nx / celdaW) !== Math.floor(x / celdaW) || Math.floor(ny / celdaH) !== Math.floor(y / celdaH)) continue;
        if (opaco(nx, ny)) {
          salida.data[i] = color[0];
          salida.data[i + 1] = color[1];
          salida.data[i + 2] = color[2];
          salida.data[i + 3] = 255;
          break;
        }
      }
    }
  }
  ctx.putImageData(salida, 0, 0);
}

export const APARIENCIAS: Record<string, AparienciaPersonaje> = {
  visitante: { pelo: "#6b3e1e", ropa: "#d9534f" },
  rodrigo: { pelo: "#2b1d14", ropa: "#1f6b57", pantalon: "#2a2a35" },
  jarvis: { pelo: "#000", ropa: "#000", robot: true },
  jefa: { pelo: "#3a2a1a", ropa: "#f0a830", pantalon: "#44403c" },
  analista: { pelo: "#8a5a2b", ropa: "#c94a3b" },
  keyuser: { pelo: "#1e1e1e", ropa: "#3d6fb5" },
  steward: { pelo: "#5a3a7a", ropa: "#55607a" },
  coordinador: { pelo: "#2b1d14", ropa: "#8e4b9e", pantalon: "#3b3b3b" },
  profesor: { pelo: "#bdbdbd", ropa: "#8c2f2f" },
  facilitador: { pelo: "#4a2e1a", ropa: "#d9822b" },
};
