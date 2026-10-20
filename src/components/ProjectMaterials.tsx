import { Download, Camera } from 'lucide-react';
import { projectMaterials as materials } from '../data/project-materials';
import { SectionHeading } from './Editorial';

export function ProjectMaterials() {
  return (
    <section className="section project-materials" id="materiales">
      <SectionHeading label="Materiales de la experiencia" title="Una invitación a mirar" />
      <div className="materials-downloads grid-three">
        <article>
          <span className="eyebrow blue">El recorrido</span>
          <h3>Programa base</h3>
          <p>
            Las cinco jornadas, el mapa y la información para preparar el viaje. Esta ficha general
            es independiente de las elecciones del planificador.
          </p>
          <a className="text-link" href={materials.programPdf} download>
            <Download size={16} /> Descargar programa · PDF
          </a>
        </article>
        <article>
          <span className="eyebrow blue">La invitación</span>
          <h3>Dos folletos</h3>
          <p>
            Una presentación visual de «Apurímac a través de tu objetivo» y de sus cinco jornadas.
          </p>
          <a className="text-link" href="/materiales/folletos-jacs-apurimac.pdf" download>
            <Download size={16} /> Descargar folletos · PDF
          </a>
        </article>
        <article>
          <span className="eyebrow blue">Nuestro cuaderno visual</span>
          <h3>@jacsdestinos</h3>
          <p>Conoce las publicaciones de JACS Destinos y acompaña el proyecto en Instagram.</p>
          <a className="text-link" href={materials.instagram} target="_blank" rel="noreferrer">
            <Camera size={17} /> Abrir Instagram ↗
          </a>
        </article>
      </div>
      <div className="project-film">
        <div className="project-film-copy">
          <span className="eyebrow blue">40 segundos · Fotografía y patrimonio</span>
          <h3>Un primer recorrido</h3>
          <p>
            Una selección de imágenes reales de los lugares del programa. El viaje empieza por
            observar.
          </p>
          <p className="small muted">
            {materials.video.narration
              ? 'Narración sintética en español. Guion editorial de JACS Destinos.'
              : 'Pieza visual subtitulada, sin narración.'}{' '}
            Propuesta académica; accesos y servicios por coordinar.
          </p>
          <a className="text-link" href={materials.video.src} download>
            <Download size={16} /> Descargar vídeo · MP4
          </a>
        </div>
        <video
          controls
          playsInline
          preload="none"
          poster={materials.video.poster}
          aria-label="Presentación visual de Apurímac a través de tu objetivo"
        >
          <source src={materials.video.src} type="video/mp4" />
          <track kind="captions" src={materials.video.captions} srcLang="es" label="Español" />
          Tu navegador no puede reproducir este vídeo. Utiliza el enlace de descarga.
        </video>
      </div>
      <details className="material-transcript">
        <summary>Guion y créditos del vídeo</summary>
        <p>{materials.video.script}</p>
        <p className="small muted">{materials.photoCredits}</p>
        <ul>
          {['4678', '8264', '31', '577', '3055'].map((id) => (
            <li key={id}>
              <a
                href={`https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=${id}`}
                target="_blank"
                rel="noreferrer"
              >
                Ficha MINCETUR {id} ↗
              </a>
            </li>
          ))}
        </ul>
      </details>
      {materials.audio.src ? (
        <div className="project-audio">
          <span className="eyebrow blue">Presentación sonora</span>
          <h3>{materials.audio.title}</h3>
          <p>Narración sintética en español · Guion editorial de JACS Destinos.</p>
          <audio
            controls
            preload="none"
            aria-label={materials.audio.title}
            src={materials.audio.src}
          />
          <a className="text-link" href={materials.audio.src} download>
            <Download size={16} /> Descargar presentación · MP3
          </a>
          <details className="material-transcript">
            <summary>Leer la transcripción</summary>
            <p>{materials.audio.script}</p>
            <a className="text-link" href="/materiales/guiones-jacs-destinos.txt" download>
              Descargar los guiones <Download size={16} />
            </a>
          </details>
        </div>
      ) : (
        <details className="material-transcript">
          <summary>Leer la presentación de JACS Destinos</summary>
          <p>{materials.audio.script}</p>
          <a className="text-link" href="/materiales/guiones-jacs-destinos.txt" download>
            Descargar los guiones <Download size={16} />
          </a>
        </details>
      )}
    </section>
  );
}
