// Contenido del portafolio. Fuente: CV de Rodrigo (16/10/2026) y los sistemas que usa a diario.
// Regla: clientes y empleadores anónimos por sector; nada real de Finanzas, clientes ni prospectos;
// todo dato ilustrativo va marcado con `ilustrativo: true` y se rotula en pantalla.

export type RamaId = "main" | "mineria" | "inmobiliaria" | "consultoria" | "banca";

export const RAMAS: Record<RamaId, { nombre: string; sector: string; color: string; carril: number }> = {
  main: { nombre: "main", sector: "Rodrigo Arancibia · INTNOVA Consulting", color: "var(--rama-main)", carril: 0 },
  mineria: { nombre: "grupo-minero", sector: "Grupo minero", color: "var(--rama-mineria)", carril: 1 },
  inmobiliaria: { nombre: "inmobiliaria", sector: "Inmobiliaria", color: "var(--rama-inmobiliaria)", carril: 1 },
  consultoria: { nombre: "consultora-internacional", sector: "Consultora internacional", color: "var(--rama-consultoria)", carril: 1 },
  banca: { nombre: "banca-y-seguros", sector: "Integradora tecnológica, proyecto de banca y seguros", color: "var(--rama-banca)", carril: 1 },
};

export type Diff = { antes: string[]; despues: string[]; ilustrativo?: boolean };

export type Entrada = {
  id: string;
  rama: RamaId;
  tipo: "cambio" | "merge" | "fork";
  fecha: string; // texto visible
  titulo: string;
  detalle?: string;
  diff?: Diff;
  caso?: string; // slug de /casos/[slug]
};

