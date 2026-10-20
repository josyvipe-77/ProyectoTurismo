import { ArrowRight, Compass, MoveUpRight, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BuildCallout, Photo, RespectNote, SectionHeading } from '../components/Editorial';
import { PhotographyRoute } from '../components/PhotographyRoute';
import { ExperienceOverview } from '../components/ExperienceOverview';
import { HomeHero, HomeIntroduction, HomeClosing } from '../components/HomeSections';
import { useHomeMotion } from '../hooks/useHomeMotion';
import { SharedTerritories } from '../components/SharedTerritories';
import { ExperiencePhoto } from '../components/ExperiencePhoto';
import { JourneyGallery } from '../components/JourneyGallery';
export default function HomePage() {
  const motion = useHomeMotion();
  return (
    <div className="home-page" ref={motion}>
      <HomeHero />

      <div className="home-caption">
        <span>Fotografía · Naturaleza · Patrimonio</span>
        <span>
          JACS Destinos <span className="red">●</span>
        </span>
      </div>
      <div className="container">
        <HomeIntroduction />
        <SharedTerritories />

        <ExperienceOverview />
        <JourneyGallery />
        <div className="home-visual-links" aria-label="Galería y contacto de JACS">
          <Link to="/rutas#galeria" className="button button-outline">
            Miradas de Apurímac · Ver galería <MoveUpRight size={17} />
          </Link>
          <Link to="/consultora#contacto" className="text-link">
            Conversemos sobre tu proyecto <ArrowRight size={18} />
          </Link>
        </div>
        <PhotographyRoute />
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
            <ExperiencePhoto id="31" name="Puente colonial de Pachachaca" />
            <div>
              <span className="eyebrow red">Patrimonio que cuenta</span>
              <h3>
                La memoria también
                <br />
                se construye en piedra.
              </h3>
              <p>
                El puente de Pachachaca invita a mirar sus arcos, sus materiales y su relación con
                el río. Fotografiarlo es una oportunidad para leer el paisaje junto con su historia.
              </p>
              <p className="small muted">
                Conoce la lectura cultural de cada jornada y observa el patrimonio desde puntos de
                acceso autorizados.
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
              <Link to="/cultura#sabores" className="text-link">
                Conoce los sabores <ArrowRight size={16} />
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
