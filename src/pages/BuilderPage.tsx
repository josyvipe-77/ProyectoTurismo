import { ArrowRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  plannedPhotographyDays,
  photographyExperience as experience,
  photographyProgramText,
} from '../data/photography-experience';
import { useTravel } from '../hooks/useTravel';
import { ExperiencePhoto } from '../components/ExperiencePhoto';
import { RespectNote } from '../components/Editorial';
import { PhotographyRoute } from '../components/PhotographyRoute';
import { ViewpointChoices } from '../components/ViewpointChoices';
import { usePhotographyRoute } from '../hooks/usePhotographyRoute';
import { monthNames, rainyPampachiri } from '../data/photography-planning';
import type { TripPlanning } from '../data/photography-planning';
import { AmpayChoices } from '../components/AmpayChoices';
import { TravelServices } from '../components/TravelServices';
import { projectMaterials } from '../data/project-materials';

function downloadProgram(viewpointIds: string[], planning: TripPlanning) {
  const url = URL.createObjectURL(
    new Blob([photographyProgramText(viewpointIds, planning)], {
      type: 'text/plain;charset=utf-8',
    }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = 'jacs-destinos-apurimac-a-traves-de-tu-objetivo.txt';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function BuilderPage() {
  const { savedPlan } = useTravel();
  const { viewpointIds, planning, updatePlanning, storageWarning } = usePhotographyRoute();
  const days = plannedPhotographyDays(planning, viewpointIds);
  return (
    <div className="container page program-page">
      <div className="page-intro">
        <span className="eyebrow blue">Planifica tu viaje · Programa preliminar</span>
        <h1>
          Cinco jornadas.
          <br />
          <em>Tu objetivo, Apurímac.</em>
        </h1>
        <p>
          El recorrido de «{experience.name}» comienza y termina en Abancay. Cada día propone un
          enfoque distinto para observar el paisaje y su patrimonio.
        </p>
      </div>
      <div className="program-toolbar">
        <div>
          <strong>5 días · 4 noches de estancia · {experience.group}</strong>
          <span>Programa de diseño · Alojamiento no incluido</span>
        </div>
        <button
          className="button button-outline"
          onClick={() => downloadProgram(viewpointIds, planning)}
        >
          <Download size={18} /> Mi programa · TXT
        </button>
      </div>
      <p className="program-download-note">
        <a className="text-link" href={projectMaterials.programPdf} download>
          <Download size={16} /> Descargar programa base · PDF
        </a>
        <span>El PDF presenta el recorrido general. El TXT conserva tus elecciones.</span>
      </p>
      <p className="program-status">
        Horarios estimados ajustados a referencias publicadas y con pausas para fotografía, comidas
        y descanso. Confirmar fecha, condiciones de acceso y logística con gestores y guía.
      </p>
      <div className="planning-fields planning-overview">
        <label htmlFor="travel-month">
          Mes propuesto
          <select
            id="travel-month"
            value={planning.month}
            onChange={(event) => updatePlanning({ month: Number(event.target.value) })}
          >
            {monthNames.map((name, index) => (
              <option key={name} value={index}>
                {name}
              </option>
            ))}
          </select>
          <small>
            La fecha exacta permitirá calcular la luz. Enero–marzo activa el horario abreviado de
            Pampachiri.
          </small>
        </label>
      </div>
      <p className="small muted">
        Alojamiento no incluido; cada participante organiza su hospedaje en Abancay.
      </p>
      {rainyPampachiri(planning.month) && (
        <p className="viewpoint-timing" role="status">
          Pampachiri usa una visita abreviada hasta las 14:00, según la recomendación de su ficha
          para enero–marzo. Comprobar alertas y estado de la carretera.
        </p>
      )}
      {planning.month === 0 && (
        <p className="small muted">
          Mes por definir: el horario de Pampachiri es la referencia hasta las 17:00. La lluvia y
          las horas de luz pueden requerir cambios.
        </p>
      )}
      {storageWarning && <p role="status">{storageWarning}</p>}
      <nav className="planning-shortcuts" aria-label="Información para preparar el viaje">
        <Link to="#servicios-del-viaje">Servicios y comidas</Link>
        <Link to="#exclusiones-del-viaje">Exclusiones</Link>
        <Link to="#photography-route-heading">Mapa del recorrido</Link>
      </nav>
      <nav className="program-index" aria-label="Jornadas del programa">
        {days.map((day) => (
          <Link key={day.id} to={`#${day.id}`}>
            <span>0{day.day}</span>
            {day.title}
          </Link>
        ))}
      </nav>
      <div className="program-days">
        {days.map((day) => (
          <section
            className="program-day"
            id={day.id}
            key={day.id}
            aria-labelledby={`${day.id}-title`}
          >
            <div className="program-day-heading">
              <span className="day-number">0{day.day}</span>
              <div>
                <span className="eyebrow blue">{day.theme}</span>
                <h2 id={`${day.id}-title`}>{day.title}</h2>
                <p className="program-tagline">{day.tagline}</p>
              </div>
            </div>
            <div className={`program-day-body ${day.photoId ? '' : 'no-photo'}`}>
              <div>
                <p>{day.description}</p>
                <ol className="program-stops" aria-label="Paradas propuestas">
                  {day.stops.map((stop) => (
                    <li key={stop}>{stop}</li>
                  ))}
                </ol>
                {day.day === 5 && <ViewpointChoices />}
                {day.day === 4 && <AmpayChoices />}
                <h3>Qué fotografiar</h3>
                <p>{day.photography}</p>
                <aside className="cultural-reading" aria-labelledby={`${day.id}-culture`}>
                  <span className="eyebrow blue">Paisaje y patrimonio</span>
                  <h3 id={`${day.id}-culture`}>Qué nos cuenta este lugar</h3>
                  <p>{day.culturalReading}</p>
                  <p className="observation-prompt">
                    <strong>Una mirada para llevarte.</strong> {day.observation}
                  </p>
                  <div className="cultural-sources">
                    {day.culturalSources.map((source) => (
                      <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                        {source.label} ↗
                      </a>
                    ))}
                  </div>
                </aside>
                <details className="program-stop-details">
                  <summary>Detalles de las paradas · Día {day.day}</summary>
                  <div>
                    <h3>Objetivo de la jornada</h3>
                    <p>{day.objective}</p>
                    {day.stopDetails.map((stop) => (
                      <article key={stop.name}>
                        <span className="stop-status">{stop.status}</span>
                        <h4>{stop.name}</h4>
                        <p>{stop.description}</p>
                        <p>
                          <strong>Qué fotografiar:</strong> {stop.photography}
                        </p>
                        <p>
                          <strong>Tiempo propuesto:</strong> {stop.duration}
                        </p>
                        <p>
                          <strong>Esfuerzo:</strong> {stop.effort}
                        </p>
                        {stop.source && (
                          <a href={stop.source} target="_blank" rel="noreferrer">
                            Consultar referencia ↗
                          </a>
                        )}
                      </article>
                    ))}
                  </div>
                </details>
                <details className="program-schedule">
                  <summary>
                    {day.schedule.length ? 'Ver horario estimado' : 'Horario por diseñar'} · Día{' '}
                    {day.day}
                  </summary>
                  {!day.schedule.length && (
                    <p className="schedule-empty">
                      {viewpointIds.length
                        ? 'Varios miradores: comprobar enlaces y duración antes de fijar horas. La combinación puede requerir más días.'
                        : 'Elige un mirador para ver la referencia de una jornada.'}
                    </p>
                  )}
                  <ol>
                    {day.schedule.map((item) => (
                      <li key={item.time}>
                        <time>{item.time}</time>
                        <span>{item.activity}</span>
                      </li>
                    ))}
                  </ol>
                </details>
                <details className="program-practical-details">
                  <summary>Preparación y condiciones · Día {day.day}</summary>
                  <div className="program-practical-content">
                    <dl className="day-practical">
                      <div>
                        <dt>Accesos y referencias</dt>
                        <dd>{day.access}</dd>
                      </div>
                      <div>
                        <dt>Comidas y pausas</dt>
                        <dd>{day.meals}</dd>
                      </div>
                      <div>
                        <dt>Esfuerzo del recorrido</dt>
                        <dd>{day.effort}</dd>
                      </div>
                      <div>
                        <dt>Alternativa por condiciones</dt>
                        <dd>{day.weatherPlan}</dd>
                      </div>
                    </dl>
                    <div className="program-pending">
                      <strong>Confirmación operativa</strong>
                      <p>{day.pending}</p>
                    </div>
                    <a href={day.source} target="_blank" rel="noreferrer" className="text-link">
                      Fuente del destino ↗
                    </a>
                  </div>
                </details>
              </div>
              {day.photoId && <ExperiencePhoto id={day.photoId} name={day.title} />}
            </div>
          </section>
        ))}
      </div>
      <TravelServices />
      <PhotographyRoute choices={false} />
      {savedPlan && (
        <section className="section" id="cuaderno-anterior">
          <details className="legacy-notebook">
            <summary>Tu cuaderno anterior sigue disponible · {savedPlan.days} días</summary>
            <p>
              Este borrador corresponde al constructor anterior. Se conserva en este navegador y no
              se ha sustituido por el programa fotográfico.
            </p>
            <ol>
              {savedPlan.destinations.map((stop, index) => (
                <li key={`${stop}-${index}`}>{stop}</li>
              ))}
            </ol>
            <p>Intereses: {savedPlan.interests.join(' · ')}</p>
          </details>
        </section>
      )}
      <div className="program-footer-links">
        <Link to="/experiencia" className="text-link">
          Servicios y preparación <ArrowRight size={18} />
        </Link>
        <Link to="/rutas" className="text-link">
          Explora los circuitos de referencia <ArrowRight size={18} />
        </Link>
      </div>
      <RespectNote />
    </div>
  );
}
