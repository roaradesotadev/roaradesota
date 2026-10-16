---
version: 1
slug: "portafolio-web-src-app-page-tsx"
primary_target: "portafolio-web/src/app/page.tsx"
related_targets: []
---

## Scope

- **Surface:** the home page `/` is a 2D top-down pixel game (the town). The text mode lives under `/historial`, `/casos/[slug]`, `/sobre-mi` and `/hablemos` and keeps the "Historial de cambios" world (its contract is retired for `/` only).
- **Visitor mode:** Experience (the visitor is inside the work). The Persuade action stays visible: the HUD "Modo texto" link, and the mailbox's "Escribir un correo" and "Bajar el CV".
- **Pinned by Rodrigo (16/10/2026 15:20):** a GBA-era Pokémon-style town, free movement with arrow keys or a touch d-pad, one person per employer building who tells what he did there. The brief wins: no direction tournament was run for this surface.
- **Constraints:** employers anonymous by sector, synthetic data labelled, only CC0 art (nothing from Nintendo), Spanish first, no PMP.

## Direction contract

**THESIS:** the CV as a town you walk through. One building per employer, one person outside who tells the story in the third person, Rodrigo greets you at the plaza and Jarvis waits at the INTNOVA HQ. It refuses the card-grid portfolio and the 3D showcase.

**OWN-WORLD:** 16 px tiles at integer scale (×2 on a phone, ×4 on desktop). GBA palette: grass #8cd46c, path #e4d29a, plaza stone #dfe4dd, water #5aa8f0, one roof colour per employer (INTNOVA green #2f7d5b, mining copper, real-estate red, consulting blue, banking slate, mall purple, university dark red, academy orange). Characters are 16 × 20 with a 1 px dark outline. The UI is white pixel boxes with a 4 px black border, an inner white line and a hard 5 px shadow. Pixelify Sans for dialogue text; Press Start 2P only for short labels (name, Jugar, A/B). Accent green #1f6b57.

**STORY:** title box → Jugar → you stand on the plaza facing Rodrigo → he explains the controls → you explore freely → each NPC gives two to four pages of facts → Jarvis offers "Ver el caso completo" → the mailbox offers mail and the CV. Anyone can leave to text mode at any time.

**FIRST VIEWPORT:** the town behind a dark veil with the title box centred (name in Press Start 2P, one sentence, the Jugar button, "Prefiero leer: modo texto →"). After Jugar: the plaza with the player at the centre, Rodrigo one tile north, the plaza sign to the west and the INTNOVA HQ visible at the top; HUD top-right with "Modo texto".

**FORM:** pinned by the brief (GBA top-down RPG town); the earlier seed 87d552d8 belonged to the text-mode world and is retired for `/`. Signature interaction: tile-by-tile walking with turn-before-step, NPCs turning to face you, and the typewriter dialogue box with a blinking chevron.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved

- CC0 asset pack (Ninja Adventure) pending Rodrigo's download permission; procedural tiles and characters ship meanwhile.
- The public CV file (phone number, Jockey name) pending his decision.
