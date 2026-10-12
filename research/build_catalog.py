"""Build a sourced snapshot, never infer driving distances from coordinates."""
import csv, json, math
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
raw = json.loads((ROOT/'research/mincetur-apurimac-raw.geojson').read_text(encoding='utf-8'))
facts = json.loads((ROOT/'research/fichas-facts.json').read_text(encoding='utf-8'))
ring = json.loads((ROOT/'src/data/apurimac-boundary.json').read_text())['geometry']['coordinates'][0]
def inside(x,y):
    return bool(sum((a[1]>y)!=(b[1]>y) and x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0] for a,b in zip(ring,ring[1:]))%2)
def title(s):
    return ' '.join(w.lower() if w.lower() in ['de','del','la','las','los','y','o','el'] else w.capitalize() for w in s.split())
fallback = {'8892':'Pueblo histórico de Mutca','8893':'Templo San Felipe de Mutca','582':'Templo San Agustín de Cotabambas',
 '4672':'Casa hacienda de Illanya','8646':'Casa hacienda de Casinchihua','5923':'Tereccmana','2041':'Mirador de Cachicunca',
 '1798':'Camino inca Huanipaca–Choqekiraw–Cachora','603':'Aguas minerales de Hualalachi',
 '4269':'Bosque de titankas o puyas de Raimondi','9021':'Condorcoccha','1419':'Templo de Tambobamba',
 '8643':'Casa de David Samanez Ocampo','2042':'Mirador de Huascatay'}
issues = {
 '422':'El SIG lo sitúa casi junto a San Pedro de Haquira; la ficha publica un acceso de 18 km hasta Llaqwa. Coordenada excluida.',
 '584':'La ficha menciona un acceso de 75 km y 40 minutos desde Chuquibambilla, incompatible con una lectura simple del punto. Revisar acceso y ubicación.',
 '1798':'Es un camino interregional, no una atracción puntual íntegramente en Apurímac. Choquequirao está en Cusco.',
 '9023':'La ficha actual describe los Túneles de Karkatera en Abancay; el SIG antiguo ubica una ruta en Huanipaca. Coordenada excluida.',
 '8007':'El punto del SIG representa un río, no un acceso único para visitantes. Las actividades se organizan por sectores.',
 '602':'El cañón es un paisaje extenso: usar sus miradores y accesos, no interpretar este punto como una entrada.',
 '8729':'Río limítrofe; punto fuera del polígono regional referencial. No se representa como acceso puntual.',
 '8066':'La ficha confirma Cachora, Apurímac, pero el punto queda fuera del límite cartográfico antiguo usado en la app. Se conserva el lugar sin pin hasta conciliar límite y coordenada.',
}
catalog=[]
for f in raw['features']:
    p=f['properties']; key=p['cod_reg']
    if key=='4672': continue # Current replacement 11102, same hacienda, not two attractions.
    current=facts.get(key,{})
    category_text=current.get('location',{}).get('Categoría','')
    cat=int(category_text[0]) if category_text and category_text[0] in '12345' else int(p['id_categoria1'])
    name=title(current.get('title') or fallback.get(key,p['des_nombre']))
    kind='Celebración' if cat==5 or key=='8320' else 'Cultura y sabores' if cat==3 else 'Lugar'
    coords=f['geometry']['coordinates'] if f['geometry'] else None
    note=issues.get(key,'')
    if not current.get('title'): note=('La ficha actual no devuelve una descripción; registro conservado de la capa SIG. '+note).strip()
    status='conflicto' if key in issues else 'referencial' if coords and kind=='Lugar' and inside(*coords) else 'sin-coordenadas'
    if kind!='Lugar': coords=None; status='no-puntual'
    if key=='8264':
        coords=[-73.4572586,-14.2810037]; status='referencial'
        note='El punto del SIG difiere aproximadamente 16 km del bosque delimitado en OSM; se usa la referencia OSM del paisaje, no una entrada.'
    province=title(current.get('location',{}).get('Provincia') or p['des_provincia'])
    district=title(current.get('location',{}).get('Distrito') or p['des_distrito'])
    catalog.append({'id':key,'name':name,
      'province':province,'district':district,'kind':kind,'category':{1:'Naturaleza',2:'Patrimonio',3:'Cultura y sabores',4:'Conservación',5:'Celebración'}[cat],
      'source':current.get('source') if current.get('title') else 'https://sigmincetur.mincetur.gob.pe/turismo/index.html','origin':'SIGMINCETUR + ficha' if current.get('title') else 'SIGMINCETUR histórico',
      'coordinates':coords if status=='referencial' else None,'coordinateStatus':status,'coordinateNote':note,
      'coordinateSource':'https://www.openstreetmap.org/way/682568539' if key=='8264' else 'https://sigmincetur.mincetur.gob.pe/turismo/index.html',
      'access':current.get('access',''),'parent':None,'aliases':[]})
for key in ['13092','13295','14383','12256','14127','14655','11102','13915']:
    current=facts[key]; loc=current['location']
    coords=next(f['geometry']['coordinates'] for f in raw['features'] if f['properties']['cod_reg']=='4672') if key=='11102' else None
    catalog.append({'id':key,'name':title(current['title']),'province':title(loc['Provincia']),'district':title(loc['Distrito']),
      'kind':'Lugar','category':'Naturaleza' if key in ['14383','12256','13915'] else 'Patrimonio',
      'source':current['source'],'origin':'Ficha MINCETUR adicional','coordinates':coords,
      'coordinateStatus':'referencial' if coords else 'sin-coordenadas',
      'coordinateNote':'Registro actual 11102; sustituye el registro SIG 4672 de la misma hacienda.' if key=='11102' else 'Ubicación administrativa y acceso documentados; sin coordenada contrastada en esta investigación.',
      'coordinateSource':'https://sigmincetur.mincetur.gob.pe/turismo/index.html' if coords else None,
      'access':current['access'],'parent':None,'aliases':['4672'] if key=='11102' else []})