// Del más nuevo al más antiguo, como un `git log --graph`.
export const HISTORIAL: Entrada[] = [
  {
    id: "jarvis",
    rama: "main",
    tipo: "cambio",
    fecha: "oct. 2026",
    titulo: "Jarvis: la consultora se opera por voz",
    detalle:
      "Un botón del mouse, una orden hablada y el sistema la ejecuta: prospección, pendientes, contenido y reportes. Responde en voz alta y también desde el celular.",
    diff: {
      antes: [
        "Abrir el CRM y buscar el contacto",
        "Copiar la respuesta y anotar el seguimiento",
        "Actualizar la hoja de cálculo de prospección",
        "Crear el pendiente y su fecha en el tablero",
      ],
      despues: ["«Anota que respondió y deja el seguimiento para el lunes»"],
      ilustrativo: true,
    },
    caso: "jarvis",
  },
  {
    id: "sistema-operativo",
    rama: "main",
    tipo: "cambio",
    fecha: "oct. 2026",
    titulo: "Un CRM y un ERP propios para una consultora de una persona",
    detalle:
      "Contactos, negocios, seguimientos, finanzas y tesorería en bases propias, sincronizadas con la herramienta de prospección cada hora y operadas por 13 agentes especializados.",
    diff: {
      antes: ["Un CRM de terceros, hojas de cálculo sueltas y notas en distintos lugares"],
      despues: ["Una sola fuente de verdad por tema, con registro de cada decisión"],
      ilustrativo: true,
    },
    caso: "sistema-operativo",
  },
  {
    id: "web-intnova",
    rama: "main",
    tipo: "cambio",
    fecha: "sep. 2026",
    titulo: "Web de INTNOVA Consulting publicada",
    detalle: "Diseño, desarrollo y despliegue de intnovaconsulting.com, de punta a punta.",
  },
  {
    id: "facilitacion",
    rama: "main",
    tipo: "cambio",
    fecha: "2026",
    titulo: "Capacitaciones corporativas en automatización, productividad e IA",
    detalle: "Facilitador in-company con Kaudal para equipos de distintas áreas.",
  },
  {
    id: "merge-banca",
    rama: "banca",
    tipo: "merge",
    fecha: "abr. 2026",
    titulo: "Merge de banca-y-seguros en main",
  },
  {
    id: "intnova",
    rama: "main",
    tipo: "cambio",
    fecha: "mar. 2026",
    titulo: "Fundo INTNOVA Consulting",
    detalle: "Automatización de procesos, datos e IA aplicada sobre los sistemas que cada empresa ya tiene.",
  },
  {
    id: "lakehouse",
    rama: "banca",
    tipo: "cambio",
    fecha: "2024 – 2026",
    titulo: "Data Steward: migración de procesos core a un Lakehouse en la nube",
    detalle:
      "Calidad, consistencia y trazabilidad de los datos críticos con estándares de gobierno de datos; enlace entre negocio y tecnología durante la migración.",
  },
  {
    id: "innovacion",
    rama: "main",
    tipo: "cambio",
    fecha: "2025",
    titulo: "Programa de innovación interna de un centro comercial de Lima",
    detalle: "Diseñé y facilité el bootcamp: 80 participantes, 4 talleres y 3 proyectos implementados.",
  },
  {
    id: "fork-banca",
    rama: "banca",
    tipo: "fork",
    fecha: "dic. 2024",
    titulo: "Nueva rama: banca-y-seguros",
  },
  {
    id: "merge-inmobiliaria",
    rama: "inmobiliaria",
    tipo: "merge",
    fecha: "dic. 2024",
    titulo: "Merge de inmobiliaria en main",
  },
  {
    id: "datawarehouse",
    rama: "inmobiliaria",
    tipo: "cambio",
    fecha: "2024",
    titulo: "Mejora continua e innovación: un datawarehouse para decidir con indicadores",
    detalle:
      "Seguimiento de los proyectos de cada gerencia, reportes para comités de la alta dirección y un datawarehouse con datos consistentes.",
  },
  {
    id: "fork-inmobiliaria",
    rama: "inmobiliaria",
    tipo: "fork",
    fecha: "jul. 2024",
    titulo: "Nueva rama: inmobiliaria",
  },
  {
    id: "merge-consultoria",
    rama: "consultoria",
    tipo: "merge",
    fecha: "jul. 2024",
    titulo: "Merge de consultora-internacional en main",
  },
  {
    id: "datos-maestros",
    rama: "consultoria",
    tipo: "cambio",
    fecha: "2024",
    titulo: "Gobierno de datos maestros en SAP con los key users",
    detalle: "Procesos de datos maestros del módulo financiero y sus definiciones, acordadas con cada área.",
  },
  {
    id: "fork-consultoria",
    rama: "consultoria",
    tipo: "fork",
    fecha: "abr. 2024",
    titulo: "Nueva rama: consultora-internacional",
  },
  {
    id: "merge-mineria",
    rama: "mineria",
    tipo: "merge",
    fecha: "mar. 2024",
    titulo: "Merge de grupo-minero en main",
  },
  {
    id: "rpa",
    rama: "mineria",
    tipo: "cambio",
    fecha: "2022 – 2024",
    titulo: "Los tres primeros robots (RPA) de la empresa",
    detalle:
      "Más de 2 000 horas-hombre al año liberadas en procesos operativos. Key user en tres proyectos SAP de las unidades mineras y gobierno de datos con DAMA-DMBOK.",
  },
  {
    id: "fork-mineria",
    rama: "mineria",
    tipo: "fork",
    fecha: "ago. 2022",
    titulo: "Nueva rama: grupo-minero",
  },
  {
    id: "ieee",
    rama: "main",
    tipo: "cambio",
    fecha: "2022",
    titulo: "Artículo en IEEE sobre tecnologías inmersivas en la industria 4.0",
  },
  {
    id: "esan",
    rama: "main",
    tipo: "cambio",
    fecha: "2017 – 2022",
    titulo: "Ingeniería de Tecnologías de Información y Sistemas, Universidad ESAN",
    detalle: "Bachiller. Practicante de TI en ESAN Graduate School of Business (2021 – 2022).",
  },
];

// Hash corto estable a partir del id: es parte del lenguaje visual, no un dato.
export function hash(id: string): string {
  let h = 2166136261;
  for (const c of id) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

// Carriles activos en cada fila: una rama lateral vive entre su fork y su merge.
export function carrilesActivos(i: number): RamaId[] {
  const activos: RamaId[] = ["main"];
  for (const rama of Object.keys(RAMAS) as RamaId[]) {
    if (rama === "main") continue;
    const merge = HISTORIAL.findIndex((e) => e.rama === rama && e.tipo === "merge");
    const fork = HISTORIAL.findIndex((e) => e.rama === rama && e.tipo === "fork");
    if (merge !== -1 && fork !== -1 && i >= merge && i <= fork) activos.push(rama);
  }
  return activos;
}
