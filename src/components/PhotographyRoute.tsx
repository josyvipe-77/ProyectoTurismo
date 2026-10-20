import { useMemo } from 'react';
import { photographyMapPlaces } from '../data/photography-map';
import { usePhotographyRoute } from '../hooks/usePhotographyRoute';
import { RouteMap } from './RouteMap';
import { ApurimacExplorer } from './ApurimacExplorer';
import { ViewpointChoices } from './ViewpointChoices';

export function PhotographyRoute({
  choices = true,
  compact = false,
}: {
  choices?: boolean;
  compact?: boolean;
}) {
  const { viewpointIds, planning } = usePhotographyRoute();
  const places = useMemo(
    () =>
      compact ? photographyMapPlaces() : photographyMapPlaces(viewpointIds, planning.ampayOption),
    [compact, viewpointIds, planning.ampayOption],
  );
  return (
    <section className="section photography-route" aria-labelledby="photography-route-heading">
      <span className="eyebrow blue">Nuestra experiencia · El recorrido</span>
      <h2 id="photography-route-heading">Cinco jornadas, sus lugares en el mapa.</h2>
      <p>
        {compact
          ? 'Taraccasa, Pampachiri, Pachachaca, Ampay y San Cristóbal: cinco miradas con salida y regreso a Abancay. Selecciona un destino para ver sus fotos.'
          : 'Taraccasa, Pampachiri, Pachachaca, Ampay y los miradores que elijas para el quinto día. Abancay es la base de salida y regreso.'}
      </p>
      {choices && !compact && <ViewpointChoices />}
      {!compact && <RouteMap places={places} />}
      <ApurimacExplorer
        places={places}
        sequence
        compact={compact}
        routeName="Apurímac a través de tu objetivo"
      />
    </section>
  );
}
