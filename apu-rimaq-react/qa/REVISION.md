# Revisión React · 03/10/2026

- Cinco páginas capturadas a 1440 × 900 y 390 × 844; ancho de documento igual al ancho de pantalla y cero imágenes rotas.
- Hero aprobado conservado con la imagen referencial exportada, texto central, serif cursiva y botones rojos/marfil.
- Contenido restante con papel crema, acentos rojos/lavanda, bordes suaves y tipografía editorial PamPam.
- Filtro Gastronomía: una ruta. Favoritos: una ruta tras guardar Ruta Chanka; dato conservado al recargar.
- Constructor incompleto: alerta por falta de destino. Cuatro destinos y dos intereses: cuatro jornadas, S/ 680 y guardado persistente.
- Caso de ocho destinos y ocho días: ocho jornadas y mapa de dos filas, sin desbordamiento móvil; enfoque trasladado al resultado.
- Calendario: septiembre muestra Cocharcas; Oficios muestra un estado vacío sin inventar eventos.
- Enlace `/cultura#calendario`: sección situada a 105 px, debajo de la cabecera.
- Ventana de idioma: foco inicial en cerrar y cierre con Escape.
- Ajustado el desplazamiento hacia botones para evitar que la navegación inferior tape sus puntos de interacción.
- Corregida la separación de contextos y proveedores para mantener estable la recarga de desarrollo.
- Fuentes y siete imágenes secundarias locales; procedencia y licencias incluidas.
- Compilación, lint y seis pruebas de lógica aprobados. No se afirma certificación WCAG; la revisión automática disponible no produjo una cobertura fiable para certificarla.

Las capturas muestran datos de prueba del navegador de revisión. Una sesión nueva empieza sin favoritos ni rutas guardadas.

## Desenfoque Mercury

Capturas `hero-mercury-blur-desktop.png` y `hero-mercury-blur-mobile.png`: máscara radial aplicada exclusivamente a una capa decorativa del paisaje. Blur computado: 10 px y 7 px respectivamente; contenido y acciones con `filter: none`. Las dos imágenes cargan y el ancho del documento coincide con el de la pantalla. Compilación de producción aprobada después del cambio.


Imagen del hero sustituida por el PNG adjunto del usuario (1200 × 896). SHA256 del recurso local idéntico al adjunto. Las dos capas cargan el PNG y conservan el desenfoque Mercury. Capturas hero-user-desktop.png y hero-user-mobile.png revisadas.

Hero actualizado con la segunda imagen adjunta: hero-user-v2.png (1449 × 1086), en ambas capas. Conserva el desenfoque Mercury. Capturas de escritorio y móvil revisadas; compilación aprobada.

Hero ampliado a 100svh sin límite máximo de altura. A 1920 × 911, altura del hero 911 px y comienzo de la siguiente sección en 911 px. En móvil 390 × 844, ambos valores son 844 px. Eliminada la franja de la siguiente sección en la vista inicial; avisos del hero situados sobre la navegación móvil. Capturas revisadas y compilación aprobada.

## Transición de scroll inspirada en Mercury

Consultados el complemento Higgsfield y la referencia visual Mercury en Refero. Adaptación local, sin generación de vídeo ni creación/publicación de otro sitio.

- Escritorio 1440 × 900: hero de 900 px; la siguiente sección comienza en 900 px. A scroll 360 px: parallax de 100,8 px, zoom 1,066 y opacidad del relato 0,544; botones con opacidad 1.
- Móvil 390 × 844: hero de 844 px; a scroll 300 px, parallax de 84 px. Ancho del documento 390 px, sin desbordamiento.
- Al regresar arriba, parallax 0 px, relato con opacidad 1 y mezcla con el papel 0: se conserva la imagen completa del hero inicial.
- Preferencia de movimiento reducido activada en caliente: parallax 0, relato opaco, zoom inicial estático y cero secciones con animación de entrada. Al desactivarla, se recupera la transición en la posición actual.
- CTA hacia el constructor operativa, navegación de regreso estable y enlace a `#cuaderno` situado a 77 px en móvil, bajo la cabecera. Sección revelada con opacidad 1.
- Espaciado del lema corregido en móvil; botones, menús y navegación inferior permanecen nítidos. Sin errores en la consola del navegador.

