import { ArrowRight, Camera, Leaf, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { photographyExperience as experience } from '../data/photography-experience';
import { ExperienceOverview } from '../components/ExperienceOverview';
import { RespectNote, SectionHeading } from '../components/Editorial';

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
            debe contrastarse. El presupuesto orientativo del cliente es de{' '}
            {experience.clientBudget}; no es el precio del programa.
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
          Servicios, comidas y presupuesto de diseño <ArrowRight size={18} />
        </Link>
        <dl className="product-services">
          {experience.services.map(([title, text]) => (
            <div key={title}>
              <dt>{title}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
        <div className="product-price">
          <span>Precio por participante</span>
          <strong>{experience.price}</strong>
          <p>
            Se calculará con transporte, alimentación, guianza, actividades fotográficas, entradas y
            seguro. El alojamiento está excluido. Los 700–1.000 euros del perfil son presupuesto del
            cliente, no la tarifa.
          </p>
        </div>
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
      <section className="section" id="materiales">
        <SectionHeading
          label="Materiales de la experiencia"
          title="Imágenes que cuentan el viaje"
        />
        <div className="grid-three product-values">
          <article>
            <span>Carteles</span>
            <h3>La invitación a mirar</h3>
            <p>
              Dos folletos presentan la experiencia y las cinco jornadas. Los carteles promocionales
              se incorporarán con sus archivos finales.
            </p>
            <a className="text-link" href="/materiales/folletos-jacs-apurimac.pdf" download>
              Descargar los dos folletos <ArrowRight size={16} />
            </a>
          </article>
          <article>
            <span>Video</span>
            <h3>Un primer recorrido</h3>
            <p>
              Anuncio audiovisual pendiente de desarrollar. El episodio 3 del podcast tiene guion
              preparado y su audio está pendiente de generar y revisar.
            </p>
          </article>
          <article>
            <span>Galería del proyecto</span>
            <h3>Memorias compartidas</h3>
            <p>
              Instagram se contempla como canal divulgativo; falta incorporar su enlace. Una
              selección de fotografías con créditos y autorización. Las imágenes del catálogo
              mantienen su fuente; aún no hay aportaciones de viajeros.
            </p>
            <Link to="/rutas#catalogo-regional" className="text-link">
              Ver fotografías del catálogo <ArrowRight size={16} />
            </Link>
          </article>
        </div>
      </section>
      <RespectNote />
    </div>
  );
}
