"""Retrieve short descriptive reference snippets, without contacts or full HTML."""
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from html.parser import HTMLParser
from urllib.request import urlopen
import html
import json
import re

root = Path(__file__).resolve().parent.parent
places = [r for r in json.loads((root / "src/data/apurimac-catalog.json").read_text(encoding="utf-8")) if r["coordinates"]]
output = root / "research/destination-context.json"
cache = json.loads(output.read_text(encoding="utf-8")) if output.exists() else {}

class DescriptionParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.description = ""
    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == "meta" and values.get("property") == "og:description":
            self.description = values.get("content", "")

def fetch(place):
    key = place["id"]
    if key in cache and cache[key].get("snippet"):
        return key, cache[key]
    result = {"name": place["name"], "source": place["source"]}
    try:
        data = urlopen(place["source"], timeout=20).read()
        try: body = data.decode("utf-8")
        except UnicodeDecodeError: body = data.decode("windows-1252")
        parser = DescriptionParser()
        parser.feed(body)
        text = re.sub(r"\s+", " ", html.unescape(parser.description)).strip()
        result["snippet"] = " ".join(text.split()[:75]) if len(text) > 40 else ""
    except Exception as error:
        result["error"] = str(error)
    return key, result

with ThreadPoolExecutor(max_workers=4) as pool:
    for future in as_completed([pool.submit(fetch, r) for r in places]):
        key, result = future.result()
        cache[key] = result
        output.write_text(json.dumps(cache, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"places": len(cache), "withDescription": sum(bool(r.get("snippet")) for r in cache.values())}))
