"""Author a 40-second photographic film and optional free Spanish narration.

Dependencies: Pillow, imageio-ffmpeg; edge-tts only with --speech.
Install authoring dependencies outside node_modules. No media service is used by the website.
"""
import argparse
import asyncio
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
if (ROOT / 'tmp/tool-deps').exists():
    sys.path.insert(0, str(ROOT / 'tmp/tool-deps'))
from PIL import Image, ImageDraw, ImageFont, ImageOps
import imageio_ffmpeg

OUT = ROOT / 'public/materiales'
TMP = ROOT / 'tmp/materiales'
OUT.mkdir(parents=True, exist_ok=True)
TMP.mkdir(parents=True, exist_ok=True)
metadata_path = ROOT / 'src/data/project-materials.json'
metadata = json.loads(metadata_path.read_text(encoding='utf-8'))
WIDTH, HEIGHT, FPS = 1280, 720, 24
FONT_DIR = Path('C:/Windows/Fonts')
font = lambda size, bold=False: ImageFont.truetype(str(FONT_DIR / ('arialbd.ttf' if bold else 'arial.ttf')), size)
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

SCENES = [
    ('8264', 'Apurímac a través\nde tu objetivo.', 'JACS DESTINOS', 'Apurímac, a través de tu objetivo. Una invitación a mirar.'),
    ('4678', 'La primera mirada', '01 / TARACCASA', 'Cinco jornadas de fotografía y patrimonio, con base en Abancay.'),
    ('8264', 'Las formas del tiempo', '02 / PAMPACHIRI', 'Pampachiri: las formas del tiempo invitan a mirar con atención.'),
    ('31', 'La memoria en piedra', '03 / PACHACHACA', 'Pachachaca: la memoria del territorio se encuentra también en sus puentes.'),
    ('577', 'El bosque y el agua', '04 / AMPAY', 'Ampay: observar el bosque y el agua, cuidar cada detalle.'),
    ('3055', 'La mirada que permanece', '05 / MIRADORES DEL CAÑÓN', 'Los miradores del cañón: una nueva perspectiva para comprender el paisaje.'),
    ('31', 'Dos territorios,\nuna mirada compartida.', 'APURÍMAC / GALICIA', 'Somos JACS Destinos. Apurímac y Galicia, dos territorios, una mirada compartida.'),
    ('3055', '@jacsdestinos', 'ACOMPAÑA NUESTRO CUADERNO VISUAL', 'Síguenos en Instagram. Propuesta académica, alojamiento no incluido.'),
]
SHOTS = [
    [('8264', 2), ('577', 1)], [('4678', 0), ('4678', 1)],
    [('8264', 0), ('8264', 1)], [('31', 0), ('31', 1)],
    [('577', 0), ('577', 1)], [('3055', 0), ('3055', 1)],
    [('31', 2), ('4678', 2)], [('3055', 2), ('8264', 3)],
]
metadata['video']['script'] = ' '.join(scene[3] for scene in SCENES)
video_script_hash = hashlib.sha256(metadata['video']['script'].encode()).hexdigest()


def lines(text, face, max_width, draw):
    result=[]
    for para in text.split('\n'):
        line=''
        for word in para.split():
            candidate=(line+' '+word).strip()
            if draw.textlength(candidate,font=face)>max_width and line:
                result.append(line);line=word
            else:line=candidate
        result.append(line)
    return result


def moving_photo(source, progress):
    zoom=1.02+progress*.045
    cropped=ImageOps.fit(source,(int(WIDTH*zoom),int(HEIGHT*zoom)),centering=(.5,.45))
    x=(cropped.width-WIDTH)//2;y=(cropped.height-HEIGHT)//2
    return cropped.crop((x,y,x+WIDTH,y+HEIGHT)).convert('RGBA')


def frame(sources, scene, index, progress):
    first, second = SHOTS[index]
    blend = max(0, min(1, (progress-.43)/.14))
    if blend == 0:
        picture = moving_photo(sources[first], progress)
    elif blend == 1:
        picture = moving_photo(sources[second], progress)
    else:
        picture = Image.blend(moving_photo(sources[first], progress), moving_photo(sources[second], progress), blend)
    overlay=Image.new('RGBA',(WIDTH,HEIGHT))
    od=ImageDraw.Draw(overlay)
    for yy in range(HEIGHT):
        alpha=int(95*(1-yy/HEIGHT)+150*max(0,(yy-280)/(HEIGHT-280)))
        od.line((0,yy,WIDTH,yy),fill=(10,27,23,alpha))
    picture=Image.alpha_composite(picture,overlay)
    d=ImageDraw.Draw(picture)
    d.text((64,58),scene[2],font=font(20,True),fill='#f1f4ea')
    title_lines=lines(scene[1],font(54,True),1110,d)
    for i,line in enumerate(title_lines):d.text((64,300+i*65),line,font=font(54,True),fill='white')
    d.line((64,478,240,478),fill='#c5dfb8',width=3)
    for i,line in enumerate(lines(scene[3],font(27),1130,d)):
        d.text((64,510+i*37),line,font=font(27),fill='white')
    d.text((64,665),'COIL USC–UNAMBA · Fotografías: fichas MINCETUR',font=font(17),fill='#e1e9dd')
    d.text((1150,665),f'{SCENES.index(scene)+1:02d} / 08',font=font(17),fill='#e1e9dd')
    return picture.convert('RGB')


