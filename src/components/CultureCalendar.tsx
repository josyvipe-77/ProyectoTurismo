import { useState } from 'react';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { SectionHeading } from './Editorial';
import { festivals } from '../data';
import { useInfo } from '../hooks/useInfo';

export function CultureCalendar() {
  const [month, setMonth] = useState('');
  const [category, setCategory] = useState('');
  const openInfo = useInfo();
  const shown = festivals.filter(
    (festival) =>
      (!month || festival.month === month || (festival.id === 'carnaval' && month === '03')) &&
      (!category || festival.category === category),
  );
  return (
    <section className="section" id="calendario">
      <SectionHeading
        number="01"
        label="Calendario del territorio"
        title={
          <>
            Cuando la comunidad
            <br />
            <em>se encuentra.</em>
          </>
        }
      />
      <div className="filter-bar culture-filters">
        <label>
          <span>Mes</span>
          <select value={month} onChange={(event) => setMonth(event.target.value)}>
            <option value="">Todos los Meses</option>
            <option value="02">Febrero</option>
            <option value="03">Marzo</option>
            <option value="04">Abril</option>
            <option value="09">Septiembre</option>
          </select>
        </label>
        <label>
          <span>Interés</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Todos los encuentros</option>
            <option>Celebraciones</option>
            <option>Oficios</option>
            <option>Gastronomía</option>
          </select>
        </label>
        <span className="small muted" role="status">
          {shown.length} referencias en el calendario
        </span>
      </div>
      <div className="calendar-grid">
        {shown.map((festival) => (
          <article className="calendar-card" key={festival.id}>
            <div className="calendar-top">
              <CalendarDays size={21} />
              <span className="tag tag-neutral">{festival.day}</span>
            </div>
            <span className="eyebrow blue">{festival.location}</span>
            <h3>{festival.title}</h3>
            <p>{festival.note}</p>
            <button
              className="text-link"
              onClick={() =>
                openInfo({
                  title: festival.title,
                  body: (
                    <>
                      <p>{festival.note}</p>
                      <p>
                        Este calendario es orientativo. No hay un programa oficial integrado ni
                        entradas o reservas disponibles.
                      </p>
                    </>
                  ),
                })
              }
            >
              Antes de viajar <ArrowRight size={16} />
            </button>
          </article>
        ))}
      </div>
      {!shown.length && (
        <div className="empty-state compact">
          <h3>Esta parte del cuaderno está por escribir.</h3>
          <p>No tenemos encuentros validados para esta selección.</p>
          <button
            className="text-link"
            onClick={() => {
              setMonth('');
              setCategory('');
            }}
          >
            Ver todo el calendario <ArrowRight size={16} />
          </button>
        </div>
      )}
      <p className="small muted">
        Carnavales y Semana Santa tienen fechas variables. El filtro mensual es orientativo;
        confirma el programa y la fecha del año en que viajes.
      </p>
    </section>
  );
}
