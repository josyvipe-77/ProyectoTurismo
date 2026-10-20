import materials from './project-materials.json' with { type: 'json' };

export const projectMaterials = materials;

export function projectEmailHref(subject = 'Consulta a JACS Destinos') {
  return `mailto:${projectMaterials.email}?subject=${encodeURIComponent(subject)}`;
}
