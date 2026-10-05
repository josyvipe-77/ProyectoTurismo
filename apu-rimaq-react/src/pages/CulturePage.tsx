import { ArrowRight, Headphones, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BuildCallout, Photo, RespectNote, SectionHeading } from '../components/Editorial';
import { CultureCalendar } from '../components/CultureCalendar';
export default function CulturePage() {
  return (
    <div className="container page">
      <div className="page-intro">
        <span className="eyebrow blue">Cuaderno N.º 05 · Patrimonio y vida comunitaria</span>
        <h1>
          La cultura no está
          <br />
          en una vitrina.
          <br className="mobile-break" /> <em>Vive aquí.</em>
        </h1>
        <p>
          La memoria oral, los oficios y las celebraciones dan ritmo al territorio. Acércate con
          curiosidad y deja que cada encuentro tenga su propio tiempo.
        </p>
      </div>
      <section className="culture-feature culture-opening">
        <Photo
          name="telar"
          alt="Representación generada de un telar andino y manos artesanas"
          eager
        />
        <div>
          <span className="eyebrow red">Crónica de taller</span>
          <h2>
            La memoria
            <br />
            <em>entre los hilos.</em>
          </h2>
          <p>
            Mirar un telar invita a detenerse en los detalles. Un hilo, un color o un gesto pueden
            abrir una conversación sobre el oficio y su lugar en la comunidad.
          </p>
          <div className="field-note">
            Enfoque editorial de visita: las historias de artesanos y los talleres se incorporarán
            con autorización y validación local.
          </div>
          <Link to="/construye" className="text-link">
            Dale espacio en tu viaje <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <CultureCalendar />
      <section className="section">
        <SectionHeading
          number="02"
          label="Artesanía y oficios"
          title={
            <>
              La belleza de hacer
              <br />
              <em>con las manos.</em>
            </>
          }
        />
        <div className="grid-three">
          {[
            {
              name: 'telar',
              label: 'Hilo y memoria',
              title: 'El gesto del telar',
              text: 'Observar, escuchar y conocer los materiales antes de hablar de una pieza.',
            },
            {
              name: 'ceramica',
              label: 'Tierra y forma',
              title: 'La pausa del barro',
              text: 'Una propuesta para acercarse al proceso y a las personas detrás del oficio.',
            },
            {
              name: 'madera',
              label: 'Tiempo y detalle',
              title: 'Oficios por descubrir',
              text: 'Los talleres y sus historias están pendientes de documentación y validación local.',
            },
          ].map((item) => (
            <article className="story-card" key={item.name}>
              <Photo name={item.name} alt={`Imagen generada referencial para ${item.title}`} />
              <div className="story-content">
                <span className="eyebrow blue">{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section food-story" id="sabores">
        <Photo name="horno" alt="Horno de barro y panes representados con una imagen generada" />
        <div>
          <Sprout size={30} strokeWidth={1.4} />
          <span className="eyebrow blue">03 / Gastronomía</span>
          <h2>
            El paisaje también
            <br />
            <em>se sienta a la mesa.</em>
          </h2>
          <p>
            El anís de Curahuasi es una puerta de entrada a los sabores del valle. La conversación
            puede continuar alrededor del horno o de una preparación compartida.
          </p>
          <p>
            Las experiencias gastronómicas de este cuaderno son propuestas por coordinar, sin
            cocineras ni establecimientos asociados todavía.
          </p>
          <Link to="/construye" className="button button-outline">
            Viajar con los sentidos <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <section className="sound-story">
        <div>
          <span className="eyebrow">04 / Memoria oral</span>
          <h2>
            Antes de contar,
            <br />
            <em>escuchar.</em>
          </h2>
          <p>
            Un espacio para historias y paisajes sonoros compartidos por sus protagonistas, con
            permiso y contexto.
          </p>
          <div className="sound-placeholder">
            <Headphones size={25} />
            <div>
              <strong>Archivo sonoro por construir</strong>
              <span>No hay grabaciones disponibles en este prototipo.</span>
            </div>
          </div>
        </div>
        <Photo
          name="musica"
          alt="Representación generada de un músico en un paisaje andino; no corresponde a un perfil real"
        />
      </section>
      <section className="section language-story" id="quechua">
        <span className="eyebrow blue">05 / Una introducción al quechua</span>
        <h2>
          Una lengua es una forma
          <br />
          <em>de habitar el mundo.</em>
        </h2>
        <p>
          El quechua es una lengua viva con variedades regionales. Aprender empieza por escuchar a
          quienes la hablan y reconocer su contexto.
        </p>
        <div className="language-principles">
          <div>
            <span>01</span>
            <strong>Escucha con atención.</strong>
            <p>Deja que tus anfitriones marquen el ritmo de la conversación.</p>
          </div>
          <div>
            <span>02</span>
            <strong>Pregunta con respeto.</strong>
            <p>Una palabra necesita pronunciación, contexto y significado.</p>
          </div>
          <div>
            <span>03</span>
            <strong>Aprende con voces locales.</strong>
            <p>El futuro glosario se elaborará con hablantes y revisión lingüística.</p>
          </div>
        </div>
        <p className="small muted">No se incluyen traducciones ni audios sin validar.</p>
      </section>
      <BuildCallout />
      <RespectNote />
    </div>
  );
}
