import { useCallback, useEffect, useRef, useState } from "react";

// Escribe el texto letra por letra. Se usa en un componente que se vuelve a montar por página
// (clave de React), así el contador arranca en cero sin reiniciarlo en un efecto.
// Con "reducir movimiento" el texto aparece completo de una vez.
export function useMaquinaEscribir(texto: string, msPorCaracter = 18) {
  const [n, setN] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? texto.length : 0,
  );
  const temporizador = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setN(i);
      if (i >= texto.length) window.clearInterval(id);
    }, msPorCaracter);
    temporizador.current = id;
    return () => window.clearInterval(id);
  }, [texto, msPorCaracter]);

  const completar = useCallback(() => {
    if (temporizador.current !== null) window.clearInterval(temporizador.current);
    setN(texto.length);
  }, [texto]);

  return { visible: texto.slice(0, n), completo: n >= texto.length, completar };
}
