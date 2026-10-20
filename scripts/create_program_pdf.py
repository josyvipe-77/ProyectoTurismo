"""Create the downloadable base programme from the same data as the website.

First run: node scripts/export_program_data.mjs
Dependencies: reportlab, Pillow (authoring only, never required by npm build).
"""
from pathlib import Path
import json
from html import escape
from math import cos, radians
import shutil

from PIL import Image as PILImage, ImageOps
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Image, Flowable

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'tmp/materiales/program-data.json').read_text(encoding='utf-8'))
OUT = ROOT / 'output/pdf/programa-base-jacs-destinos.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
TMP = ROOT / 'tmp/pdfs/programa-base'
TMP.mkdir(parents=True, exist_ok=True)
INK = colors.HexColor('#253e34')
BLUE = colors.HexColor('#28566c')
MUTED = colors.HexColor('#58665e')
PALE = colors.HexColor('#e9eee6')
W, H = A4
CW = W - 84

for name, filename in [('Jacs', 'arial.ttf'), ('JacsBold', 'arialbd.ttf'), ('JacsItalic', 'ariali.ttf')]:
    font_path = Path('C:/Windows/Fonts') / filename
    if not font_path.exists():
        raise RuntimeError('Arial TTF is required for this authoring script; configure an equivalent Unicode font.')
    pdfmetrics.registerFont(TTFont(name, str(font_path)))
pdfmetrics.registerFontFamily('Jacs', normal='Jacs', bold='JacsBold', italic='JacsItalic', boldItalic='JacsBold')
styles = {
    'body': ParagraphStyle('body', fontName='Jacs', fontSize=10, leading=15, textColor=INK, spaceAfter=9),
    'small': ParagraphStyle('small', fontName='Jacs', fontSize=8, leading=11, textColor=MUTED, spaceAfter=6),
    'label': ParagraphStyle('label', fontName='JacsBold', fontSize=9, leading=13, textColor=BLUE, spaceAfter=10),
    'title': ParagraphStyle('title', fontName='JacsBold', fontSize=25, leading=30, textColor=INK, spaceAfter=12),
    'cover': ParagraphStyle('cover', fontName='JacsBold', fontSize=33, leading=39, textColor=INK, spaceAfter=18),
    'h': ParagraphStyle('h', fontName='JacsBold', fontSize=12, leading=16, textColor=INK, spaceBefore=9, spaceAfter=6),
}


def p(text, style='body'):
    return Paragraph(escape(text).replace('\n', '<br/>'), styles[style])


def photo(fiche, height=150):
    gallery = json.loads((ROOT / f'public/images/mincetur/galleries/{fiche}.json').read_text(encoding='utf-8'))
    source = ROOT / 'public' / gallery['photos'][0]['full'].lstrip('/')
    im = ImageOps.fit(PILImage.open(source).convert('RGB'), (1500, round(1500 * height / CW)))
    target = TMP / f'{fiche}-{height}.jpg'
    im.save(target, quality=91)
    return [Image(str(target), width=CW, height=height), Spacer(1, 5), p(f'{gallery["name"]} | Fuente de imagen: ficha MINCETUR {fiche}.', 'small')]


