// Recreación de una orden por voz con datos ficticios (nombres, horas y tareas inventados).
export function RecreacionJarvis() {
  return (
    <figure className="recreacion" aria-label="Recreación de una orden por voz, con datos ficticios">
      <div className="recreacion-rotulo mono">
        <span>orden por voz · 08:05</span>
        <span>datos ficticios</span>
      </div>
      <div className="burbuja-orden">
        <span className="onda" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span>«¿Qué tengo hoy?»</span>
      </div>
      <div className="respuesta">
        <p>Hoy tiene tres prioridades y una reunión a las 11:00.</p>
        <ul>
          <li>Responder a Laura Méndez, que pidió una propuesta.</li>
          <li>Revisar el borrador del post de la semana.</li>
          <li>Enviar la guía del mes al contador.</li>
          <li>11:00 · Reunión de descubrimiento con una distribuidora.</li>
        </ul>
      </div>
    </figure>
  );
}
