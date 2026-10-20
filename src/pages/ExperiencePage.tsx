import { ArrowRight, Camera, Leaf, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { photographyExperience as experience } from '../data/photography-experience';
import { ExperienceOverview } from '../components/ExperienceOverview';
import { RespectNote, SectionHeading } from '../components/Editorial';
import { ProjectMaterials } from '../components/ProjectMaterials';
import { JourneyInfographic } from '../components/JourneyInfographic';

export default function ExperiencePage() {
  return (
    <div className="container page experience-page">
      <div className="page-intro">
        <span className="eyebrow blue">JACS Destinos · La experiencia</span>
        <h1>
          Apurímac
          <br />
          <em>a través de tu objetivo.</em>
        </h1>
        <p>
          {experience.slogan} Un recorrido propuesto de cinco días entre paisajes, naturaleza y
          patrimonio, con tiempo para observar y fotografiar.
        </p>
      </div>
      <div className="product-summary">
        <span>
          <Camera /> Fotografía de paisaje
        </span>
        <span>
          <MapPin /> Abancay · 5 días
        </span>
        <span>
          <Users /> {experience.group}
        </span>
        <span>
          <Leaf /> Interpretación y cuidado del entorno
        </span>
      </div>
      <ExperienceOverview action="program" />
      <JourneyInfographic />
      <section className="section product-columns">
        <div>
          <span className="eyebrow blue">Para quién</span>
          <h2>
            Un viaje para
            <br />
            <em>mirar con atención.</em>
          </h2>
        </div>
        <div>
          <p>
            {experience.audience} También puede interesar a observadores de flora y fauna y viajeros
            culturales.
          </p>
          <p>
            El perfil de referencia es de 30–70 años, con interés en grupos reducidos y buena
            organización. Europa occidental, América y Japón son mercados exploratorios; la demanda
            debe contrastarse.
          </p>
          <p>
            Se informará del esfuerzo, altitud, accesos y equipo antes del viaje. En la recepción se
            prevé una encuesta para adaptar las rutas a las necesidades del grupo. La web está en
            español y se prevé su traducción. {experience.languages} Los profesionales y servicios
            requieren confirmación.
          </p>
        </div>
      </section>
      <section className="section">
        <SectionHeading
          label="Lo que distingue la propuesta"
          title="Fotografiar también es comprender."
        />
        <div className="grid-three product-values">
          <article>
            <span>01 / El ritmo</span>
            <h3>Tiempo para observar</h3>
            <p>
              Prácticas de composición, texturas y panorámicas en cinco jornadas con enfoques
              fotográficos diferentes.
            </p>
          </article>
          <article>
            <span>02 / El territorio</span>
            <h3>Paisaje y memoria</h3>
            <p>
              Relacionar naturaleza y geología con el puente de Pachachaca, los entornos urbanos y
              los saberes locales que puedan documentarse.
            </p>
          </article>
          <article>
            <span>03 / El encuentro</span>
            <h3>Grupos reducidos</h3>
            <p>
              Diseñar el acompañamiento para 6–12 personas y priorizar guías y alimentación locales.
              Taller fotográfico supervisado por profesionales previsto, con alcance por definir.
            </p>
          </article>
        </div>
      </section>
      <section className="section">
        <SectionHeading label="Servicios previstos en el diseño" title="Cómo se plantea el viaje" />
        <p className="product-section-lead">
          Estos servicios forman parte de la propuesta. Sus proveedores, disponibilidad y
          condiciones todavía deben confirmarse.
        </p>
        <Link to="/construye#servicios-del-viaje" className="text-link product-planning-link">
          Servicios, comidas y exclusiones <ArrowRight size={18} />
        </Link>
        <dl className="product-services">
          {experience.services.map(([title, text]) => (
            <div key={title}>
              <dt>{title}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="section product-columns">
        <div>
          <span className="eyebrow blue">Sostenibilidad y preparación</span>
          <h2>
            Cuidar lo que
            <br />
            <em>venimos a conocer.</em>
          </h2>
        </div>
        <div>
          <p>
            Recorrer senderos autorizados, llevar los residuos de regreso, observar la fauna a
            distancia y solicitar permiso para fotografiar personas. La participación local requiere
            coordinación y respeto por sus tiempos.
          </p>
          <p>
            Antes de operar el producto se comprobarán permisos, condiciones meteorológicas,
            dificultad, adaptación a la altitud y protocolos de asistencia. No se promete
            accesibilidad universal ni avistamientos de especies.
          </p>
          <Link to="/construye" className="text-link">
            Consulta las cinco jornadas <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <ProjectMaterials />
      <RespectNote />
    </div>
  );
}
