import inventory from './apurimac-catalog.json' with { type: 'json' };
import itineraries from './apurimac-routes.json' with { type: 'json' };
import type { TouristPlace } from './apurimac-places';
import { destinationDescriptions } from './destination-descriptions.ts';

export interface TourismResource {
  id: string;
  name: string;
  province: string;
  district: string;
  kind: string;
  category: string;
  origin: string;
  source: string;
  coordinates: [number, number] | null;
  coordinateStatus: string;
  coordinateNote: string;
  coordinateSource: string | null;
  access: string;
  parent: string | null;
  aliases: string[];
}
export interface RegionalRoute {
  id: string;
  name: string;
  province: string;
  base: string;
  duration: string;
  kind: string;
  stops: string[];
  note: string;
  legs: { from: string; to: string; detail: string; source: string }[];
  branches: { name: string; stops: string[]; note: string; source: string }[];
}

export const resources = inventory as TourismResource[];
export const regionalRoutes: RegionalRoute[] = itineraries;
export const provinces = [...new Set(resources.map((resource) => resource.province))];
export const resourceById = new Map(resources.map((resource) => [resource.id, resource]));
export const catalogCounts = {
  total: resources.length,
  places: resources.filter((resource) => resource.kind === 'Lugar').length,
  mapped: resources.filter((resource) => resource.coordinates).length,
};

const mapNames: Record<string, string> = {
  '9023': 'Karkatera',
  '8806': 'Andahuaylas',
  '650': 'San Pedro',
  '8833': 'Paccha Arguedas',
  '8823': 'Talavera',
  '8827': 'Santiago Apóstol',
  '603': 'Hualalachi',
  '8640': 'Abancay',
  '8010': 'Catedral',
  '8642': 'Ocampo',
  '8641': 'Micaela Bastidas',
  '8006': 'Usno Moqo',
  '4678': 'Taraccasa',
  '11102': 'Illanya',
  '31': 'Pachachaca',
  '13092': 'Paqpachaca',
  '4673': 'Yaca',
  '4685': 'Capilla de Yaca',
  '577': 'Ampay',
  '571': 'Saywite',
  '32': 'Curahuasi',
  '575': 'Cconoc',
  '573': 'San Pedro de Haquira',
  '651': 'Qaqa Cárcel',
  '1797': 'Vicuñas de Lliullita',
  '8321': 'Laguna Lliullita',
  '34': 'Cocharcas',
  '423': 'Huaquirca',
  '455': 'San Salvador',
  '33': 'Chuquinga',
  '36': 'Pincahuacho',
  '8264': 'Pampachiri',
};

export function mapPlace(resource: TourismResource): TouristPlace | null {
  if (!resource.coordinates || resource.kind !== 'Lugar') return null;
  return {
    id: resource.id,
    name: resource.name,
    shortName:
      mapNames[resource.id] ??
      resource.name.replace(
        /^(Sitio Arqueológico de |Templo Colonial de |Casa Hacienda de |Plaza de Armas de |Mirador de |Laguna de |Baños Termales de )/i,
        '',
      ),
    location: `${resource.district} · ${resource.province}`,
    category: resource.category,
    title: resource.name,
    description:
      destinationDescriptions[resource.id] ??
      'Una parada del inventario turístico de Apurímac. Consulta su ficha para conocer el acceso publicado y preparar la visita.',
    coordinateNote: resource.coordinateNote,
    respect:
      'Confirma accesos, condiciones y horarios con orientación local. Respeta los senderos y los espacios de las comunidades.',
    coordinates: resource.coordinates,
    zoom: 12.4,
    detailZoom: resource.id === '577' || resource.id === '1316' ? 13 : 14,
    bearing: 20,
    source: resource.source,
    coordinateSource: resource.coordinateSource ?? resource.source,
  };
}
export function routeMapPlaces(route: RegionalRoute): TouristPlace[] {
  return route.stops.flatMap((id) => {
    const resource = resourceById.get(id);
    const place = resource ? mapPlace(resource) : null;
    return place ? [place] : [];
  });
}
export function nextRouteStop(
  current: number | null,
  direction: -1 | 1,
  count: number,
): number | null {
  if (!count) return null;
  if (current === null) return direction === 1 ? 0 : count - 1;
  return Math.min(count - 1, Math.max(0, current + direction));
}
export function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es');
}
// Geographic neighbors help discover candidates; they do not describe a road or a trail.
export function geographicDistance(a: [number, number], b: [number, number]): number {
  const radians = (value: number) => (value * Math.PI) / 180;
  const [longitudeA, latitudeA] = a.map(radians);
  const [longitudeB, latitudeB] = b.map(radians);
  const value =
    Math.sin((latitudeB - latitudeA) / 2) ** 2 +
    Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin((longitudeB - longitudeA) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(Math.min(1, value)));
}
export function geographicNeighbors(resource: TourismResource) {
  if (!resource.coordinates) return [];
  const origin = resource.coordinates;
  return resources
    .flatMap((other) =>
      other.id !== resource.id && other.coordinates
        ? [{ resource: other, distance: geographicDistance(origin, other.coordinates) }]
        : [],
    )
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);
}
