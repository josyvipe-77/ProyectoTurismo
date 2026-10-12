# Recursos del proyecto

## Incluidos para ejecutar el sitio

- Hero, fotos WebP, ilustraciones transparentes y nubes decorativas.
- 54 galerías locales de MINCETUR, con 294 fotos y variantes pequeñas/grandes.
- Tipografías locales Montserrat y Lato, con sus licencias en `public/licenses`.
- Inventario, límites cartográficos, fichas de procedencia y propuestas de ruta.

La biblioteca de fotos ocupa aproximadamente 81.5 MB sin comprimir. Eso afecta al tamaño del clon; no se descarga completa al abrir la web.

## Procedencia

Conserva `public/images/provenance.json`, `public/images/destinations/provenance.json` y `public/images/mincetur/provenance.json`.

Las fotografías de MINCETUR se enlazan con su ficha de origen. No se afirma una licencia abierta de esas imágenes ni que MINCETUR sea su autor individual. Las ilustraciones de destinos son interpretativas y generadas con IA; no representan un modelo 3D verificado. El hero fue aportado por el usuario.

La cartografía tiene atribuciones visibles de sus proveedores. Se usa EOX histórico para satélite, OpenFreeMap para cartografía y Mapterhorn para relieve, sin tokens. No se usa la API de Mapbox; la licencia de Storytelling se conserva como referencia histórica.

## Fuera de la exportación limpia

`node_modules`, `dist`, configuración local, logs, cachés, `tmp`, `output`, `qa`, PDF de entrega de la raíz, archivos ZIP, exportaciones históricas de Stitch y maestros de ilustración.

El código y los recursos necesarios de la web sí se incluyen, también el folleto de `public/materiales`. Los informes históricos de QA y las entregas se conservan localmente, excluidos de Git. Los originales del hero y del logo se mantienen para su procedencia y futuras ediciones.
