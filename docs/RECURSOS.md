# Recursos del proyecto

## Incluidos para ejecutar el sitio

- Hero, fotos WebP, ilustraciones transparentes y nubes decorativas.
- 107 galerías locales de MINCETUR, con 552 fotos y variantes pequeñas/grandes.
- Tipografías locales Montserrat y Lato, con sus licencias en `public/licenses`.
- Inventario, límites cartográficos, fichas de procedencia y propuestas de ruta.

La cobertura y las 28 referencias pendientes se detallan en [Fotografías del catálogo](FOTOGRAFIAS-PENDIENTES.md).

La biblioteca de fotos ocupa aproximadamente 144.9 MB sin comprimir. Eso afecta al tamaño del clon; no se descarga completa al abrir la web.

## Procedencia

Conserva `public/images/provenance.json`, `public/images/destinations/provenance.json` y `public/images/mincetur/provenance.json`.

Las fotografías de MINCETUR se enlazan con su ficha de origen. No se afirma una licencia abierta de esas imágenes ni que MINCETUR sea su autor individual. Las ilustraciones de destinos son interpretativas y generadas con IA; no representan un modelo 3D verificado. El hero fue aportado por el usuario.

La cartografía tiene atribuciones visibles de sus proveedores. Se usa EOX histórico para satélite, OpenFreeMap para cartografía y Mapterhorn para relieve, sin tokens. No se usa la API de Mapbox; la licencia de Storytelling se conserva como referencia histórica.

Los materiales finales se sirven desde `public/materiales`: programa base PDF, folletos, vídeo MP4 narrado, portada JPEG, subtítulos WebVTT, presentación MP3 y guiones. `procedencia-materiales.json` conserva las fuentes y huellas de las 15 fotografías utilizadas en el vídeo, el método de montaje y las voces sintéticas. El vídeo es un montaje local de imágenes existentes; no contiene paisajes generados. Las narraciones editoriales usan la voz de sistema `es-PE-CamilaNeural` a través de Edge Read Aloud, sin clonación de voz ni generaciones de pago. No son testimonios ni grabaciones de campo.

La portada principal y las nubes conservan sus recursos y animaciones anteriores. Las ilustraciones que permanecen en Cultura viva continúan identificadas como referenciales.

## Fuera de la exportación limpia

`node_modules`, `dist`, configuración local, logs, cachés, `tmp`, `output`, `qa`, PDF de entrega de la raíz, archivos ZIP, exportaciones históricas de Stitch y maestros de ilustración.

El código y los recursos necesarios de la web sí se incluyen, también el folleto de `public/materiales`. Los informes históricos de QA y las entregas se conservan localmente, excluidos de Git. Los originales del hero y del logo se mantienen para su procedencia y futuras ediciones.
