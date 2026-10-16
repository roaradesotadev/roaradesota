import type { Direccion, EstadoUI, Fase } from "./tipos";

// El puente une el motor (canvas) con la interfaz (React): eventos de la interfaz hacia el motor
// y un estado pequeño que React lee con useSyncExternalStore.
export type Eventos = {
  "entrada:dpad": { dir: Direccion | null };
  "entrada:accion": undefined;
  "entrada:correr": { activo: boolean };
  "juego:fase": { fase: Fase };
};

type Oyente<E extends keyof Eventos> = (dato: Eventos[E]) => void;

export class Puente {
  private oyentes = new Map<keyof Eventos, Set<(dato: unknown) => void>>();
  private estado: EstadoUI = { fase: "titulo", tactil: false, dialogo: null };
  private suscriptores = new Set<() => void>();

  on<E extends keyof Eventos>(evento: E, oyente: Oyente<E>): () => void {
    let set = this.oyentes.get(evento);
    if (!set) {
      set = new Set();
      this.oyentes.set(evento, set);
    }
    const envuelto = oyente as (dato: unknown) => void;
    set.add(envuelto);
    return () => {
      set?.delete(envuelto);
    };
  }

  emit<E extends keyof Eventos>(evento: E, dato: Eventos[E]): void {
    this.oyentes.get(evento)?.forEach((oyente) => oyente(dato));
  }

  // Estado compartido (store externo para React).
  leer = (): EstadoUI => this.estado;

  suscribir = (cb: () => void): (() => void) => {
    this.suscriptores.add(cb);
    return () => {
      this.suscriptores.delete(cb);
    };
  };

  actualizar(parcial: Partial<EstadoUI>): void {
    this.estado = { ...this.estado, ...parcial };
    this.suscriptores.forEach((cb) => cb());
  }
}
