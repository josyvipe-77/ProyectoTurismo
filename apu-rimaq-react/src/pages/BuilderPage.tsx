import { ArrowRight, Bookmark, Check, Compass, RotateCcw, Trash2 } from 'lucide-react';
import { destinations, interests } from '../data';
import { useBuilder } from '../hooks/useBuilder';
import { PlanResult } from '../components/PlanResult';
import { RespectNote } from '../components/Editorial';
import { Link } from 'react-router-dom';

export default function BuilderPage() {
  const builder = useBuilder();
  const { selection } = builder;
  const saved = !!builder.plan && builder.savedPlan?.createdAt === builder.plan.createdAt;
  return (
    <div className="container page">
      <div className="page-intro">
        <span className="eyebrow blue">Cuaderno N.º 04 · Planificación consciente</span>
        <h1>
          Construye tu ruta
          <br />
          <em>por la tierra Chanka.</em>
        </h1>
        <p>
          Diseña un compás personal entre lagunas, memoria y pueblos. Un primer borrador con espacio
          para escuchar y cambiar de idea.
        </p>
      </div>
      <div className="saved-banner">
        <Compass size={22} />
        <div>
          <strong>Primero, conoce los accesos que comparten camino.</strong>
          <span>
            Consulta los 15 circuitos investigados. Este constructor libre conserva el orden de tu
            selección y no optimiza conexiones.
          </span>
        </div>
        <Link className="text-link" to="/rutas#regional-heading">
          Ver circuitos <ArrowRight size={16} />
        </Link>
      </div>
      {builder.savedPlan && (
        <div className="saved-banner">
          <Bookmark size={22} />
          <div>
            <strong>Tienes un cuaderno guardado</strong>
            <span>
              {builder.savedPlan.days} días · {builder.savedPlan.destinations.join(' · ')}
            </span>
          </div>
          <button className="text-link" onClick={builder.load}>
            <RotateCcw size={16} />
            Recuperar
          </button>
          <button
            className="icon-button"
            aria-label="Eliminar ruta guardada"
            onClick={builder.remove}
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
      <div className="builder-layout">
        <form
          className="builder-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (builder.generate() && window.matchMedia('(max-width: 800px)').matches) {
              requestAnimationFrame(() => {
                const result = document.getElementById('result-title');
                result?.scrollIntoView({ behavior: 'instant', block: 'start' });
                result?.focus({ preventScroll: true });
              });
            }
          }}
          noValidate
        >
          <div className="form-heading">
            <span>
              <Compass size={20} />
              Configuración del itinerario
            </span>
            <small>Tres elecciones, un comienzo</small>
          </div>
          <fieldset>
            <legend>
              <span className="step-dot">1</span>Tu tiempo en el territorio
            </legend>
            <p className="field-hint">¿Cuántas jornadas quieres dedicarle al viaje?</p>
            <div className="day-options">
              {Array.from({ length: 9 }, (_, index) => index + 2).map((day) => (
                <button
                  type="button"
                  key={day}
                  className={selection.days === day ? 'selected-control' : ''}
                  aria-pressed={selection.days === day}
                  aria-label={`${day} días`}
                  onClick={() => builder.update({ ...selection, days: day })}
                >
                  {day}
                  <small>días</small>
                </button>
              ))}
            </div>
            <div className="field-note">Deja espacio para descansar y confirmar los traslados.</div>
          </fieldset>
          <fieldset>
            <legend>
              <span className="step-dot">2</span>Lo que despierta tu curiosidad
            </legend>
            <p className="field-hint">Elige uno o varios intereses.</p>
            <div className="choice-grid">
              {interests.map((interest) => (
                <label
                  key={interest}
                  className={`choice ${selection.interests.includes(interest) ? 'choice-selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selection.interests.includes(interest)}
                    onChange={() => builder.toggle('interests', interest)}
                  />
                  <span>{interest}</span>
                  <Check size={16} aria-hidden="true" />
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>
              <span className="step-dot">3</span>Las escalas de tu cuaderno
            </legend>
            <p className="field-hint">El orden del recorrido sigue el orden de tu selección.</p>
            <div className="destination-options">
              {destinations.map((destination) => (
                <label className="destination-choice" key={destination}>
                  <input
                    type="checkbox"
                    checked={selection.destinations.includes(destination)}
                    onChange={() => builder.toggle('destinations', destination)}
                  />
                  <span>{destination}</span>
                  {selection.destinations.includes(destination) && (
                    <small>Escala {selection.destinations.indexOf(destination) + 1}</small>
                  )}
                </label>
              ))}
            </div>
            <div className="field-note">
              Selecciona como máximo un destino por jornada. No se calculan distancias ni tiempos
              reales.
            </div>
          </fieldset>
          {builder.error && (
            <p className="form-error" role="alert">
              {builder.error}
            </p>
          )}
          <div className="form-submit">
            <button className="button full-width" type="submit">
              Crear mi borrador <ArrowRight size={18} />
            </button>
            <span className="small muted">
              {selection.destinations.length} destinos · {selection.interests.length} intereses ·{' '}
              {selection.days} días
            </span>
          </div>
        </form>
        <PlanResult plan={builder.plan} selection={selection} onSave={builder.save} saved={saved} />
      </div>
      <div
        className={`builder-notice ${builder.notice ? 'visible' : ''}`}
        aria-live="polite"
        role="status"
      >
        {builder.notice && (
          <>
            <Check size={18} />
            {builder.notice}
          </>
        )}
      </div>
      <RespectNote />
    </div>
  );
}
