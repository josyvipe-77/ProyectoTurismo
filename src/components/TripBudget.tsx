import { groupScenarios, budgetEstimate, planningSources } from '../data/photography-planning';
import type { TripPlanning } from '../data/photography-planning';
import { usePhotographyRoute } from '../hooks/usePhotographyRoute';

const money = (value: number) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
const fields: {
  key: 'transport' | 'guide' | 'meals' | 'insurance' | 'other' | 'contingency' | 'margin';
  label: string;
  max: number;
  help: string;
}[] = [
  {
    key: 'transport',
    label: 'Transporte del grupo · Programa completo (S/)',
    max: 100000,
    help: 'Vehículo, conductor, combustible, pausas y gastos acordados.',
  },
  {
    key: 'guide',
    label: 'Guía y acompañamiento fotográfico del grupo (S/)',
    max: 100000,
    help: 'Cotización completa, incluidos los gastos del personal que corresponda.',
  },
  {
    key: 'meals',
    label: 'Alimentación por persona (S/)',
    max: 100000,
    help: 'Comidas del programa completo, incluidos los desayunos previstos; alojamiento excluido.',
  },
  {
    key: 'insurance',
    label: 'Seguro por persona (S/)',
    max: 100000,
    help: 'Cotizar la cobertura adecuada al recorrido.',
  },
  {
    key: 'other',
    label: 'Otros costos por persona (S/)',
    max: 100000,
    help: 'Permisos, material y servicios adicionales a presupuestar.',
  },
  {
    key: 'contingency',
    label: 'Reserva para imprevistos (%)',
    max: 30,
    help: 'Supuesto editable sobre el costo; propuesta inicial del 10%.',
  },
  {
    key: 'margin',
    label: 'Margen sobre el precio de venta (%)',
    max: 40,
    help: 'Supuesto editable del 15%; el precio se calcula dividiendo costo y reserva entre 1 menos el margen.',
  },
];
export function TripBudget() {
  const { planning, updatePlanning } = usePhotographyRoute();
  const scenarios = groupScenarios.map((count) => ({ count, ...budgetEstimate(planning, count) }));
  return (
    <section
      className="section trip-budget"
      id="presupuesto-del-viaje"
      aria-labelledby="budget-heading"
    >
      <span className="eyebrow blue">Presupuesto de diseño</span>
      <h2 id="budget-heading">Comparar costos antes de fijar el precio.</h2>
      <p>
        El alojamiento está excluido. Se calculan comidas, entradas, seguro y otros costos del
        recorrido base. Los costos de vehículo y guía se reparten según el tamaño del grupo.
        Completa las cotizaciones para simular un precio; el precio comercial sigue pendiente.
      </p>
      <div className="planning-fields">
        <label htmlFor="budget-admission">
          Categoría de entrada a Ampay
          <select
            id="budget-admission"
            value={planning.admission}
            onChange={(event) =>
              updatePlanning({ admission: event.target.value as TripPlanning['admission'] })
            }
          >
            <option value="national">Adulto nacional · S/11</option>
            <option value="general">Tarifa general · S/30</option>
            <option value="local">Adulto local acreditado · S/5</option>
          </select>
        </label>
      </div>
      <p className="budget-entry-note">
        Se añaden S/2 de Taraccasa y S/2 de Pampachiri. Paqpachaca, Pachachaca y los tres miradores
        publican ingreso libre. Confirmar tarifas, categoría y cualquier permiso adicional antes de
        operar.{' '}
        <a href={planningSources.ampay} target="_blank" rel="noreferrer">
          Tarifario de Ampay ↗
        </a>
      </p>
      <details className="budget-inputs">
        <summary>Completar cotizaciones y supuestos</summary>
        <div className="planning-fields">
          {fields.map((field) => (
            <label htmlFor={`cost-${field.key}`} key={field.key}>
              {field.label}
              <input
                id={`cost-${field.key}`}
                type="number"
                min="0"
                max={field.max}
                step="0.01"
                inputMode="decimal"
                value={planning[field.key] ?? ''}
                placeholder="Pendiente de cotización"
                onChange={(event) => {
                  const value = event.target.value === '' ? null : Number(event.target.value);
                  if (value !== null && (!Number.isFinite(value) || value < 0 || value > field.max))
                    return;
                  updatePlanning({
                    [field.key]:
                      value ?? (['other', 'contingency', 'margin'].includes(field.key) ? 0 : null),
                  });
                }}
              />
              <small>{field.help}</small>
            </label>
          ))}
        </div>
      </details>
      <div
        className="budget-table-wrap"
        tabIndex={0}
        role="region"
        aria-label="Comparación de costos para seis, ocho, diez y doce participantes"
      >
        <table className="budget-table">
          <caption>Escenarios por participante · Importes en soles</caption>
          <thead>
            <tr>
              <th scope="col">Grupo</th>
              <th scope="col">Entradas</th>
              <th scope="col">Subtotal conocido</th>
              <th scope="col">Precio simulado</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((scenario) => (
              <tr key={scenario.count}>
                <th scope="row">{scenario.count} personas</th>
                <td>{money(scenario.admission)}</td>
                <td>{money(scenario.cost)}</td>
                <td>
                  {scenario.estimate === null ? 'Faltan cotizaciones' : money(scenario.estimate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="budget-result-note" role="status">
        {scenarios[0].complete
          ? 'Simulación con las referencias publicadas y los importes introducidos. No constituye una oferta ni acredita disponibilidad.'
          : 'Transporte, guía, alimentación y seguro deben completarse. El subtotal muestra solo los costos conocidos; no es el precio del viaje.'}
      </p>
      <p className="small muted">
        Cada participante organiza y paga su hospedaje. Las extensiones se cotizan aparte. La
        descarga del programa incluye estos mismos ajustes y exclusiones.
      </p>
    </section>
  );
}