class ProgrammeMap(Flowable):
    def __init__(self):
        super().__init__()
        self.width, self.height = CW, 330

    def draw(self):
        c = self.canv
        boundary = json.loads((ROOT / 'src/data/apurimac-boundary.json').read_text(encoding='utf-8'))['geometry']['coordinates'][0]
        positions = [x['coordinates'] for x in DATA['places'] if x.get('coordinates')]
        c.setFillColor(PALE)
        c.roundRect(0, 0, CW, 330, 8, fill=1, stroke=0)
        # Regional locator, plus a larger view of the programme's points.
        for panel, coords in [((12, 34, 160, 260), boundary), ((190, 34, CW - 202, 260), positions)]:
            x, y, width, height = panel
            lon = [q[0] for q in coords]; lat = [q[1] for q in coords]
            lowx, highx, lowy, highy = min(lon), max(lon), min(lat), max(lat)
            sx = (width - 38) / ((highx-lowx)*cos(radians(-14)))
            sy = (height - 38) / (highy-lowy)
            scale = min(sx, sy)
            def project(q):
                return (x+width/2+(q[0]-(lowx+highx)/2)*cos(radians(-14))*scale,
                        y+height/2+(q[1]-(lowy+highy)/2)*scale)
            if coords is boundary:
                path = c.beginPath()
                for i, q in enumerate(boundary):
                    u, v = project(q)
                    if i == 0: path.moveTo(u, v)
                    else: path.lineTo(u, v)
                path.close()
                c.setFillColor(colors.HexColor('#d1dfd0')); c.setStrokeColor(colors.HexColor('#94ad99'))
                c.drawPath(path, fill=1, stroke=1)
                c.setFont('JacsBold', 9); c.setFillColor(INK); c.drawString(x+8, 305, 'APURÍMAC')
                for q in positions:
                    u,v=project(q);c.setFillColor(BLUE);c.circle(u,v,2,fill=1,stroke=0)
            else:
                c.setFont('JacsBold', 9); c.setFillColor(INK); c.drawString(x,305,'LUGARES DEL PROGRAMA')
                offsets = [(3,-15), (0,0), (-18,-10), (-18,15), (9,15), (22,-14), (0,24)]
                labels=['1','2','3','4','5a','5b','5c']
                for i, place in enumerate(DATA['places']):
                    u,v=project(place['coordinates']);dx,dy=offsets[i]
                    c.setStrokeColor(BLUE);c.line(u,v,u+dx,v+dy)
                    c.setFillColor(BLUE);c.circle(u,v,2,stroke=0,fill=1)
                    c.setFillColor(INK);c.roundRect(u+dx-10,v+dy-8,20,16,5,stroke=0,fill=1)
                    c.setFillColor(colors.white);c.setFont('JacsBold',8);c.drawCentredString(u+dx,v+dy-3,labels[i])
        c.setFillColor(MUTED);c.setFont('Jacs',8);c.drawString(20,15,'Ubicaciones de referencia. El esquema no representa carreteras ni senderos.')


def footer(c, doc):
    c.setFillColor(colors.HexColor('#f8f6ef')); c.rect(0, 0, W, H, fill=1, stroke=0)
    # onPage runs before the flowables: background, running label and folio only.
    c.setFont('JacsBold', 9); c.setFillColor(INK); c.drawString(42, H-27, 'JACS DESTINOS')
    c.setFont('Jacs', 8); c.setFillColor(MUTED); c.drawRightString(W-42, H-27, 'PROGRAMA BASE | COIL USC-UNAMBA')
    c.setStrokeColor(colors.HexColor('#d0d9ce'));c.line(42,35,W-42,35)
    c.setFont('Jacs',8);c.drawString(42,22,'Propuesta académica. Accesos y servicios por coordinar.')
    c.drawRightString(W-42,22,str(doc.page))


story = [p('FOTOGRAFÍA / NATURALEZA / PATRIMONIO', 'label'),
         p('Apurímac a través\nde tu objetivo.', 'cover'),
         p('Experiencias que se convierten en memorias.'), *photo('8264', 235), Spacer(1, 14),
         p('5 jornadas | 4 noches de estancia | Base en Abancay | 6-12 participantes', 'label'),
         p(DATA['experience']['audience']),
         p('Dos territorios, una mirada compartida', 'h'),
         p('Un equipo académico de Apurímac y Galicia diseña una experiencia para observar el paisaje, interpretar el patrimonio y fotografiar con respeto.'),
         p('Este PDF presenta el programa general. El planificador de la web permite elegir el mes, la variante de Ampay y los miradores. El alojamiento no está incluido. No hay reservas ni pagos en el sitio.', 'small'),
         PageBreak(), p('Un territorio para observar', 'title'),
         p('Lugares del programa y variantes de la quinta jornada. El viaje comienza y termina en Abancay.'), ProgrammeMap(), Spacer(1,14)]
