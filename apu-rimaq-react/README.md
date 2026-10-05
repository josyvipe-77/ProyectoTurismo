# Apu Rimaq · React

Aplicación React + TypeScript + Vite basada en las últimas cinco pantallas de escritorio y móvil del proyecto de Google Stitch. Mantiene el hero cinematográfico aprobado y aplica el cuaderno editorial PamPam al contenido restante.

[Proyecto de Stitch](https://stitch.withgoogle.com/projects/14997431346823630038)

## Ejecutar

Probado con Node.js 24.16.0 y npm 11.13.0. Se recomienda Node 24 para ejecutar también las pruebas TypeScript con el runner nativo.

```powershell
cd apu-rimaq-react
npm ci
npm run dev -- --host 127.0.0.1 --port 5173
```

Abre [la aplicación local](http://127.0.0.1:5173/). Consulta [la guía de desarrollo](docs/DESARROLLO.md) y [la publicación del repositorio privado](docs/REPOSITORIO-PRIVADO.md).

```powershell
npm run build
npm run preview -- --host 127.0.0.1
npm run lint
npm run test
npm run format
```

La compilación se genera en `dist/`. Un futuro alojamiento debe devolver `index.html` para las rutas del cliente. Esta entrega no publica el sitio.

## Páginas y funciones

| Ruta | Contenido y controles |
| --- | --- |
| `/` | Hero, introducción, rutas, mapa, cultura, sabores, voces locales pendientes, festividades y llamada al constructor. |
| `/rutas` | Filtros combinables por interés, duración y dificultad; favoritos y estado sin resultados. |
| `/rutas/chanka` | Ejemplo de cuatro días, itinerario desplegable, mapa, preparación, presupuesto y consulta demostrativa. |
| `/construye` | Días, destinos e intereses; validación; resultado; guardado, recuperación, eliminación y descarga TXT. |
| `/cultura` | Calendario filtrable, oficios, sabores, memoria oral pendiente e introducción al quechua. |

El recorrido Inicio → Rutas → Detalle → Constructor → Resultado está conectado mediante React Router. La navegación móvil incluye menú y barra inferior con etiquetas. Los enlaces a calendario, sabores y quechua desplazan a sus secciones.

Los favoritos y un único cuaderno guardado persisten en `localStorage`, con claves versionadas y validación de datos. Si el almacenamiento está bloqueado, la aplicación continúa durante la sesión y muestra un aviso. No hay cuenta ni sincronización entre dispositivos.

El presupuesto del constructor usa una referencia visible de S/ 170 por persona y jornada. Cuatro días equivalen a S/ 680. El orden de destinos sigue la selección; las jornadas sobrantes permanecen en la última escala. No es un algoritmo de planificación geográfica.

## Diseño y archivos

- `src/pages/`: páginas React reales, sin iframes ni inyección de los HTML exportados.
- `src/components/`: navegación, tarjetas, mapas, secciones editoriales, presupuesto, resultado y diálogos.
- `src/hooks/`: preferencias y estado del constructor.
- `src/lib/`: validación, presupuesto y acceso seguro al almacenamiento.
- `src/data.ts`: propuestas editoriales y referencias del calendario.
- `src/index.css`: sistema visual, distribución adaptable y movimiento reducido.
- `public/images/`: imágenes WebP locales; `provenance.json` registra la procedencia.
- `tests/`: pruebas de la lógica del constructor y almacenamiento.
- `qa/`: capturas de escritorio y móvil e informe de revisión.

Fuentes Newsreader y Public Sans servidas localmente mediante Fontsource. Sus licencias OFL se incluyen en `public/`. El hero usa la imagen PNG aportada por el usuario, preservada sin modificar. Las demás fotografías provienen de la exportación anterior de Stitch y se identifican como generadas y referenciales, sin atribuirles una ubicación o identidad real verificada. Las nubes de la apertura proceden de un SVG procedural decorativo local; la animación utiliza su versión WebP transparente precalculada. El script `scripts/prepare_assets.py` permite reproducir la conversión de las fotografías desde la carpeta hermana `stitch-export`, con Python y Pillow; no es necesario para ejecutar la aplicación.

## Ilustraciones de destinos · 2026-10-04

Pacucha, Sóndor, Saywite, Pampachiri, Ampay y Cconoc disponen de dioramas transparentes con apariencia 3D. Son imágenes interpretativas generadas con IA, identificadas como tales en la interfaz. Se crearon con el generador integrado; no se copiaron fotografías de DIRCETUR.

El mapa muestra únicamente la ilustración del destino seleccionado, anclada encima del pin mediante una flecha. Sigue sus coordenadas al desplazar, ampliar o inclinar el mapa. Las fichas del inventario y los itinerarios utilizan miniaturas con carga diferida. Cada destino tiene versiones WebP de 320 y 640 px: 22–35 KB y 75–132 KB respectivamente. La colección completa suma 700.3 KB, sin añadir dependencias JavaScript. Se sirve desde archivos locales y no requiere generar imágenes ni ejecutar modelos 3D en el servidor.

Los prompts y la documentación están en `research/illustrations/`; la procedencia y los tamaños exactos, en `public/images/destinations/provenance.json`. Los originales PNG se conservan localmente para futuras ediciones y se excluyen del ZIP de entrega. La animación de entrada respeta la preferencia de movimiento reducido.

## Galerías de las fichas MINCETUR

El panel del destino está a la derecha del mapa en escritorio y debajo en móvil. Incluye carrusel manual, selector de foto, contador y ampliación en una ventana con navegación por flechas, cierre con Escape y retorno del foco al control de apertura. No cambia las paradas del mapa al usar las flechas dentro de la galería. El panel derecho permite desplazarse para leer toda la ficha.

Se importaron 294 fotografías, hasta seis por ficha, de 54 recursos del mapa que tienen ficha y galería pública de MINCETUR. Se enlaza la ficha exacta de procedencia; no se atribuye autoría individual a MINCETUR ni se declara una licencia no comprobada. No se generaron fotografías de reemplazo. Si no se dispone de una galería local o falla su carga, se ofrece la ficha del destino.

Se sirven como WebP locales: miniaturas de hasta 480 px y ampliaciones de hasta 1400 px, sin aumentar la resolución de los originales pequeños. Los JSON de cada galería se descargan al seleccionar el destino; solo se carga la miniatura actual y la versión grande al ampliar. La biblioteca completa ocupa 79.6 MB de archivos, pero no se descarga completa al abrir la página. No se añade una dependencia para carruseles ni una API.

Procedencia y URLs originales: `public/images/mincetur/provenance.json`. Importación reproducible: `research/prepare_mincetur_photos.py`, con Python y Pillow, y revisión de integridad: `research/audit_mincetur_photos.py`. La importación conserva únicamente enlaces de fotos y metadatos de procedencia, no el HTML con datos personales de las fichas.

## Alcance del prototipo

Son demostrativos el selector ES/EN, las consultas y las propuestas de experiencias. No se envían consultas de reserva ni existen reservas, pagos, APIs propias, base de datos, disponibilidad, audio real o cálculo de rutas geográficas. El nuevo explorador consume cartografía y elevación públicas de solo lectura. Los detalles de las dos rutas secundarias están pendientes; sus botones explican este estado. Los perfiles y testimonios de protagonistas se incorporarán con autorización, sin inventar personas reales.

Precios, itinerarios, acceso, dificultad, altitudes y traslados requieren confirmación local. Los diagramas de los itinerarios siguen siendo esquemáticos. El explorador regional usa cartografía y relieve reales, con límites y puntos referenciales; ninguna de estas vistas sirve para navegar. El calendario no integra una agenda oficial del año en curso.

## Referencias culturales y geográficas

Se conservaron las referencias documentadas en la exportación anterior. Cocharcas y Curahuasi se contrastaron nuevamente con fuentes institucionales durante la implementación; estas fuentes respaldan los datos generales, no una agenda o disponibilidad actual.

- [MINCETUR: Laguna de Pacucha](https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=1316).
- [MINCETUR: Complejo arqueológico de Sóndor](https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=578).
- [Ministerio de Cultura: Cocharcas y el día central del 8 de septiembre](https://www.gob.pe/institucion/cultura/noticias/46475-ministerio-de-cultura-reinicia-restauracion-del-templo-de-cocharcas-en-apurimac).
- [Municipalidad Provincial de Abancay: Curahuasi y el anís](https://www.gob.pe/institucion/muniabancay/noticias/1328911-curahuasi-169-aniversario-02-de-enero).

## Validación de la entrega

Compilación de producción, TypeScript estricto, lint y seis pruebas de lógica aprobados. Revisión del navegador a 1440 × 900 y 390 × 844 en las cinco páginas, sin desbordamientos horizontales ni imágenes rotas. Se comprobaron navegación, filtros, favoritos, guardado y recuperación tras recargar, calendario, diálogo con Escape, enlaces a secciones, resultado móvil de ocho escalas y descarga del cuaderno.

La revisión es funcional y visual; no se afirma una certificación de accesibilidad ni cobertura de todos los navegadores.

## Ajuste del hero · Desenfoque Mercury

Se añadió un desenfoque periférico gradual inspirado en Mercury: centro del paisaje más definido, bordes suavizados con una máscara radial y una segunda capa de la misma imagen. Intensidad de 10 px en escritorio y 7 px en móvil, controlada por `--hero-edge-blur` en `src/index.css`. El texto, la navegación y los botones permanecen nítidos. Verificado a 1440 × 900 y 390 × 844, sin desbordamiento y con compilación de producción aprobada.

## Transición al deslizar · Mercury / Higgsfield

Se consultó el complemento de Higgsfield y sus referencias de scroll cinematográfico. La adaptación se implementa en el React existente con la imagen aprobada: parallax y zoom leve del paisaje, desvanecimiento del relato y mezcla gradual con el papel de la siguiente sección. Las secciones editoriales entran con un desplazamiento corto. No se generaron vídeos ni se creó otro sitio alojado.

`src/hooks/useHomeMotion.ts` actualiza variables CSS mediante `requestAnimationFrame`, sin renderizar React en cada frame ni interceptar el scroll. El hero conserva `100svh`, sin franjas en la vista inicial. Subir restablece la transición; `prefers-reduced-motion` desactiva el movimiento, incluso si cambia durante la sesión. Los botones conservan su opacidad y la animación no oculta ni condiciona el contenido. Los listeners y observadores se eliminan al cambiar de página.

## Apertura inicial con nubes

`useHeroIntro` coordina la apertura y `CloudIntro` dibuja tres capas de vapor que se separan y disuelven en 4,2 segundos. El HTML incluye un preloader minimalista desde antes de cargar React: fondo carbón neutro `#252525`, emblema vectorial de montañas en marfil, sol dorado, bruma animada, marca Apu Rimaq, línea de carga indeterminada y etiqueta «Abriendo el cuaderno». El SVG está incluido en el documento y no requiere descargar imágenes ni fuentes externas para mostrarse. La imagen y la textura del hero se precargan; la apertura espera su decodificación y las fuentes, con un límite de espera de 6 segundos para conexiones lentas. El paisaje mantiene una transición de opacidad independiente si su descarga tarda más.

La entrada se prepara durante dos frames antes de cambiar de estado, incluso con los recursos en caché. En la fase `revealing`, el preloader y el paisaje se funden durante 1,6 segundos y las nubes empiezan a moverse de inmediato. Un segundo después empieza `opening`, que añade la entrada escalonada de los textos; las nubes conservan la misma animación, sin reiniciarla al cambiar de fase. Su dispersión usa velocidad lineal y la textura WebP transparente de 1400 × 800 evita calcular filtros SVG durante el movimiento. La marca del preloader se desvanece durante 650 ms; su cortina se retira mediante `transitionend`, con un temporizador de respaldo. Etiqueta, título, descripción, botones y notas aparecen con opacidad gradual y desplazamiento de 12 px. Las nubes solo pierden opacidad, sin el aumento inicial que producía un destello. El indicador no representa un porcentaje ficticio; la capa no bloquea el scroll o la interacción. Su estado se comunica mediante `role="status"`, y las animaciones de la línea, el sol y la bruma se desactivan con movimiento reducido.

Se omite al entrar mediante un enlace a una sección o con movimiento reducido. Un clic, toque, tecla o scroll disuelve las nubes en 1,1 segundos, manteniendo su movimiento para evitar que reaparezcan de golpe al cancelar la apertura. El foco de teclado hace visibles las acciones. No se repite al volver a Inicio por la navegación interna; recargar permite verla de nuevo. Los temporizadores y listeners se limpian al desmontar el componente.

Se intentó generar una textura transparente con Higgsfield (`gpt_image_2_5`, coste estimado 1,5 créditos), pero el servicio rechazó la solicitud con «Requires basic plan or higher». No se creó un job ni un recurso generado. La versión entregada utiliza `public/images/cloud-wisp.webp`, derivado del SVG local conservado como fuente, y animación CSS locales; estos archivos no proceden de Higgsfield.

El 4 de octubre de 2026 se volvió a consultar Higgsfield para generar el emblema del preloader: estimación de 1,5 créditos y rechazo por el mismo requisito de plan. El emblema entregado es SVG/CSS local en `index.html`, no un recurso generado por Higgsfield. Sus montañas son una ilustración decorativa, sin atribución a un paisaje específico.


## Explorador de Apurímac por clics · 4 de octubre de 2026

Adaptación del concepto de capítulos de [Mapbox Storytelling](https://github.com/mapbox/storytelling) al React existente, con MapLibre GL JS 6.12, OpenFreeMap y elevación Mapterhorn. No necesita un token de Mapbox. Se integra en Inicio y Rutas, en `#explora-apurimac`. Se preservan el hero, el preloader y las nubes.

Seis paradas: Santuario Nacional de Ampay, laguna de Pacucha, complejo arqueológico de Sóndor, sitio arqueológico de Saywite, bosque de piedras de Pampachiri y baños termales de Cconoc. Cada ficha enlaza al inventario de MINCETUR. La cámara sigue clics en las etiquetas o los marcadores, botones anterior/siguiente bajo el relato y flechas en los laterales del mapa. Las teclas izquierda/derecha funcionan al enfocar los controles del explorador. El recorrido es circular. El scroll desplaza la página y no cambia el capítulo.

La vista general muestra el contorno de Apurímac; una máscara opaca cubre las regiones vecinas. La cámara tiene un margen exterior para encuadrar el contorno completo. Al seleccionar un lugar, el mapa se acerca e inclina 48 grados. Vista 2D/3D, zoom, orientación al norte y retorno a la región completa son controles funcionales. El relieve usa exageración 1,1; las pequeñas columnas coloreadas son señales de ubicación, **no modelos de edificios o reconstrucciones de monumentos**. No se generan rutas de traslado entre los puntos.

El motor y su worker se cargan en un módulo separado cuando la sección se aproxima al viewport. La rueda no captura el scroll; en pantallas táctiles el mapa usa gestos cooperativos. Las transiciones duran 1,4 s y se omiten con movimiento reducido. La instancia, los marcadores, los temporizadores y los observadores se limpian al cambiar de página. Si la cartografía falla, queda un mapa SVG 2D del mismo límite con destinos y flechas funcionales y opción de reintentar. El relieve en línea requiere conexión a sus proveedores.

Procedencia detallada: `public/maps/provenance.json`, fuentes individuales en `src/data/apurimac-places.ts`, límite en `public/maps/apurimac.geojson` y copia local en `src/data/apurimac-boundary.json`. La geometría es geoBoundaries gbOpen PER ADM1, dominio público, límite representado en 2008: es referencial y no catastral. Las coordenadas de enfoque son aproximadas: Ampay corresponde al centro del área protegida, Cconoc a la localidad asociada y Saywite al GPS de una fotografía del conjunto; las demás proceden de elementos de OpenStreetMap del atractivo. No representan entradas o puntos de acceso garantizados. Choquequirao no se incluye porque el sitio está en Cusco.

Las atribuciones de OpenFreeMap, OpenMapTiles, OpenStreetMap y Mapterhorn aparecen en el mapa. La licencia BSD del proyecto de referencia se conserva en `public/licenses/mapbox-storytelling.txt`. El constructor de itinerarios y los presupuestos continúan siendo demostrativos.


## Apariencia satelital en color · 4 de octubre de 2026

El explorador abre ahora en vista satelital sobre el relieve 3D. El control «Satélite / Mapa» alterna la apariencia sin reinicializar el motor ni desplazar la cámara. La imagen proviene del mosaico histórico EOxCloudless Sentinel-2 de 2016–2017, mediante EOX::Maps (CC BY 4.0, capa `s2cloudless_3857`). Se mantiene la cartografía OpenFreeMap para las etiquetas y la vista ilustrada, y Mapterhorn para la elevación. La atribución completa aparece en el mapa; detalles y enlaces en `public/maps/provenance.json`. Las capas modernas 2018–2025 de EOX tienen licencia distinta y no se usan.

Los encuadres de las seis cámaras mantienen sus coordenadas. La vista satelital conserva colores naturales, con contraste moderado y sin sombreado adicional. Los nombres tienen texto claro y halo oscuro en la vista satelital, y el límite regional cambia a dorado. Zoom y brújula están en una barra horizontal de controles táctiles de 44 px, para dejar libres las flechas laterales incluso cuando la atribución ocupa varias líneas en móvil. Si la capa satelital falla, se cambia a la vista ilustrada; un fallo del mapa base sigue activando el respaldo 2D.

El efecto es una textura satelital real aplicada al terreno, inspirado en `JIMdvd/Plan_Turistico`; no se usó su token público de Mapbox. Las imágenes son históricas y su resolución limita el detalle de edificios o monumentos al acercarse. El preloader, el hero, las nubes y las funciones del constructor no cambian.


## Nitidez del mapa · 4 de octubre de 2026

El canvas se renderiza con densidad de píxeles 2 y antialias, tanto en escritorio como en móvil, respetando los límites de tamaño de MapLibre. La capa satelital usa selección de nivel de detalle 2/4 para conservar teselas más detalladas en laderas lejanas. Las seis cámaras abren encuadres más amplios, a 48 grados, con exageración del terreno 1,1 para reducir el estiramiento de la textura. El zoom manual de Satélite se limita a 13; Mapa admite hasta 15. El cambio de superficie conserva la selección y solo ajusta la cámara si supera el límite fotográfico.

Esto mejora el renderizado y evita parte del sobreacercamiento, pero no añade detalle a la fotografía original. El mosaico Sentinel-2 tiene resolución nativa de 10 m y sigue siendo limitado en primeros planos de edificios o monumentos. Alcanzar el detalle del repositorio de referencia exige una fuente de imágenes de mayor resolución con credenciales propias. No se reutilizan credenciales del repositorio de referencia ni se presentan texturas generadas como cartografía real.

## Imágenes Mapbox Satellite · 4 de octubre de 2026

El proyecto usa ahora `mapbox.satellite` cuando se configura un token público propio. El motor sigue siendo MapLibre: Mapbox aporta la fotografía y Mapterhorn la elevación real. Las teselas fotográficas se solicitan en 512 × 512 (`@2x.jpg90`) y la cámara admite zoom hasta 18, con encuadres específicos para las seis paradas. Se conservan la densidad 2, antialias, LOD 2/4, inclinación 48 grados, límite de Apurímac y controles por clic/flechas. Las señales decorativas se redujeron a 35 m de radio y 90/45 m de altura para no tapar el detalle del atractivo.

Para configurar otra copia, copia `.env.example` a `.env.local` y asigna un token público propio que empiece por `pk.` a `VITE_MAPBOX_ACCESS_TOKEN`. Reinicia Vite o vuelve a ejecutar `npm run build`. `.env.local` está excluido del repositorio; el token público se incorpora a las peticiones del navegador y al build, como corresponde a una aplicación web. No se utiliza el token del repositorio de referencia. Sin token público, se mantiene EOX como proveedor alternativo con sus encuadres y límite de zoom anteriores.

El mapa muestra el logotipo oficial de Mapbox y atribución a Mapbox/Maxar, además de los proveedores existentes. «Improve this map» incluye el centro y zoom de la cámara. Si falla la imagen de Mapbox, se cambia a la superficie ilustrada; la selección, el relieve y los controles continúan disponibles. La resolución fotográfica y fecha de captura varían según cada lugar; no se afirma una resolución submétrica uniforme ni se reconstruyen monumentos. Las peticiones consumen la cuota de Raster Tiles API de la cuenta configurada, según su plan de Mapbox.


## Investigación regional y circuitos · 4 de octubre de 2026

Los 62 puntos del mapa tienen una descripción breve en `src/data/destination-descriptions.ts`, visible antes de las fotografías. Los textos se basan en el inventario; las notas técnicas de ubicación se muestran separadas. `research/destination-context.json` conserva fragmentos de referencia y señala las fichas históricas sin descripción disponible.

El catálogo reúne 135 referencias: 122 lugares o sectores de visita y 13 manifestaciones culturales. Se recuperaron los 112 registros del SIGMINCETUR de Apurímac, se consultaron sus fichas y ocho fichas adicionales, se unificó Illanya, se preservó Tres Cruces como registro histórico independiente y se añadieron 15 referencias de PROMPERÚ y SERNANP. La existencia documental y la coordenada referencial no garantizan acceso o apertura actual. No se afirma que este inventario incluya todos los lugares no registrados de la región.

`research/INVESTIGACION-APURIMAC.md` contiene la metodología, el catálogo completo por provincia, 15 propuestas de ruta, fuentes individuales y discrepancias. `public/research/inventario-apurimac.csv` incluye los tres vecinos geográficos de cada uno de los 62 puntos utilizables; son distancias en línea recta, no por carretera. `research/mincetur-apurimac-raw.geojson` conserva la descarga oficial y `research/fichas-facts.json` solo conserva nombres, ubicación, categoría y accesos públicos; no se retienen contactos personales.

La página `/rutas` permite elegir circuitos, ver sus escalas y ramales, buscar por provincia o distrito y abrir un punto del catálogo en el mapa 3D. El mapa se actualiza sin recrear su instancia. Las flechas se detienen en los extremos del circuito. Las paradas sin coordenadas siguen en el itinerario y no reciben un pin inventado. La secuencia numérica del mapa representa únicamente los puntos utilizables, no el trazado de una carretera.

Pacucha–Sóndor se presenta como circuito local; Pacucha–Cconoc usa una conexión regional con Andahuaylas, Curamba como ramal opcional, Abancay, Saywite y Curahuasi. La secuencia y duración de estancia son propuestas editoriales. Llaqwa, Occocco, Karkatera y Capuliyoc tienen discrepancias documentadas. Choquequirao está en Cusco; sus accesos desde Apurímac no alteran esa ubicación. El constructor libre y los presupuestos siguen siendo ilustrativos; enlazan los nuevos circuitos para contrastar las selecciones.

Verificación: 14 pruebas de lógica, TypeScript/compilación y lint; revisión funcional y visual de circuito local, conexión regional, ruta sin pins, búsquedas y selección desde el catálogo a 1440 × 900 y 390 × 844. Auditoría axe: 46 comprobaciones aprobadas, 0 infracciones detectadas y una revisión de contraste pendiente sobre elementos del prototipo previo. No se afirma certificación de accesibilidad.
