// Casos completos (frente y reverso). Hechos verificables de los sistemas que Rodrigo usa a diario.
// Sin cifras de Finanzas, nombres de clientes ni prospectos; lo ilustrativo se rotula en pantalla.

export type Pieza = { n: number; nombre: string; texto: string };
export type Estacion = { nombre: "Diagnóstico" | "Construcción" | "Prueba" | "En uso"; texto: string };

export type Caso = {
  slug: string;
  entrada: string; // id en HISTORIAL
  titulo: string;
  bajada: string;
  problema: string;
  resultado: string[];
  piezas: Pieza[];
  estaciones: Estacion[];
  herramientas: string[];
  aprendizajes: string[];
};

export const CASOS: Caso[] = [
  {
    slug: "jarvis",
    entrada: "jarvis",
    titulo: "Jarvis: la consultora se opera por voz",
    bajada:
      "Un asistente que escucha, ejecuta y responde. Lo construí para mi propia consultora y lo uso todos los días, desde la laptop y desde el celular.",
    problema:
      "En una consultora de una sola persona, todo pasa por las mismas manos: prospección, seguimiento, contenido, pendientes y finanzas. La mitad del día se iba en abrir herramientas, copiar datos de una a otra y acordarse de qué faltaba.",
    resultado: [
      "Una orden hablada reemplaza la secuencia de abrir, buscar, copiar y anotar.",
      "Cada mañana el sistema arma el día: las tres prioridades, los seguimientos y las reuniones.",
      "Desde el celular puedo dar órdenes, mandar fotos o documentos y ver los entregables del día.",
      "La respuesta llega en voz alta en una o dos frases; el detalle queda escrito.",
    ],
    piezas: [
      { n: 1, nombre: "Botón y transcripción", texto: "Un botón del mouse empieza y termina la grabación; la voz se transcribe en la misma laptop." },
      { n: 2, nombre: "Orquestador", texto: "Una sesión de Claude Code recibe la orden, decide qué hacer y es la única que habla conmigo." },
      { n: 3, nombre: "Agentes especializados", texto: "Trece agentes, uno por área, cada uno con su manual, sus reglas y sus pruebas." },
      { n: 4, nombre: "Voz", texto: "El primer párrafo de cada respuesta se lee en voz alta; se apaga en reuniones." },
      { n: 5, nombre: "Burbuja y panel", texto: "Una burbuja flotante con la conversación en viñetas y un panel con tablero, CRM y entregables." },
      { n: 6, nombre: "App del celular", texto: "La misma vista en el teléfono, por una red privada, con chat, fotos y documentos." },
      { n: 7, nombre: "Datos propios", texto: "CRM, ERP, tablero de pendientes y registro de decisiones: lo que el sistema lee y actualiza." },
    ],
    estaciones: [
      { nombre: "Diagnóstico", texto: "Partí de lo que más se repetía en el día y de cuántas herramientas tocaba para cada tarea: buscar, copiar, anotar y recordar fechas." },
      { nombre: "Construcción", texto: "Primero los datos (CRM, tablero, registro), luego el orquestador con sus agentes ①②③, después la voz ①④ y al final la burbuja, el panel y el celular ⑤⑥." },
      { nombre: "Prueba", texto: "Cada módulo tiene pruebas automáticas y cada agente, casos de prueba con la respuesta esperada. Un cambio en un manual se prueba antes de usarse." },
      { nombre: "En uso", texto: "Lo uso a diario desde octubre de 2026. Cada semana una retrospectiva convierte los errores en reglas nuevas para los agentes." },
    ],
    herramientas: ["Claude Code", "Python", "Electron", "Transcripción local de voz", "Síntesis de voz", "SQLite", "Red privada para el celular", "Conectores MCP"],
    aprendizajes: [
      "Separar al orquestador de los agentes: uno solo habla con la persona y decide; los demás trabajan en su área.",
      "Las reglas viven en archivos, no en la memoria del modelo: así se pueden leer, corregir y probar.",
      "Lo irreversible (enviar, publicar, borrar) siempre pide confirmación; lo demás se hace sin preguntar.",
    ],
  },
  {
    slug: "sistema-operativo",
    entrada: "sistema-operativo",
    titulo: "Un CRM y un ERP propios para una consultora de una persona",
    bajada:
      "Reemplacé un CRM de terceros y un puñado de hojas de cálculo por bases propias, sincronizadas y operadas por agentes. Es la memoria del negocio.",
    problema:
      "Los contactos vivían en un CRM, los correos en la herramienta de prospección, las finanzas en hojas de cálculo y las decisiones en mi cabeza. Cada reporte era armar un rompecabezas.",
    resultado: [
      "Un CRM propio con contactos, empresas, negocios, actividades y seguimientos, sincronizado cada hora con la herramienta de prospección.",
      "Un ERP propio de finanzas y tesorería que genera el reporte en hoja de cálculo y la guía mensual para el contador.",
      "Un tablero de pendientes con un máximo de tres prioridades por día y una barra de capacidad.",
      "Un registro de decisiones que guarda qué se decidió, por qué y desde cuándo.",
    ],
    piezas: [
      { n: 1, nombre: "CRM", texto: "Base SQLite con su línea de comandos; es el registro oficial de contactos y negocios." },
      { n: 2, nombre: "Sincronización", texto: "Cada hora baja secuencias, estados, correos y tareas de la herramienta de prospección." },
      { n: 3, nombre: "ERP", texto: "Comprobantes, pagos, tesorería y obligaciones; genera la hoja de cálculo y la guía de impuestos." },
      { n: 4, nombre: "Tablero", texto: "Los pendientes del día, por persona y por agente, con su enlace directo y el texto exacto." },
      { n: 5, nombre: "Registro de decisiones", texto: "Solo se agrega: una decisión que cambia se registra nueva y apunta a la anterior." },
    ],
    estaciones: [
      { nombre: "Diagnóstico", texto: "Revisé qué dato vivía dónde y cuáles copiaba a mano de un lugar a otro. La respuesta decidió el orden: primero el CRM ①②, después las finanzas ③." },
      { nombre: "Construcción", texto: "Esquema, migración del CRM anterior, sincronización ② y luego el ERP ③ con sus reglas: las cifras viven solo ahí." },
      { nombre: "Prueba", texto: "Migraciones con conteos antes y después, y pruebas de cada comando antes de apagar el sistema anterior." },
      { nombre: "En uso", texto: "En producción desde octubre de 2026; el CRM anterior quedó como histórico de solo lectura." },
    ],
    herramientas: ["Python", "SQLite", "Claude Code", "API de la herramienta de prospección", "Generación de hojas de cálculo", "Panel web propio"],
    aprendizajes: [
      "Una sola fuente de verdad por tema evita la pregunta «¿cuál es el dato correcto?».",
      "Los datos sensibles se quedan en un solo lugar y nunca viajan al tablero ni al chat.",
      "Registrar las decisiones con su porqué ahorra discutirlas dos veces.",
    ],
  },
];

export function caso(slug: string) {
  return CASOS.find((c) => c.slug === slug);
}
