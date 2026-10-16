// El motor: lienzo con escala entera, bucle, cámara, jugador por casillas, personajes e interacción.
import { TILE, type Dialogo, type Direccion, type MapaDef, type Npc, type Vec } from "../tipos";
import type { Puente } from "../puente";
import { APARIENCIAS, FILA_DIR, crearAtlasProcedural, crearHojaPersonaje, type Atlas, type HojaPersonaje } from "./procedural";
import { clave, parsearMapa, type MapaListo } from "./mapa";
import { Entrada } from "./entrada";
import { construirEstampas } from "../datos/estampas";

const DELTA: Record<Direccion, Vec> = {
  arriba: { x: 0, y: -1 },
  abajo: { x: 0, y: 1 },
  izquierda: { x: -1, y: 0 },
  derecha: { x: 1, y: 0 },
};
const OPUESTA: Record<Direccion, Direccion> = {
  arriba: "abajo",
  abajo: "arriba",
  izquierda: "derecha",
  derecha: "izquierda",
};

type Entidad = {
  id: string;
  x: number;
  y: number;
  px: number;
  py: number;
  dir: Direccion;
  hoja: HojaPersonaje;
  moviendo: boolean;
  t: number;
  ox: number;
  oy: number;
  dx: number;
  dy: number;
  pie: 0 | 1;
};

export type OpcionesJuego = { debug?: boolean; grilla?: boolean };

export type DebugJuego = {
  posicion: () => { x: number; y: number; dir: Direccion; px: number; py: number };
  estado: () => { fase: string; dialogo: boolean; escala: number; vista: Vec };
  teletransportar: (x: number, y: number, dir?: Direccion) => void;
  hablar: () => void;
  abrirDialogo: (npcId: string) => void;
};

export class Juego {
  private ctx: CanvasRenderingContext2D;
  private atlas!: Atlas;
  private mapa!: MapaListo;
  private base!: HTMLCanvasElement;
  private capaEncima!: HTMLCanvasElement;
  private jugador!: Entidad;
  private npcs: Entidad[] = [];
  private npcDefs = new Map<string, Npc>();
  private hojas = new Map<string, HojaPersonaje>();
  private entrada: Entrada;
  private observador?: ResizeObserver;
  private raf = 0;
  private ultimo = 0;
  private destruido = false;
  private activo = false;
  private escala = 3;
  private vistaW = 240;
  private vistaH = 160;
  private cam: Vec = { x: 0, y: 0 };
  private tGiro = 0;
  private tAgua = 0;
  private accionPendiente = false;
  private tMirada = 2000;
  private aviso = 0;
  private quitarOyentes: (() => void)[] = [];

  constructor(
    private contenedor: HTMLElement,
    private canvas: HTMLCanvasElement,
    private puente: Puente,
    private def: MapaDef,
    private opciones: OpcionesJuego = {},
  ) {
    this.ctx = canvas.getContext("2d")!;
    this.entrada = new Entrada(
      () => this.interactuar(),
      () => this.puente.leer().dialogo !== null,
    );
  }

  iniciar() {
    this.atlas = crearAtlasProcedural();
    this.aviso = this.atlas.indice("aviso");
    const estampas = construirEstampas(this.atlas);
    this.mapa = parsearMapa(this.def, this.atlas, estampas);
    this.prerenderizar();

    this.jugador = this.crearEntidad("jugador", "visitante", this.def.inicio.x, this.def.inicio.y, this.def.inicio.dir);
    this.npcs = this.def.npcs.map((n) => {
      this.npcDefs.set(n.id, n);
      return this.crearEntidad(n.id, n.sprite, n.x, n.y, n.dir);
    });

    this.entrada.montar();
    this.quitarOyentes.push(
      this.puente.on("entrada:dpad", ({ dir }) => {
        this.entrada.dpad = dir;
      }),
      this.puente.on("entrada:accion", () => this.interactuar()),
      this.puente.on("entrada:correr", ({ activo }) => {
        this.entrada.corriendoBoton = activo;
      }),
      this.puente.on("juego:fase", ({ fase }) => {
        if (fase === "jugando") this.activar();
      }),
    );
    document.addEventListener("visibilitychange", this.alCambiarVisibilidad);

    this.observador = new ResizeObserver(() => this.redimensionar());
    this.observador.observe(this.contenedor);
    this.redimensionar();
    this.camara();
    this.raf = requestAnimationFrame(this.cuadro);

    if (this.opciones.debug) {
      (window as unknown as { __juego: DebugJuego }).__juego = this.debug();
    }
    if (this.puente.leer().fase === "jugando") this.activar();
  }

