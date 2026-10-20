import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BuildCallout, Photo, RespectNote, SectionHeading } from '../components/Editorial';
import { CultureCalendar } from '../components/CultureCalendar';
import { ExperiencePhoto } from '../components/ExperiencePhoto';
import '../culture-content.css';

export default function CulturePage() {
  return (
    <div className="container page culture-page">
      <div className="page-intro">
        <span className="eyebrow blue">Cuaderno N.º 05 · Patrimonio y vida comunitaria</span>
        <h1>
          La cultura no está
          <br />
          en una vitrina.
          <br className="mobile-break" /> <em>Vive aquí.</em>
        </h1>
        <p>
          Los oficios, la cocina y las celebraciones ayudan a comprender el paisaje. Un cuaderno
          para acercarnos a sus protagonistas con curiosidad, fuentes y respeto.
        </p>
        <nav className="culture-contents" aria-label="En este cuaderno">
          <a href="#calendario">Celebraciones</a>
          <a href="#artesania">Textiles y oficios</a>
          <a href="#sabores">Sabores del territorio</a>
          <a href="#quechua">Escuchar y fotografiar</a>
        </nav>
      </div>
      <section className="section product-columns">
        <div>
          <span className="eyebrow blue">El patrimonio en nuestra experiencia</span>
          <h2>
            Leer el paisaje
            <br />
            <em>con su historia.</em>
          </h2>
        </div>
        <div>
          <p>
            Abancay y Tamburco abren el recorrido; Pachachaca conecta la fotografía del paisaje con
            el patrimonio construido. Las visitas proponen observar cómo la ciudad, los caminos y el
            puente se relacionan con su entorno.
          </p>
          <p>
            Aquí reunimos referencias del inventario turístico y del Ministerio de Cultura. Los
            oficios, sabores y celebraciones aportan contexto cultural; no añaden talleres ni
            visitas a fiestas al programa fotográfico.
          </p>
          <Link to="/construye#pachachaca" className="text-link">
            Ver la jornada de Pachachaca <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <section className="section" aria-labelledby="documentary-places-title">
        <SectionHeading label="Fotografías del territorio" title="Tres formas de leer el paisaje" />
        <p id="documentary-places-title" className="culture-section-intro">
          Un mirador, un puente y un bosque: lugares del programa que invitan a observar cómo se
          relacionan paisaje, patrimonio y conservación. Las imágenes proceden de sus fichas de
          inventario turístico.
        </p>
        <div className="documentary-strip">
          <ExperiencePhoto id="4678" name="Taraccasa · Ciudad y paisaje" />
          <ExperiencePhoto id="31" name="Pachachaca · Patrimonio construido" />
          <ExperiencePhoto id="577" name="Ampay · Conservación del territorio" />
        </div>
        <Link className="text-link" to="/construye">
          Lee el contexto cultural de las cinco jornadas <ArrowRight size={17} />
        </Link>
      </section>
      <CultureCalendar />
      <section className="section" id="artesania">
        <SectionHeading
          number="02"
          label="Textiles y oficios"
          title={
            <>
              La memoria
              <br />
              <em>entre los hilos.</em>
            </>
          }
        />
        <div className="culture-craft">
          <Photo
            name="telar"
            alt="Ilustración generada de un telar andino; no representa un taller identificado"
          />
          <div className="culture-craft-copy">
            <span className="eyebrow blue">Cotabambas · Un ejemplo documentado</span>
            <h3>Materiales, técnica y autoría.</h3>
            <p>
              El directorio Ruraq Maki del Ministerio de Cultura documenta a la Asociación de
              Artesanos Apu Killani, de Huamaniray, Cotabambas. Su trabajo textil emplea lana de
              ovino y fibra de camélido, con telar de cintura o qallwa y telar de pedal.
            </p>
            <p>
              Ante una pieza, pregunta quién la elaboró, qué fibra utiliza y cómo se hizo. Son
              preguntas para reconocer el oficio y a su autor, sin atribuir un mismo significado a
              todos los diseños.
            </p>
            <a
              className="text-link"
              href="https://ruraqmaki.pe/node/703"
              target="_blank"
              rel="noreferrer"
            >
              Fuente: Ruraq Maki · Ministerio de Cultura ↗
            </a>
            <div className="culture-craft-note">
              <h3>También se construye para celebrar.</h3>
              <p>
                Los altares de espejos son un arte efímero asociado a las procesiones del sur andino
                y documentado en Apurímac. Sus saberes de construcción y uso fueron reconocidos como
                Patrimonio Cultural de la Nación en 2014.
              </p>
              <a
                className="text-link"
                href="https://repositorio.cultura.gob.pe/backend/api/core/bitstreams/affb5eb0-bbe0-4c90-9548-90ebd869345c/content"
                target="_blank"
                rel="noreferrer"
              >
                Fuente: RVM 141-2014 · Ministerio de Cultura ↗
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="section" id="sabores">
        <SectionHeading
          number="03"
          label="Gastronomía y paisaje agrícola"
          title={
            <>
              El paisaje también
              <br />
              <em>se sienta a la mesa.</em>
            </>
          }
        />
        <div className="culture-food-grid">
          <article className="culture-food-card">
            <ExperiencePhoto id="8067" name="Tallarín de casa abanquino" />
            <div>
              <span className="eyebrow blue">Abancay · Cocina festiva</span>
              <h3>Tallarín de casa</h3>
              <p>
                Harina de trigo, huevos y mantequilla forman parte de esta preparación. La ficha
                turística describe su presencia en días festivos, acompañada de estofado de gallina,
                kapchi de chuño o rocoto relleno, entre otras combinaciones.
              </p>
              <p className="culture-photo-prompt">
                Para tu mirada: observa la textura, los ingredientes y la luz de la mesa. Pide
                permiso antes de fotografiar la preparación.
              </p>
            </div>
          </article>
          <article className="culture-food-card">
            <ExperiencePhoto id="3055" name="San Cristóbal · Paisaje de Curahuasi" />
            <div>
              <span className="eyebrow blue">Curahuasi · Paisaje y cultivo</span>
              <h3>El territorio del anís</h3>
              <p>
                La ficha del mirador de San Cristóbal sitúa las parcelas de anís en el paisaje del
                valle de Curahuasi. Este cultivo permite relacionar los sabores del territorio con
                la tierra y el trabajo agrícola que los hace posibles.
              </p>
              <p className="culture-photo-prompt">
                Para tu mirada: busca las formas de las parcelas desde los puntos de observación.
                Acuerda cualquier acceso a un cultivo con sus responsables.
              </p>
            </div>
          </article>
        </div>
      </section>
      <section className="section language-story" id="quechua">
        <span className="eyebrow blue">04 / Quechua y memoria oral</span>
        <h2>
          Una mirada empieza
          <br />
          <em>por escuchar.</em>
        </h2>
        <p>
          El quechua es una lengua viva. Escuchar a quienes lo hablan y preguntar por el contexto de
          sus palabras es parte de una fotografía respetuosa. La memoria oral pertenece a sus
          protagonistas: conversar, grabar y publicar requieren acuerdos propios.
        </p>
        <div className="language-principles">
          <div>
            <span>01</span>
            <strong>Escucha y pregunta.</strong>
            <p>
              Respeta la lengua y el ritmo que la persona elija. Pide que te expliquen el sentido
              antes de interpretar.
            </p>
          </div>
          <div>
            <span>02</span>
            <strong>Acuerda antes de grabar.</strong>
            <p>
              Explica para qué quieres la imagen o la voz y dónde se compartirá. Respeta una
              negativa.
            </p>
          </div>
          <div>
            <span>03</span>
            <strong>Conserva el contexto.</strong>
            <p>
              Atribuye con el nombre que la persona autorice y evita recortes que cambien lo que
              quiso contar.
            </p>
          </div>
        </div>
        <Link to="/experiencia#materiales" className="text-link">
          Presentación de JACS y materiales del viaje <ArrowRight size={17} />
        </Link>
      </section>
      <BuildCallout />
      <RespectNote />
    </div>
  );
}
