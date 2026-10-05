# Recursos del proyecto

## Incluidos para ejecutar el sitio

- Hero, fotos WebP, ilustraciones transparentes y nubes decorativas.
- 54 galerías locales de MINCETUR, con 294 fotos y variantes pequeñas/grandes.
- Tipografías locales Newsreader y Public Sans, con sus licencias en `public`.
- Inventario, límites cartográficos, fichas de procedencia y propuestas de ruta.

La biblioteca de fotos ocupa aproximadamente 81.5 MB sin comprimir. Eso afecta al tamaño del clon; no se descarga completa al abrir la web.

## Procedencia

Conserva `public/images/provenance.json`, `public/images/destinations/provenance.json` y `public/images/mincetur/provenance.json`.

Las fotografías de MINCETUR se enlazan con su ficha de origen. No se afirma una licencia abierta de esas imágenes ni que MINCETUR sea su autor individual. Las ilustraciones de destinos son interpretativas y generadas con IA; no representan un modelo 3D verificado. El hero fue aportado por el usuario.

La cartografía tiene atribuciones visibles de sus proveedores. El token público de Mapbox es configuración de cliente; no se incluyen credenciales privadas en el repositorio.

## Fuera de la exportación limpia

`node_modules`, `dist`, configuración local, logs, cachés, capturas de QA, archivos ZIP, exportaciones históricas de Stitch y maestros de ilustración.

El código y los WebP necesarios sí se incluyen. Los informes de QA se conservan como Markdown. Los maestros y referencias originales permanecen en el espacio de trabajo del propietario; no se necesitan para instalar ni compilar.
