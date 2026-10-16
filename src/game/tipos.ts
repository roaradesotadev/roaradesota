// Tipos compartidos por el motor, los datos del pueblo y la interfaz.

export const TILE = 16;

export type Direccion = "arriba" | "abajo" | "izquierda" | "derecha";
export type Vec = { x: number; y: number };

export type Capa = "suelo" | "objetos" | "encima";

// Un carácter del mapa ASCII. `tile` nombra un dibujo del atlas (con varios, se elige uno por posición);
// `auto` nombra un conjunto con bordes (camino, agua, plaza) que se resuelve mirando a los vecinos.
export type DefTile = { tile?: string | string[]; auto?: string; solido?: boolean; capa?: Capa };
export type Leyenda = Record<string, DefTile>;

// Un edificio u objeto de varios tiles, ya resuelto a índices del atlas.
export type Estampa = {
  tiles: (number | null)[][];
  encima?: (number | null)[][];
  solido: boolean[][];
};
export type Colocacion = { estampa: string; x: number; y: number; id?: string };

export type Opcion = {
  texto: string;
  accion: { tipo: "ir"; href: string } | { tipo: "enlace"; href: string } | { tipo: "cerrar" };
};
export type Dialogo = { hablante?: string; retrato?: string; paginas: string[]; opciones?: Opcion[] };

export type Npc = {
  id: string;
  nombre: string;
  sprite: string;
  x: number;
  y: number;
  dir: Direccion;
  dialogo: () => Dialogo;
};

export type HotspotFijo = { tipo: "letrero" | "buzon" | "puerta" | "objeto"; x: number; y: number; dialogo: () => Dialogo };

export type MapaDef = {
  id: string;
  ancho: number;
  alto: number;
  suelo: string[];
  objetos: string[];
  leyenda: Leyenda;
  colocaciones: Colocacion[];
  hotspots: HotspotFijo[];
  npcs: Npc[];
  inicio: Vec & { dir: Direccion };
};

// Hoja de un personaje: sabe qué recorte dibujar según la dirección y el paso.
export type Celda = { sx: number; sy: number; w: number; h: number };
export type HojaPersonaje = {
  imagen: CanvasImageSource;
  offsetY: number; // cuánto sube el dibujo respecto de la casilla (cabezas que asoman)
  celda: (dir: Direccion, moviendo: boolean, t: number, pie: 0 | 1) => Celda;
};

export type Fase = "titulo" | "jugando";
export type EstadoDialogo = { dialogo: Dialogo; indice: number; npcId?: string };
export type EstadoUI = { fase: Fase; tactil: boolean; dialogo: EstadoDialogo | null };
