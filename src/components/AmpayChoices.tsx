import { ampayOptions, planningSources } from '../data/photography-planning';
import { usePhotographyRoute } from '../hooks/usePhotographyRoute';

export function AmpayChoices() {
  const { planning, updatePlanning } = usePhotographyRoute();
  return (
    <div className="ampay-choices">
      <fieldset className="viewpoint-choices">
        <legend>Elige el recorrido de Ampay</legend>
        <div className="viewpoint-options">
          {ampayOptions.map((option) => (
            <label
              className={`viewpoint-option ${planning.ampayOption === option.id ? 'is-selected' : ''}`}
              key={option.id}
            >
              <input
                type="radio"
                name="ampay-route"
                value={option.id}
                checked={planning.ampayOption === option.id}
                onChange={() => updatePlanning({ ampayOption: option.id })}
              />
              <span>
                <small>{option.label}</small>
                <strong>{option.title}</strong>
                <span>{option.description}</span>
                <span>{option.effort}</span>
              </span>
            </label>
          ))}
        </div>
        <p>
          La elección actualiza las paradas, el horario estimado y el programa descargable. El pin
          del mapa corresponde al control de visitantes.
        </p>
      </fieldset>
      <details className="program-extension">
        <summary>Usphaq’ocha y el nevado · Opciones para ampliar el viaje</summary>
        <div>
          <h4>Laguna Usphaq’ocha</h4>
          <p>
            Una extensión de mayor duración y esfuerzo. SERNANP recomienda dos días para la ruta
            completa de bosques y lagunas; hace falta diseñar pernocta, transporte y guianza
            específicos.
          </p>
          <h4>Fotografía del nevado</h4>
          <p>
            Las vistas pueden formar parte de un recorrido autorizado si hay visibilidad. Llegar al
            nevado o ascender requiere un itinerario de montaña distinto.
          </p>
          <a href={planningSources.ampay} target="_blank" rel="noreferrer">
            Consultar rutas de SERNANP ↗
          </a>
          <p className="small muted">
            Estas extensiones no están incluidas en las cinco jornadas ni en las referencias del
            presupuesto.
          </p>
        </div>
      </details>
    </div>
  );
}
