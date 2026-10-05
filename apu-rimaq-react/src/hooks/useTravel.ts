import { createContext, useContext } from 'react';
import type { RoutePlan } from '../lib/plan';
interface TravelState {
  favorites: string[];
  savedPlan: RoutePlan | null;
  storageWarning: string;
  toggleFavorite: (id: string) => void;
  savePlan: (plan: RoutePlan) => boolean;
  deletePlan: () => void;
}
export const TravelContext = createContext<TravelState | null>(null);
export function useTravel() {
  const context = useContext(TravelContext);
  if (!context) throw new Error('TravelProvider is required');
  return context;
}