  destruir() {
    this.destruido = true;
    cancelAnimationFrame(this.raf);
    this.entrada.desmontar();
    this.observador?.disconnect();
    document.removeEventListener("visibilitychange", this.alCambiarVisibilidad);
    this.quitarOyentes.forEach((q) => q());
    this.quitarOyentes = [];
  }

  activar() {
    this.activo = true;
    this.entrada.activo = true;
    this.contenedor.focus({ preventScroll: true });
  }

  // ---------- construcción ----------

  private hoja(sprite: string) {
    let h = this.hojas.get(sprite);
    if (!h) {
      h = crearHojaPersonaje(APARIENCIAS[sprite] ?? APARIENCIAS.visitante);
      this.hojas.set(sprite, h);
    }
    return h;
  }

  private crearEntidad(id: string, sprite: string, x: number, y: number, dir: Direccion): Entidad {
    return { id, x, y, px: x * TILE, py: y * TILE, dir, hoja: this.hoja(sprite), moviendo: false, t: 0, ox: 0, oy: 0, dx: x, dy: y, pie: 0 };
  }

  private prerenderizar() {
    const { ancho, alto, suelo, objetos, encima } = this.mapa;
    const w = ancho * TILE;
    const h = alto * TILE;
    this.base = document.createElement("canvas");
    this.base.width = w;
    this.base.height = h;
    this.capaEncima = document.createElement("canvas");
    this.capaEncima.width = w;
    this.capaEncima.height = h;
    const cb = this.base.getContext("2d")!;
    const ce = this.capaEncima.getContext("2d")!;
    for (let y = 0; y < alto; y++) {
      for (let x = 0; x < ancho; x++) {
        const i = y * ancho + x;
        if (suelo[i]) this.atlas.dibujar(cb, suelo[i] - 1, x * TILE, y * TILE);
        if (objetos[i]) this.atlas.dibujar(cb, objetos[i] - 1, x * TILE, y * TILE);
        if (encima[i]) this.atlas.dibujar(ce, encima[i] - 1, x * TILE, y * TILE);
      }
    }
  }

  // ---------- lienzo ----------

