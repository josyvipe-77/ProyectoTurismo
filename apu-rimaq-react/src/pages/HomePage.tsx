import { ArrowRight, Compass, MoveUpRight, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  BuildCallout,
  Photo,
  RespectNote,
  RouteCard,
  SavedBadge,
  SectionHeading,
} from '../components/Editorial';
import { ApurimacExplorer } from '../components/ApurimacExplorer';
import { journeys } from '../data';
import { HomeHero, HomeIntroduction, HomeClosing } from '../components/HomeSections';
import { useHomeMotion } from '../hooks/useHomeMotion';
export default function HomePage() {
  const motion = useHomeMotion();
  return (
    <div className="home-page" ref={motion}>
      <HomeHero />

      <div className="home-caption">
        <span>Un territorio. Muchas voces.</span>
        <span>
          Cuaderno N.º 01 <span className="red">●</span>
        </span>
      </div>
      <div className="container">
        <HomeIntroduction />

        <section className="section">
          <SectionHeading
            number="01"
            label="Elige un primer camino"
            title={
              <>
                Rutas cardinales
                <br />
                <em>del territorio.</em>
              </>
            }
          >
            <Link to="/rutas" className="text-link">
              Ver todas las rutas <ArrowRight size={18} />
            </Link>
          </SectionHeading>
          <div className="grid-two">
            {journeys.slice(0, 2).map((journey) => (
              <RouteCard key={journey.id} journey={journey} />
            ))}
          </div>
          <SavedBadge />
        </section>
        <ApurimacExplorer />
        <section className="section">
          <SectionHeading
            number="03"
            label="Cultura viva"
            title={
              <>
                Lo que las manos saben,
                <br />
                <em>el tiempo lo recuerda.</em>
              </>
            }
          >
            <Link to="/cultura" className="text-link">
              Conoce la cultura viva <ArrowRight size={18} />
            </Link>
          </SectionHeading>
          <div className="culture-feature">
            <Photo name="telar" alt="Representación generada de manos trabajando en un telar" />
            <div>
              <span className="eyebrow red">Oficios que cuentan</span>
              <h3>
                Un hilo también
                <br />
                puede ser un camino.
              </h3>
              <p>
                Acercarse a un oficio es aprender a observar. Los materiales, las herramientas y los
                gestos abren una conversación con el territorio.
              </p>
              <p className="small muted">
                Las visitas y los talleres se deben acordar con sus anfitriones. No hay experiencias
                reservables en este prototipo.
              </p>
              <Link to="/cultura" className="button button-outline">
                Abrir esta historia <MoveUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>
        <section className="section">
          <SectionHeading
            number="04"
            label="Sabores del territorio"
            title={
              <>
                Una mesa.
                <br />
                <em>Muchas formas de recibirte.</em>
              </>
            }
          >
            <span className="section-side-note">
              El viaje también se escucha
              <br />
              alrededor de una mesa.
            </span>
          </SectionHeading>
          <div className="grid-three">
            <article className="story-card flavor-text">
              <Sprout size={34} strokeWidth={1.2} />
              <span className="eyebrow">Curahuasi</span>
              <h3>El aroma del anís</h3>
              <p>
                Un punto de partida para conversar sobre los sabores del valle y su vínculo con el
                paisaje.
              </p>
              <Link to="/cultura#sabores" className="text-link">
                Saborear el territorio <ArrowRight size={16} />
              </Link>
            </article>
            <article className="story-card">
              <Photo name="horno" alt="Imagen generada de un horno de barro y panes" />
              <div className="story-content">
                <span className="eyebrow">El fuego y la pausa</span>
                <h3>Al calor del horno</h3>
                <p>
                  Pan, conversación y tiempo compartido. Una propuesta para mirar la cocina de
                  cerca.
                </p>
              </div>
            </article>
            <article className="story-card flavor-text lavender">
              <Compass size={34} strokeWidth={1.2} />
              <span className="eyebrow">Viajar con los sentidos</span>
              <h3>La cocina reúne</h3>
              <p>
                Escucha antes de preguntar. Prueba con curiosidad y conoce quién está detrás de cada
                preparación.
              </p>
              <Link to="/construye" className="text-link">
                Inclúyelo en tu ruta <ArrowRight size={16} />
              </Link>
            </article>
          </div>
        </section>
        <HomeClosing />
        <BuildCallout />
        <RespectNote />
      </div>
    </div>
  );
}
