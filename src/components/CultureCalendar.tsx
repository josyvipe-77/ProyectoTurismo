import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { SectionHeading } from './Editorial';
import { ExperiencePhoto } from './ExperiencePhoto';
import { PhotoCard } from './PhotoCard';
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
        {festivals.length} celebraciones documentadas para conocer el territorio. Estas épocas son
        referencias culturales: confirma el programa del año en que viajes. Las fiestas no forman
        parte de las cinco jornadas de JACS.
      </p>
      <div className="filter-bar culture-filters">
        <label>
          <span>Mes de referencia</span>
          <select value={month} onChange={(event) => setMonth(event.target.value)}>
            <option value="">Todos los meses</option>
            {festivalMonths.map((value) => (
              <option key={value} value={value}>
                {monthName.format(new Date(Date.UTC(2020, Number(value) - 1, 1)))}
              </option>
            ))}
          </select>
        </label>
        <span className="small muted" role="status" aria-live="polite">
          {shown.length}{' '}
          {shown.length === 1 ? 'celebración documentada' : 'celebraciones documentadas'}
        </span>
      </div>
      <div className="calendar-grid">
        {shown.map((festival) => (
          <PhotoCard
            className="calendar-card"
            key={festival.id}
            image={<ExperiencePhoto id={festival.photoResourceId} name={festival.title} />}
            title={festival.title}
            eyebrow={festival.location}
            meta={
              <span className="photo-card-date">
                <CalendarDays size={14} aria-hidden="true" />
                {festival.day}
              </span>
            }
          >
            <p>{festival.note}</p>
          </PhotoCard>
        ))}
      </div>
    </section>
  );
}
