"""Summarize verified gallery coverage and the photographs still to document."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
catalog = json.loads((ROOT / "src/data/apurimac-catalog.json").read_text(encoding="utf-8"))
manifest = json.loads((ROOT / "src/data/mincetur-photos.json").read_text(encoding="utf-8"))
available = {key for key, item in manifest.items() if item["photos"]}
missing = [item for item in catalog if item["id"] not in available]
checked = max(item["checked"] for item in manifest.values())
photos = sum(len(item["photos"]) for item in manifest.values())
lines = ["# Fotografías del catálogo", "", f"Revisión: {checked}.", "",
         f"El catálogo tiene {len(catalog)} referencias: {len(available)} con galería local "
         f"({photos} imágenes) y {len(missing)} pendientes de una imagen identificada.", "",
         "Las fotografías incorporadas proceden de la ficha específica de cada recurso en MINCETUR. "
         "Las fuentes, fechas de consulta y huellas SHA-256 se conservan en "
         "`src/data/mincetur-photos.json` y `public/images/mincetur/provenance.json`. "
         "El crédito del inventario no atribuye autoría individual ni una licencia abierta.", "",
         "## Pendientes", "",
         "Esta lista indica lo que falta en el archivo local; no afirma que no existan fotos públicas. "
         "Para completarla se necesita una imagen propia o de otra fuente cuya ubicación, "
         "autoría y condiciones de uso puedan documentarse. Los sectores de Ampay requieren "
         "imágenes del sector concreto. Los registros históricos necesitan confirmar primero "
         "la identidad actual del recurso. No se sustituyen por fotos de lugares cercanos.", "",
         "| Referencia | Provincia | Fuente documental |",
         "| --- | --- | --- |"]
for item in missing:
    lines.append(f"| {item['name']} (`{item['id']}`) | {item['province']} | "
                 f"[Consultar fuente]({item['source']}) |")
lines += ["", "## Actualizar el archivo", "", "```sh",
          "python research/prepare_mincetur_photos.py",
          "python research/audit_mincetur_photos.py",
          "python research/build_photo_coverage.py", "```", "",
          "El importador reutiliza las fotos existentes y consulta las fichas oficiales del catálogo, "
          "incluidas celebraciones, gastronomía y lugares sin coordenadas. Nunca modifica los pins. "
          "Huayhuaca conserva el identificador local `waywaka` y enlaza a su ficha actual 13276. "
          "Las galerías se cargan al acercarse a la pantalla y se sirven en WebP con versiones "
          "pequeñas y ampliadas.", ""]
(ROOT / "docs/FOTOGRAFIAS-PENDIENTES.md").write_text("\n".join(lines), encoding="utf-8")
print(json.dumps({"references": len(catalog), "galleries": len(available), "photos": photos,
                  "pending": len(missing)}))
