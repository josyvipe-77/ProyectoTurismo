import { ArrowRight, Camera, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  photographyDays,
  photographyExperience as experience,
} from '../data/photography-experience';
import { ExperiencePhoto } from './ExperiencePhoto';

export function ExperienceOverview({
  action = 'experience',
}: {
  action?: 'experience' | 'program';
}) {
  return (
    <section className="section experience-overview" aria-labelledby="experience-overview-title">
      <ExperiencePhoto id="8264" name="Bosque de Piedras de Pampachiri" />
      <div className="experience-overview-copy">
        <span className="eyebrow blue">Nuestra propuesta · Fotografía y patrimonio</span>
        <h2 id="experience-overview-title">
          Cinco días.
          <br />
          <em>Una nueva manera de mirar.</em>
        </h2>
        <p>{experience.audience}</p>
        <div className="experience-facts">
          <span>
            <Camera size={18} /> 5 jornadas
          </span>
          <span>
            <MapPin size={18} /> Base en Abancay
          </span>
          <span>
            <Users size={18} /> {experience.group}
          </span>
        </div>
        <ol className="experience-day-list">
          {photographyDays.map((day) => (
            <li key={day.id}>
              <span>0{day.day}</span>
              <Link to={`/construye#${day.id}`}>
                {day.title}
                <ArrowRight size={16} />
              </Link>
            </li>
          ))}
        </ol>
        <Link to={action === 'program' ? '/construye' : '/experiencia'} className="button">
          {action === 'program' ? 'Ver itinerario de cinco días' : 'Conoce la experiencia'}{' '}
          <ArrowRight size={18} />
        </Link>
        <p className="small muted">Diseño de producto COIL USC–UNAMBA · Alojamiento no incluido.</p>
      </div>
    </section>
  );
}
