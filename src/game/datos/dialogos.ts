// Lo que dicen los personajes, los letreros y el buzón. Todo sale del contenido del modo texto.
import type { Dialogo, Opcion } from "../tipos";
import { HISTORIAL, RAMAS, type RamaId } from "@/content/historial";
import { caso } from "@/content/casos";
import { TEMAS, DOCENCIA_INTRO, FORMACION } from "@/content/perfil";
import { CORREO } from "@/components/marco";

// Parte un texto en páginas de hasta `max` caracteres, cortando en oraciones y, si hace falta, en palabras.
export function paginar(texto: string, max = 125): string[] {
  const oraciones = texto.replace(/\s+/g, " ").trim().match(/[^.!?]+[.!?]+["»)]?|[^.!?]+$/g) ?? [texto];
  const paginas: string[] = [];
  let actual = "";
  const empujar = (trozo: string) => {
    const t = trozo.trim();
    if (!t) return;
    if (!actual) actual = t;
    else if ((actual + " " + t).length <= max) actual += " " + t;
    else {
      paginas.push(actual);
      actual = t;
    }
  };
  for (const o of oraciones) {
    if (o.trim().length <= max) {
      empujar(o);
      continue;
    }
    // oración larga: por palabras
    let linea = "";
    for (const palabra of o.trim().split(" ")) {
      if ((linea + " " + palabra).trim().length > max) {
        empujar(linea);
        linea = palabra;
      } else linea = (linea + " " + palabra).trim();
    }
    empujar(linea);
  }
  if (actual) paginas.push(actual);
  return paginas;
}

const entrada = (id: string) => {
  const e = HISTORIAL.find((x) => x.id === id);
  if (!e) throw new Error(`Entrada del historial no encontrada: ${id}`);
  return e;
};

const CERRAR: Opcion = { texto: "Seguir paseando", accion: { tipo: "cerrar" } };

function desdeEntrada(hablante: string, intro: string, id: string, cierre?: string): Dialogo {
  const e = entrada(id);
  return { hablante, paginas: paginar([intro, e.detalle ?? "", cierre ?? ""].filter(Boolean).join(" ")) };
}

export const DIALOGOS = {
  rodrigoPlaza: (): Dialogo => ({
    hablante: "Rodrigo",
    paginas: [
      "¡Hola! Bienvenido a mi pueblo. Soy Rodrigo Arancibia.",
      "Cada edificio es un lugar donde trabajé. La gente que está afuera le cuenta qué hice ahí.",
      "Camine con las flechas o la cruceta y hable con Espacio o el botón A. Si prefiere leer, arriba está el modo texto.",
      "Al norte está la sede de INTNOVA, mi consultora. Ahí lo espera Jarvis.",
    ],
  }),

  letreroPlaza: (): Dialogo => ({
    hablante: "Letrero",
    paginas: [
      "Pueblo de Rodrigo Arancibia.",
      "Flechas o WASD para caminar · Espacio para hablar · Shift para correr. Esc cierra una conversación.",
    ],
  }),

  jarvis: (): Dialogo => {
    const c = caso("jarvis");
    const so = caso("sistema-operativo");
    return {
      hablante: "Jarvis",
      paginas: paginar(
        [
          "Bip. Soy Jarvis, el asistente que Rodrigo construyó para operar INTNOVA por voz.",
          c?.bajada ?? "",
          c?.resultado[0] ?? "",
          "También construyó un CRM y un ERP propios: " + (so?.bajada ?? ""),
        ].join(" "),
      ),
      opciones: [
        { texto: "Ver el caso de Jarvis", accion: { tipo: "ir", href: "/casos/jarvis" } },
        { texto: "Ver el CRM y el ERP", accion: { tipo: "ir", href: "/casos/sistema-operativo" } },
        CERRAR,
      ],
    };
  },

  jefa: (): Dialogo =>
    desdeEntrada(
      "Jefa de procesos",
      "Rodrigo trabajó con nosotros en el grupo minero entre 2022 y 2024, como asistente de procesos.",
      "rpa",
    ),

  analista: (): Dialogo =>
    desdeEntrada(
      "Analista de la inmobiliaria",
      "En 2024 Rodrigo fue analista de mejora continua e innovación en la inmobiliaria.",
      "datawarehouse",
    ),

  keyuser: (): Dialogo =>
    desdeEntrada(
      "Key user de SAP",
      "Rodrigo fue consultor de gobierno de datos en una consultora internacional, de abril a julio de 2024.",
      "datos-maestros",
    ),

  steward: (): Dialogo =>
    desdeEntrada(
      "Data steward",
      "Entre diciembre de 2024 y abril de 2026, Rodrigo fue Data Steward en un proyecto de banca y seguros.",
      "lakehouse",
    ),

  coordinador: (): Dialogo =>
    desdeEntrada(
      "Coordinador de innovación",
      "En 2025 Rodrigo diseñó y facilitó el programa de innovación interna de este centro comercial.",
      "innovacion",
    ),

  profesor: (): Dialogo => ({
    hablante: "Profesor",
    paginas: paginar(
      [
        "Rodrigo es bachiller en Ingeniería de Tecnologías de Información y Sistemas por la Universidad ESAN (2017 – 2022) y fue practicante de TI en la escuela de posgrado.",
        "Publicó un artículo en IEEE (2022) sobre tecnologías inmersivas en la industria 4.0.",
        "Después hizo dos diplomaturas: " + FORMACION[0].replace(/\.$/, "") + ", y " + FORMACION[1].replace(/^Diplomatura/, "la de"),
      ].join(" "),
    ),
  }),

  facilitador: (): Dialogo => ({
    hablante: "Facilitador",
    paginas: paginar(
      [
        "Rodrigo dicta capacitaciones in-company con Kaudal desde 2026: automatización de procesos, productividad e IA.",
        DOCENCIA_INTRO,
        "Sus temas: " + TEMAS.map((t) => t.toLowerCase()).join("; ") + ".",
      ].join(" "),
    ),
    opciones: [{ texto: "Ver la docencia completa", accion: { tipo: "ir", href: "/sobre-mi" } }, CERRAR],
  }),

  buzon: (): Dialogo => ({
    hablante: "Buzón",
    paginas: [`Aquí puede escribirle a Rodrigo: ${CORREO}.`, "También puede bajar su CV o leer todo en modo texto."],
    opciones: [
      { texto: "Escribir un correo", accion: { tipo: "enlace", href: `mailto:${CORREO}?subject=${encodeURIComponent("Conversemos 30 minutos")}` } },
      { texto: "Bajar el CV", accion: { tipo: "enlace", href: "/cv/CV_Rodrigo_Arancibia.pdf" } },
      { texto: "Ir al modo texto", accion: { tipo: "ir", href: "/historial" } },
      CERRAR,
    ],
  }),

  letreroEdificio: (rama: RamaId | "intnova" | "universidad" | "academia" | "laboratorio", fechas: string): Dialogo => {
    const nombres: Record<string, string> = {
      intnova: "INTNOVA Consulting",
      universidad: "Universidad",
      academia: "Academia de capacitación",
      laboratorio: "Laboratorio",
    };
    const nombre = nombres[rama] ?? RAMAS[rama as RamaId]?.sector ?? rama;
    return { hablante: "Letrero", paginas: [`${nombre} · ${fechas}`] };
  },

  puertaCerrada: (quien: string): Dialogo => ({
    paginas: [`La puerta está cerrada. ${quien} está aquí afuera y le puede contar.`],
  }),

  laboratorio: (): Dialogo => ({
    hablante: "Laboratorio",
    paginas: ["Laboratorio de experimentos con IA. Próximamente: aquí irán las pruebas y los tableros con datos de ejemplo."],
  }),

  cueva: (): Dialogo => ({
    paginas: ["Entrada de la mina. Casco obligatorio. La jefa de procesos está aquí al lado."],
  }),
};