def audio_duration(path):
    probe=subprocess.run([ffmpeg,'-i',str(path)],capture_output=True,text=True)
    match=re.search(r'Duration: (\d+):(\d+):(\d+\.\d+)',probe.stderr)
    if not match:raise RuntimeError('Cannot verify narration duration.')
    h,m,s=map(float,match.groups())
    return h*3600+m*60+s


async def video_speech():
    import edge_tts
    voices=await asyncio.wait_for(edge_tts.list_voices(),timeout=20)
    voice=next((v['ShortName'] for v in voices if v['Locale']=='es-PE' and v['Gender']=='Female'),None)
    if voice is None:raise RuntimeError('No Spanish voice returned by the free service.')
    pieces=[]
    for i,scene in enumerate(SCENES):
        text=scene[3]
        key=hashlib.sha256((voice+text).encode()).hexdigest()[:12]
        raw=TMP/f'video-voz-{i}-{key}.mp3'
        if not raw.exists() or raw.stat().st_size<1000:
            partial=raw.with_suffix('.partial.mp3')
            await asyncio.wait_for(edge_tts.Communicate(text,voice,rate='+3%').save(str(partial)),timeout=50)
            partial.replace(raw)
        duration=audio_duration(raw)
        tempo=max(1,duration/4.75)
        if tempo>1.5:raise RuntimeError(f'Scene {i+1} narration is too long: {duration}')
        piece=TMP/f'video-voz-{i}.wav'
        subprocess.run([ffmpeg,'-y','-i',str(raw),'-af',f'atempo={tempo:.6f},apad,atrim=duration=5,afade=t=out:st=4.85:d=0.15','-ar','48000','-ac','1',str(piece)],check=True,capture_output=True)
        pieces.append(piece)
        print(f'Voice segment {i+1}/8 ready',flush=True)
    concat=TMP/'video-audio-list.txt'
    concat.write_text(''.join(f"file '{piece.as_posix()}'\n" for piece in pieces),encoding='utf-8')
    joined=TMP/'narracion-video-40s.wav'
    subprocess.run([ffmpeg,'-y','-f','concat','-safe','0','-i',str(concat),'-c:a','pcm_s16le',str(joined)],check=True,capture_output=True)
    (TMP/'narracion-video-40s.json').write_text(json.dumps({'scriptHash':video_script_hash,'voice':voice}),encoding='utf-8')
    return joined,{'provider':'Microsoft Edge Read Aloud via edge-tts','voice':voice,'durationSeconds':40,'synthetic':True,'paidGenerations':0,'synchronization':'8 segments of 5 seconds'}


async def speech():
    import edge_tts
    voices=await asyncio.wait_for(edge_tts.list_voices(),timeout=20)
    voice=next((v['ShortName'] for v in voices if v['Locale']=='es-PE' and v['Gender']=='Female'),None)
    if voice is None:raise RuntimeError('No free es-PE female voice returned by the service.')
    raw=TMP/'presentacion-original.mp3'
    await asyncio.wait_for(edge_tts.Communicate(metadata['audio']['script'],voice,rate='+0%').save(str(raw)),timeout=75)
    probe=subprocess.run([ffmpeg,'-i',str(raw)],capture_output=True,text=True)
    match=re.search(r'Duration: (\d+):(\d+):(\d+\.\d+)',probe.stderr)
    if not match:raise RuntimeError('Cannot verify narration duration.')
    h,m,s=map(float,match.groups());duration=h*3600+m*60+s
    tempo=duration/75
    if not .8<=tempo<=1.35:raise RuntimeError('Narration speed would need an excessive adjustment.')
    final=OUT/'presentacion-jacs-destinos.mp3'
    subprocess.run([ffmpeg,'-y','-i',str(raw),'-af',f'atempo={tempo:.6f},apad,atrim=duration=75','-codec:a','libmp3lame','-b:a','128k',str(final)],check=True,capture_output=True)
    metadata['audio']['src']='/materiales/'+final.name
    return {'provider':'Microsoft Edge Read Aloud via edge-tts','voice':voice,'durationSeconds':75,'synthetic':True,'paidGenerations':0}


