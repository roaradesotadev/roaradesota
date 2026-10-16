"use client";

import { useEffect, useState } from "react";
import { Puente } from "../puente";
import { Juego } from "./Juego";
import { Hud } from "./Hud";
import { Dpad } from "./Dpad";
import { CajaDialogo } from "./CajaDialogo";
import { PantallaTitulo } from "./PantallaTitulo";
import { useEstadoJuego } from "./usePuente";
import "./juego.css";

export function Portada() {
  const [puente] = useState(() => new Puente());
  const estado = useEstadoJuego(puente);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const forzado = q.get("dpad");
    const tactil =
      forzado === "1" ||
      (forzado !== "0" && (window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0));
    puente.actualizar({ tactil });
  }, [puente]);

  // el título se desvanece en pasos (como en GBA) y recién después se desmonta
  const [tituloVisible, setTituloVisible] = useState(true);
  useEffect(() => {
    if (estado.fase !== "jugando") return;
    const t = window.setTimeout(() => setTituloVisible(false), 420);
    return () => window.clearTimeout(t);
  }, [estado.fase]);

  const conMando = estado.fase === "jugando" && estado.tactil;

  return (
    <div className={`pantalla-juego${conMando ? " con-mando" : ""}`}>
      <Juego puente={puente} />
      <Hud puente={puente} />
      {conMando && <Dpad puente={puente} />}
      <CajaDialogo puente={puente} />
      {tituloVisible && <PantallaTitulo puente={puente} saliendo={estado.fase === "jugando"} />}
    </div>
  );
}
