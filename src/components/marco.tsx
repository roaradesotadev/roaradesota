"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", texto: "Jugar" },
  { href: "/historial", texto: "Historial" },
  { href: "/sobre-mi", texto: "Sobre mí" },
  { href: "/hablemos", texto: "Hablemos" },
];

export const CORREO = "roarancibia733@gmail.com";
export const LINKEDIN = "https://www.linkedin.com/in/hirodrigoarancibia";
export const INTNOVA = "https://www.intnovaconsulting.com";

function esActual(href: string, ruta: string) {
  if (href === "/") return false; // la portada es el juego: desde el modo texto nunca es "actual"
  if (href === "/historial") return ruta.startsWith("/historial") || ruta.startsWith("/casos");
  return ruta.startsWith(href);
}

export function Cabecera() {
  const ruta = usePathname();
  return (
    <header className="cabecera">
      <Link href="/historial" className="nombre-corto">
        Rodrigo Arancibia
      </Link>
      <nav className="nav" aria-label="Principal">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} aria-current={esActual(n.href, ruta) ? "page" : undefined}>
            {n.texto}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function Pie() {
  return (
    <footer className="pie">
      <span>Rodrigo Arancibia · Lima, Perú</span>
      <nav aria-label="Enlaces externos">
        <a href={INTNOVA} rel="noopener">INTNOVA Consulting</a>
        <a href={LINKEDIN} rel="noopener">LinkedIn</a>
        <a href={`mailto:${CORREO}`}>{CORREO}</a>
      </nav>
    </footer>
  );
}
