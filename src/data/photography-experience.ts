import program from './photography-program.json' with { type: 'json' };
import { photographyViewpoints } from './photography-map.ts';
import {
  groupScenarios,
  ampayOptions,
  budgetEstimate,
  defaultTripPlanning,
  monthNames,
  rainyPampachiri,
} from './photography-planning.ts';
import type { TripPlanning } from './photography-planning.ts';

export interface PhotographyStop {
  name: string;
  description: string;
  photography: string;
  duration: string;
  effort: string;
  status: string;
  source?: string;
}
export interface PhotographyDay {
  day: number;
  id: string;
  title: string;
  theme: string;
  objective: string;
  tagline: string;
  description: string;
  stops: string[];
  stopDetails: PhotographyStop[];
  photography: string;
  schedule: { time: string; activity: string }[];
  access: string;
  meals: string;
  effort: string;
  weatherPlan: string;
  pending: string;
  source: string;
  photoId?: string;
}
export const photographyExperience = {
  name: 'Apurímac a través de tu objetivo',
  consultant: 'JACS Destinos',
  slogan: 'Experiencias que se convierten en memorias.',
  days: 5,
  nights: 4,
  base: 'Abancay',
  group: '6–12 participantes',
  age: '30–70 años',
  clientBudget: '700–1.000 euros',
  languages: 'Guianza prevista en español e inglés; otros idiomas según el grupo y disponibilidad.',
  price: 'Pendiente de estimación',
  audience:
    'Personas adultas aficionadas a la fotografía de naturaleza y paisaje. Fotógrafos profesionales, clubes y viajeros culturales como públicos secundarios.',
  services: [
    [
      'Acompañamiento',
      'Recepción, presentación de las jornadas y encuesta inicial para adaptar el recorrido. Guía local acreditado y acompañamiento fotográfico; taller supervisado por profesionales previsto, con alcance y disponibilidad por confirmar.',
    ],
    [
      'Transporte',
      'Vehículo turístico privado y conductor con experiencia en montaña. Capacidad, tiempos, pausas y costos a confirmar.',
    ],
    [
      'Equipo fotográfico',
      'Servicios de mantenimiento fotográfico previstos; alcance, personal y disponibilidad por definir. Cada participante aporta su equipo.',
    ],
    [
      'Alimentación',
      'Almuerzos de las cinco jornadas, desayunos de los días 2–5 y cenas de los días 1–4 previstos, independientes del alojamiento. Coordinar picnic, agua, alergias e intolerancias. Desayuno de llegada y cena del quinto día opcionales.',
    ],
    [
      'Accesos y asistencia',
      'Entradas del recorrido base, registro en Ampay, material informativo y seguro de asistencia previstos. Cobertura y permisos específicos a confirmar.',
    ],
  ],
  exclusions:
    'Alojamiento por cuenta de cada participante, vuelos, traslado hasta Abancay, equipo fotográfico, compras personales y actividades fuera del programa base.',
} as const;
export const photographyDays: PhotographyDay[] = program;

export function plannedPhotographyDays(
  planning: TripPlanning = defaultTripPlanning,
  viewpointIds: string[] = [],
): PhotographyDay[] {
  const selected = photographyViewpoints.filter((option) => viewpointIds.includes(option.id));
  return photographyDays.map((day) => {
    if (day.day === 2 && rainyPampachiri(planning.month))
      return {
        ...day,
        schedule: [
          ...day.schedule.slice(0, 5),
          { time: '13:00–13:30', activity: 'Picnic y descanso.' },
          {
            time: '13:30–14:00',
            activity: 'Últimos encuadres en el sector habilitado; fin de visita a las 14:00.',
          },
          {
            time: '14:15–18:15',
            activity: 'Regreso estimado a Abancay, con pausas del conductor.',
          },
          { time: '19:00–20:00', activity: 'Cena prevista.' },
        ],
        stops: ['Abancay', 'Puente de Paqpachaca', 'Sector habilitado de Pampachiri'],
        description:
          'Versión abreviada de enero a marzo: visita al bosque hasta las 14:00. El sector concreto se elegirá según condiciones y acceso; la jornada puede reprogramarse ante alertas.',
        stopDetails: day.stopDetails.map((stop) =>
          stop.name === 'Ayamachay'
            ? { ...stop, status: 'Visita adicional; fuera del horario abreviado' }
            : stop,
        ),
      };
    if (day.day === 4) {
      const option = ampayOptions.find((item) => item.id === planning.ampayOption)!;
      const forestOnly = option.id === 'bosque';
      return {
        ...day,
        description: option.description,
        stops: [...option.stops],
        photography: option.photography,
        effort: option.effort,
        stopDetails: forestOnly
          ? day.stopDetails.filter((stop) => stop.name !== 'Laguna Angasq’ocha')
          : day.stopDetails,
        schedule: forestOnly
          ? [
              { ...day.schedule[0], activity: 'Desayuno y preparación del equipo y agua.' },
              ...day.schedule.slice(1, 3),
              {
                time: '09:15–10:45',
                activity: 'Paseo fotográfico por el tramo autorizado del bosque, con pausas.',
              },
              { time: '10:45–11:15', activity: 'Descanso e interpretación del entorno.' },
              { time: '11:15–12:45', activity: 'Regreso al control por el recorrido acordado.' },
              { time: '12:45–13:15', activity: 'Regreso a Abancay.' },
              { time: '13:15–14:15', activity: 'Almuerzo y descanso.' },
              { time: '19:00–20:00', activity: 'Cena local propuesta.' },
            ]
          : day.schedule,
        meals: forestOnly ? 'Desayuno, agua, almuerzo en Abancay y cena.' : day.meals,
      };
    }
    if (day.day === 5)
      return {
        ...day,
        stops: [
          'Abancay',
          ...(selected.length
            ? selected.map((option) => `${option.name} (${option.district})`)
            : ['Mirador por elegir']),
          'Entorno autorizado del mirador',
        ],
        // A single-mirador timetable must not be exported as a confirmed combination.
        schedule: selected.length === 1 ? day.schedule : [],
        description:
          selected.length > 1
            ? 'Comparación de varios miradores elegidos. La conexión, duración y posibles noches adicionales deben diseñarse antes de fijar horas.'
            : selected.length
              ? day.description
              : 'Elige un mirador para completar la jornada y consultar su horario estimado.',
        source:
          selected.length === 1
            ? `https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=${selected[0].id}`
            : day.source,
      };
    return day;
  });
}

