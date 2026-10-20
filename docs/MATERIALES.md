# Materiales finales

El sitio sirve archivos terminados desde `public/materiales`. No genera medios al ejecutarse ni necesita Python, FFmpeg, claves o servicios de voz para compilar.

## Fuentes de contenido

`src/data/photography-program.json` contiene la lectura cultural, la propuesta de observación y las fuentes de cada jornada. La web, el TXT y el PDF reutilizan estos datos. Los textos interpretativos se distinguen de los datos documentados; no añaden visitas o talleres al recorrido.

`src/data/project-materials.json` contiene el nombre oficial del proyecto, la aprobación del plan académico, Instagram, los guiones y las rutas de los medios. La resolución fuente es la proporcionada por el usuario: N.º 394-2026-DFI-UNAMBA, del 21 de agosto de 2026, páginas 1–3. No se distribuye el documento original en el sitio.

## Regenerar el programa base

Con Node.js 24 y Python con `reportlab` y `Pillow`:

```sh
node scripts/export_program_data.mjs
python scripts/create_program_pdf.py
```

El PDF se genera en `output/pdf/` y se copia a `public/materiales/programa-base-jacs-destinos.pdf`. El script de autoría utiliza Arial TTF de Windows. El mapa usa las coordenadas existentes y el límite regional de geoBoundaries del proyecto; no dibuja carreteras calculadas. La quinta jornada presenta las variantes, sin fijar un horario para varias combinadas. El TXT sigue siendo la descarga personalizada del planificador.

Renderizar y revisar las nueve páginas antes de entregar una nueva versión. Los folletos existentes tienen un enlace independiente y no son sustituidos por este programa.

## Folleto ilustrado

`python scripts/create_brochures_pdf.py` genera dos páginas A4 en `output/pdf/folletos-jacs-apurimac.pdf`, las copia a `public/materiales` y prepara su portada WebP. Requiere `reportlab`, `Pillow`, `pypdfium2` y Arial de Windows. Reutiliza los paneles visuales de las láminas 01 y 05-09 de `output/imagegen/presentacion-jacs-unificada`, conservadas localmente. Los textos del PDF son seleccionables; las imágenes se identifican como composiciones ilustrativas de la presentación. `procedencia-folletos.json` registra archivos y huellas SHA-256. La web incluye una vista previa y un enlace de descarga con versión para evitar el PDF anterior en caché.

## Enlace al mapa Perú-España

La sección de territorios incluye una tarjeta enlazada a `https://plan-turistico.vercel.app/`. Su emblema de los dos viajeros procede del propio sitio y se sirve como WebP local de 36 KB, con su URL de origen en `public/images/plan-turistico/procedencia.json`. No requiere imágenes remotas al abrir la web. «La mirada de viaje» incorpora una fotografía del archivo de Ampay, con crédito a su ficha.

## Inicio y tarjetas fotográficas

Inicio muestra un solo mapa del programa base, con las cinco paradas. La variante compacta de `PhotographyRoute` oculta el esquema cartográfico y las opciones de planificación; el explorador presenta la ficha con fotos después de seleccionar un destino. La selección de miradores y los mapas completos siguen en el planificador. El cierre «Tu próxima mirada empieza aquí» combina una fotografía del cañón del Apurímac con una invitación breve a planificar.

`PhotoCard` presenta imagen, título y ubicación, con detalles nativos de HTML para desplegar textos y fuentes. Se usa en las catorce tarjetas de Cultura viva y en las doce imágenes de la galería editorial; conserva los controles de ampliación existentes. `photo-cards.css` unifica los marcos fotográficos, bordes redondeados de 14 px, créditos y sombras. Las tarjetas desplegables usan imágenes 16:9 y se alinean arriba, para no estirar las vecinas al abrir una. Los logos y el hero conservan sus formatos propios.

## Regenerar el vídeo y los guiones

Dependencias de autoría: `Pillow` e `imageio-ffmpeg`. El script acepta su instalación temporal en `tmp/tool-deps`, sin añadir dependencias a la aplicación.

```sh
python scripts/create_project_media.py --video-speech
```

Produce un MP4 H.264 de 1280 × 720, 24 fps y 40 segundos, con 16 planos de 15 fotografías de las fichas MINCETUR 8264, 4678, 31, 577 y 3055. Incluye zoom suave, fundidos y subtítulos integrados. `--video-speech` genera gratuitamente ocho segmentos de voz española, sincronizados con las escenas de cinco segundos, y los integra como una pista AAC. Genera también portada, subtítulos WebVTT, guiones y procedencia. Los subtítulos externos son opcionales porque el texto ya está integrado en las imágenes.

Para repetir solo el montaje con la voz ya generada, se puede omitir `--video-speech`: reutiliza la narración temporal cuando su huella coincide con el guion. Si falta una voz compatible, genera una versión sin narración y actualiza la descripción del reproductor. El montaje se crea en la carpeta temporal y reemplaza el archivo público al terminar. Las rutas del vídeo, la portada y los subtítulos incorporan una versión para evitar reutilizar archivos antiguos desde la caché.

