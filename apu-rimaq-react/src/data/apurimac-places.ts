export type TouristPlace = {
  id: string;
  name: string;
  shortName: string;
  location: string;
  category: string;
  title: string;
  description: string;
  coordinateNote?: string;
  respect: string;
  coordinates: [number, number];
  zoom: number;
  detailZoom: number;
  bearing: number;
  source: string;
  coordinateSource: string;
};

export const regionBounds: [[number, number], [number, number]] = [
  [-73.84323807499993, -14.85926490099996],
  [-72.04648772899998, -13.177591940999946],
];

const inventory = (id: number) =>
  `https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=${id}`;

export const touristPlaces: TouristPlace[] = [
  {
    id: 'ampay',
    name: 'Santuario Nacional de Ampay',
    shortName: 'Ampay',
    location: 'Tamburco · Abancay',
    category: 'Bosque y montaña',
    title: 'Un bosque que invita a escuchar.',
    description:
      'La intimpa forma parte del paisaje protegido de Ampay. Entre bosque, lagunas y montaña, el encuentro empieza caminando con atención.',
    respect:
      'Consulta los accesos autorizados y las condiciones con el personal del santuario. Mantente en los senderos habilitados.',
    coordinates: [-72.8861891, -13.5839034],
    zoom: 12.15,
    detailZoom: 13,
    bearing: -25,
    source: inventory(577),
    coordinateSource: 'https://www.openstreetmap.org/relation/9477540',
  },
  {
    id: 'pacucha',
    name: 'Laguna de Pacucha',
    shortName: 'Pacucha',
    location: 'Pacucha · Andahuaylas',
    category: 'Agua y paisaje',
    title: 'Una pausa junto al agua.',
    description:
      'La laguna abre el paisaje de Pacucha. Observa sus orillas y deja espacio para conocer la vida cotidiana del entorno.',
    respect:
      'Lleva contigo tus residuos y respeta los espacios de las comunidades junto a la laguna.',
    coordinates: [-73.3207102, -13.6122283],
    zoom: 12.45,
    detailZoom: 13.05,
    bearing: -20,
    source: inventory(1316),
    coordinateSource: 'https://www.openstreetmap.org/way/24710804',
  },
  {
    id: 'sondor',
    name: 'Complejo arqueológico de Sóndor',
    shortName: 'Sóndor',
    location: 'Pacucha · Andahuaylas',
    category: 'Memoria en piedra',
    title: 'La memoria también tiene relieve.',
    description:
      'Sobre el paisaje de Pacucha, Sóndor reúne arquitectura y memoria arqueológica. Acércate con tiempo para observar y aprender.',
    respect:
      'Recorre las áreas permitidas. No subas sobre estructuras ni retires piezas del sitio.',
    coordinates: [-73.2702786, -13.6060723],
    zoom: 12.65,
    detailZoom: 14.5,
    bearing: 30,
    source: inventory(578),
    coordinateSource: 'https://www.openstreetmap.org/way/236481490',
  },
  {
    id: 'saywite',
    name: 'Sitio arqueológico de Saywite',
    shortName: 'Saywite',
    location: 'Curahuasi · Abancay',
    category: 'Piedra y territorio',
    title: 'Un territorio tallado en piedra.',
    description:
      'El conjunto arqueológico de Saywite invita a detenerse ante el trabajo de la piedra y a conocer su contexto con una interpretación local.',
    respect:
      'Evita tocar o trepar sobre las piezas arqueológicas. Pregunta antes de fotografiar espacios restringidos.',
    coordinates: [-72.802997, -13.547285],
    zoom: 12.65,
    detailZoom: 14.25,
    bearing: 35,
    source: inventory(571),
    coordinateSource:
      'https://commons.wikimedia.org/wiki/File:Zona_arqueol%C3%B3gica_Saywite_wlm_13.jpg',
  },
  {
    id: 'pampachiri',
    name: 'Bosque de piedras de Pampachiri',
    shortName: 'Pampachiri',
    location: 'Pampachiri · Andahuaylas',
    category: 'Paisaje de piedra',
    title: 'Formas que despiertan la mirada.',
    description:
      'La Pampa de Pabellones, conocida como bosque de piedras, ofrece un paisaje de formaciones rocosas en el distrito de Pampachiri.',
    respect:
      'Acuerda la visita con orientación local y cuida las formaciones. No dejes marcas en la roca.',
    coordinates: [-73.4572586, -14.2810037],
    zoom: 12.35,
    detailZoom: 13.8,
    bearing: 35,
    source: inventory(8264),
    coordinateSource: 'https://www.openstreetmap.org/way/682568539',
  },
  {
    id: 'cconoc',
    name: 'Baños termales de Cconoc',
    shortName: 'Cconoc',
    location: 'Curahuasi · Abancay',
    category: 'Una pausa en el valle',
    title: 'El viaje también necesita una pausa.',
    description:
      'Las aguas termales de Cconoc forman parte del paisaje del valle del río Apurímac. Consulta el acceso y las condiciones de visita antes de viajar.',
    respect: 'Sigue las indicaciones del lugar y evita dejar residuos en las aguas o junto al río.',
    coordinates: [-72.6388414924, -13.5429868821],
    zoom: 12.55,
    detailZoom: 14.1,
    bearing: 60,
    source: inventory(575),
    coordinateSource: 'https://sigmincetur.mincetur.gob.pe/turismo/index.html',
  },
];

// The overview precedes the first chapter. Chapter navigation wraps at both ends.
export function adjacentPlace(current: number | null, direction: -1 | 1): number {
  if (current === null) return direction === 1 ? 0 : touristPlaces.length - 1;
  return (current + direction + touristPlaces.length) % touristPlaces.length;
}

export function projectedPoint([longitude, latitude]: [number, number]): [number, number] {
  const [[west, south], [east, north]] = regionBounds;
  return [
    40 + ((longitude - west) / (east - west)) * 640,
    40 + ((north - latitude) / (north - south)) * 600,
  ];
}