Capturas: `scroll-top-desktop.png`, `scroll-transition-desktop.png`, `scroll-top-mobile.png`, `scroll-transition-mobile.png` y `scroll-content-mobile.png`. Compilación de producción y lint aprobados.

## Apertura con nubes

- Higgsfield: preferencias consultadas; proyecto automático desactivado. Generación de textura transparente rechazada por requerir Basic o superior, sin job creado. Alternativa entregada: textura SVG procedural local con capas animadas en CSS.
- Capturas a 1440 × 900 y 390 × 844 de inicio, apertura y final: `cloud-start-*`, `cloud-opening-*` y `cloud-finished-*`. El hero conserva su altura y no aparece una franja de contenido en la vista inicial.
- Tras terminar la apertura, cero elementos `.cloud-intro` en el DOM; sin restos de niebla sobre el hero.
- Escape elimina las nubes. El botón hacia el constructor funciona; al regresar a Inicio no se repite la apertura.
- Scroll durante la entrada: nubes retiradas y parallax existente conservado (56 px de desplazamiento de imagen a scroll 200 px).
- Movimiento reducido: apertura omitida desde el montaje, cero capas de nubes y parallax 0.
- Sin desbordamientos horizontales ni errores en la consola. Compilación y lint aprobados.

## Recarga suave y corrección del destello blanco

El arranque anterior dependía del CSS de React y mostraba todo el texto de inmediato. Se incorporó CSS crítico al HTML, precarga de imagen y textura, y una cortina inicial oscura. El controlador espera la decodificación de ambas imágenes y carga explícitamente las fuentes del hero antes de revelar la escena, con un tiempo máximo de espera.

- Arranque sin React, abortando únicamente su módulo en el navegador de revisión: raíz vacía, cortina presente y fondo computado `rgb(35, 48, 47)`; no se muestra un lienzo blanco. La interceptación se retiró después de esta comprobación.
- Recargas a 1440 × 900 y 390 × 844: paisaje y textos aparecen por etapas; nubes con dispersión de 3,8 s y retirada por interacción mediante fundido de 650 ms.
- Al terminar: fase `done`, sin cortina ni capas de nubes, título y botones con opacidad 1, imagen decodificada y sin desbordamiento horizontal.
- Movimiento reducido: fase `done` desde el montaje, título visible y sin cortina ni nubes. Escape termina la entrada suavemente; CTA al constructor y regreso a Inicio comprobados, sin repetición de la apertura.
- La transición de scroll sigue independiente del fundido inicial; se animan elementos interiores para no sobrescribir sus variables de movimiento.

Capturas `smooth-before-react.png`, `smooth-first-paint-*`, `smooth-title-*`, `smooth-reveal-desktop.png` y `smooth-finished-*`. Compilación de producción, TypeScript y lint aprobados.

## Preloader minimalista

La pantalla de espera verde se sustituyó por un preloader carbón neutro con marca marfil, acento rojo, línea fina indeterminada y «Cargando». HTML y CSS críticos incluidos en el documento inicial, sin nuevas dependencias, imágenes o fuentes necesarias para el preloader.

- Arranque anterior a React comprobado con su módulo temporalmente bloqueado: fondo `rgb(37, 37, 37)`, marca visible, `role="status"`, raíz vacía y ancho de documento igual al viewport. La interceptación se retiró después.
- Capturas `preloader-desktop.png` (1440 × 900), `preloader-mobile.png` (390 × 844) y `preloader-finished-mobile.png` revisadas.
- Tras cargar: sin `#boot-scene`, fase del hero `done`, título con opacidad 1 y sin desbordamiento horizontal.
- Movimiento reducido: preloader retirado al montar el hero, sin indicador animado ni apertura de nubes.
- Fundido del fondo de 850 ms; retirada de la marca de 350 ms para evitar que coincida con la entrada del título. Sin porcentajes ficticios ni espera mínima adicional.
- Compilación de producción y lint aprobados.

