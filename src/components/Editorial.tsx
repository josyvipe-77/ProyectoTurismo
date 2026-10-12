import { ArrowRight, Feather } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface SectionHeadingProps {
  number?: string;
  label: string;
  title: ReactNode;
  children?: ReactNode;
}
export function SectionHeading({ number, label, title, children }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">
          {number && <span className="section-number">{number} / </span>}
          {label}
        </span>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
interface PhotoProps {
  name: string;
  alt: string;
  className?: string;
  eager?: boolean;
}
export function Photo({ name, alt, className = '', eager = false }: PhotoProps) {
  return (
    <figure className={`photo ${className}`}>
      <img
        src={`/images/${name}.webp`}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
      <figcaption>Imagen generada · Referencial</figcaption>
    </figure>
  );
}
export function RespectNote() {
  return (
    <aside className="respect-note">
      <Feather size={26} strokeWidth={1.4} />
      <div>
        <h3>Viaja con respeto.</h3>
        <p>
          Pide permiso antes de fotografiar. Escucha a quienes habitan el territorio. Lleva tus
          residuos de regreso y elige acompañamiento local.
        </p>
      </div>
    </aside>
  );
}
export function BuildCallout() {
  return (
    <section className="build-callout">
      <span className="eyebrow">Apurímac a través de tu objetivo</span>
      <h2>
        Cinco jornadas para observar.
        <br />
        <em>Una experiencia para recordar.</em>
      </h2>
      <Link to="/construye" className="button">
        Planifica tu viaje <ArrowRight size={18} />
      </Link>
      <span className="small">Sin prisa. Con curiosidad. Con respeto.</span>
    </section>
  );
}
