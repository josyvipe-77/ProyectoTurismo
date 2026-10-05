import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInfo } from '../hooks/useInfo';
const currentYear = new Date().getFullYear();

export function Footer() {
  const openInfo = useInfo();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="brand">
            Apu Rimaq<span className="brand-dot">•</span>
          </Link>
          <p>
            Apurímac no se visita,
            <br />
            <em>se escucha.</em>
          </p>
        </div>
        <div>
          <span className="eyebrow">Abre tu cuaderno</span>
          <Link to="/rutas">
            Explora las rutas <ArrowUpRight size={15} />
          </Link>
          <Link to="/cultura">
            Cultura viva <ArrowUpRight size={15} />
          </Link>
          <Link to="/construye">
            Construye tu ruta <ArrowUpRight size={15} />
          </Link>
        </div>
        <div>
          <span className="eyebrow">El compromiso</span>
          <button
            onClick={() =>
              openInfo({
                title: 'Un territorio vivo merece cuidado.',
                body: (
                  <p>
                    Respeta las indicaciones locales, pide autorización para fotografiar personas o
                    participar en actividades y cuida los sitios naturales y arqueológicos. Cada
                    visita debe coordinarse con sus anfitriones.
                  </p>
                ),
              })
            }
          >
            Viaja con respeto <ArrowUpRight size={15} />
          </button>
          <button
            onClick={() =>
              openInfo({
                title: 'Acerca de este prototipo',
                body: (
                  <>
                    <p>
                      Aplicación React basada en el último cuaderno PamPam de Apu Rimaq en Google
                      Stitch. El hero utiliza la imagen aportada y las demás imágenes son generadas
                      y referenciales; no documentan ubicaciones ni personas verificadas.
                    </p>
                    <p>
                      Los itinerarios, costos y tiempos son ejemplos. No hay reservas, pagos, envío
                      de consultas ni cálculo geográfico real. Los favoritos y tu ruta se guardan
                      únicamente en este navegador.
                    </p>
                    <a
                      href="https://stitch.withgoogle.com/projects/14997431346823630038"
                      target="_blank"
                      rel="noreferrer"
                      className="text-link"
                    >
                      Ver proyecto de Stitch <ArrowUpRight size={16} />
                    </a>
                  </>
                ),
              })
            }
          >
            Acerca del cuaderno <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {currentYear} Apu Rimaq · Prototipo de exploración</span>
        <span>Imágenes referenciales · Precios de muestra en soles</span>
      </div>
    </footer>
  );
}