## Preloader Apu Rimaq · 4 de octubre de 2026

- Nuevo emblema SVG inline con dos cordilleras marfil, sol dorado y dos trazos de bruma; animaciones CSS discretas y etiqueta «Abriendo el cuaderno». Conserva el fondo carbón, la marca, el indicador indeterminado y el fundido anterior.
- Higgsfield: coste estimado de 1,5 créditos para generar el emblema; solicitud rechazada con «Requires basic plan or higher». No hubo job ni imagen generada. La versión implementada es vectorial local.
- Arranque antes de React comprobado bloqueando temporalmente únicamente su módulo: fondo `rgb(37, 37, 37)`, SVG presente, bruma animada, raíz vacía y ancho de 390 px igual al viewport. La interceptación se retiró después.
- Capturas `apu-preloader-desktop.png` (1440 × 900), `apu-preloader-mobile.png` (390 × 844) y `apu-preloader-finished-*` revisadas visualmente.
- Movimiento reducido: las animaciones de bruma, sol e indicador computan `none`; al montar React, fase `done`, sin cortina ni nubes.
- Apertura normal completada: preloader retirado, fase `done`, título con opacidad 1 y sin desbordamiento horizontal en móvil. Consola sin errores.
- Compilación de producción, TypeScript y lint aprobados. No se añadieron dependencias.

## Corrección del salto durante la recarga · 4 de octubre de 2026

La cortina, el movimiento de nubes y la entrada del título comenzaban a la vez. Además, las nubes tenían un keyframe que subía la opacidad antes de disminuirla. Se separó el arranque en `waiting → revealing → opening → done`, se garantizó el pintado inicial con dos frames, se amplió el fundido de la cortina a 1,6 s y se eliminó el aumento de opacidad. La cortina se retira al terminar su transición, con un respaldo de 1,75 s. Cancelar la apertura usa un fundido de 1,1 s.

- Observador `intro-observer.js` cargado solo en el navegador de revisión, sin incorporarlo a la aplicación. Muestreo cada 100 ms desde el inicio, tanto en escritorio como en móvil.
- Escritorio 1440 × 900: a 401 ms, cortina 0,988 y título 0; a 1001 ms, cortina 0,287 y título 0; a 1908 ms, cortina retirada y título 0,024; a 2502 ms, título 0,669; a 3701 ms, título 1. Altura del título constante en 187,47 px. Estos tiempos corresponden a la recarga medida, no a una garantía de rendimiento.
- Móvil 390 × 844: todas las fases observadas; sin incrementos de opacidad de las nubes mayores de 0,01 ni saltos de opacidad del título mayores de 0,2 entre muestras. Altura del título constante en 102,875 px. Documento de 390 px de ancho, sin desbordamiento; al terminar no quedan cortina ni nubes.
- Capturas `smoother-handoff-*`, `smoother-text-*` y `smoother-finished-*` revisadas. Se conservan los colores y el paisaje del hero.
- Escape durante la entrada: retirada completa de capas y título con opacidad 1. Navegación al constructor y regreso a Inicio sin repetir la apertura.
- Movimiento reducido: fase `done` desde el montaje, sin cortina ni nubes, título visible. Sin errores en el navegador durante las comprobaciones finales.
- Compilación de producción, TypeScript y lint aprobados.

## Dispersión continua de las nubes · 4 de octubre de 2026