guide='https://repositorio.promperu.gob.pe/bitstreams/1dad4376-4311-4459-9cd4-42f34245a97b/download'
sernanp='https://visitaareasnaturales.sernanp.gob.pe/anps/santuario-nacional-de-ampay/'
extra=[
 ('waywaka','Mirador de Waywaka / Huayhuaca','Andahuaylas','Andahuaylas',None),
 ('sachapucro','Petroglifos de Sachapucro','Andahuaylas','Por confirmar',None),
 ('ayamachay','Ayamachay','Andahuaylas','Pampachiri','8264'),
 ('aukillaqta','Aukillaqta','Andahuaylas','Pampachiri','8264'),
 ('larkay','Aguas termales de Larkay','Andahuaylas','Pampachiri',None),
 ('catarata-pampachiri','Catarata de Pampachiri','Andahuaylas','Pampachiri',None),
 ('qello-yaku','Cascada Qello Yaku','Abancay','Por confirmar',None),
 ('ccoya','Mirador y comunidad de Ccoya','Abancay','Huanipaca',None),
 ('angasqocha','Laguna Angasq’ocha','Abancay','Dentro de Ampay','577'),
 ('usphaqocha','Laguna Usphaq’ocha / Uspaccocha','Abancay','Dentro de Ampay','577'),
 ('huillcaqocha','Laguna Huillcaq’ocha','Abancay','Dentro de Ampay','577'),
 ('intimpas','Bosque de intimpas','Abancay','Dentro de Ampay','577'),
 ('bosque-enano','Bosque enano de Ampay','Abancay','Dentro de Ampay','577'),
 ('abra-ampay','Abra del nevado Ampay','Abancay','Dentro de Ampay','577'),
 ('faccha','Catarata Faccha','Abancay','Dentro de Ampay','577'),
]
for key,name,province,district,parent in extra:
    sn=province=='Abancay' and parent=='577'
    catalog.append({'id':key,'name':name,'province':province,'district':district,'kind':'Lugar','category':'Naturaleza' if sn else 'Paisaje y cultura',
      'source':sernanp if sn else guide,'origin':'SERNANP: sector interno' if sn else 'Guía PROMPERÚ 2023',
      'coordinates':None,'coordinateStatus':'sin-coordenadas','coordinateNote':'Referencia documentada; no se inventa un pin. '+('Sector dentro del atractivo principal, no un destino regional independiente.' if parent else ''),
      'coordinateSource':None,'access':'Consultar recorrido autorizado de Ampay.' if sn else 'Consultar accesos locales; referencia en la guía 2023.',
      'parent':parent,'aliases':[]})
catalog.append({'id':'sig-8320-tres-cruces','name':'Tres Cruces de Mamara (registro histórico)',
 'province':'Grau','district':'Mamara','kind':'Lugar','category':'Patrimonio','source':'https://sigmincetur.mincetur.gob.pe/turismo/index.html',
 'origin':'SIGMINCETUR histórico','coordinates':None,'coordinateStatus':'conflicto',
 'coordinateNote':'La capa SIG lo registró con código 8320; la ficha actual de ese código describe Carnaval de Sacclaya en Andahuaylas. Se conserva separado, sin atribuirle esa ficha ni un pin.',
 'coordinateSource':None,'access':'Acceso sin confirmar. Referencia histórica que requiere revisión con DIRCETUR.','parent':None,'aliases':[]})
overrides = json.loads((ROOT/'research/coordinate-overrides.json').read_text(encoding='utf-8'))
for entry in catalog:
    if entry['id'] in overrides:
        entry.update(overrides[entry['id']])
catalog.sort(key=lambda x:(x['province'],x['name']))
out=ROOT/'src/data/apurimac-catalog.json'
out.write_text(json.dumps(catalog,ensure_ascii=False,indent=2),encoding='utf-8')
public=ROOT/'public/research'; public.mkdir(exist_ok=True)
def km(a,b):
    lon1,lat1,lon2,lat2=map(math.radians,[*a,*b]); dlat=lat2-lat1; dlon=lon2-lon1
    return 6371*2*math.asin(math.sqrt(math.sin(dlat/2)**2+math.cos(lat1)*math.cos(lat2)*math.sin(dlon/2)**2))
with (public/'inventario-apurimac.csv').open('w',encoding='utf-8-sig',newline='') as handle:
    writer=csv.writer(handle); writer.writerow(['id','nombre','provincia','distrito','tipo','categoria','origen','longitud','latitud','estado_coordenada','observaciones','fuente','vecinos_linea_recta_no_carretera'])
    for p in catalog:
        nearby=sorted([(km(p['coordinates'],x['coordinates']),x['name']) for x in catalog if x['coordinates'] and p['coordinates'] and p['id']!=x['id']])[:3]
        writer.writerow([p['id'],p['name'],p['province'],p['district'],p['kind'],p['category'],p['origin'],*(p['coordinates'] or ['', '']),p['coordinateStatus'],p['coordinateNote'],p['source'],'; '.join(f'{name}: {distance:.1f} km geodesicos' for distance,name in nearby)])
print(json.dumps({'total':len(catalog),'kinds':dict(Counter(p['kind'] for p in catalog)),
 'mapPoints':sum(bool(p['coordinates']) for p in catalog),'provinces':dict(Counter(p['province'] for p in catalog))},ensure_ascii=True))
