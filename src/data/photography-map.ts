import { mapPlace, resourceById } from './regional-tourism.ts';
import type { TouristPlace } from './apurimac-places.ts';
import { ampayOptions } from './photography-planning.ts';
import type { AmpayOptionId } from './photography-planning.ts';

export const photographyViewpoints = [
  {
    id: '3055',
    name: 'San Cristóbal',
    district: 'Curahuasi',
    description: 'Un mirador del entorno de Curahuasi para contemplar el paisaje del cañón.',
  },
  {
    id: '2039',
    name: 'Capitán Rumi',
    district: 'Curahuasi',
    description: 'Una alternativa del mismo distrito, con acceso y tiempos por confirmar.',
  },
  {
    id: '8066',
    name: 'Capuliyoc',
    district: 'Cachora',
    description: 'Un mirador con acceso desde Cachora, por un corredor diferente al de Curahuasi.',
  },
] as const;
export const defaultViewpointIds = ['3055'];
export function validViewpointIds(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= photographyViewpoints.length &&
    new Set(value).size === value.length &&
    value.every((id) => photographyViewpoints.some((option) => option.id === id))
  );
}
export function photographyMapPlaces(
  selectedViewpoints: string[] = defaultViewpointIds,
  ampayOption: AmpayOptionId = 'angasqocha',
): TouristPlace[] {
  const main = ['4678', '8264', '31', '577'].flatMap((id, index) => {
    const resource = resourceById.get(id);
    const place = resource ? mapPlace(resource) : null;
    return place
      ? [
          {
            ...place,
            mapLabel: String(index + 1),
            ...(id === '577'
              ? {
                  description: ampayOptions.find((option) => option.id === ampayOption)!
                    .description,
                }
              : {}),
          },
        ]
      : [];
  });
  const selected = photographyViewpoints.filter((option) => selectedViewpoints.includes(option.id));
  const fifthDay = selected.flatMap((option, index) => {
    const resource = resourceById.get(option.id);
    const place = resource ? mapPlace(resource) : null;
    return place
      ? [
          {
            ...place,
            mapLabel: selected.length === 1 ? '5' : `5${String.fromCharCode(65 + index)}`,
          },
        ]
      : [];
  });
  return [...main, ...fifthDay];
}
