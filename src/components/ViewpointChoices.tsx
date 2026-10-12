import { photographyViewpoints } from '../data/photography-map';
import { usePhotographyRoute } from '../hooks/usePhotographyRoute';

export function ViewpointChoices() {
  const { viewpointIds, updateViewpoints, storageWarning } = usePhotographyRoute();
  return (
    <fieldset className="viewpoint-choices" id="elige-miradores">
      <legend>Elige los miradores del quinto día</legend>
      <p>
        San Cristóbal aparece como opción inicial y puedes cambiarla. Elige uno o varios miradores
        para explorar sus ubicaciones.
      </p>
      <div className="viewpoint-options">
        {photographyViewpoints.map((option) => (
          <label
            className={`viewpoint-option ${viewpointIds.includes(option.id) ? 'is-selected' : ''}`}
            key={option.id}
          >
            <input
              type="checkbox"
              checked={viewpointIds.includes(option.id)}
              onChange={() =>
                updateViewpoints(
                  viewpointIds.includes(option.id)
                    ? viewpointIds.filter((id) => id !== option.id)
                    : [...viewpointIds, option.id],
                )
              }
            />
            <span>
              <strong>{option.name}</strong>
              <small>{option.district}</small>
              <span>{option.description}</span>
            </span>
          </label>
        ))}
      </div>
      <div className="viewpoint-actions">
        <button
          className="text-link"
          type="button"
          onClick={() => updateViewpoints(photographyViewpoints.map((option) => option.id))}
        >
          Seleccionar los tres
        </button>
        <span>
          {viewpointIds.length}{' '}
          {viewpointIds.length === 1 ? 'mirador elegido' : 'miradores elegidos'}
        </span>
      </div>
      {viewpointIds.length > 1 && (
        <p className="viewpoint-timing" role="status">
          La combinación necesita ajustar traslados y duración. Los horarios preliminares del quinto
          día no cubren automáticamente todos los miradores.
        </p>
      )}
      {viewpointIds.length === 0 && (
        <p className="viewpoint-timing" role="status">
          Elige un mirador para completar el quinto destino en el mapa.
        </p>
      )}
      {storageWarning && <p role="status">{storageWarning}</p>}
    </fieldset>
  );
}
