// Trayectoria, docencia y formación de Rodrigo. Fuente: su CV (16/10/2026).
// Lo usan la página "Sobre mí" (modo texto) y los personajes del juego.

export type Etapa = { c: string; fecha: string; rol: string; texto: string };

export const TRAYECTORIA: Etapa[] = [
  { c: "var(--rama-main)", fecha: "2026 – hoy", rol: "Fundador y gerente general, INTNOVA Consulting", texto: "Automatización de procesos, datos e IA aplicada sobre los sistemas que cada empresa ya tiene." },
  { c: "var(--rama-banca)", fecha: "2024 – 2026", rol: "Data Steward, integradora tecnológica (banca y seguros)", texto: "Migración de procesos core a un Lakehouse en la nube y gobierno de datos críticos." },
  { c: "var(--rama-inmobiliaria)", fecha: "2024", rol: "Analista de Mejora Continua e Innovación, inmobiliaria", texto: "Seguimiento de proyectos por gerencia, reportes para la alta dirección y un datawarehouse." },
  { c: "var(--rama-consultoria)", fecha: "2024", rol: "Consultor de Gobierno de Datos, consultora internacional", texto: "Datos maestros del módulo financiero de SAP, con los key users." },
  { c: "var(--rama-mineria)", fecha: "2022 – 2024", rol: "Asistente de Procesos, grupo minero", texto: "Los tres primeros RPA de la empresa (más de 2 000 horas-hombre al año) y tres proyectos SAP." },
  { c: "var(--riel)", fecha: "2021 – 2022", rol: "Practicante de TI, ESAN Graduate School of Business", texto: "" },
];

export const TEMAS = [
  "Automatización de tareas repetitivas con Power Automate e IA",
  "Power BI y análisis de datos para la toma de decisiones",
  "Excel intermedio y avanzado para equipos de negocio",
  "IA generativa aplicada al trabajo diario",
  "Innovación, design thinking y Scrum",
];

export const DOCENCIA_INTRO =
  "Facilito capacitaciones in-company y talleres prácticos: se aprende haciendo, con los archivos y los procesos reales del equipo. Formatos de 8, 12 o 16 horas.";

export const DOCENCIA_EXPERIENCIA =
  "Experiencia como facilitador: capacitaciones corporativas con Kaudal (2026) y el bootcamp del programa de innovación interna de un centro comercial de Lima (2025, 80 participantes).";

export const FORMACION = [
  "Diplomatura Internacional en Gestión de Procesos, CENTRUM PUCP y EADA Business School (2024 – 2025).",
  "Diplomatura en Dirección de Innovación, Agilidad y Transformación Digital, PUCP (2023 – 2024).",
  "Bachiller en Ingeniería de Tecnologías de Información y Sistemas, Universidad ESAN (2017 – 2022).",
  "SAP ERP (ESAN, 2021), ITIL 4 Foundation (Cibertec, 2020) y Cloud Computing (Google, 2020).",
  "Artículo en IEEE (2022) sobre tecnologías inmersivas en la industria 4.0.",
];

export const PERFIL_RESUMEN =
  "Ingeniero de Tecnologías de Información y Sistemas por la Universidad ESAN. Más de cinco años mejorando procesos en minería, inmobiliario, centros comerciales, banca y seguros. Hoy dirijo INTNOVA Consulting y dicto capacitaciones corporativas en automatización, datos e IA.";
