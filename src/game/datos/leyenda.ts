import type { Leyenda } from "../tipos";

// Caracteres del mapa ASCII → tiles del atlas.
export const LEYENDA: Leyenda = {
  // suelo
  ".": { tile: ["pasto", "pasto", "pasto2", "pasto3"] },
  ",": { tile: "pasto_alto" },
  "*": { tile: "flores_rosa" },
  "+": { tile: "flores_amar" },
  "%": { tile: "flores_azul" },
  "=": { tile: "camino" },
  p: { tile: "piso_plaza" },
  s: { tile: "arena" },
  "~": { tile: "agua", solido: true, anim: ["agua", "agua2"] },
  // objetos (fondo transparente, se posan sobre el suelo)
  T: { tile: "arbol", solido: true },
  b: { tile: "arbusto", solido: true },
  o: { tile: "roca", solido: true },
  "#": { tile: "muro", solido: true },
  "^": { tile: "muro_cima", solido: true },
  C: { tile: "cueva", solido: true },
  "-": { tile: "cerca_h", solido: true },
  "|": { tile: "cerca_v", solido: true },
  S: { tile: "letrero", solido: true },
  M: { tile: "buzon", solido: true },
};
