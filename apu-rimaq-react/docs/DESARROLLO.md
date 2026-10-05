# Guía para el desarrollador

## Primera ejecución

1. Clona el repositorio privado y entra en `apu-rimaq-react`.
2. Instala Node.js 24.16.0, la versión de `.nvmrc`, y npm 11.13.0.
3. Ejecuta `npm ci`; conserva `package-lock.json` en los cambios de dependencias.
4. Copia `.env.example` a `.env.local`.
5. Ejecuta `npm run dev` y abre `http://localhost:5173`.

En PowerShell, la copia de configuración se realiza con:

```powershell
Copy-Item .env.example .env.local
```

En macOS/Linux:

```sh
cp .env.example .env.local
```

`VITE_MAPBOX_ACCESS_TOKEN` acepta un token público de Mapbox. Sin token, el mapa utiliza la imagen de respaldo de EOX. Las teselas y el relieve necesitan conexión a internet. Las fotos y fuentes del sitio están en el repositorio. No se necesitan cuenta de Stitch, Higgsfield, Python ni una base de datos para ejecutar el frontend.

## Estructura

| Carpeta / archivo                       | Responsabilidad                                      |
| --------------------------------------- | ---------------------------------------------------- |
| `src/pages`                             | Inicio, rutas, detalle Chanka, constructor y cultura |
| `src/components/ApurimacExplorer.tsx`   | Panel de destino, navegación y mapa                  |
| `src/components/RegionalRoutes.tsx`     | Circuitos, escalas y selección desde catálogo        |
| `src/components/DestinationGallery.tsx` | Carrusel y ampliación de fotos                       |
| `src/hooks`                             | Estado y carga de datos del frontend                 |
| `src/lib`                               | Presupuesto, validación y almacenamiento             |
| `src/data/apurimac-catalog.json`        | Inventario y fuentes de los recursos                 |
| `src/data/apurimac-routes.json`         | Quince propuestas y accesos publicados               |
| `src/data/destination-descriptions.ts`  | Texto breve del panel de destino                     |
| `src/data/atlas-imagery.ts`             | Selección de imágenes Mapbox / EOX                   |
| `public/images`                         | Fotografías e ilustraciones locales                  |
| `research`                              | Evidencia, importadores y generación del catálogo    |
| `tests`                                 | Lógica de rutas, constructor y almacenamiento        |

## Validar antes de abrir un PR

```sh
npm run lint
npm run test
npm run build
```

Revisa también escritorio y móvil. Para el mapa, comprueba selección, flechas, cambio de circuito, ampliación de foto y retorno del foco. Para el hero, comprueba una recarga completa y la preferencia de movimiento reducido. El estado de presupuesto y favoritos utiliza `localStorage`.

## Datos y recursos

Hay 135 referencias, 15 propuestas y 62 puntos referenciales utilizables. No deduzcas una carretera de la distancia geográfica. Los lugares sin coordenadas verificadas conservan una escala textual.

Para corregir un punto, documenta una fuente en `research/coordinate-overrides.json` y ejecuta:

```sh
python research/build_catalog.py
python research/build_report.py
```

Estos dos scripts usan la biblioteca estándar de Python. Los importadores de imágenes requieren Python y Pillow; no forman parte de la compilación. `research/prepare_mincetur_photos.py` descarga recursos de las fichas oficiales. `scripts/prepare_assets.py` depende de la exportación histórica de Stitch, y `scripts/prepare_destination_artwork.py` de maestros locales; ambos quedan fuera de la copia limpia.

## Pendientes funcionales

- ES/EN, consultas y reservas son demostrativos.
- Presupuestos e itinerarios son propuestas, no precios o disponibilidad confirmados.
- No hay backend, autenticación, sincronización ni cálculo vial.
- Qello Yaku y el mirador de Ccoya siguen sin pin contrastado.
- Los marcadores indican referencias del paisaje; no son accesos GPS verificados.
- Las imágenes ilustrativas no son reconstrucciones tridimensionales de los monumentos.

## Compilar y alojar

`npm run build` genera `dist`. Configura el servidor para devolver `index.html` cuando la ruta no corresponde a un archivo real; comprueba directamente `/rutas`, `/rutas/chanka`, `/construye` y `/cultura`. Los archivos reales de `images`, `maps` y `research` deben conservar sus respuestas normales y no devolver HTML si faltan.

El token `VITE_MAPBOX_ACCESS_TOKEN` debe definirse antes de compilar. Cambiar una variable en el servidor después de la compilación no cambia el frontend. Todo valor `VITE_` se puede ver desde el navegador.

La compilación conserva un aviso por el tamaño de MapLibre. No bloquea el build; evita añadir bibliotecas de mapa o animación sin comprobar su coste. Las fotos grandes se cargan al ampliar, no al iniciar el sitio.

## Trabajo compartido

Crea una rama por cambio, abre un PR y describe el comportamiento, las pruebas realizadas y cualquier cambio de coordenadas o procedencia. La integración continua compila sin el token personal de Mapbox. No modifica ni despliega el sitio.
