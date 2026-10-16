import type { Metadata } from "next";
import { Schibsted_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Cabecera, Pie } from "@/components/marco";
import "./globals.css";

const grotesk = Schibsted_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-datos",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rodrigo Arancibia · Automatización de procesos, datos e IA",
    template: "%s · Rodrigo Arancibia",
  },
  description:
    "Construyo sistemas que automatizan procesos, ordenan datos y ponen la IA a trabajar sobre lo que la empresa ya tiene. Casos, trayectoria y docencia.",
  openGraph: {
    title: "Rodrigo Arancibia",
    description: "Automatización de procesos, datos e IA aplicada. Casos de punta a punta, con el antes y el después del proceso.",
    locale: "es_PE",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${grotesk.variable} ${mono.variable} antialiased`}>
      <body>
        <div className="marco">
          <Cabecera />
          <main>{children}</main>
          <Pie />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
