import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconoPixel } from "@/components/IconoPixel";
import { CASOS, caso as buscarCaso } from "@/content/casos";
import { HISTORIAL } from "@/content/historial";
import { CasoVista } from "@/components/caso-vista";

// Press Start 2P es monoespaciada: los dos puntos dejan un hueco doble, así que el título se parte ahí.
function partirTitulo(titulo: string) {
  const i = titulo.indexOf(":");
  if (i === -1) return titulo;
  return (
    <>
      {titulo.slice(0, i + 1)}
      <br />
      {titulo.slice(i + 1).trim()}
    </>
  );
}

export function generateStaticParams() {
  return CASOS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/casos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = buscarCaso(slug);
  return c ? { title: c.titulo, description: c.bajada } : {};
}

export default async function PaginaCaso({ params }: PageProps<"/casos/[slug]">) {
  const { slug } = await params;
  const c = buscarCaso(slug);
  if (!c) notFound();
  const entrada = HISTORIAL.find((e) => e.id === c.entrada);
  const i = CASOS.findIndex((x) => x.slug === c.slug);
  const siguiente = CASOS[(i + 1) % CASOS.length];

  return (
    <article>
      <header className="caso-cabeza">
        <div className="ficha">
          <Link href={`/historial#${c.entrada}`} className="enlace-sec">
            <IconoPixel nombre="flecha_izquierda" tam={2} /> Volver al historial
          </Link>
          <h1>{partirTitulo(c.titulo)}</h1>
          <div className="meta-commit">{entrada?.fecha}</div>
          <p className="bajada">{c.bajada}</p>
          <CasoVista caso={c} diff={entrada?.diff} />
          <p style={{ marginTop: 40 }}>
            <Link href={`/casos/${siguiente.slug}`} className="ver-caso">
              Siguiente caso: {siguiente.titulo} <IconoPixel nombre="flecha_derecha" tam={2} />
            </Link>
          </p>
          <div className="acciones">
            <Link className="boton" href="/hablemos">
              Conversemos 30 minutos <IconoPixel nombre="flecha_derecha" tam={2} />
            </Link>
          </div>
        </div>
      </header>
    </article>
  );
}
