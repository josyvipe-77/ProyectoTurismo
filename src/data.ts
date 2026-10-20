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
  months: string[];
  day: string;
  location: string;
  photoResourceId: string;
  note: string;
}
export const festivals: Festival[] = [
  {
    id: 'carnaval',
    title: 'Carnaval Abanquino',
    months: ['02', '03'],
    day: 'FEB–MAR',
    location: 'Abancay',
    photoResourceId: '8004',
    note: 'Comparsas, música y danzas reúnen a la comunidad en las calles de Abancay. Su fecha es variable; confirma el programa anual y pide permiso antes de retratar a los participantes.',
  },
  {
    id: 'cocharcas',
    title: 'Virgen de Cocharcas',
    months: ['09'],
    day: '08 SEP',
    location: 'Cocharcas · Chincheros',
    photoResourceId: '7512',
    note: 'La devoción a la Mamacha Cocharcas reúne a peregrinos en torno al santuario. La fecha central es el 8 de septiembre; consulta la programación local y respeta los momentos de culto.',
  },
  {
    id: 'ninuchanchik',
    title: 'Festividad del Niñuchanchik',
    months: ['12', '01'],
    day: 'DIC–ENE',
    location: 'Talavera · Andahuaylas · San Jerónimo',
    photoResourceId: '6935',
    note: 'El ciclo navideño enlaza celebraciones del Niño Jesús entre diciembre y enero, con música, danzas y participación colectiva. Las fechas y los recorridos dependen de cada localidad.',
  },
];

// Only months represented by documented celebrations are offered by the calendar.
export const festivalMonths = [...new Set(festivals.flatMap((festival) => festival.months))].sort();
