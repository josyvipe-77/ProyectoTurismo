import { useState } from 'react';
import type { ReactNode } from 'react';
import { journeys, destinations, interests } from '../data';
import { isRoutePlan } from '../lib/plan';
import type { RoutePlan } from '../lib/plan';
import { readStored, writeStored } from '../lib/storage';

import { TravelContext } from './useTravel';
const favoriteKey = 'apu-rimaq:favorites:v1';
const planKey = 'apu-rimaq:plan:v1';
const validFavorites = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.length <= journeys.length &&
  value.every((item) => typeof item === 'string' && journeys.some((route) => route.id === item));
const validPlan = (value: unknown): value is RoutePlan | null =>
  value === null ||
  (isRoutePlan(value) &&
    value.destinations.every((item) => destinations.includes(item)) &&
    value.interests.every((item) => interests.includes(item)));

export function TravelProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState(() => readStored(favoriteKey, [], validFavorites));
  const [savedPlan, setSavedPlan] = useState<RoutePlan | null>(() =>
    readStored(planKey, null, validPlan),
  );
  const [storageWarning, setStorageWarning] = useState('');
  const persist = (key: string, value: unknown) => {
    const success = writeStored(key, value);
    setStorageWarning(
      success
        ? ''
        : 'El navegador bloqueó el almacenamiento. Tus cambios estarán disponibles solo durante esta sesión.',
    );
    return success;
  };
  function toggleFavorite(id: string) {
    const next = favorites.includes(id)
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];
    setFavorites(next);
    persist(favoriteKey, next);
  }
  function savePlan(plan: RoutePlan) {
    setSavedPlan(plan);
    return persist(planKey, plan);
  }
  function deletePlan() {
    setSavedPlan(null);
    persist(planKey, null);
  }
  return (
    <TravelContext.Provider
      value={{ favorites, savedPlan, storageWarning, toggleFavorite, savePlan, deletePlan }}
    >
      {children}
    </TravelContext.Provider>
  );
}