- Eliminada la espera de un segundo para iniciar las nubes: ahora se animan desde `revealing`. El retraso de los textos se conserva; la misma animación continúa en `opening` y `settling`, sin reinicios. Movimiento lineal, sin arranque con velocidad casi nula. Retirada de nubes coordinada a los 4,4 s desde el comienzo de la dispersión.
- Rasterizada la textura procedural local como `cloud-wisp.webp`, 1400 × 800 y 210.178 bytes, con transparencia. Precarga, decodificación y CSS usan el WebP; el SVG se conserva como fuente. Así no se evalúan sus filtros durante la animación. Procedencia registrada en el manifiesto y preservada por el script de preparación.
- Medición final en escritorio: reloj de animación 97 ms a los 405 ms de navegación, 785 ms a los 1104 ms y 986 ms al entrar en `opening` a los 1303 ms; continúa avanzando. Cero muestras con reloj detenido entre 0 y 4100 ms y cero reinicios. Ningún intervalo entre frames mayor de 80 ms en esa recarga medida; no implica garantía de rendimiento en otros dispositivos.
- Móvil 390 × 844: cero detenciones o reinicios entre muestras; ancho de documento igual al viewport. Fase final `done`, preloader retirado y título con opacidad 1. Capturas `cloud-flow-moving-mobile.png` y `cloud-flow-mobile.png` revisadas.
- Movimiento reducido conserva la entrada estática, sin cortina ni nubes. Escape termina la apertura y no se registran errores del navegador. Compilación de producción, TypeScript y lint aprobados.


## Explorador geográfico de Apurímac · 4 de octubre de 2026

- Adaptado el patrón de capítulos de Mapbox Storytelling al React existente en Inicio y Rutas. MapLibre GL JS 6.12.0, OpenFreeMap y Mapterhorn, sin token. Mapa limitado visualmente al polígono regional mediante máscara opaca; cámara con margen para encuadrar el contorno completo.
- Seis destinos: Ampay, Pacucha, Sóndor, Saywite, Pampachiri y Cconoc. Información contrastada con el inventario de MINCETUR; coordenadas referenciales de OSM y GPS fotográfico de Wikimedia. Las seis quedan dentro del polígono de Apurímac. Procedencia en public/maps/provenance.json.
- Relieve real, inclinación 58 grados al seleccionar una parada y exageración 1,25. Columnas coloreadas decorativas para ubicar destinos, sin reconstruir monumentos. Vista general completa, vista 2D/3D, zoom y orientación al norte.
- Comprobados clics en etiquetas y marcador de Pacucha, flechas laterales, paginador y teclas izquierda/derecha. El recorrido circula por las seis paradas, sincronizando texto, marcador activo y cámara. Marcadores próximos separados como llamadas con líneas hacia la coordenada original, sin modificar la geografía.
- Escritorio 1440 × 900 y móvil 390 × 844, sin desbordamiento horizontal. Capturas atlas-overview-desktop.png, atlas-pacucha-desktop.png, atlas-sondor-desktop.png y atlas-pampachiri-mobile.png inspeccionadas. Botones laterales de 44 px y controles nativos del mapa con etiquetas en español.
- Simulada una interrupción del estilo base con una regla de red exclusiva de la sesión de QA: se conserva el SVG 2D, las flechas y los destinos; sin canvas activo ni falsa indicación de relieve cargado. Retirada la regla y probado Reintentar: recupera el mapa 3D y mantiene el destino elegido (Cconoc).
- Movimiento reducido activado en el navegador: cambio de destino funcional y cámara sin transición animada. Se restableció la preferencia normal. La rueda desplaza la página; no se usa Scrollama ni se seleccionan capítulos al desplazarla.
- Auditoría axe-core 4.12.1 en Rutas: 0 infracciones WCAG2A/2AA y 24 comprobaciones aprobadas. Contraste sobre fotografías y canvas señalado para revisión manual; revisado visualmente, con texto de marcadores sobre fondo marfil opaco. Corregidas etiquetas ARIA de contenedores y nombre del aside.
- Compilación de producción/TypeScript, lint y las ocho pruebas aprobados. Pruebas nuevas: pertenencia geográfica/fuentes de los seis destinos y recorrido circular en ambos sentidos. Instalación actual sin vulnerabilidades reportadas; se descartó la versión inicial antigua de MapLibre.
- MapLibre y su worker permanecen en un módulo cargado al aproximarse al explorador. El hero y su secuencia de nubes no se modificaron. La cartografía externa necesita conexión; los puntos y el límite son referenciales, no para navegación.


## Relieve satelital en color · 4 de octubre de 2026

