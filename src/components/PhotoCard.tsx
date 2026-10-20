import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export function PhotoCard({
  image,
  title,
  eyebrow,
  meta,
  children,
  className = '',
}: {
  image: ReactNode;
  title: string;
  eyebrow?: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={`photo-card ${className}`}>
      {image}
      <details className="photo-card-details">
        <summary>
          {(eyebrow || meta) && (
            <span className="photo-card-labels">
              {eyebrow && <span className="eyebrow blue">{eyebrow}</span>}
              {meta}
            </span>
          )}
          <h3>{title}</h3>
          <span className="photo-card-more">
            <span className="photo-card-show">Ver detalles</span>
            <span className="photo-card-hide">Ocultar detalles</span>
            <ChevronDown size={16} aria-hidden="true" />
          </span>
        </summary>
        <div className="photo-card-body">{children}</div>
      </details>
    </article>
  );
}
