import { dayNotes, journeys } from '../data';
export function DailyItinerary() {
  const route = journeys[0];
  return (
    <div className="itinerary">
      {route.stops.map((stop, index) => (
        <details className="day-detail" open={index === 0} key={stop}>
          <summary>
            <span className="day-number">0{index + 1}</span>
            <span>
              <small>Día {index + 1} · Propuesta de recorrido</small>
              <strong>{stop}</strong>
            </span>
            <span className="detail-plus" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="day-body">
            <p>{dayNotes[index]}</p>
            <span className="small muted">
              Tiempo de visita y traslado: por confirmar con acompañamiento local.
            </span>
          </div>
        </details>
      ))}
    </div>
  );
}