  private redimensionar() {
    const r = this.contenedor.getBoundingClientRect();
    const w = Math.max(1, Math.floor(r.width));
    const h = Math.max(1, Math.floor(r.height));
    // Escala entera: ×2 en un celular, hasta ×4 en escritorio. La vista lógica mide al menos 192 × 144 px.
    const escalaCss = Math.max(2, Math.min(4, Math.floor(Math.min(w / 192, h / 144))));
    const dpr = window.devicePixelRatio || 1;
    const escalaDisp = Math.max(1, Math.round(escalaCss * dpr));
    this.vistaW = Math.max(1, Math.floor((w * dpr) / escalaDisp));
    this.vistaH = Math.max(1, Math.floor((h * dpr) / escalaDisp));
    this.canvas.width = this.vistaW * escalaDisp;
    this.canvas.height = this.vistaH * escalaDisp;
    this.canvas.style.width = `${this.canvas.width / dpr}px`;
    this.canvas.style.height = `${this.canvas.height / dpr}px`;
    this.ctx.setTransform(escalaDisp, 0, 0, escalaDisp, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
    this.escala = escalaCss;
    this.camara();
  }

  private camara() {
    const mw = this.mapa.ancho * TILE;
    const mh = this.mapa.alto * TILE;
    const cx = Math.round(this.jugador.px + TILE / 2 - this.vistaW / 2);
    const cy = Math.round(this.jugador.py + TILE / 2 - this.vistaH / 2);
    this.cam.x = mw <= this.vistaW ? -Math.round((this.vistaW - mw) / 2) : Math.max(0, Math.min(mw - this.vistaW, cx));
    this.cam.y = mh <= this.vistaH ? -Math.round((this.vistaH - mh) / 2) : Math.max(0, Math.min(mh - this.vistaH, cy));
  }

  // ---------- bucle ----------

  private alCambiarVisibilidad = () => {
    this.entrada.limpiar();
    this.ultimo = 0;
  };

  private cuadro = (ahora: number) => {
    if (this.destruido) return;
    const dt = this.ultimo ? Math.min(50, ahora - this.ultimo) : 16;
    this.ultimo = ahora;
    this.actualizar(dt);
    this.dibujar();
    this.raf = requestAnimationFrame(this.cuadro);
  };

  private actualizar(dt: number) {
    this.tAgua += dt;
    const j = this.jugador;
    const dialogoAbierto = this.puente.leer().dialogo !== null;

    if (!j.moviendo && this.activo && !dialogoAbierto) {
      const dir = this.entrada.direccion();
      if (dir) {
        if (dir !== j.dir) {
          // primero gira; si la tecla sigue pulsada, camina (como en Pokémon)
          j.dir = dir;
          this.tGiro = 90;
        } else if (this.tGiro > 0) {
          this.tGiro -= dt;
        } else {
          const d = DELTA[dir];
          const nx = j.x + d.x;
          const ny = j.y + d.y;
          if (this.libre(nx, ny)) {
            j.moviendo = true;
            j.t = 0;
            j.ox = j.px;
            j.oy = j.py;
            j.dx = nx;
            j.dy = ny;
          }
        }
      } else {
        this.tGiro = 0;
      }
    }

    if (j.moviendo) {
      const dur = this.entrada.corre() ? 120 : 210;
      j.t += dt / dur;
      const k = Math.min(1, j.t);
      j.px = j.ox + (j.dx * TILE - j.ox) * k;
      j.py = j.oy + (j.dy * TILE - j.oy) * k;
      if (k >= 1) {
        j.x = j.dx;
        j.y = j.dy;
        j.px = j.x * TILE;
        j.py = j.y * TILE;
        j.moviendo = false;
        j.pie = j.pie ? 0 : 1;
        if (this.accionPendiente) {
          this.accionPendiente = false;
          this.interactuar();
        }
      }
    }
    // de vez en cuando, un personaje mira hacia otro lado (menos el que está conversando)
    this.tMirada -= dt;
    if (this.tMirada <= 0 && this.npcs.length) {
      this.tMirada = 1800 + Math.random() * 2600;
      const n = this.npcs[Math.floor(Math.random() * this.npcs.length)];
      const hablando = this.puente.leer().dialogo?.npcId === n.id;
      if (!hablando) {
        const dirs: Direccion[] = ["abajo", "izquierda", "derecha", "abajo"];
        n.dir = dirs[Math.floor(Math.random() * dirs.length)];
      }
    }
    this.camara();
  }

  private libre(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.mapa.ancho || y >= this.mapa.alto) return false;
    if (this.mapa.solido[y * this.mapa.ancho + x]) return false;
    return !this.npcs.some((n) => n.x === x && n.y === y);
  }

  private cuadroDe(e: Entidad) {
    if (!e.moviendo) return 0;
    return e.t % 1 < 0.5 ? (e.pie ? 2 : 1) : 0;
  }

  // ---------- interacción ----------

  private interactuar() {
    if (!this.activo || this.puente.leer().dialogo) return;
    const j = this.jugador;
    if (j.moviendo) {
      this.accionPendiente = true;
      return;
    }
    const d = DELTA[j.dir];
    const tx = j.x + d.x;
    const ty = j.y + d.y;
    const npc = this.npcs.find((n) => n.x === tx && n.y === ty);
    if (npc) {
      npc.dir = OPUESTA[j.dir];
      const def = this.npcDefs.get(npc.id);
      if (def) this.abrir(def.dialogo(), def.id);
      return;
    }
    const h = this.mapa.hotspots.get(clave(tx, ty));
    if (h) this.abrir(h.dialogo());
  }

