import { useState } from 'react';
import type { ReactNode } from 'react';
import { Dialog } from '../components/Dialog';
import type { DialogContent } from '../components/Dialog';

import { InfoContext } from './useInfo';
export function InfoProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<DialogContent | null>(null);
  return (
    <InfoContext.Provider value={setContent}>
      {children}
      <Dialog content={content} onClose={() => setContent(null)} />
    </InfoContext.Provider>
  );
}
