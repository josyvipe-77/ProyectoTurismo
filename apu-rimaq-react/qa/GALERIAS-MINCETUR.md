# Galerías · 2026-10-04

- Descripciones originales para los 61 puntos, basadas en el inventario. Los registros históricos sin descripción actual usan textos prudentes. Se muestran antes del carrusel, con notas de coordenadas separadas.
- Revisión de Pacucha y Sóndor: texto actualizado al seleccionar otro destino y sin desbordamiento a 1440 y 390 px. Capturas del carrusel actualizadas. Compilación, lint y 14 pruebas aprobadas.

- 53 fichas, 288 fotos y 576 variantes locales. Hasta seis fotos por ficha. Vínculo de cada galería con el código exacto del inventario y URLs originales preservadas.
- El mapa queda a la izquierda y la ficha con fotos a la derecha en escritorio; en móvil la ficha aparece debajo. Panel de escritorio de altura contenida con lectura mediante desplazamiento.
- En una apertura de Pacucha se descargaron únicamente `1316.json` y la primera miniatura de 480 px. No se pidió la versión de 1400 px antes de ampliar. No se incorporó una biblioteca de carruseles.
- Anterior/siguiente, selector de foto y ampliación funcionan. Flechas del teclado dentro del visor cambian fotos y mantienen el destino 1316. Escape cierra, restaura el scroll y devuelve el foco a «Ampliar fotos de Laguna de Pacucha».
- Cambio Pacucha → Sóndor reinicia en foto 1 de 5. Fallo simulado de la galería de Andahuaylas muestra el enlace a la ficha y permite recuperarla al volver a seleccionar el destino.
- Revisión a 1440 × 900 y 390 × 844. Sin desbordamiento horizontal en página ni ventana ampliada. Foco dentro del diálogo nativo y texto alternativo en las imágenes. No se afirma certificación de accesibilidad.
- Compilación de producción y lint aprobados; 14 pruebas existentes aprobadas. Las resoluciones pequeñas de origen no se amplían artificialmente durante la conversión.
- Evidencia: `mincetur-gallery-desktop.png`, `mincetur-gallery-mobile.png`, `mincetur-lightbox-desktop.png` y `mincetur-lightbox-mobile.png`.
