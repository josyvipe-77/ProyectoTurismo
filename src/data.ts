// IDs retained only to validate favorites saved by previous versions.
export const legacyJourneyIds = ['chanka', 'bosque', 'sabores'] as const;

export const destinations = [
  'Andahuaylas',
  'Pacucha',
  'Sóndor',
  'Chincheros',
  'Talavera',
  'Abancay',
  'Ampay',
  'Saywite',
  'Curahuasi',
];
export const interests = ['Cultura', 'Naturaleza', 'Gastronomía', 'Aventura'];
export interface Festival {
  id: string;
  title: string;
  month: string;
  day: string;
  location: string;
  category: string;
  note: string;
}
export const festivals: Festival[] = [
  {
    id: 'carnaval',
    title: 'Tiempo de carnavales',
    month: '02',
    day: 'FEB–MAR',
    location: 'Distintas localidades',
    category: 'Celebraciones',
    note: 'La programación y las fechas cambian cada año. Consulta la agenda local antes de viajar.',
  },
  {
    id: 'semana',
    title: 'Semana Santa',
    month: '04',
    day: 'FECHA VARIABLE',
    location: 'Apurímac',
    category: 'Celebraciones',
    note: 'Una oportunidad para acercarte con respeto a las celebraciones de cada localidad.',
  },
  {
    id: 'cocharcas',
    title: 'Virgen de Cocharcas',
    month: '09',
    day: '08 SEP',
    location: 'Cocharcas · Chincheros',
    category: 'Celebraciones',
    note: 'La fecha central es el 8 de septiembre. El programa completo debe confirmarse localmente.',
  },
];
