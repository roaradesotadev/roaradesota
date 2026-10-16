import type { Leyenda } from "../tipos";

// Caracteres del mapa ASCII → tiles del atlas. El pasto es la base de todo; lo demás se dibuja encima.
export const LEYENDA: Leyenda = {
  // suelo
  ".": { tile: ["pasto", "pasto", "pasto", "pasto2", "pasto3", "pasto4"] },
  ",": { tile: "pasto_alto" },
  "*": { tile: "flores_rosa" },
  "+": { tile: "flores_amar" },
  "%": { tile: "flores_azul" },
  "=": { auto: "camino" },
  p: { auto: "plaza" },
  "~": { auto: "agua", solido: true },
  // objetos sueltos (los árboles, rocas y edificios son estampas)
  b: { tile: "arbusto", solido: true },
  o: { tile: "roca", solido: true },
  "-": { tile: "cerca_h", solido: true },
  "|": { tile: "cerca_v", solido: true },
  S: { tile: "letrero", solido: true },
  M: { tile: "buzon", solido: true },
};
