import { useMemo } from 'react';
import { photographyMapPlaces } from '../data/photography-map';
import { usePhotographyRoute } from '../hooks/usePhotographyRoute';
import { RouteMap } from './RouteMap';
import { ApurimacExplorer } from './ApurimacExplorer';
import { ViewpointChoices } from './ViewpointChoices';

export function PhotographyRoute({ choices = true }: { choices?: boolean }) {
  const { viewpointIds, planning } = usePhotographyRoute();
  const places = useMemo(
    () => photographyMapPlaces(viewpointIds, planning.ampayOption),
    [viewpointIds, planning.ampayOption],
  );
  return (
    <section className="section photography-route" aria-labelledby="photography-route-heading">
      <span className="eyebrow blue">Cuaderno cartográfico · Nuestra experiencia</span>
      <h2 id="photography-route-heading">Cinco jornadas, sus lugares en el mapa.</h2>
      <p>
        Taraccasa, Pampachiri, Pachachaca, Ampay y los miradores que elijas para el quinto día.
        Abancay es la base de salida y regreso.
      </p>
      {choices && <ViewpointChoices />}
      <RouteMap places={places} />
      <ApurimacExplorer places={places} sequence routeName="Apurímac a través de tu objetivo" />
    </section>
  );
}
