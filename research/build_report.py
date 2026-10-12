import json, math
from collections import Counter
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
catalog=json.loads((ROOT/'src/data/apurimac-catalog.json').read_text(encoding='utf-8'))
routes=json.loads((ROOT/'src/data/apurimac-routes.json').read_text(encoding='utf-8'))
by_id={p['id']:p for p in catalog}
out=['# Investigación turística y rutas de Apurímac',
 '**Fecha de consulta: 4 de octubre de 2026.** Elaborado para Apu Rimaq.',
 '## Resultado y alcance',
 '135 referencias documentadas en las siete provincias: **122 lugares o sectores de visita, 11 celebraciones y 2 registros de cultura y sabores**. Hay 62 puntos con coordenadas referenciales utilizables en el mapa actual. Los sectores de Ampay y Pampachiri forman parte de atractivos mayores; no deben contarse como destinos regionales independientes.',
 'Este es un catálogo completo de las consultas realizadas, no una afirmación de que existan solamente 135 atractivos o de que se haya identificado cada lugar no inventariado de Apurímac. No todos los registros históricos siguen teniendo ficha pública activa. La existencia documental no garantiza apertura, conservación, infraestructura o accesibilidad actual.',
 '## Método y fuentes',
 '1. Descarga íntegra del filtro Apurímac de la capa pública `ProduSig:SIG1GEOIRT` de SIGMINCETUR: 112 registros, 72 con geometría y 40 sin ella. La capa contiene fiestas y gastronomía además de lugares; no se transforma cada recurso en un pin.',
 '2. Consulta de las 112 fichas y ocho fichas adicionales encontradas en búsquedas por provincia. Se recuperaron títulos actuales de 106 de las 120 consultas; 14 no devolvieron título. Se conserva el origen histórico de los registros que no tienen descripción actual.',
 '3. Se unificó Illanya: el registro antiguo 4672 y la ficha actual 11102 corresponden a la misma hacienda. Las 120 referencias de ficha quedan en 119 entradas. Se contrastaron nombres, distritos y categorías con la ficha actual. El código 8320 requiere tratamiento especial: la ficha describe Carnaval de Sacclaya, pero la capa histórica lo asocia a Tres Cruces de Mamara. Se conservan ambos nombres separados, identificando el segundo como histórico pendiente de verificar, sin adjudicarle la ficha del carnaval.',
 '4. Se añadieron 15 referencias de PROMPERÚ y SERNANP y el registro histórico separado de Tres Cruces. Resultado: 119 + 15 + 1 = 135.',
 '5. Auditoría de geometrías frente al límite cartográfico existente y de discrepancias obvias con accesos publicados. Tener una coordenada oficial es una referencia, no una verificación de campo de la entrada.',
 '6. Quince propuestas de ruta organizadas por acceso común, núcleo urbano, corredor y ramales. El orden y duración de estancia son una propuesta editorial; no se ha resuelto un problema de ruta óptima ni descargado una red vial para todos los recursos.',
 '- [SIGMINCETUR: visor y capa geográfica](https://sigmincetur.mincetur.gob.pe/turismo/index.html). Consulta reproducible WFS: `service=WFS&version=1.0.0&request=GetFeature&typeName=ProduSig:SIG1GEOIRT&outputFormat=application/json&srsName=EPSG:4326&CQL_FILTER=des_region%20ILIKE%20%27APUR%25%27` en `https://sigmincetur.mincetur.gob.pe/geoserver/ProduSig/ows`.',
 '- [Fichas públicas de MINCETUR](https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=578); cada entrada del catálogo enlaza su propia fuente.',
 '- [Guía práctica de PROMPERÚ, información actualizada en septiembre de 2023](https://repositorio.promperu.gob.pe/bitstreams/1dad4376-4311-4459-9cd4-42f34245a97b/download).',
 '- [SERNANP: Ampay, sectores y senderos autorizados](https://visitaareasnaturales.sernanp.gob.pe/anps/santuario-nacional-de-ampay/).',
 '- [PERTUR Apurímac: contexto de planificación](https://www.gob.pe/institucion/mincetur/informes-publicaciones/2366623-pertur-apurimac). Se consultó su publicación oficial; el PDF completo no pudo descargarse y no se usó como evidencia de cada itinerario.',
 '## Inventario por provincia',
 '| Provincia | Lugares / sectores | Manifestaciones | Total |', '|---|---:|---:|---:|']
