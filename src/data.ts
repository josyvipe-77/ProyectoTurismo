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
    id: 'pukllay',
    title: 'Pukllay · Carnaval originario',
    months: ['02', '03'],
    day: 'FEB–MAR',
    location: 'Andahuaylas · Valle del Chumbao',
    photoResourceId: '8634',
    note: 'Delegaciones de las comunidades comparten danzas, música y pasacalles en el encuentro del carnaval originario. La fecha cambia con el calendario del carnaval; consulta el programa de cada edición.',
  },
  {
    id: 'sacclaya',
    title: 'Carnaval de Sacclaya',
    months: ['02', '03'],
    day: 'FEB–MAR',
    location: 'Sacclaya · José María Arguedas · Andahuaylas',
    photoResourceId: '8320',
    note: 'Las visitas entre comuneros, la música y el encuentro familiar forman parte de este carnaval, celebrado antes del Miércoles de Ceniza. Acércate con respeto y coordina antes de fotografiar sus actividades.',
  },
  {
    id: 'sondor-raymi',
    title: 'Sóndor Raymi · La epopeya Chanka',
    months: ['06'],
    day: 'JUN',
    location: 'Pacucha y Sóndor · Andahuaylas',
    photoResourceId: '8869',
    note: 'Una escenificación colectiva evoca los relatos de origen del pueblo Chanka en el entorno de Pacucha y Sóndor. Se celebra en junio; confirma la programación anual y las condiciones de acceso al sitio arqueológico.',
  },
  {
    id: 'senor-animas',
    title: 'Fiesta Mayor del Señor de Ánimas',
    months: ['07', '08'],
    day: 'JUL–AGO',
    location: 'Chalhuanca · Aymaraes',
    photoResourceId: '5057',
    note: 'La celebración patronal reúne devoción, procesiones y encuentros de la comunidad a finales de julio y comienzos de agosto. La ficha del inventario señala el 31 de julio como fecha central; confirma los actos de cada año.',
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
    id: 'huaylia',
    title: 'Huaylía de Antabamba',
    months: ['12'],
    day: '23–28 DIC',
    location: 'Antabamba',
    photoResourceId: '8877',
    note: 'Cantos, violines y pasos de danza acompañan la celebración navideña de la provincia. El 25 de diciembre es el día central; cada localidad conserva su estilo y sus formas de participación.',
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
