"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", texto: "Historial" },
  { href: "/sobre-mi", texto: "Sobre mí" },
  { href: "/hablemos", texto: "Hablemos" },
];

export const CORREO = "roarancibia733@gmail.com";
export const LINKEDIN = "https://www.linkedin.com/in/hirodrigoarancibia";
export const INTNOVA = "https://www.intnovaconsulting.com";

export function Cabecera() {
  const ruta = usePathname();
  return (
    <header className="cabecera">
      {ruta === "/" ? (
        <span />
      ) : (
        <Link href="/" className="nombre-corto">
          Rodrigo Arancibia
        </Link>
      )}
      <nav className="nav" aria-label="Principal">
        {NAV.map((n) => {
          const actual = n.href === "/" ? ruta === "/" || ruta.startsWith("/casos") : ruta.startsWith(n.href);
          return (
            <Link key={n.href} href={n.href} aria-current={actual ? "page" : undefined}>
              {n.texto}
            </Link>
          );
        })}
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
