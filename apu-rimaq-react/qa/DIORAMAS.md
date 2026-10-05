# Ilustraciones · 2026-10-04

- Seis destinos y doce variantes WebP transparentes. Se verificaron dimensiones, canal alfa, límite de 150 KB por archivo y carga HTTP.
- Mapa: una ilustración a la vez, correspondiente al destino seleccionado. Cambio Pacucha → Sóndor mediante la flecha. En la apertura solo se descargaron las miniaturas de Pacucha y Sóndor del itinerario; no toda la colección.
- Catálogo: búsqueda sin tilde de Sóndor, imagen cargada con `loading=lazy`. Las ilustraciones de provincias cerradas no se descargaron en esta sesión.
- Revisión visual de escritorio (1440 × 900) y móvil (390 × 844), sin desbordamiento horizontal. Se corrigió la superposición de la flecha izquierda sobre la ilustración móvil. Etiquetas de IA y texto alternativo presentes.
- TypeScript y compilación de producción aprobados, lint sin errores y 14 pruebas existentes aprobadas. Permanece la advertencia anterior sobre el tamaño del paquete de cartografía; esta colección no añade bibliotecas.
- Evidencia: `dioramas-collection.jpg`, `dioramas-map-desktop.png`, `dioramas-map-mobile.png` y `dioramas-catalog-mobile.png`.

Estas ilustraciones no son fotografías ni reconstrucciones arqueológicas. El ensayo no garantiza una carga rápida del mapa con cualquier red: la cartografía externa conserva sus propios tiempos.

## Anclaje sobre el pin

- El diorama se representa mediante un portal React dentro de un marcador nativo de MapLibre. Flecha sobre el borde superior del círculo, sin impedir clics en el pin ni arrastrar el mapa.
- Medición en escritorio tras arrastrar y en móvil 2D: diferencia horizontal de 0 px entre centros; 28 px entre tarjeta y círculo, ocupados por la flecha.
- Revisión móvil 390 × 844 con satélite y relieve: tarjeta por encima del destino, controles y créditos visibles, sin desbordamiento horizontal.
- Siguiente cambia Pacucha por Sóndor; Toda Apurímac retira el marcador ilustrado (0 elementos restantes). Sin errores de JavaScript en esa sesión.
- Compilación, lint y 14 pruebas aprobados; capturas del mapa actualizadas.

## Diorama sin fondo de tarjeta

- Eliminados fondo, borde y sombra rectangular de la tarjeta del mapa. Se conserva el fondo transparente de los archivos WebP, la flecha y el anclaje al pin.
- Etiqueta y flecha en marfil con sombra oscura para distinguirlas sobre la cartografía. Sombra ligera aplicada solo a la silueta del diorama.
- Revisado a 1440 × 900 y 390 × 844. Estilos computados: fondo transparente, borde de 0 px y sombra de tarjeta inexistente. Compilación de producción aprobada.
