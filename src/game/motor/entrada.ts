// Teclado: una pila de direcciones (la última pulsada manda), Shift para correr y una tecla de acción.
import type { Direccion } from "../tipos";

const TECLAS: Record<string, Direccion> = {
  ArrowUp: "arriba",
  KeyW: "arriba",
  ArrowDown: "abajo",
  KeyS: "abajo",
  ArrowLeft: "izquierda",
  KeyA: "izquierda",
  ArrowRight: "derecha",
  KeyD: "derecha",
};
const ACCION = new Set(["Space", "Enter", "KeyZ"]);

export class Entrada {
  activo = false;
  dpad: Direccion | null = null;
  corriendoBoton = false;
  private pila: Direccion[] = [];
  private shift = false;

  constructor(
    private alAccion: () => void,
    private dialogoAbierto: () => boolean,
  ) {}

  montar() {
    window.addEventListener("keydown", this.alPulsar);
    window.addEventListener("keyup", this.alSoltar);
    window.addEventListener("blur", this.limpiar);
  }

  desmontar() {
    window.removeEventListener("keydown", this.alPulsar);
    window.removeEventListener("keyup", this.alSoltar);
    window.removeEventListener("blur", this.limpiar);
  }

  direccion(): Direccion | null {
    return this.dpad ?? this.pila[this.pila.length - 1] ?? null;
  }

  corre() {
    return this.shift || this.corriendoBoton;
  }

  limpiar = () => {
    this.pila = [];
    this.shift = false;
    this.dpad = null;
    this.corriendoBoton = false;
  };

  private alPulsar = (e: KeyboardEvent) => {
    if (!this.activo) return;
    const dir = TECLAS[e.code];
    if (dir) {
      e.preventDefault(); // que las flechas no desplacen la página
      if (this.dialogoAbierto()) return; // dentro del diálogo las flechas eligen opciones
      if (!this.pila.includes(dir)) this.pila.push(dir);
      return;
    }
    if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
      this.shift = true;
      return;
    }
    if (ACCION.has(e.code)) {
      if (this.dialogoAbierto()) return; // el diálogo maneja su propio avance
      e.preventDefault();
      if (!e.repeat) this.alAccion();
    }
  };

  private alSoltar = (e: KeyboardEvent) => {
    const dir = TECLAS[e.code];
    if (dir) this.pila = this.pila.filter((d) => d !== dir);
    if (e.code === "ShiftLeft" || e.code === "ShiftRight") this.shift = false;
  };
}
