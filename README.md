# Rodrigo Arancibia: portafolio

Sitio personal de Rodrigo Arancibia, sobre automatización de procesos, datos e IA aplicada.

- **La portada es un juego 2D** al estilo de los RPG de GBA: un pueblo con un edificio por empresa donde trabajó. Se camina con las flechas (o la cruceta en el celular) y se conversa con los personajes, que cuentan qué hizo en cada lugar. El motor es propio, sobre Canvas 2D, sin librerías de juegos (`src/game/`).
- **Modo texto:** `/historial` (la trayectoria como el historial de un sistema), `/casos/[slug]`, `/sobre-mi` y `/hablemos`.
- El contenido vive en `src/content/` (`historial.ts`, `casos.ts`, `perfil.ts`) y alimenta tanto las páginas como los diálogos del juego. Los clientes y empleadores van anónimos por sector, y todo dato ilustrativo está rotulado como tal.
- Next.js (App Router) en Vercel. Para trabajar en local: `npm install` y `npm run dev`.

Gráficos: por ahora dibujados por código; los paquetes de dominio público que se incorporen quedan listados en `public/juego/LICENCIAS.md`.
