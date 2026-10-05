import { Bus, BedDouble, Utensils, Mountain } from 'lucide-react';
export function PracticalInfo() {
  return (
    <div className="practical-grid">
      <article>
        <Bus size={25} />
        <h3>Traslados</h3>
        <p>
          Coordina vehículos y puntos de encuentro localmente. El mapa muestra escalas; no calcula
          distancias ni tiempos reales.
        </p>
      </article>
      <article>
        <Utensils size={25} />
        <h3>Experiencias culturales</h3>
        <p>
          Visitas, comidas o talleres propuestos están sujetos a autorización y disponibilidad de
          sus anfitriones.
        </p>
      </article>
      <article>
        <BedDouble size={25} />
        <h3>Alojamiento</h3>
        <p>
          El presupuesto contempla una referencia por jornada. No hay establecimientos asociados ni
          disponibilidad consultada.
        </p>
      </article>
      <article>
        <Mountain size={25} />
        <h3>Viajar a tu ritmo</h3>
        <p>
          Confirma el acceso, el clima y la dificultad con fuentes locales. Deja margen para
          descansar y adaptar el recorrido.
        </p>
      </article>
    </div>
  );
}