for province in sorted(set(p['province'] for p in catalog)):
    group=[p for p in catalog if p['province']==province]
    places=sum(p['kind']=='Lugar' for p in group)
    out.append(f'| {province} | {places} | {len(group)-places} | {len(group)} |')
out += ['## Cómo se decide una ruta',
 'La distancia geográfica ayuda a encontrar candidatos cercanos. Después se revisa si comparten acceso, hay carretera o sendero publicado y se necesita regresar al punto base. Ríos, barrancos, altura y ramales pueden hacer muy largo un enlace que parece corto en el mapa.',
 'Un circuito local combina paradas del mismo núcleo o acceso. Un corredor incluye desvíos con retorno. Una conexión regional combina varios circuitos y requiere etapas. Los destinos próximos sin acceso contrastado son propuestas pendientes; no se convierten en enlaces viales validados.',
 '**Pacucha → Sóndor:** el enlace publicado parte del Parque de la Sirena de Pacucha: 6 km y 15 minutos en taxi por vía afirmada. Andahuaylas → Parque de la Sirena: 15 km y 30 minutos. La ficha de la laguna usa otra llegada y publica 17 km. Estos son datos de ficha, no tiempos en vivo. [Ficha 578](https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=578).',
 '**Pacucha → Cconoc:** propuesta por etapas: Pacucha → regreso a Andahuaylas → ramal de Curamba desde Kishuara → Abancay → Saywite → Curahuasi → Cconoc. Sóndor se puede visitar antes de salir de Pacucha; los miradores de Curahuasi son desvíos con retorno. Se propone dedicar 3–4 días, no se asegura que ese sea el tiempo mínimo. No existe aquí un cálculo de distancia vial acumulada. Curamba es opcional y debe confirmarse el enlace con el corredor elegido. No es necesario visitar cada lugar intermedio: se presentan las alternativas para elegirlas conscientemente.',
 '## Las 15 propuestas de recorrido']
for number,r in enumerate(routes,1):
    names=' → '.join(by_id[id]['name'] for id in r['stops'])
    out += [f'### {number:02d}. {r["name"]}',f'**{r["province"]} · {r["kind"]} · {r["duration"]}. Base: {r["base"]}.',f'**Secuencia propuesta:** {names}.',r['note'], '**Accesos y evidencia:**']
    for leg in r['legs']:
        source=by_id[leg['source']]
        out.append(f'- {leg["detail"]} [Fuente: {source["name"]}]({source["source"]}).')
    if r['branches']:
        out.append('**Ramales opcionales:**')
        for b in r['branches']:
            source=by_id[b['source']]
            out.append(f'- {b["name"]}: {b["note"]} [Fuente]({source["source"]}).')
