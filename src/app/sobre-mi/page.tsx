import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre mí",
  description: "Trayectoria, docencia y formación de Rodrigo Arancibia: procesos, datos e IA aplicada.",
};

const TRAYECTORIA = [
  { c: "var(--rama-main)", fecha: "2026 – hoy", rol: "Fundador y gerente general, INTNOVA Consulting", texto: "Automatización de procesos, datos e IA aplicada sobre los sistemas que cada empresa ya tiene." },
  { c: "var(--rama-banca)", fecha: "2024 – 2026", rol: "Data Steward, integradora tecnológica (banca y seguros)", texto: "Migración de procesos core a un Lakehouse en la nube y gobierno de datos críticos." },
  { c: "var(--rama-inmobiliaria)", fecha: "2024", rol: "Analista de Mejora Continua e Innovación, inmobiliaria", texto: "Seguimiento de proyectos por gerencia, reportes para la alta dirección y un datawarehouse." },
  { c: "var(--rama-consultoria)", fecha: "2024", rol: "Consultor de Gobierno de Datos, consultora internacional", texto: "Datos maestros del módulo financiero de SAP, con los key users." },
  { c: "var(--rama-mineria)", fecha: "2022 – 2024", rol: "Asistente de Procesos, grupo minero", texto: "Los tres primeros RPA de la empresa (más de 2 000 horas-hombre al año) y tres proyectos SAP." },
  { c: "var(--riel)", fecha: "2021 – 2022", rol: "Practicante de TI, ESAN Graduate School of Business", texto: "" },
];

const TEMAS = [
  "Automatización de tareas repetitivas con Power Automate e IA",
  "Power BI y análisis de datos para la toma de decisiones",
  "Excel intermedio y avanzado para equipos de negocio",
  "IA generativa aplicada al trabajo diario",
  "Innovación, design thinking y Scrum",
];

export default function SobreMi() {
  return (
    <div className="pagina">
      <div aria-hidden="true" />
      <div>
        <h1>Sobre mí</h1>
        <p className="bajada">
          Ingeniero de Tecnologías de Información y Sistemas por la Universidad ESAN. Más de cinco años mejorando
          procesos en minería, inmobiliario, centros comerciales, banca y seguros. Hoy dirijo INTNOVA Consulting y
          dicto capacitaciones corporativas en automatización, datos e IA.
        </p>
        <div className="acciones">
          <a className="boton" href="/cv/CV_Rodrigo_Arancibia.pdf" download>
            <Download size={18} strokeWidth={2} aria-hidden="true" /> Bajar CV
          </a>
          <Link className="enlace-sec" href="/hablemos">
            Conversemos <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>

        <h2>Trayectoria</h2>
        <ul className="tabla-trayectoria">
          {TRAYECTORIA.map((t) => (
            <li key={t.rol}>
              <span className="pastilla" style={{ "--c": t.c } as React.CSSProperties} aria-hidden="true" />
              <span className="mono" style={{ fontSize: "0.85rem", color: "var(--tinta-3)" }}>
                {t.fecha}
              </span>
              <span>
                <strong>{t.rol}.</strong> {t.texto}
              </span>
            </li>
          ))}
        </ul>

        <h2>Docencia</h2>
        <p>
          Facilito capacitaciones in-company y talleres prácticos: se aprende haciendo, con los archivos y los
          procesos reales del equipo. Formatos de 8, 12 o 16 horas.
        </p>
        <ul className="lista-resultado">
          {TEMAS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p style={{ marginTop: 18 }}>
          Experiencia como facilitador: capacitaciones corporativas con Kaudal (2026) y el bootcamp del programa de
          innovación interna de un centro comercial de Lima (2025, 80 participantes).
        </p>

        <h2>Formación</h2>
        <ul className="lista-resultado">
          <li>Diplomatura Internacional en Gestión de Procesos, CENTRUM PUCP y EADA Business School (2024 – 2025).</li>
          <li>Diplomatura en Dirección de Innovación, Agilidad y Transformación Digital, PUCP (2023 – 2024).</li>
          <li>Bachiller en Ingeniería de Tecnologías de Información y Sistemas, Universidad ESAN (2017 – 2022).</li>
          <li>SAP ERP (ESAN, 2021), ITIL 4 Foundation (Cibertec, 2020) y Cloud Computing (Google, 2020).</li>
          <li>Artículo en IEEE (2022) sobre tecnologías inmersivas en la industria 4.0.</li>
        </ul>
      </div>
    </div>
  );
}
