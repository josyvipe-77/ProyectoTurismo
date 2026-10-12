export const planningSources = {
  taraccasa: 'https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=4678',
  pampachiri: 'https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=8264',
  paqpachaca: 'https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=13092',
  chichaqasa: 'https://www.gob.pe/institucion/cultura/normas-legales/2921430-000024-2022-dgpa-mc',
  pachachaca: 'https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=31',
  ampay: 'https://visitaareasnaturales.sernanp.gob.pe/anps/santuario-nacional-de-ampay/',
  ampayInventory:
    'https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=577',
  promperu:
    'https://repositorio.promperu.gob.pe/bitstreams/1dad4376-4311-4459-9cd4-42f34245a97b/download',
};
export const groupScenarios = [6, 8, 10, 12] as const;
export type AmpayOptionId = 'angasqocha' | 'bosque';
export const ampayOptions = [
  {
    id: 'angasqocha',
    title: 'Bosque y laguna Angasq’ocha',
    label: 'Recorrido base',
    description:
      'Sendero por el bosque y pausa fotográfica en la laguna chica. Referencia de PROMPERÚ: 2 km y aproximadamente 1 h 30 min de ida desde el centro de visitantes.',
    effort:
      'Caminata de montaña con ascenso. Reservamos más tiempo para pausas y fotografía; desnivel y estado del sendero por confirmar.',
    stops: ['Abancay', 'Control de visitantes', 'Bosque de intimpa', 'Laguna Angasq’ocha'],
    photography:
      'Detalles de intimpas, reflejos de la laguna y paisaje del bosque. La ficha registra el ave colaespina de Apurímac; observarla depende de las condiciones.',
  },
  {
    id: 'bosque',
    title: 'Bosque y vistas de montaña',
    label: 'Alternativa sin llegar a la laguna',
    description:
      'Recorrido por un tramo autorizado del bosque, con vuelta acordada con el guía. Las vistas del nevado dependen de la ubicación y la visibilidad.',
    effort:
      'Opción de menor recorrido propuesto. Longitud y desnivel todavía deben medirse; no se presenta como accesible para cualquier movilidad.',
    stops: [
      'Abancay',
      'Control de visitantes',
      'Tramo autorizado del bosque',
      'Regreso al control',
    ],
    photography:
      'Vegetación, texturas y planos de montaña desde puntos autorizados. Fotografiar el nevado desde el recorrido no implica una ascensión.',
  },
] as const;

export type TripPlanning = {
  month: number;
  ampayOption: AmpayOptionId;
  admission: 'national' | 'general' | 'local';
  transport: number | null;
  guide: number | null;
  meals: number | null;
  insurance: number | null;
  other: number;
  contingency: number;
  margin: number;
};
export const defaultTripPlanning: TripPlanning = {
  month: 0,
  ampayOption: 'angasqocha',
  admission: 'national',
  transport: null,
  guide: null,
  meals: null,
  insurance: null,
  other: 0,
  contingency: 10,
  margin: 15,
};
export const monthNames = [
  'Por definir',
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];
export const rainyPampachiri = (month: number) => month >= 1 && month <= 3;
export function validTripPlanning(value: unknown): value is TripPlanning {
  if (!value || typeof value !== 'object') return false;
  const v = value as TripPlanning;
  const cost = (n: unknown) => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 100000;
  return (
    Number.isInteger(v.month) &&
    v.month >= 0 &&
    v.month <= 12 &&
    ampayOptions.some((option) => option.id === v.ampayOption) &&
    ['national', 'general', 'local'].includes(v.admission) &&
    [v.transport, v.guide, v.meals, v.insurance].every((n) => n === null || cost(n)) &&
    cost(v.other) &&
    cost(v.contingency) &&
    v.contingency <= 30 &&
    cost(v.margin) &&
    v.margin <= 40
  );
}
export function budgetEstimate(planning: TripPlanning, participants: number) {
  if (
    !validTripPlanning(planning) ||
    !Number.isInteger(participants) ||
    participants < 6 ||
    participants > 12
  )
    throw new Error('Invalid planning scenario');
  const admission =
    (planning.admission === 'general' ? 30 : planning.admission === 'local' ? 5 : 11) + 4;
  const complete = [planning.transport, planning.guide, planning.meals, planning.insurance].every(
    (n) => n !== null,
  );
  const cost =
    admission +
    ((planning.transport ?? 0) + (planning.guide ?? 0)) / participants +
    (planning.meals ?? 0) +
    (planning.insurance ?? 0) +
    planning.other;
  const withContingency = cost * (1 + planning.contingency / 100);
  return {
    admission,
    cost,
    complete,
    estimate: complete ? withContingency / (1 - planning.margin / 100) : null,
  };
}
