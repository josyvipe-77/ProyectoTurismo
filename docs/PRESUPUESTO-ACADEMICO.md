# Presupuesto de diseño

Los cálculos son herramientas de la consultora. El sitio público y la descarga TXT no presentan simulaciones de precio, cotizaciones introducidas, margen ni presupuesto supuesto del cliente.

La función `budgetEstimate` y sus pruebas se conservan en `src/data/photography-planning.ts`. Reparten transporte y guía entre participantes, añaden costos individuales y aplican los supuestos de contingencia y margen. Una cotización pendiente impide obtener un precio completo; no se reemplaza por cero.

Para obtener un escenario interno desde la raíz, con Node.js 24:

```sh
node --input-type=module -e "import { budgetEstimate, defaultTripPlanning } from './src/data/photography-planning.ts'; console.log(budgetEstimate(defaultTripPlanning, 8));"
```

Este ejemplo informa que faltan cotizaciones. Para una estimación interna, el equipo debe completar transporte y guía por grupo, comidas y seguro por persona, y documentar sus fuentes y fechas. El alojamiento está excluido.

Los importes previamente introducidos siguen en el navegador bajo la misma clave `jacs-destinos:photography:planning:v1`. El planificador conserva mes, miradores y variante de Ampay; retirar la interfaz de presupuesto no borra los registros ni modifica su validación.