- Añadida imagen EOxCloudless / Sentinel-2 2016–2017 (CC BY 4.0, `s2cloudless_3857`) sobre el DEM real de Mapterhorn. Endpoint y licencia contrastados con el WMTS de EOX y su documentación oficial. Se mantiene MapLibre y no se usa el token del repositorio de referencia. Crédito completo visible en el mapa y procedencia actualizada.
- Color y contraste moderados, sombras abiertas con brillo mínimo 0,07 y máximo 0,98, sombreado adicional reducido a 0,12. Etiquetas claras con halo oscuro, límite regional dorado y encuadres más cercanos de las seis paradas, sin alterar coordenadas.
- Control Satélite/Mapa funcional sin reiniciar la instancia o cambiar de destino; vistas 2D/3D independientes, flechas y selección conservadas. Barra nativa de zoom/brújula horizontal con botones de 44 px para evitar superposición con las flechas y la atribución en móvil.
- Escritorio 1440 × 900 y móvil 390 × 844 inspeccionados, sin desbordamiento. Capturas atlas-satellite-ampay-desktop.png y atlas-satellite-pacucha-mobile.png. Cambiar a Mapa conservó Ampay y cambiar a 2D conservó Pacucha y la imagen satelital.
- Bloqueo de red simulado únicamente para la imagen: el mapa quedó disponible en 3D con superficie ilustrada. Tras retirar el bloqueo y volver a Satélite/seleccionar Ampay, recuperó las imágenes; captura atlas-satellite-recovered-mobile.png. Regla de red retirada al terminar.
- Auditoría WCAG2A/2AA: 0 infracciones, 24 comprobaciones aprobadas. Fotografía/canvas del contenido previo requieren comprobación visual de contraste; marcadores y controles sobre fondos opacos. Sin errores del navegador en la revisión normal. Build/TypeScript, lint y las ocho pruebas aprobados.
- Es un mosaico histórico, no imagen en tiempo real ni fotogrametría de monumentos. Hero y secuencia inicial conservados.

## Nitidez del relieve satelital · 4 de octubre de 2026

- Diagnóstico en la vista real de Ampay: canvas 806 × 635 para una caja CSS del mismo tamaño, DPR 1. Tesela EOX decodificada 256 × 256; el tileSize configurado era correcto. El mosaico tiene 10 m de detalle nativo, por lo que aumentar el zoom no ofrece detalle fotográfico nuevo.
- Canvas a densidad 2 con antialias: escritorio 1612 × 1270 para 806 × 635 CSS; móvil 696 × 800 para 348 × 400 CSS. Sin aumentar de forma ilimitada según el DPR del teléfono. Selección LOD 2/4 en la imagen satelital para conservar detalle en las laderas lejanas.
- Encuadres más amplios de las seis paradas, inclinación de 48 grados y exageración 1,1. Colores naturales, contraste 0,03, sin sombreado adicional sobre la fotografía. Satélite admite zoom hasta 13 y Mapa hasta 15; probado el botón Acercar deshabilitado al llegar al límite satelital. Se conservan coordenadas, contorno regional y máscara exterior.
- Inspeccionadas capturas atlas-sharpness-before.png, atlas-sharpness-ampay-desktop.png, atlas-sharpness-pacucha-desktop.png y atlas-sharpness-pacucha-mobile.png. Las etiquetas y aristas se renderizan con mayor densidad; la fotografía conserva suavidad propia de su resolución. No se presenta como fotografía HD ni como reconstrucción de monumentos.
- Selección de las seis paradas en escritorio y flecha siguiente en móvil. Alternancias Satélite/Mapa y 2D/3D mantienen Sóndor seleccionado. Sin desbordamiento horizontal en 1440 × 900 y 390 × 844, y sin errores JavaScript registrados durante la revisión.
- Build/TypeScript, lint y las ocho pruebas aprobados. Hero, preloader y nubes sin cambios. Para igualar el detalle fotográfico de la referencia hace falta un proveedor de mayor resolución con credenciales propias.