out += ['## Discrepancias que afectan a las rutas',
 '- **Pampachiri:** se mantiene el punto OSM del bosque como referencia del paisaje. El punto SIG se encuentra aproximadamente 16 km lejos. El sector Awquimarca tiene ficha independiente; no se le asigna el mismo pin por comodidad.',
 '- **Llaqwa:** la geometría histórica aparece casi junto al templo de Haquira, pero su acceso publicado sale a una comunidad a 18 km. Se conserva la referencia y se excluye el pin.',
 '- **Occocco:** la ficha publica 75 km/40 minutos para un acceso desde Chuquibambilla, mientras el punto del SIG parece próximo a Lliullita. No se afirma que ambas lagunas estén conectadas por una ruta corta.',
 '- **Capuliyoc:** su ubicación en Cachora, Apurímac, está documentada. El punto SIG cae fuera del límite regional antiguo y simplificado utilizado en el mapa. Se mantiene como parada textual hasta conciliar geometría y límite; no se desplaza artificialmente el punto.',
 '- **Karkatera:** se concilia el tramo de túneles con la geometría OpenStreetMap 310159538 y la ficha MINCETUR 9023. Se usa un punto referencial sobre el tramo, no la entrada de un túnel. Qello Yaku y el mirador de Ccoya siguen sin ubicación contrastada.',
 '- **Cconoc:** ficha actual: 29 km/40 minutos desde el paradero de Curahuasi; guía 2023: 21 km/45 minutos desde Curahuasi. Son referencias distintas; confirmar origen y acceso. No se promedia una distancia para ocultar la diferencia.',
 '- **Haquira y San Cristóbal:** fichas y guía difieren en distancias. Se evita derivar tiempos propios a partir de ellas. Las duraciones peatonales que no parecen coherentes requieren revisión local.',
 '- **Choquequirao está en Cusco**, con accesos desde Cachora y Huanipaca, Apurímac. Q’eswachaka también está en Cusco: cruzar el río Apurímac no convierte un lugar en atractivo de la región Apurímac.',
 '## Catálogo completo de las 135 referencias',
 '«Referencial» significa que el punto tiene fuente y pasa la comprobación básica del límite, no que sea la entrada verificada. «Conflicto» excluye el pin. «Sin coordenadas» conserva el atractivo en texto. Las celebraciones y sabores no se representan como puntos geográficos fijos.']
for province in sorted(set(p['province'] for p in catalog)):
    out.append(f'### {province}')
    for kind in ['Lugar','Celebración','Cultura y sabores']:
        entries=[p for p in catalog if p['province']==province and p['kind']==kind]
        if not entries: continue
        out += [f'**{kind}: {len(entries)} referencias.**','| Nombre y fuente | Distrito / sector | Ubicación y observaciones |','|---|---|---|']
        for p in entries:
            note=p['coordinateNote'] or p['coordinateStatus']
            out.append(f'| [{p["name"]}]({p["source"]}) · {p["id"]} | {p["district"]} | {p["coordinateStatus"]}. {note} |')
out += ['## Cercanía entre todos los puntos con coordenadas',
 'El archivo `inventario-apurimac.csv` incluye, para cada uno de los 62 puntos utilizables, sus tres vecinos más próximos por distancia geodesica (Haversine, radio terrestre 6371 km). No se asignan vecinos a lugares sin coordenadas o en conflicto. Estas distancias son entre referencias del paisaje, no necesariamente entradas. No son kilómetros por carretera ni una sugerencia automática de visita.',
 'Los lugares restantes se mantienen por provincia y distrito en el catálogo: cada ficha ofrece sus accesos desde una localidad base. Antes de extender un circuito a esos lugares se debe confirmar el enlace entre paradas, disponibilidad local, estado de conservación y condiciones de temporada.',
 '## Aplicación y límites de la implementación',
 'La pantalla de rutas permite elegir las 15 propuestas, consultar el orden completo y sus ramales, explorar en 3D los puntos con coordenadas, buscar las 135 referencias por nombre/distrito/provincia y descargar este informe y el CSV. Las flechas de un circuito se detienen en sus extremos: no saltan del último destino al primero de otro circuito.',
 'El mapa conserva el relieve real y las imágenes satelitales. Las señales de destino no son reconstrucciones 3D de monumentos. No hay trazados viales calculados, tráfico en vivo, reservas, precios confirmados ni un optimizador automático. El constructor libre y los presupuestos del prototipo siguen siendo borradores ilustrativos; deben contrastarse con los circuitos investigados.',
 'No se guardaron ni publicaron teléfonos o correos personales de responsables del inventario.']
text='\n\n'.join(out)+'\n'
import re
text=re.sub(r'(?m)(^\|[^\n]*\|)\n\n(?=\|)', r'\1\n', text)
(ROOT/'research/INVESTIGACION-APURIMAC.md').write_text(text,encoding='utf-8')
(ROOT/'public/research/investigacion-apurimac.md').write_text(text,encoding='utf-8')
print('Informe generado: 135 entradas y 15 propuestas; fuentes individuales incluidas.')
