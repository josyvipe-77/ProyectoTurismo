import { ArrowRight, Feather, Heart, CalendarDays, Footprints, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useInfo } from '../hooks/useInfo';
import { useTravel } from '../hooks/useTravel';
import type { Journey } from '../data';
import { money } from '../data';
import { budgetFor } from '../lib/plan';

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
export function RouteCard({ journey, featured = false }: { journey: Journey; featured?: boolean }) {
  const { favorites, toggleFavorite } = useTravel();
  const openInfo = useInfo();
  const favorite = favorites.includes(journey.id);
  return (
    <article className={`route-card ${featured ? 'featured' : ''}`}>
      <div className="card-top">
        <span className="tag">
          {journey.id === 'chanka' ? 'Ruta sugerida del mes' : 'Cuaderno de exploración'}
        </span>
        <span className="small muted">
          AP–0{journey.id === 'chanka' ? '1' : journey.id === 'bosque' ? '2' : '3'}
        </span>
        <button
          className={`icon-button favorite ${favorite ? 'is-favorite' : ''}`}
          aria-label={`${favorite ? 'Quitar' : 'Guardar'} ${journey.title} ${favorite ? 'de' : 'en'} favoritos`}
          aria-pressed={favorite}
          onClick={() => toggleFavorite(journey.id)}
        >
          <Heart size={20} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <Photo name={journey.image} alt={`Representación referencial para ${journey.title}`} />
      <div className="card-content">
        <span className="eyebrow blue">{journey.stops.join(' · ')}</span>
        <h3>
          {journey.title}: {journey.subtitle}
        </h3>
        <p>{journey.description}</p>
        <div className="route-meta">
          <span>
            <CalendarDays size={16} />
            {journey.days} días
          </span>
          <span>
            <Footprints size={16} />
            {journey.difficulty}
          </span>
          <span>Desde {money(journey.cost)}</span>
        </div>
        <div className="card-bottom">
          <span className="small muted">Por persona · estimación de muestra</span>
          {journey.id === 'chanka' ? (
            <Link to="/rutas/chanka" className="text-link">
              Explorar ruta <ArrowRight size={18} />
            </Link>
          ) : (
            <button
              className="text-link"
              onClick={() =>
                openInfo({
                  title: journey.title,
                  body: (
                    <>
                      <p>
                        Esta ruta es una propuesta editorial. Su itinerario detallado todavía está
                        pendiente de validación local.
                      </p>
                      <p>
                        Puedes incluir sus destinos en el constructor y crear un borrador de viaje.
                      </p>
                      <Link to="/construye" className="text-link">
                        Ir al constructor <ArrowRight size={16} />
                      </Link>
                    </>
                  ),
                })
              }
            >
              Ver propuesta <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
export function Budget({ days = 4 }: { days?: number }) {
  return (
    <div className="budget">
      <span className="eyebrow">Aporte base referencial</span>
      <h3>Lo que puede costar el camino</h3>
      <dl>
        {budgetFor(days).map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{money(item.value)}</dd>
          </div>
        ))}
        <div className="budget-total">
          <dt>Total por persona</dt>
          <dd>{money(days * 170)}</dd>
        </div>
      </dl>
      <p className="small muted">
        Estimación ilustrativa de {days} días. No es una cotización. No incluye el viaje de llegada
        a Apurímac; precios y disponibilidad por confirmar.
      </p>
    </div>
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
      <span className="eyebrow">Un viaje con tu propio compás</span>
      <h2>
        El territorio pone las historias.
        <br />
        <em>Tú eliges el camino.</em>
      </h2>
      <Link to="/construye" className="button">
        Construye tu ruta <ArrowRight size={18} />
      </Link>
      <span className="small">Sin prisa. Con curiosidad. Con respeto.</span>
    </section>
  );
}
export function SavedBadge() {
  const { savedPlan } = useTravel();
  return savedPlan ? (
    <Link className="saved-badge" to="/construye">
      <Bookmark size={16} />
      Tu cuaderno guardado · {savedPlan.days} días <ArrowRight size={16} />
    </Link>
  ) : null;
}