## Integración de Mapbox Satellite · 4 de octubre de 2026

- Token público propio suministrado por el usuario, configurado en `.env.local`, excluido de Git. `.env.example` explica la configuración sin incluir valores reales. El cliente selecciona Mapbox si hay un token `pk.`; sin él se conserva EOX. No se reutilizan credenciales del repositorio de referencia.
- Mapbox Raster Tiles API con `mapbox.satellite`, `@2x.jpg90`, tileSize 512, maxzoom 20 y zoom de cámara máximo 18. Verificado en el navegador un HTTP 200 y una tesela decodificada de 512 × 512. No se imprime el token en la revisión.
- Mayor detalle visible de laderas, lagunas y parcelas en Ampay y de caminos/parcelas en Sóndor. Capturas atlas-mapbox-ampay-desktop.png, atlas-mapbox-pacucha-desktop.png, atlas-mapbox-sondor-desktop.png y atlas-mapbox-pacucha-mobile.png inspeccionadas. Las seis cámaras siguen sus coordenadas originales, con acercamientos adaptados a la nueva imagen; no se afirma resolución nativa uniforme para toda Apurímac.
- Señales 3D decorativas reducidas a radio 35 m, alturas de 90 m para el destino activo y 45 m para otros, opacidad 0,5 para no tapar el detalle al acercarse. No son modelos de edificios. DEM Mapterhorn, exageración 1,1, inclinación 48 grados, máscara regional y contorno conservados.
- Logo oficial Mapbox extraído sin modificar del CSS oficial, visible junto a la fotografía, atribución Mapbox/Maxar y proveedores existentes. Enlace Improve this map con centro/zoom verificado; corregida su actualización después de alternar superficies mediante el evento idle.
- Revisadas seis selecciones, flecha siguiente, alternancias 2D/3D y Satélite/Mapa. Escritorio 1440 × 900 y móvil 390 × 844 sin desbordamiento horizontal. Canvas móvil 696 × 800 para caja CSS 348 × 400. Sin errores JavaScript en la revisión normal.
- Interrupción de Mapbox simulada solo en la sesión de QA: estado ready, modo 3D, superficie map, destino Ampay y canvas conservado; logo Mapbox oculto. Regla retirada y navegación nueva: recupera la fotografía con Mapbox. Cambios de superficie mantienen destino y actualizan la atribución contextual.
- Build/TypeScript, lint y ocho pruebas aprobados. La imagen depende de cobertura y fecha de captura del proveedor; no se presentan monumentos reconstruidos ni fotografías en tiempo real. Hero, nubes y apertura inicial sin cambios.


## Investigación y rutas regionales · 2026-10-04

- 135 referencias: 122 lugares/sectores y 13 manifestaciones culturales; 61 pins referenciales. CSV e informe completos con 135 filas, sin caracteres de sustitución. Fuentes, sectores internos, registros históricos y discrepancias conservados.
- 15 propuestas, con recorrido principal y ramales. Pacucha–Sóndor es local; Pacucha–Cconoc usa Andahuaylas, Curamba opcional, Abancay, Saywite y Curahuasi. No se generan carreteras ni tiempos en vivo.
- 14 pruebas aprobadas, TypeScript/producción y lint sin errores. Verificación real de cambio de rutas (3, 7, 2 y 0 pins), selección de último destino sin wrap, ruta Capuliyoc textual y navegación desde el catálogo.
- Búsqueda SONDOR sin acento encuentra Sóndor. Descargas de informe y CSV: HTTP 200. Canvas de 390 px sin desbordamiento y marcador centrado después de alternar 1440 y 390 px; se corrigió la cámara al redimensionar.
- JavaScript: sin errores en la sesión probada. Axe completo: 46 passes, 0 violations, 1 incomplete de contraste en elementos previos; no se afirma certificación. El filtro de tags produjo 0 comprobaciones y no se contó como validación.
- Evidencia: atlas-conexion-regional-desktop.png, atlas-catalogo-sondor-mobile.png y rutas-investigadas-mobile.png. Hero y nubes conservados.
