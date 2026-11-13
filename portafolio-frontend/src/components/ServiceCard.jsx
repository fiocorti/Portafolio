
import { Link } from "react-router-dom";

function ServiceCard({ servicio, numero }) {
  return (
    <article className="service-card">

      <div className="service-card-number">
        {String(numero).padStart(2, "0")}
      </div>

      <h3>{servicio.nombre}</h3>

      <p className="service-card-description">
        {servicio.descripcion}
      </p>

      <h4 className="service-card-subtitle">
        ¿Qué incluye?
      </h4>

      <ul className="service-card-list">
        {servicio.incluye.map((item) => (
          <li key={item}>
            <span aria-hidden="true">✓</span>
            {item}
          </li>
        ))}
      </ul>

      <Link
        to="/contacto"
        className="service-card-link"
      >
        Solicitar información
        <span aria-hidden="true"> →</span>
      </Link>

    </article>
  );
}

export default ServiceCard;
