import { mkdir, writeFile } from 'node:fs/promises';
import {
  photographyExperience,
  plannedPhotographyDays,
} from '../src/data/photography-experience.ts';
import { defaultTripPlanning } from '../src/data/photography-planning.ts';
import { photographyMapPlaces } from '../src/data/photography-map.ts';
import { projectMaterials } from '../src/data/project-materials.ts';

const days = plannedPhotographyDays(defaultTripPlanning, []);
days[4] = {
  ...days[4],
  description:
    'La jornada se adapta al mirador elegido en Curahuasi o Cachora. Antes de fijar el horario se verifican los accesos, los traslados y la duración. Elegir varios miradores puede ampliar la estancia.',
};
await mkdir('tmp/materiales', { recursive: true });
await writeFile(
  'tmp/materiales/program-data.json',
  JSON.stringify(
    {
      experience: photographyExperience,
      days,
      places: photographyMapPlaces(['3055', '2039', '8066']),
      materials: projectMaterials,
    },
    null,
    2,
  ),
);
console.log('Datos del programa base exportados a tmp/materiales/program-data.json');
