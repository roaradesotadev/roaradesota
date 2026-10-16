import type { Metadata, Viewport } from "next";
import { Pixelify_Sans, Press_Start_2P } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Dos fuentes para todo el sitio: Pixelify para leer (acentos y ñ legibles),
// Press Start 2P solo para títulos y rótulos cortos, a múltiplos de 8 px.
const pixel = Pixelify_Sans({
  variable: "--font-pixel",
  subsets: ["latin"],
  display: "swap",
});

const pixelRotulo = Press_Start_2P({
  variable: "--font-pixel-rotulo",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rodrigo Arancibia · Automatización de procesos, datos e IA",
    template: "%s · Rodrigo Arancibia",
  },
  description:
    "Construyo sistemas que automatizan procesos, ordenan datos y ponen la IA a trabajar sobre lo que la empresa ya tiene. Un pueblo para recorrer, casos, trayectoria y docencia.",
  openGraph: {
    title: "Rodrigo Arancibia",
    description: "Automatización de procesos, datos e IA aplicada. Recorra el pueblo o lea los casos, con el antes y el después del proceso.",
    locale: "es_PE",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#adbc3a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${pixel.variable} ${pixelRotulo.variable} antialiased`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