export function photographyProgramText(
  viewpointIds: string[] = [],
  planning: TripPlanning = defaultTripPlanning,
): string {
  const viewpoints = photographyViewpoints.filter((option) => viewpointIds.includes(option.id));
  return [
    `${photographyExperience.consultant.toUpperCase()} · ${photographyExperience.name}`,
    photographyExperience.slogan,
    '',
    'Programa estimado · 5 días y 4 noches de estancia · Inicio y final: Abancay · Alojamiento no incluido',
    `Mes: ${monthNames[planning.month]}`,
    `Grupo propuesto: ${photographyExperience.group}`,
    `Perfil de referencia: ${photographyExperience.age}; hipótesis de diseño.`,
    `Presupuesto orientativo del cliente: ${photographyExperience.clientBudget}; no es la tarifa del programa.`,
    photographyExperience.languages,
    `Precio: ${photographyExperience.price}`,
    'Horarios de diseño ajustados a referencias publicadas; confirmar fechas, accesos, caminos y condiciones con gestores y guía.',
    '',
    ...plannedPhotographyDays(planning, viewpointIds).flatMap((day) => [
      `DÍA ${day.day}: ${day.title}`,
      day.tagline,
      `Objetivo de la jornada: ${day.objective}`,
      day.description,
      `Paradas propuestas: ${day.stops.join(' → ')}`,
      `Enfoque fotográfico: ${day.photography}`,
      ...day.stopDetails.flatMap((stop) => [
        `${stop.name} · ${stop.status}`,
        `${stop.description} Fotografía: ${stop.photography}`,
        `Tiempo: ${stop.duration} · Esfuerzo: ${stop.effort}`,
        ...(stop.source ? [`Referencia: ${stop.source}`] : []),
      ]),
      ...(day.day === 5 && viewpoints.length > 1
        ? [
            'Varios miradores seleccionados: recalcular traslados y duración. No hay horario cerrado para esta combinación.',
          ]
        : []),
      ...day.schedule.map((item) => `${item.time} · ${item.activity}`),
      `Información publicada: ${day.access}`,
      `Comidas: ${day.meals}`,
      `Esfuerzo: ${day.effort}`,
      `Alternativa por condiciones: ${day.weatherPlan}`,
      `Confirmación operativa: ${day.pending}`,
      `Fuente del destino: ${day.source}`,
      ...(day.day === 5
        ? viewpoints.map(
            (option) =>
              `Mirador ${option.name}: https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=${option.id}`,
          )
        : []),
      '',
    ]),
    'EXTENSIÓN DE AMPAY: Usphaq’ocha requiere mayor duración y esfuerzo. SERNANP recomienda dos días para la ruta completa de bosques y lagunas. No está incluida en las cinco jornadas.',
    'Las vistas del nevado dependen de las condiciones; una ascensión requiere otro itinerario de montaña.',
    '',
    'ALOJAMIENTO EXCLUIDO: cada participante organiza y paga su hospedaje. Las cuatro noches indican la duración de la estancia y no una prestación contratada.',
    'PRESUPUESTO DE DISEÑO: comidas, entradas, seguro y otros costos individuales, más vehículo y guía repartidos entre participantes. No incluye alojamiento. Los costos pendientes no se convierten en cero para publicar un precio.',
    `Categoría de ingreso: ${planning.admission === 'general' ? 'general' : planning.admission === 'local' ? 'local' : 'nacional'}.`,
    `Costos introducidos: transporte por grupo ${planning.transport ?? 'pendiente'}; guía por grupo ${planning.guide ?? 'pendiente'}; alimentación por persona ${planning.meals ?? 'pendiente'}; seguro por persona ${planning.insurance ?? 'pendiente'}; otros por persona ${planning.other}. Todos los importes son S/.`,
    `Reserva para imprevistos: ${planning.contingency}%; margen sobre venta: ${planning.margin}%. Son supuestos editables.`,
    ...groupScenarios.map((count) => {
      const estimate = budgetEstimate(planning, count);
      return `${count} personas: subtotal de costos conocidos S/${estimate.cost.toFixed(2)} por persona; ${estimate.estimate === null ? 'precio por estimar: faltan cotizaciones' : `simulación de precio S/${estimate.estimate.toFixed(2)} por persona, sin oferta ni disponibilidad confirmadas`}.`;
    }),
    '',
    'Servicios previstos en el diseño; proveedores y disponibilidad sin confirmar.',
    ...photographyExperience.services.map(([title, detail]) => `${title}: ${detail}`),
    `Exclusiones: ${photographyExperience.exclusions}`,
    '',
    'Propuesta académica COIL USC–UNAMBA. Sin reservas ni pagos.',
    'Respeta los senderos, conserva distancia de la fauna y pide autorización para fotografiar personas.',
  ].join('\n');
}
