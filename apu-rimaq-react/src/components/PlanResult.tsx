import { ArrowRight, Bookmark, Download, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { RoutePlan, RouteSelection } from '../lib/plan';
import { stopsForDay } from '../lib/plan';
import { money } from '../data';
import { Budget } from './Editorial';
import { RouteMap } from './RouteMap';

interface PlanResultProps {
  plan: RoutePlan | null;
  selection: RouteSelection;
  onSave: () => void;
  saved: boolean;
}
function exportPlan(plan: RoutePlan) {
  const text = [
    'APU RIMAQ · MI CUADERNO DE VIAJE',
    'Apurímac no se visita, se escucha.',
    '',
    `Duración: ${plan.days} días`,
    `Intereses: ${plan.interests.join(', ')}`,
    '',
    ...stopsForDay(plan).map(
      (stop, index) => `Día ${index + 1}: ${stop} · actividades y traslados por confirmar`,
    ),
    '',
    `Presupuesto ilustrativo por persona: ${money(plan.cost)}`,
    'Referencia: S/ 170 por jornada. No es una cotización.',
    'El orden de destinos es el de tu selección; no se verifican distancias o viabilidad geográfica.',
    'No incluye viaje de llegada a Apurímac. Confirma acceso y disponibilidad local.',
    '',
    'Viaja con respeto. Pide permiso, escucha y cuida el territorio.',
  ].join('\n');
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'apu-rimaq-mi-cuaderno.txt';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function PlanResult({ plan, selection, onSave, saved }: PlanResultProps) {
  return (
    <section className="plan-result" aria-labelledby="result-title">
      <div className="result-heading">
        <span className="eyebrow blue">Cuaderno de campo preliminar</span>
        <h2 id="result-title" tabIndex={-1}>
          {plan ? 'Tu ruta, a tu ritmo.' : 'El comienzo de tu cuaderno.'}
        </h2>
        <p>
          {plan
            ? 'Un borrador para conversar y ajustar con anfitriones locales.'
            : 'Elige los lugares que te llaman y los intereses que te acompañan.'}
        </p>
      </div>
      <RouteMap
        stops={
          plan?.destinations ??
          (selection.destinations.length
            ? selection.destinations
            : ['Andahuaylas', 'Pacucha', 'Sóndor', 'Talavera'])
        }
        compact
      />
      {plan ? (
        <>
          <div className="result-summary">
            <span className="tag tag-neutral">{plan.days} días por el territorio</span>
            {plan.interests.map((interest) => (
              <span className="tag tag-lavender" key={interest}>
                {interest}
              </span>
            ))}
          </div>
          <div className="result-itinerary">
            <span className="eyebrow blue">Jornadas sugeridas del cuaderno</span>
            {stopsForDay(plan).map((stop, index) => (
              <article key={index}>
                <span className="tag">Día {index + 1}</span>
                <h3>{stop}</h3>
                <p>
                  {index >= plan.destinations.length
                    ? 'Una jornada libre para descansar o profundizar en esta escala.'
                    : 'Una escala abierta a paisaje, cultura y encuentros por coordinar.'}
                </p>
                <small>Actividades, alojamiento y traslados por confirmar.</small>
              </article>
            ))}
          </div>
          <Budget days={plan.days} />
          <div className="result-actions">
            <button className="button" onClick={onSave}>
              {saved ? <Check size={18} /> : <Bookmark size={18} />}
              {saved ? 'Guardar cambios' : 'Guardar mi ruta'}
            </button>
            <button className="button button-outline" onClick={() => exportPlan(plan)}>
              <Download size={18} />
              Descargar cuaderno
            </button>
          </div>
          <p className="small muted">
            Guardado local; no hay cuenta ni sincronización. El presupuesto usa S/ 170 por jornada y
            persona. La propuesta no calcula distancias, disponibilidad o viabilidad.
          </p>
        </>
      ) : (
        <div className="result-empty">
          <span className="eyebrow">Todavía por escribir</span>
          <h3>
            Un camino empieza
            <br />
            con una elección.
          </h3>
          <p>
            Completa días, destinos e intereses y pulsa «Crear mi borrador» para ver tus jornadas y
            su presupuesto de muestra.
          </p>
          <Link to="/rutas/chanka" className="text-link">
            Ver un cuaderno de ejemplo <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </section>
  );
}
