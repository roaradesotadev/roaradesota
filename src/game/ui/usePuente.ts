import { useSyncExternalStore } from "react";
import type { Puente } from "../puente";

export function useEstadoJuego(puente: Puente) {
  return useSyncExternalStore(puente.suscribir, puente.leer, puente.leer);
}
