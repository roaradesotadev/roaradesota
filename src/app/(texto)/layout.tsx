import { Cabecera, Pie } from "@/components/marco";

// Marco de las páginas de texto (historial, casos, Sobre mí, Hablemos). La portada es el juego.
export default function LayoutTexto({ children }: { children: React.ReactNode }) {
  return (
    <div className="marco">
      <Cabecera />
      <main>{children}</main>
      <Pie />
    </div>
  );
}
