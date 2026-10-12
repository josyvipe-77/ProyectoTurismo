"""Import only public gallery images and their source; discard full fiche HTML."""
from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser
from io import BytesIO
from pathlib import Path
from urllib.parse import urlparse, parse_qs
from urllib.request import Request, urlopen
import hashlib
import json
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public/images/mincetur"
OUT.mkdir(parents=True, exist_ok=True)
CATALOG = json.loads((ROOT / "src/data/apurimac-catalog.json").read_text(encoding="utf-8"))
MANIFEST = ROOT / "src/data/mincetur-photos.json"
CACHE = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {}

class GalleryParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.photos = {}
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        url = attrs.get("href" if tag == "a" else "src", "")
        if tag not in ("a", "img") or "foto.aspx?cod=" not in url:
            return
        parsed = urlparse(url)
        if parsed.hostname != "consultasenlinea.mincetur.gob.pe":
            return
        code = parse_qs(parsed.query).get("cod", [""])[0]
        if code.isdigit():
            self.photos.setdefault(code, {"url": url, "caption": attrs.get("title", "") or attrs.get("alt", "")})

def read(url):
    with urlopen(Request(url, headers={"User-Agent": "Apu-Rimaq local prototype source verification"}), timeout=25) as response:
        data = response.read(12_000_001)
        if len(data) > 12_000_000:
            raise ValueError("Image exceeds import limit")
        return data

def import_resource(resource):
    key = resource["id"]
    previous = CACHE.get(key)
    if previous and all((ROOT / "public" / variant.lstrip("/")).exists()
                        for p in previous["photos"] for variant in (p["thumbnail"], p["full"])):
        return key, previous
    source = resource["source"]
    result = {"name": resource["name"], "source": source, "checked": "2026-10-04", "photos": []}
    try:
        body = read(source).decode("utf-8", errors="replace")
        parser = GalleryParser()
        parser.feed(body)
        for index, (code, photo) in enumerate(list(parser.photos.items())[:6]):
            try:
                data = read(photo["url"])
                image = ImageOps.exif_transpose(Image.open(BytesIO(data))).convert("RGB")
                if min(image.size) < 100:
                    continue
                paths = {}
                sizes = {}
                for label, width in (("thumbnail", 480), ("full", 1400)):
                    resized = image.copy()
                    resized.thumbnail((width, width), Image.Resampling.LANCZOS)
                    filename = f"{key}-{code}-{width}.webp"
                    target = OUT / filename
                    resized.save(target, "WEBP", quality=82, method=4)
                    paths[label] = f"/images/mincetur/{filename}"
                    sizes[label] = {"width": resized.width, "height": resized.height, "bytes": target.stat().st_size}
                result["photos"].append({
                    "id": code,
                    "alt": photo["caption"] or f"{resource['name']}: fotografía {index + 1} de su ficha MINCETUR",
                    "original": photo["url"],
                    "sha256Original": hashlib.sha256(data).hexdigest(),
                    **paths,
                    "sizes": sizes,
                })
            except Exception as error:
                result.setdefault("unavailable", []).append({"photoId": code, "reason": str(error)})
    except Exception as error:
        result["error"] = str(error)
    return key, result

resources = [r for r in CATALOG if r["coordinates"] and r["kind"] == "Lugar"
             and urlparse(r["source"]).hostname == "consultasenlinea.mincetur.gob.pe"]
with ThreadPoolExecutor(max_workers=4) as pool:
    for future in as_completed([pool.submit(import_resource, r) for r in resources]):
        key, result = future.result()
        CACHE[key] = result
        MANIFEST.write_text(json.dumps(CACHE, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"{key}: {len(result['photos'])} photos", flush=True)
provenance = {
    "source": "Public gallery of the MINCETUR tourism inventory",
    "notice": "Source credit identifies the publishing inventory, not individual authorship. No explicit image license was asserted.",
    "checked": "2026-10-04",
    "galleries": CACHE,
}
(OUT / "provenance.json").write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
galleries = OUT / "galleries"
galleries.mkdir(exist_ok=True)
for key, record in CACHE.items():
    if not record["photos"]:
        continue
    gallery = {"name": record["name"], "source": record["source"], "photos": [
        {k: photo[k] for k in ("id", "alt", "thumbnail", "full")} for photo in record["photos"]
    ]}
    (galleries / f"{key}.json").write_text(json.dumps(gallery, ensure_ascii=False) + "\n", encoding="utf-8")
(ROOT / "src/data/mincetur-gallery-index.json").write_text(
    json.dumps([key for key, record in CACHE.items() if record["photos"]]) + "\n", encoding="utf-8")
print(json.dumps({"places": len(CACHE), "withPhotos": sum(bool(x["photos"]) for x in CACHE.values()),
                  "photos": sum(len(x["photos"]) for x in CACHE.values()),
                  "webpBytes": sum(p.stat().st_size for p in OUT.glob("*.webp"))}), flush=True)
