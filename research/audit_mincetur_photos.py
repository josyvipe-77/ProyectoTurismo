from pathlib import Path
from urllib.parse import urlparse, parse_qs
import json
from PIL import Image

root = Path(__file__).resolve().parent.parent
manifest = json.loads((root / "src/data/mincetur-photos.json").read_text(encoding="utf-8"))
index = json.loads((root / "src/data/mincetur-gallery-index.json").read_text(encoding="utf-8"))
catalog = {r["id"]: r for r in json.loads((root / "src/data/apurimac-catalog.json").read_text(encoding="utf-8"))}
photos = 0
assert set(index) == {key for key, gallery in manifest.items() if gallery["photos"]}
for key, gallery in manifest.items():
    assert catalog[key]["source"] == gallery["source"]
    if not gallery["photos"]:
        assert key not in index
        continue
    assert key in index
    assert parse_qs(urlparse(gallery["source"]).query)["cod_Ficha"][0].isdigit()
    assert len({p["id"] for p in gallery["photos"]}) == len(gallery["photos"])
    public_gallery = json.loads((root / f"public/images/mincetur/galleries/{key}.json").read_text(encoding="utf-8"))
    assert [p["id"] for p in public_gallery["photos"]] == [p["id"] for p in gallery["photos"]]
    assert public_gallery["source"] == gallery["source"]
    assert [p["alt"] for p in public_gallery["photos"]] == [p["alt"] for p in gallery["photos"]]
    for photo in gallery["photos"]:
        assert urlparse(photo["original"]).hostname == "consultasenlinea.mincetur.gob.pe"
        for variant in ("thumbnail", "full"):
            path = root / "public" / photo[variant].lstrip("/")
            image = Image.open(path)
            image.load()
            assert image.format == "WEBP" and min(image.size) >= 100
            assert list(image.size) == [photo["sizes"][variant]["width"], photo["sizes"][variant]["height"]]
        photos += 1
print(json.dumps({"galleries": len(index), "photos": photos, "variantsVerified": photos * 2,
                  "thumbnailBytes": sum(p["sizes"]["thumbnail"]["bytes"] for g in manifest.values() for p in g["photos"]),
                  "fullBytes": sum(p["sizes"]["full"]["bytes"] for g in manifest.values() for p in g["photos"])}))
