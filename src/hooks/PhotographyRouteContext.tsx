import { useState } from 'react';
import type { ReactNode } from 'react';
import { defaultViewpointIds, validViewpointIds } from '../data/photography-map';
import { readStored, writeStored } from '../lib/storage';
import { PhotographyRouteContext } from './usePhotographyRoute';
import { defaultTripPlanning, validTripPlanning } from '../data/photography-planning';
import type { TripPlanning } from '../data/photography-planning';

const key = 'jacs-destinos:photography:viewpoints:v1';
const planningKey = 'jacs-destinos:photography:planning:v1';
export function PhotographyRouteProvider({ children }: { children: ReactNode }) {
  const [viewpointIds, setViewpointIds] = useState(() =>
    readStored(key, [...defaultViewpointIds], validViewpointIds),
  );
  const [storageWarning, setStorageWarning] = useState('');
  const [planning, setPlanning] = useState(() =>
    readStored(planningKey, { ...defaultTripPlanning }, validTripPlanning),
  );
  function updatePlanning(patch: Partial<TripPlanning>) {
    const next = { ...planning, ...patch };
    if (!validTripPlanning(next)) return;
    setPlanning(next);
    setStorageWarning(
      writeStored(planningKey, next)
        ? ''
        : 'Los ajustes están disponibles durante esta sesión; el navegador no permitió guardarlos.',
    );
  }
  function updateViewpoints(ids: string[]) {
    if (!validViewpointIds(ids)) return;
    setViewpointIds(ids);
    setStorageWarning(
      writeStored(key, ids)
        ? ''
        : 'La elección de miradores estará disponible durante esta sesión; el navegador no permitió guardarla.',
    );
  }
  return (
    <PhotographyRouteContext.Provider
      value={{ viewpointIds, updateViewpoints, planning, updatePlanning, storageWarning }}
    >
      {children}
    </PhotographyRouteContext.Provider>
  );
}
