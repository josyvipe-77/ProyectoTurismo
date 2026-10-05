import { ArrowLeft, ArrowRight, Bookmark, CalendarDays, Footprints, Mountain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Budget, Photo, RespectNote, SectionHeading } from '../components/Editorial';
import { RouteMap } from '../components/RouteMap';
import { journeys } from '../data';
import { DailyItinerary } from '../components/DailyItinerary';
import { PracticalInfo } from '../components/PracticalInfo';
import { useTravel } from '../hooks/useTravel';
import { useInfo } from '../hooks/useInfo';

export default function DetailPage() {
  const { favorites, toggleFavorite } = useTravel();
  const openInfo = useInfo();
  const route = journeys[0];
  const favorite = favorites.includes('chanka');
  const consult = () =>
    openInfo({
      title: 'Preparar una consulta',
      body: (
        <>
          <p>
            Tu interés en la Ruta Chanka sería el punto de partida para conversar con un anfitrión
            local.
          </p>
          <p>
            Esta demostración no envía mensajes ni realiza reservas. El canal de consulta se
            incorporará cuando existan colaboradores y contactos verificados.
          </p>
          <Link to="/construye?ejemplo=chanka" className="text-link">
            Preparar mi cuaderno <ArrowRight size={16} />
          </Link>
        </>
      ),
    });
  return (
    <div className="container page">
      <div className="page-topline">
        <Link to="/rutas" className="text-link">
          <ArrowLeft size={16} />
          Volver al catálogo de rutas
        </Link>
        <span className="tag tag-neutral">Cuaderno N.º 03</span>
      </div>
      <div className="page-intro detail-intro">
        <span className="eyebrow red">Ruta Chanka · 4 días · Itinerario de muestra</span>
        <h1>
          Tras las huellas
          <br />
          <em>de una historia viva.</em>
        </h1>
        <p className="serif-quote">«Apurímac no se visita, se escucha»</p>
      </div>
      <div className="stats-grid">
        <div>
          <CalendarDays />
          <span>Duración</span>
          <strong>4 jornadas</strong>
          <small>Itinerario de muestra</small>
        </div>
        <div>
          <Footprints />
          <span>Caminatas</span>
          <strong>Moderadas</strong>
          <small>Condiciones por confirmar</small>
        </div>
        <div>
          <span>Aporte base</span>
          <strong>
            S/ 680 <small>/ pers.</small>
          </strong>
          <small>Estimación ilustrativa</small>
        </div>
        <div>
          <Mountain />
          <span>Altitud</span>
          <strong>Por confirmar</strong>
          <small>Planifica tu adaptación</small>
        </div>
        <button
          className={`stat-save ${favorite ? 'is-favorite' : ''}`}
          aria-pressed={favorite}
          onClick={() => toggleFavorite('chanka')}
        >
          <Bookmark fill={favorite ? 'currentColor' : 'none'} />
          <span>{favorite ? 'Guardada en favoritos' : 'Guardar en favoritos'}</span>
        </button>
      </div>
      <Photo
        name="hero"
        alt="Paisaje andino generado para ambientar la propuesta Chanka; ubicación no verificada"
        className="detail-panorama"
        eager
      />
      <section className="section detail-story">
        <div>
          <span className="eyebrow blue">La intención del camino</span>
          <h2>
            Agua, piedra
            <br />
            <em>y memoria compartida.</em>
          </h2>
        </div>
        <div>
          <p>
            Esta propuesta conecta Andahuaylas, la laguna de Pacucha, el complejo arqueológico de
            Sóndor y Talavera. Cuatro jornadas para dejar espacio a lo que aparece entre una escala
            y la siguiente.
          </p>
          <p>
            Pacucha y Sóndor comparten un circuito local. Para visitar Talavera se regresa al eje de
            Andahuaylas. Consulta los circuitos documentados del catálogo; actividades y
            alojamientos requieren confirmación.
          </p>
          <div className="chips">
            {route.interests.map((item) => (
              <span className="tag tag-neutral" key={item}>
                {item}
              </span>
            ))}
            <span className="tag tag-neutral">Viaje pausado</span>
          </div>
        </div>
      </section>
      <section className="section">
        <SectionHeading
          number="01"
          label="El recorrido"
          title={
            <>
              Cuatro escalas,
              <br />
              <em>un mismo hilo.</em>
            </>
          }
        />
        <RouteMap />
      </section>
      <div className="detail-columns">
        <div>
          <section className="section">
            <SectionHeading
              number="02"
              label="Itinerario diario"
              title="El ritmo de cada jornada"
            />
            <DailyItinerary />
          </section>
          <section className="section">
            <SectionHeading
              number="03"
              label="Preparar el encuentro"
              title="Antes de hacer el camino"
            />
            <PracticalInfo />
          </section>
        </div>
        <aside className="detail-budget">
          <Budget />
          <button className="button full-width" onClick={consult}>
            Consultar esta ruta <ArrowRight size={18} />
          </button>
          <Link className="button button-outline full-width" to="/construye?ejemplo=chanka">
            Personalizar el cuaderno
          </Link>
          <p className="small muted">Consulta demostrativa · No se envían solicitudes.</p>
        </aside>
      </div>
      <RespectNote />
    </div>
  );
}