parser=argparse.ArgumentParser()
parser.add_argument('--speech',action='store_true',help='Generate the approved public presentation through free Edge Read Aloud.')
parser.add_argument('--skip-video',action='store_true')
parser.add_argument('--video-speech',action='store_true',help='Generate free Spanish narration synchronized to each scene.')
args=parser.parse_args()
previous_provenance = OUT/'procedencia-materiales.json'
audio_info = json.loads(previous_provenance.read_text(encoding='utf-8')).get('audio') if previous_provenance.exists() else None
video_voice_info = json.loads(previous_provenance.read_text(encoding='utf-8')).get('film',{}).get('voice') if previous_provenance.exists() else None
if args.speech:
    try:
        audio_info=asyncio.run(speech());print('Spanish narration generated:',audio_info)
    except Exception as error:
        print('Free narration unavailable:',type(error).__name__,str(error)[:180])
        if not (OUT/'presentacion-jacs-destinos.mp3').exists():metadata['audio']['src']=''

video_audio = None
if args.video_speech:
    video_audio, video_voice_info = asyncio.run(video_speech())

credits=[]
sources={}
for id, index in dict.fromkeys(shot for scene in SHOTS for shot in scene):
    gallery=json.loads((ROOT/f'public/images/mincetur/galleries/{id}.json').read_text(encoding='utf-8'))
    photo=gallery['photos'][index]
    asset=ROOT/'public'/photo['full'].lstrip('/')
    sources[(id,index)]=Image.open(asset).convert('RGB')
    credits.append({'fiche':id,'name':gallery['name'],'source':gallery['source'],'file':photo['full'],'sha256':hashlib.sha256(asset.read_bytes()).hexdigest()})

if not args.skip_video:
    silent=TMP/'jacs-video-montaje.mp4'
    writer=imageio_ffmpeg.write_frames(str(silent),(WIDTH,HEIGHT),fps=FPS,codec='libx264',pix_fmt_out='yuv420p',quality=None,macro_block_size=16,output_params=['-crf','25','-preset','medium','-movflags','+faststart','-an'],ffmpeg_log_level='error')
    writer.send(None)
    previous_frame = None
    try:
        for i,scene in enumerate(SCENES):
            for n in range(FPS*5):
                im=frame(sources,scene,i,n/(FPS*5-1))
                if previous_frame is not None and n<10:
                    im=Image.blend(previous_frame,im,n/10)
                writer.send(im.tobytes())
                if i==0 and n==0:im.save(OUT/'jacs-destinos-portada.jpg',quality=93)
            previous_frame = im
            print('Film scene',i+1,'of',len(SCENES),flush=True)
    finally:writer.close()
    cached_voice = TMP/'narracion-video-40s.json'
    if video_audio is None and (TMP/'narracion-video-40s.wav').exists() and cached_voice.exists():
        if json.loads(cached_voice.read_text(encoding='utf-8')).get('scriptHash') == video_script_hash:
            video_audio=TMP/'narracion-video-40s.wav'
    if video_audio:
        final=TMP/'jacs-video-final.mp4'
        subprocess.run([ffmpeg,'-y','-i',str(silent),'-i',str(video_audio),'-c:v','copy','-c:a','aac','-b:a','128k','-t','40','-movflags','+faststart',str(final)],check=True,capture_output=True)
        final.replace(OUT/'jacs-destinos-40s.mp4')
        metadata['video']['narration']=True
    else:
        silent.replace(OUT/'jacs-destinos-40s.mp4')
        metadata['video']['narration']=False
    revision=hashlib.sha256((OUT/'jacs-destinos-40s.mp4').read_bytes()).hexdigest()[:10]
    metadata['video']['src']='/materiales/jacs-destinos-40s.mp4?v='+revision
    metadata['video']['poster']='/materiales/jacs-destinos-portada.jpg?v='+revision
    metadata['video']['captions']='/materiales/jacs-destinos-40s.vtt?v='+revision

vtt=['WEBVTT','']
for i,scene in enumerate(SCENES):
    start=i*5;end=start+5
    vtt += [f'00:{start//60:02d}:{start%60:02d}.000 --> 00:{end//60:02d}:{end%60:02d}.000',scene[3],'']
(OUT/'jacs-destinos-40s.vtt').write_text('\n'.join(vtt),encoding='utf-8')
(OUT/'guiones-jacs-destinos.txt').write_text('JACS DESTINOS | GUIONES EDITORIALES\n\nPRESENTACIÓN (aproximadamente 75 segundos)\n\n'+metadata['audio']['script']+'\n\nANUNCIO FOTOGRÁFICO (40 segundos)\n\n'+metadata['video']['script']+'\n\n'+metadata['photoCredits']+'\n',encoding='utf-8')
metadata_path.write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
provenance={'film':{'file':'jacs-destinos-40s.mp4','durationSeconds':40,'width':WIDTH,'height':HEIGHT,'fps':FPS,'method':'Montaje local de 16 planos con 15 fotografías documentales, zoom, fundidos, títulos y subtítulos integrados. Sin escenas ni personas generadas.','narration':metadata['video']['narration'],'voice':video_voice_info},'photos':credits,'audio':audio_info,'note':metadata['photoCredits']}
(OUT/'procedencia-materiales.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Media and scripts ready in',OUT)