  private abrir(dialogo: Dialogo, npcId?: string) {
    this.entrada.limpiar();
    this.puente.actualizar({ dialogo: { dialogo, indice: 0, npcId } });
  }

  // ---------- dibujo ----------

  private dibujar() {
    const c = this.ctx;
    const { x: cx, y: cy } = this.cam;
    c.fillStyle = "#101518";
    c.fillRect(0, 0, this.vistaW, this.vistaH);
    c.drawImage(this.base, -cx, -cy);

    const paso = Math.floor(this.tAgua / 450);
    for (const a of this.mapa.animados) {
      const sx = a.x * TILE - cx;
      const sy = a.y * TILE - cy;
      if (sx < -TILE || sy < -TILE || sx > this.vistaW || sy > this.vistaH) continue;
      this.atlas.dibujar(c, a.frames[paso % a.frames.length], sx, sy);
    }

    const entidades = [...this.npcs, this.jugador].sort((a, b) => a.py - b.py);
    for (const e of entidades) {
      const sx = Math.round(e.px - cx);
      const sy = Math.round(e.py - cy) - 4; // la cabeza asoma sobre la casilla
      if (sx < -TILE || sy < -20 || sx > this.vistaW || sy > this.vistaH) continue;
      c.drawImage(e.hoja.imagen, this.cuadroDe(e) * 16, FILA_DIR[e.dir] * 20, 16, 20, sx, sy, 16, 20);
    }

    c.drawImage(this.capaEncima, -cx, -cy);

    // globo sobre lo que tiene al frente: así se ve con quién se puede hablar
    const j = this.jugador;
    if (this.activo && !j.moviendo && !this.puente.leer().dialogo) {
      const d = DELTA[j.dir];
      const tx = j.x + d.x;
      const ty = j.y + d.y;
      const hay = this.npcs.some((n) => n.x === tx && n.y === ty) || this.mapa.hotspots.has(clave(tx, ty));
      if (hay) {
        const bob = Math.round(Math.sin(this.tAgua / 220));
        this.atlas.dibujar(c, this.aviso, tx * TILE - cx, ty * TILE - 14 - cy + bob);
      }
    }

    if (this.opciones.grilla) {
      c.strokeStyle = "rgba(255,255,255,0.15)";
      c.lineWidth = 1 / this.escala;
      for (let x = -(cx % TILE); x < this.vistaW; x += TILE) {
        c.beginPath();
        c.moveTo(x, 0);
        c.lineTo(x, this.vistaH);
        c.stroke();
      }
      for (let y = -(cy % TILE); y < this.vistaH; y += TILE) {
        c.beginPath();
        c.moveTo(0, y);
        c.lineTo(this.vistaW, y);
        c.stroke();
      }
    }
  }

  // ---------- pruebas ----------

  private debug(): DebugJuego {
    return {
      posicion: () => ({ x: this.jugador.x, y: this.jugador.y, dir: this.jugador.dir, px: this.jugador.px, py: this.jugador.py }),
      estado: () => ({
        fase: this.puente.leer().fase,
        dialogo: this.puente.leer().dialogo !== null,
        escala: this.escala,
        vista: { x: this.vistaW, y: this.vistaH },
      }),
      teletransportar: (x, y, dir) => {
        const j = this.jugador;
        j.moviendo = false;
        j.x = j.dx = x;
        j.y = j.dy = y;
        j.px = x * TILE;
        j.py = y * TILE;
        if (dir) j.dir = dir;
        this.camara();
      },
      hablar: () => this.interactuar(),
      abrirDialogo: (npcId) => {
        const def = this.npcDefs.get(npcId);
        if (def) this.abrir(def.dialogo(), def.id);
      },
    };
  }
}
