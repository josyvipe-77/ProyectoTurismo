import { createContext, useContext } from 'react';
import type { DialogContent } from '../components/Dialog';
export const InfoContext = createContext<((content: DialogContent) => void) | null>(null);
export function useInfo() {
  const open = useContext(InfoContext);
  if (!open) throw new Error('InfoProvider is required');
  return open;
}