Inicio incorpora una galería de cinco lugares con dos fotografías por tarjeta. En escritorio cambia de perspectiva con el cursor o el foco; en móvil se desliza con el dedo o con los controles. Respeta la preferencia de movimiento reducido y conserva enlaces a las fichas originales.

El catálogo de Explora Apurímac presenta las galerías propias de 107 registros. Las otras 28 referencias tienen una portada de contexto ampliable, con la indicación «Imagen de contexto», el nombre real del lugar fotografiado y un enlace a su fuente. Se mantiene visible que falta una fotografía específica. Estas portadas no se añaden al manifiesto de fotografías propias ni cambian la cobertura verificada. `research/build_context_photos.py` prepara `src/data/catalog-context-photos.json` a partir del archivo existente; la prueba de cobertura verifica que cada referencia tenga una galería propia o una portada identificada y que sus archivos existan.

Las tarjetas del catálogo muestran una imagen 16:9, nombre y ubicación. «Ver detalles» despliega el estado de la ubicación, observaciones, fuentes y acciones. Las tarjetas se alinean arriba y no heredan la altura de otras tarjetas expandidas. Las portadas de contexto mantienen la identificación visible y presentan su procedencia completa al desplegar los detalles o ampliar la imagen. Las galerías y las portadas comparten el visor de ampliación.

Las fotografías interiores de Inicio usan marcos 4:3 con bordes redondeados y créditos en una franja separada. Las tarjetas de las cinco jornadas comparten ese formato. La ilustración gastronómica conserva su identificación visible en una franja inferior. Estas reglas están limitadas a Inicio en `src/home-media.css`; la portada y las nubes mantienen su diseño y comportamiento.

## Galería editorial, contacto y cierre visual

`/rutas#galeria` presenta «Miradas de Apurímac»: doce imágenes locales, cuatro por cada tema (Paisajes, Patrimonio y Cultura viva). La selección ligera de `src/data/curated-photos.json` guarda el recurso, la fotografía editorial, el tema y una descripción. Los archivos y créditos proceden de la galería específica del recurso; el manifiesto fotográfico completo no se incorpora al JavaScript de la aplicación. Se usan miniaturas WebP con carga progresiva y las versiones grandes se solicitan al abrir el visor.

El visor compartido con el catálogo y los destinos permite usar las flechas del teclado y Escape, bloquea el desplazamiento de fondo y devuelve el foco al control que lo abrió. Un error de carga conserva el enlace a la fuente. Las imágenes del inventario no se atribuyen al equipo de JACS.

«Comparte tu mirada» invita a enviar aportes al correo o Instagram, indicando lugar, autoría y autorización de publicación. El equipo revisará cada envío antes de incorporarlo; no existe subida de archivos ni publicación automática. Las 28 referencias pendientes siguen identificadas en el catálogo y en `FOTOGRAFIAS-PENDIENTES.md`.

`/consultora#contacto` centraliza el acceso a `jacsdestinos@gmail.com` y `@jacsdestinos`. El correo está definido en los datos del proyecto; los enlaces `mailto:` abren el cliente del visitante sin enviar mensajes desde la web. Inicio y el pie enlazan a la galería y al contacto. La infografía de La experiencia reutiliza los cinco registros del programa base y enlaza a las jornadas del planificador.

Los exploradores cartográficos abren en 2D con sombreado suave (`0.10`). El satélite histórico EOX y el relieve 3D se activan manualmente. Los puntos mantienen sus coordenadas; los nombres se muestran en la selección, el foco o el cursor. Se conservan las atribuciones, los límites de acercamiento del satélite y el mapa de respaldo ante fallos de servicios.

El planificador mantiene visibles el recorrido, el enfoque fotográfico y la interpretación cultural de cada jornada. Los objetivos y las paradas detalladas se consultan en «Detalles de las paradas»; los accesos, las comidas, el esfuerzo, las alternativas y las confirmaciones están en «Preparación y condiciones». Los horarios conservan su desplegable. Esta presentación no modifica los datos ni las exportaciones. El botón de encuadre se llama «Ver recorrido completo» para itinerarios con varios puntos y «Toda Apurímac» cuando muestra el contexto regional.

## Narración gratuita

Con `edge-tts` instalado y conexión a internet:

```sh
python scripts/create_project_media.py --speech --skip-video
```

Consulta las voces disponibles y utiliza la voz de sistema femenina de español de Perú; no clona personas ni usa una cuenta de pago. Envía solo el guion editorial público al servicio de lectura de Edge. La presentación se ajusta suavemente a 75 segundos y se identifica como narración sintética, con transcripción visible. Si el servicio no está disponible, mantiene el audio ya creado; en una generación inicial sin voz, el componente muestra la presentación escrita sin un reproductor vacío.

La procedencia no declara una licencia abierta ni atribuye autoría individual a MINCETUR. Conserva cada ficha de consulta y las huellas SHA-256 de los archivos de origen. No hay música, entrevistas ni testimonios simulados.