legend = [('1', 'Taraccasa - ciudad y paisaje'), ('2', 'Pampachiri - arquitectura y entorno'), ('3', 'Pachachaca - patrimonio construido'), ('4', 'Ampay - conservación y territorio'), ('5a', 'San Cristóbal - variante Curahuasi'), ('5b', 'Capitán Rumi - variante Curahuasi'), ('5c', 'Capuliyoc - variante Cachora')]
for label, title in legend: story.append(p(f'{label}  {title}'))
story += [p('Las opciones 5a, 5b y 5c son alternativas. Combinarlas exige revisar los traslados y puede ampliar la estancia. Los puntos son referencias de los atractivos; no garantizan accesos GPS.', 'small'), PageBreak()]

for day in DATA['days']:
    story += [p(f'JORNADA {day["day"]} / {day["theme"].upper()}', 'label'), p(day['title'], 'title')]
    story += photo(day.get('photoId') or '3055', 138)
    story += [p(day['description']), p('Qué nos cuenta este lugar', 'h'), p(day['culturalReading']),
              p('Una mirada para llevarte', 'h'), p(day['observation'])]
    left = [p('Horario estimado', 'h')]
    if day['schedule']:
        for stop in day['schedule']: left.append(p(f'{stop["time"]}  {stop["activity"]}', 'small'))
    else:
        left.append(p('Se define al elegir una variante y confirmar sus accesos. El programa no fija un horario para la combinación de varios miradores.', 'small'))
    right = [p('Preparar la jornada', 'h'), p('Paradas: '+ ' / '.join(day['stops']), 'small'),
             p(day['effort'],'small'), p('Comidas: '+day['meals'],'small'),
             p('Si cambian las condiciones: '+day['weatherPlan'],'small'),
             p('Por coordinar: '+day['pending'],'small')]
    table = Table([[left,right]], colWidths=[CW*.5,CW*.5])
    table.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(0,0),16),('LEFTPADDING',(1,0),(1,0),12)]))
    story += [table, PageBreak()]

story += [p('Preparar el viaje', 'title'),p('Servicios previstos en el diseño', 'label')]
for title, detail in DATA['experience']['services']:story += [p(title,'h'),p(detail)]
story += [p('Exclusiones','h'),p(DATA['experience']['exclusions']),
          p('Antes de salir','h'),p('Confirmar fecha, accesos, registro, guías y permisos. Revisar el esfuerzo y la adaptación a la altitud con el acompañante. Llevar agua, protección solar, abrigo y equipo fotográfico propio. La lluvia, la visibilidad o un cierre pueden requerir cambios.'),
          p('Fotografía respetuosa','h'),p('Camina por senderos autorizados, lleva tus residuos de regreso, observa la fauna a distancia y pide permiso antes de fotografiar personas. No se garantizan avistamientos ni accesibilidad universal.'),PageBreak(),
          p('Fuentes y créditos','title'),p('Un proyecto compartido','h'),p(DATA['materials']['projectName']),p(DATA['materials']['approval']+'. Semestre 2026-II. Plan presentado por el Dr. Manuel Jesús Ibarra Cabrera. La aprobación corresponde al plan académico.','small'),
          p('Fuentes para conocer los lugares','h')]
sources={s['url']:s['label'] for d in DATA['days'] for s in d['culturalSources']}
for url,label in sources.items():
    story += [p(label,'label'),Paragraph(f'<link href="{escape(url)}" color="#28566c">{escape(url)}</link>', styles['small'])]
story += [p('Fotografías y mapa','h'),p(DATA['materials']['photoCredits'],'small'),
          p('Mapa: límite regional y coordenadas del inventario local del proyecto. Las fuentes y la precisión de cada ubicación están documentadas en el catálogo web. No se ha calculado una ruta vial.','small'),
          p('Sigue el cuaderno visual','h'),Paragraph('<link href="https://www.instagram.com/jacsdestinos/" color="#28566c">Instagram: @jacsdestinos</link>',styles['body']),
          p('JACS Destinos | Apurímac y Galicia | Fotografía, naturaleza y patrimonio.','small')]

doc=SimpleDocTemplate(str(OUT),pagesize=A4,rightMargin=42,leftMargin=42,topMargin=49,bottomMargin=47,title='Apurímac a través de tu objetivo - Programa base',author='JACS Destinos',pageCompression=1)
doc.build(story,onFirstPage=footer,onLaterPages=footer)
public=ROOT/'public/materiales'/OUT.name
shutil.copy2(OUT,public)
print(OUT)
