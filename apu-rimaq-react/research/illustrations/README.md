# Colección interpretativa de Apurímac

Seis dioramas raster creados con el generador integrado `image_gen`, el 4 de octubre de 2026. Los prompts completos están en `prompts.json`; los originales PNG se conservan en `masters/` y no se incluyen en el ZIP de publicación.

La colección representa Pacucha, Sóndor, Saywite, Pampachiri, Ampay y Cconoc. Es una interpretación visual: no son fotografías, levantamientos topográficos ni reconstrucciones arqueológicas. No se extrajeron fotografías de DIRCETUR. Las referencias institucionales del inventario orientan los temas; no se usaron fotografías ajenas como entrada al generador.

Los doce archivos públicos están en `public/images/destinations/`: dos versiones transparentes por destino, de hasta 320 y 640 px, WebP calidad 82. Miniaturas: 22.3–35.4 KB; versiones mayores: 74.9–132.1 KB. Total: 700,300 bytes. `provenance.json` registra dimensiones y pesos.

`scripts/prepare_destination_artwork.py` reproduce la conversión desde los originales locales, con Python y Pillow; no se necesita para alojar el sitio. Si los originales cambian de ubicación, actualizar `GENERATED` o colocar los archivos allí. Solo se redimensionan y recodifican; el diseño y la transparencia proceden del generador.

El explorador monta un único diorama para el destino activo, cuando el mapa está visible y preparado. Se ancla encima del pin mediante un marcador nativo de MapLibre, con una flecha que termina sobre el círculo. Comparte la proyección del relieve y sigue el punto al mover, acercar o inclinar el mapa. La cámara reserva espacio encima del destino seleccionado. Los demás marcadores siguen siendo señales simples. Catálogo e itinerarios usan carga diferida nativa, dimensiones reservadas, decodificación asíncrona y prioridad baja. Las imágenes no requieren API de generación, modelos WebGL ni servidor especial. La transición respeta movimiento reducido. Los identificadores se vinculan a seis recursos concretos, sin asignar la ilustración a sectores internos o lugares vecinos.
