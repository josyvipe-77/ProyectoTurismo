"""Create two illustrated brochures using the team's existing presentation artwork.

Authoring only: reportlab and Pillow. The website serves the finished PDF.
Source artwork: output/imagegen/presentacion-jacs-unificada (kept locally).
"""
from hashlib import sha256
from html import escape
from io import BytesIO
import json
from pathlib import Path
import shutil

from PIL import Image, ImageOps
import pypdfium2 as pdfium
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / 'output/imagegen/presentacion-jacs-unificada'
OUT = ROOT / 'output/pdf/folletos-jacs-apurimac.pdf'
PUBLIC = ROOT / 'public/materiales'
W, H = A4
INK, BLUE, GOLD = '#123e31', '#235b77', '#d89423'
PAPER, PALE, MUTED = '#faf8f1', '#e9eee6', '#52645d'
for name, filename in [('Jacs', 'arial.ttf'), ('JacsBold', 'arialbd.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(Path('C:/Windows/Fonts') / filename)))

def text(c, value, x, top, width, size=11, color=INK, bold=False, leading=None):
    style = ParagraphStyle('copy', fontName='JacsBold' if bold else 'Jacs',
                           fontSize=size, leading=leading or size * 1.4,
                           textColor=colors.HexColor(color))
    p = Paragraph(escape(value).replace('\n', '<br/>'), style)
    _, height = p.wrap(width, H)
    p.drawOn(c, x, top - height)
    return top - height

def picture(c, filename, x, y, width, height, crop):
    # Select the visual panel of an existing slide, excluding its text and footer.
    with Image.open(ART / filename) as im:
        a, b, d, e = crop
        panel = im.crop((round(a * im.width), round(b * im.height),
                         round(d * im.width), round(e * im.height)))
        panel = ImageOps.fit(panel.convert('RGB'), (round(width * 3), round(height * 3)),
                             method=Image.Resampling.LANCZOS)
        data = BytesIO()
        panel.save(data, format='JPEG', quality=94)
        data.seek(0)
        c.drawImage(ImageReader(data), x, y, width, height)

def background(c, label, page):
    c.setFillColor(colors.HexColor(PAPER)); c.rect(0, 0, W, H, fill=1, stroke=0)
    c.drawImage(str(ROOT / 'public/images/jacs-destinos-logo-transparent.png'),
                34, H - 79, 135, 55, preserveAspectRatio=True, mask='auto')
    text(c, 'COIL USC + UNAMBA', W - 205, H - 35, 170, 9, BLUE, True)
    text(c, label, W - 205, H - 53, 170, 9, MUTED)
    c.setFillColor(colors.HexColor(INK)); c.rect(0, 0, W, 48, fill=1, stroke=0)
    text(c, 'JACS DESTINOS  /  EXPERIENCIAS QUE SE CONVIERTEN EN MEMORIAS',
         34, 33, W - 90, 8, '#ffffff', True)
    text(c, str(page).zfill(2), W - 49, 33, 22, 8, '#e9bd63', True)

def link(c, label, url, x, top, width):
    bottom = text(c, label, x, top, width, 10, BLUE, True)
    c.linkURL(url, (x, bottom - 2, x + width, top), relative=0)

def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=A4)
    c.setTitle('JACS Destinos - Apurímac a través de tu objetivo | Dos folletos')
    c.setAuthor('JACS Destinos - COIL USC / UNAMBA')
    c.setSubject('Experiencia fotográfica académica; imágenes ilustrativas de la presentación del equipo')
    background(c, '01 / La experiencia', 1)
    text(c, 'APURÍMAC A TRAVÉS\nDE TU OBJETIVO', 34, H - 105, W - 68, 29, INK, True, 33)
    text(c, 'Cinco jornadas para observar, interpretar y fotografiar.',
         34, H - 181, W - 68, 11, BLUE)
    picture(c, '01-portada.png', 34, 342, W - 68, 278, (.615, .08, 1, .89))
    text(c, 'Composición ilustrativa reutilizada de la presentación del equipo.',
         34, 333, W - 68, 8, MUTED)
    text(c, 'Un viaje para mirar con tiempo', 34, 305, W - 68, 18, INK, True)
    text(c, 'Bosques, formaciones de piedra, puentes y miradores: una propuesta de fotografía '
         'de naturaleza y patrimonio, con salida y regreso a Abancay. Cada jornada invita '
         'a construir una imagen y una lectura propia del territorio.', 34, 273, W - 68, 11)
    for index, (title, caption) in enumerate([
        ('5 días / 4 noches', 'Base en Abancay'),
        ('6-12 participantes', 'Personas adultas aficionadas'),
        ('Fotografía + cultura', 'Naturaleza y patrimonio'),
    ]):
        x = 34 + index * (W - 68) / 3
        c.setFillColor(colors.HexColor(PALE)); c.roundRect(x, 143, (W - 80) / 3, 56, 6, fill=1, stroke=0)
        text(c, title, x + 10, 188, (W - 135) / 3, 11, INK, True)
        text(c, caption, x + 10, 167, (W - 135) / 3, 8, MUTED)
    text(c, 'Diseño académico. Alojamiento por cuenta de cada participante. Accesos, servicios, '
         'guianza y precio sujetos a confirmación. Respeta los senderos y pide permiso antes '
         'de fotografiar personas.', 34, 127, W - 68, 8.5, MUTED)
    link(c, 'Conoce el proyecto: jacs.aureasoft.com', 'https://jacs.aureasoft.com/', 34, 80, 285)
    link(c, '@jacsdestinos', 'https://www.instagram.com/jacsdestinos/', W - 160, 80, 126)
    c.showPage()

    background(c, '02 / El recorrido', 2)
    text(c, 'CINCO JORNADAS,\nCINCO MANERAS DE MIRAR', 34, H - 102, W - 68, 25, INK, True, 30)
    text(c, 'Un programa base con tiempo para observar y compartir.', 34, H - 172, W - 68, 10.5, BLUE)
    rows = [
        ('05-dia-1-taraccasa.png', 'Taraccasa', 'La primera mirada al valle',
         'Abancay y Tamburco antes de la panorámica. Componer con la ciudad, las montañas y la profundidad del paisaje.'),
        ('06-dia-2-pampachiri.png', 'Pampachiri', 'Las formas del tiempo',
         'Formaciones de piedra, siluetas y texturas. Paqpachaca como parada propuesta; sectores y accesos por confirmar.'),
        ('07-dia-3-pachachaca.png', 'Pachachaca', 'La memoria en piedra',
         'El puente colonial y el tramo autorizado de ribera. Observar arcos, materiales y la relación entre patrimonio y río.'),
        ('08-dia-4-ampay.png', 'Ampay', 'El bosque y el agua',
         'Bosque de intimpa y recorrido base a Angasq’ocha. Acceso, esfuerzo y condiciones se coordinan con el santuario.'),
        ('09-dia-5-canon-apurimac.png', 'Cañón del Apurímac', 'La mirada que permanece',
         'San Cristóbal como variante base de mirador. Capuliyoc y Capitán Rumi son alternativas para otros ajustes del programa.'),
    ]
    for i, (filename, title, subtitle, description) in enumerate(rows):
        y = 538 - i * 94
        picture(c, filename, 34, y, 136, 82, (.65, .29, 1, .84))
        text(c, f'0{i + 1} / {subtitle}', 187, y + 82, W - 221, 8.5, BLUE, True)
        text(c, title, 187, y + 64, W - 221, 16, INK, True)
        text(c, description, 187, y + 39, W - 221, 9, MUTED, leading=12.5)
    text(c, 'Imágenes ilustrativas reutilizadas de las láminas 01 y 05-09 del equipo; no son '
         'un registro fotográfico del recorrido. Horarios, servicios y accesos por coordinar. '
         'Alojamiento excluido. Consulta el programa base para preparar tu visita.',
         34, 144, W - 68, 8.2, MUTED)
    link(c, 'Mapa Perú-España: plan-turistico.vercel.app', 'https://plan-turistico.vercel.app/',
         34, 90, W - 68)
    c.save()
    shutil.copy2(OUT, PUBLIC / OUT.name)
    with pdfium.PdfDocument(str(OUT)) as doc:
        preview = doc[0].render(scale=1).to_pil()
        preview.thumbnail((420, 594), Image.Resampling.LANCZOS)
        preview.save(PUBLIC / 'folletos-jacs-portada.webp', quality=88)
    inputs = ['01-portada.png'] + [row[0] for row in rows]
    provenance = {
        'method': 'Diseño PDF con texto seleccionable y paneles visuales de la presentación existente del equipo.',
        'imageType': 'Composiciones ilustrativas creadas previamente con IA; no se presentan como fotografías de campo.',
        'artwork': [{'file': str((ART / name).relative_to(ROOT)).replace('\\', '/'),
                     'sha256': sha256((ART / name).read_bytes()).hexdigest()} for name in inputs],
        'outputSha256': sha256(OUT.read_bytes()).hexdigest(),
    }
    (PUBLIC / 'procedencia-folletos.json').write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(OUT)

if __name__ == '__main__':
    main()
