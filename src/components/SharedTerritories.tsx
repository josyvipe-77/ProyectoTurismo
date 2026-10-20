import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SharedTerritories() {
  return (
    <section className="shared-territories" aria-labelledby="shared-territories-title">
      <div>
        <span className="eyebrow blue">JACS Destinos · COIL USC–UNAMBA</span>
        <h2 id="shared-territories-title">
          Dos territorios,
          <br />
          <em>una mirada compartida.</em>
        </h2>
        <p>
          Desde Apurímac y Galicia, un equipo universitario reúne perspectivas para diseñar una
          experiencia fotográfica que conecte paisaje, patrimonio y respeto por quienes habitan el
          territorio.
        </p>
        <Link to="/consultora" className="text-link">
          Conoce al equipo y nuestro enfoque <ArrowRight size={17} />
        </Link>
      </div>
      <div className="territory-pair">
        <div>
          <span>01 / Perú</span>
          <h3>Apurímac</h3>
          <p>El territorio de nuestra propuesta: cinco jornadas para observar y comprender.</p>
          <small>UNAMBA · Abancay</small>
        </div>
        <div>
          <span>02 / España</span>
          <h3>Galicia</h3>
          <p>
            La otra orilla del equipo: una perspectiva compartida sobre el diseño de la experiencia.
          </p>
          <small>USC · Santiago de Compostela</small>
        </div>
      </div>
    </section>
  );
}
