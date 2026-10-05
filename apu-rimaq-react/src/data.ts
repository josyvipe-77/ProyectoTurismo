export interface Journey {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  days: number;
  cost: number;
  difficulty: 'Suave' | 'Moderada';
  interests: string[];
  stops: string[];
}

export const journeys: Journey[] = [
  {
    id: 'chanka',
    title: 'Ruta Chanka',
    subtitle: 'Memorias del lago y la roca',
    description:
      'Un cuaderno de viaje entre el agua de Pacucha, las piedras de Sóndor y los caminos de Andahuaylas.',
    image: 'laguna',
    days: 4,
    cost: 680,
    difficulty: 'Moderada',
    interests: ['Cultura', 'Naturaleza'],
    stops: ['Andahuaylas', 'Pacucha', 'Sóndor', 'Talavera'],
  },
  {
    id: 'bosque',
    title: 'Entre bosques y piedra',
    subtitle: 'El verde también tiene memoria',
    description:
      'Una propuesta para acercarte al paisaje de Ampay y a la piedra labrada de Saywite, a tu propio ritmo.',
    image: 'bosque',
    days: 3,
    cost: 520,
    difficulty: 'Moderada',
    interests: ['Naturaleza', 'Aventura', 'Cultura'],
    stops: ['Abancay', 'Ampay', 'Saywite'],
  },
  {
    id: 'sabores',
    title: 'Sabores del valle',
    subtitle: 'Una mesa, muchas historias',
    description:
      'Curahuasi como punto de partida para descubrir el anís, los hornos y las cocinas del territorio.',
    image: 'horno',
    days: 2,
    cost: 340,
    difficulty: 'Suave',
    interests: ['Gastronomía', 'Cultura'],
    stops: ['Curahuasi', 'Cocinas del valle'],
  },
];

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
export const dayNotes = [
  'Llegar sin prisa. Recorrer Andahuaylas y reservar la primera jornada para adaptarte al ritmo del territorio.',
  'Contemplar la laguna de Pacucha. Caminar con calma y acercarte a las historias del agua con acompañamiento local.',
  'Visitar el complejo arqueológico de Sóndor. Dejar espacio para el paisaje y la interpretación del patrimonio.',
  'Regresar al eje de Andahuaylas y visitar Talavera. Confirmar la visita a su plaza y templo; no se continúa hacia Chincheros como si fuera una parada cercana.',
];

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
export const money = (value: number) =>
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    maximumFractionDigits: 0,
  }).format(value);
