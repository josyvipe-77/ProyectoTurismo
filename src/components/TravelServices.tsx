import { photographyExperience as experience } from '../data/photography-experience';

export function TravelServices() {
  return (
    <section
      className="section travel-services"
      id="servicios-del-viaje"
      aria-labelledby="travel-services-heading"
    >
      <span className="eyebrow blue">Comidas y acompañamiento</span>
      <h2 id="travel-services-heading">Preparar cada jornada.</h2>
      <p>
        Cinco días y cuatro noches de estancia con base en Abancay. El alojamiento no está incluido:
        cada participante organiza y paga su hospedaje. Recepción el primer día a las 12:00 y cierre
        el quinto a las 17:30, sujetos a la logística acordada.
      </p>
      <dl className="product-services">
        {experience.services.map(([title, detail]) => (
          <div key={title}>
            <dt>{title}</dt>
            <dd>{detail}</dd>
          </div>
        ))}
      </dl>
      <div className="service-notes grid-two">
        <article>
          <h3>Comidas y descansos</h3>
          <p>
            Almuerzos de las cinco jornadas, desayunos de los días 2–5 y cenas de los días 1–4. Se
            coordinan como servicios del programa, independientes del hospedaje. Desayuno de llegada
            y cena del quinto día opcionales.
          </p>
          <p>
            Picnic previsto en Ampay y opción local o picnic en Pampachiri y los miradores.
            Coordinar agua, alergias, intolerancias y desayunos tempranos.
          </p>
        </article>
        <article id="exclusiones-del-viaje">
          <h3>Servicios excluidos</h3>
          <p>{experience.exclusions}</p>
          <p>
            Extensiones como Chichaqasa, Ccónoc o la ruta larga de Ampay requieren otro diseño.
            Confirmar disponibilidad, seguro, registro y permisos de actividades organizadas.
          </p>
        </article>
      </div>
    </section>
  );
}
