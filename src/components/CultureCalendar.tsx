import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { SectionHeading } from './Editorial';
import { ExperiencePhoto } from './ExperiencePhoto';
import { festivalMonths, festivals } from '../data';

const monthName = new Intl.DateTimeFormat('es-PE', { month: 'long', timeZone: 'UTC' });

export function CultureCalendar() {
  const [month, setMonth] = useState('');
  const shown = festivals.filter((festival) => !month || festival.months.includes(month));
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
      <p className="culture-section-intro">
        Tres celebraciones documentadas para conocer el territorio. Estas épocas son referencias
        culturales: confirma el programa del año en que viajes. Las fiestas no forman parte de las
        cinco jornadas de JACS.
      </p>
      <div className="filter-bar culture-filters">
        <label>
          <span>Mes de referencia</span>
          <select value={month} onChange={(event) => setMonth(event.target.value)}>
<<<<<<< Updated upstream
            <option value="">Todos los Meses</option>
            <option value="02">Febrero</option>
            <option value="03">Marzo</option>
            <option value="04">Abril</option>
            <option value="09">Septiembre</option>
=======
            <option value="">Todas las épocas</option>
            {festivalMonths.map((value) => (
              <option key={value} value={value}>
                {monthName.format(new Date(Date.UTC(2020, Number(value) - 1, 1)))}
              </option>
            ))}
>>>>>>> Stashed changes
          </select>
        </label>
        <span className="small muted" role="status" aria-live="polite">
          {shown.length}{' '}
          {shown.length === 1 ? 'celebración documentada' : 'celebraciones documentadas'}
        </span>
      </div>
      <div className="calendar-grid">
        {shown.map((festival) => (
          <article className="calendar-card" key={festival.id}>
            <ExperiencePhoto id={festival.photoResourceId} name={festival.title} />
            <div className="calendar-copy">
              <div className="calendar-top">
                <CalendarDays size={21} aria-hidden="true" />
                <span className="tag tag-neutral">{festival.day}</span>
              </div>
              <span className="eyebrow blue">{festival.location}</span>
              <h3>{festival.title}</h3>
              <p>{festival.note}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
