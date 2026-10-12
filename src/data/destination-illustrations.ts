export interface DestinationArtwork {
  id: string;
  name: string;
  alt: string;
}

export const destinationArtworks: DestinationArtwork[] = [
  {
    id: 'pacucha',
    name: 'Pacucha',
    alt: 'Diorama interpretativo de una laguna azul entre laderas andinas.',
  },
  {
    id: 'sondor',
    name: 'Sóndor',
    alt: 'Diorama interpretativo de un cerro con terrazas de piedra y una escalinata.',
  },
  {
    id: 'saywite',
    name: 'Saywite',
    alt: 'Diorama interpretativo del monolito tallado de Saywite sobre terreno herbáceo.',
  },
  {
    id: 'pampachiri',
    name: 'Pampachiri',
    alt: 'Diorama interpretativo de formaciones rocosas cónicas entre pastos andinos.',
  },
  {
    id: 'ampay',
    name: 'Ampay',
    alt: 'Diorama interpretativo de montaña, bosque y laguna del santuario de Ampay.',
  },
  {
    id: 'cconoc',
    name: 'Cconoc',
    alt: 'Diorama interpretativo de pozas termales junto a un río en un valle.',
  },
];

// Exact inventory IDs only: never assign a nearby site's artwork to another resource.
const inventoryArtwork: Record<string, string> = {
  '1316': 'pacucha',
  '578': 'sondor',
  '571': 'saywite',
  '8264': 'pampachiri',
  '577': 'ampay',
  '575': 'cconoc',
};

export function destinationArtwork(id: string): DestinationArtwork | undefined {
  const canonical = inventoryArtwork[id] ?? id;
  return destinationArtworks.find((artwork) => artwork.id === canonical);
}

export function artworkUrl(id: string, size: 320 | 640): string {
  return `/images/destinations/${id}-v1-${size}.webp`;
}
