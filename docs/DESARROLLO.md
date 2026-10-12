# Guía de desarrollo

## Primera ejecución

1. Instala Node.js 24 y npm 11; `.nvmrc` fija la versión de Node.
2. Abre la carpeta principal y ejecuta `npm ci` para una instalación limpia.
3. Ejecuta `npm run dev` y abre http://localhost:5173.

No se requieren tokens ni variables de entorno. Python solo se utiliza para los scripts de investigación y exportación.

## Organización

| Carpeta o archivo                   | Responsabilidad                                                      |
| ----------------------------------- | -------------------------------------------------------------------- |
| `src/pages`                         | Inicio, experiencia, planificación, catálogo, cultura y consultora.  |
| `src/components`                    | Controles, mapas, galerías, contenido y diálogos compartidos.        |
| `src/hooks`                         | Estado del programa y lectura de datos anteriores del navegador.     |
| `src/data/photography-program.json` | Jornadas, horarios y referencias del programa.                       |
| `src/data/photography-planning.ts`  | Validación, servicios y estimaciones.                                |
| `src/data/photography-map.ts`       | Selección de destinos y miradores.                                   |
| `src/lib`                           | Almacenamiento, navegación y compatibilidad de cuadernos anteriores. |
| `public`                            | Recursos servidos por la web y metadatos de procedencia.             |
| `research`                          | Evidencia e importadores del catálogo y coordenadas.                 |
| `tests`                             | Pruebas de lógica y datos.                                           |

Las claves `apu-rimaq:plan:v1` y `apu-rimaq:favorites:v1` se conservan para leer los datos antiguos. El programa fotográfico utiliza su propio contexto y no sobrescribe los cuadernos previos.

## Verificar cambios

```sh
npm run lint
npm test
npm run format:check
npm run build
```

`npm test` incluye la comprobación del proveedor real de almacenamiento anterior. El formato se aplica con `npm run format`. Revisa también escritorio y móvil: elección de miradores, controles del planificador, descarga, galerías, navegación por teclado y enlaces a secciones.

## Recursos y datos

Mantén los archivos de procedencia y las fuentes de las coordenadas. Para modificar el inventario, revisa `research/coordinate-overrides.json`, `research/build_catalog.py` y `research/build_report.py`. Los importadores de fotografías requieren Python y Pillow; no se ejecutan al compilar el frontend.

Los puntos son referencias del paisaje o del atractivo, no accesos GPS garantizados. Los circuitos no calculan carreteras. Las imágenes satelitales son históricas; mapas y relieve dependen de sus proveedores externos.

## Alojamiento

`npm run build` genera `dist/`. El servidor debe devolver `index.html` para las rutas del cliente, incluyendo enlaces directos a `/experiencia`, `/construye`, `/rutas`, `/cultura` y `/consultora`. Los archivos reales de `images`, `maps`, `materiales` y `research` deben conservar sus respuestas normales.

El sitio incluye `noindex, nofollow`. Conserva esa política hasta que se decida publicar para buscadores. No hay backend, autenticación, reservas ni pagos. GitHub Actions valida el proyecto y no lo despliega.

## Trabajo compartido

Usa una rama por cambio y describe en el PR el comportamiento y la validación. No añadas `node_modules`, `dist`, `tmp`, `output`, `qa`, configuración local ni ZIP. Los recursos en `public/materiales` sí pertenecen al sitio.
