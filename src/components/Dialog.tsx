import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

export interface DialogContent {
  title: string;
  body: ReactNode;
}
interface DialogProps {
  content: DialogContent | null;
  onClose: () => void;
}
export function Dialog({ content, onClose }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (content && !dialog?.open) dialog?.showModal();
    if (!content && dialog?.open) dialog.close();
  }, [content]);
  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="dialog-title"
      onCancel={onClose}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
        if (event.target instanceof HTMLElement && event.target.closest('a')) onClose();
      }}
    >
      {content && (
        <div className="dialog-inner">
          <button
            className="icon-button dialog-close"
            onClick={onClose}
            aria-label="Cerrar ventana"
          >
            <X size={22} />
          </button>
          <span className="eyebrow">JACS Destinos · Cuaderno de viaje</span>
          <h2 id="dialog-title">{content.title}</h2>
          <div className="dialog-body">{content.body}</div>
          <button className="button" onClick={onClose}>
            Entendido
          </button>
        </div>
      )}
    </dialog>
  );
}
