import { ArrowDown, ArrowRight, CalendarDays, MoveUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeading } from './Editorial';
import { festivals } from '../data';
import { CloudIntro } from './CloudIntro';
import { useHeroIntro } from '../hooks/useHeroIntro';
export function HomeHero() {
  const { ref, phase } = useHeroIntro();
  return (
    <>
      <section className="hero" aria-labelledby="home-title" ref={ref} data-intro-phase={phase}>
        <div className="hero-landscape">
          <img
            className="hero-image"
            src="/images/hero-user-v2.png"
            alt="Caminante en un sendero de piedra ante un valle de montaña con nubes bajas"
            fetchPriority="high"
          />
          <img
            className="hero-image hero-image-soft"
            src="/images/hero-user-v2.png"
            alt=""
            aria-hidden="true"
            decoding="async"
          />
        </div>
        <CloudIntro phase={phase} />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="hero-copy">
            <span className="hero-label hero-enter hero-enter-label">
              Cuaderno de exploración humana
            </span>
            <h1 id="home-title" className="hero-enter hero-enter-title">
              Apurímac no se visita, <br />
              <em>se escucha.</em>
            </h1>
            <p className="hero-enter hero-enter-description">
              Camina despacio. Descubre rutas, sabores e historias
              <br className="desktop-break" /> que merecen tiempo.
            </p>
          </div>
          <div className="hero-actions hero-enter hero-enter-actions">
            <Link to="/construye" className="button">
              Construye tu ruta <ArrowRight size={17} />
            </Link>
            <Link to="/rutas" className="button button-ghost">
              Explora Apurímac
            </Link>
          </div>
        </div>
        <div className="hero-bottom">
          <span className="hero-enter hero-enter-meta">Imagen referencial</span>
          <a href="#cuaderno" className="hero-enter hero-enter-meta">
            Desliza para escuchar <ArrowDown size={16} />
          </a>
          <span className="hero-enter hero-enter-meta">Apurímac · Andes del Perú</span>
        </div>
      </section>
    </>
  );
}

export function HomeIntroduction() {
  return (
    <>
      <section id="cuaderno" className="intro-section">
        <div>
          <span className="eyebrow blue">La mirada de viaje</span>
          <span className="intro-mark" aria-hidden="true">
            ✳
          </span>
        </div>
        <div>
          <h2>
            Viajar no para coleccionar postales,
            <br />
            <em>sino para escuchar el territorio.</em>
          </h2>
          <div className="intro-copy">
            <p>
              Hay lugares que se revelan poco a poco. Entre lagunas, caminos de piedra y mesas
              compartidas, Apurímac invita a cambiar el ritmo.
            </p>
            <p>
              Este cuaderno reúne propuestas para descubrir su cultura y su naturaleza con
              curiosidad, tiempo y respeto por quienes le dan vida.
            </p>
          </div>
          <Link to="/cultura" className="text-link">
            Acércate a sus historias <MoveUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

export function HomeClosing() {
  return (
    <>
      <section className="section local-voices">
        <div>
          <span className="eyebrow blue">05 / Protagonistas del territorio</span>
          <h2>
            Las mejores historias
            <br />
            <em>tienen voz propia.</em>
          </h2>
          <p>
            Este espacio está pensado para las voces de artesanos, cocineras, músicos y guías
            locales.
          </p>
          <p className="small muted">
            Las historias y los perfiles se incorporarán con autorización de sus protagonistas. Aquí
            no se presentan testimonios reales.
          </p>
        </div>
        <div className="voice-card">
          <span className="voice-mark" aria-hidden="true">
            “
          </span>
          <h3>
            Un cuaderno que empieza
            <br />
            por escuchar.
          </h3>
          <p>Historias locales por construir juntos.</p>
          <Link to="/cultura" className="text-link">
            Conoce el enfoque <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <section className="section">
        <SectionHeading
          number="06"
          label="El tiempo de la comunidad"
          title={
            <>
              Hay fechas que reúnen
              <br />
              <em>a todo un territorio.</em>
            </>
          }
        >
          <Link to="/cultura#calendario" className="text-link">
            Abrir el calendario <CalendarDays size={18} />
          </Link>
        </SectionHeading>
        <div className="festival-list">
          {festivals.map((festival) => (
            <article key={festival.id}>
              <span className="festival-date">{festival.day}</span>
              <div>
                <h3>{festival.title}</h3>
                <p>{festival.location}</p>
              </div>
              <Link
                to="/cultura#calendario"
                aria-label={`Ver calendario: ${festival.title}`}
                className="icon-button"
              >
                <MoveUpRight size={22} />
              </Link>
            </article>
          ))}
        </div>
        <p className="small muted">
          Fechas orientativas; confirma la programación con fuentes locales antes de viajar.
        </p>
      </section>
      <section className="language-story">
        <span className="eyebrow blue">Una lengua, muchas maneras de mirar</span>
        <h2>
          Escuchar también
          <br />
          es aprender.
        </h2>
        <p>
          El quechua forma parte de la vida del territorio. Acercarte a una lengua empieza por
          respetar a quienes la hablan.
        </p>
        <Link to="/cultura#quechua" className="text-link">
          Una primera aproximación <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
}
