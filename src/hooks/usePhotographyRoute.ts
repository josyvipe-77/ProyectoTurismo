import { createContext, useContext } from 'react';
import type { TripPlanning } from '../data/photography-planning';
export const PhotographyRouteContext = createContext<{
  viewpointIds: string[];
  updateViewpoints: (ids: string[]) => void;
  planning: TripPlanning;
  updatePlanning: (patch: Partial<TripPlanning>) => void;
  storageWarning: string;
} | null>(null);
export function usePhotographyRoute() {
  const context = useContext(PhotographyRouteContext);
  if (!context) throw new Error('PhotographyRouteProvider is required');
  return context;
}
