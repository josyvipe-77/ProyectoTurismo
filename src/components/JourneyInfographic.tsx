import { ArrowUpRight, Binoculars, Landmark, Layers, Mountain, Trees } from 'lucide-react';
import { Link } from 'react-router-dom';
import { photographyDays } from '../data/photography-experience';

const icons = [Binoculars, Mountain, Landmark, Trees, Layers];

export function JourneyInfographic() {
  return (
    <section className="section journey-infographic" aria-labelledby="journey-infographic-title">
      <div className="journey-infographic-heading">
        <span className="eyebrow blue">El programa, de un vistazo</span>
        <h2 id="journey-infographic-title">
          Cinco días. <em>Cinco formas de mirar.</em>
        </h2>
        <p>
          Un recorrido base con salida y regreso a Abancay. Cada jornada propone una manera distinta
          de observar y fotografiar.
        </p>
      </div>
      <ol className="journey-infographic-grid">
        {photographyDays.map((day, index) => {
          const Icon = icons[index];
          return (
            <li key={day.id}>
              <span className="journey-infographic-day">
                Día {day.day.toString().padStart(2, '0')}
              </span>
              <Icon size={32} strokeWidth={1.25} aria-hidden="true" />
              <span className="eyebrow blue">{day.theme}</span>
              <h3>{day.title}</h3>
              <p>{day.photography}</p>
              <Link className="text-link" to={`/construye#${day.id}`}>
                Ver jornada <ArrowUpRight size={15} />
              </Link>
            </li>
          );
        })}
      </ol>
      <p className="small muted">
        Programa base. Las variantes de Ampay, los miradores y los ajustes por temporada se eligen
        en el planificador.
      </p>
    </section>
  );
}
