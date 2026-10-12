"""Create a self-contained source handoff without copying local Git history."""
import argparse
import hashlib
import json
import re
import shutil
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

APP = Path(__file__).resolve().parent.parent
WORKSPACE = APP
ROOT_FILES = {"README.md", ".gitignore", ".gitattributes"}
APP_FOLDERS = {"src", "public", "tests", "docs", "research", "scripts"}
APP_FILES = {
    "README.md", "package.json", "package-lock.json", "index.html", "vite.config.ts",
    "tsconfig.json", "tsconfig.app.json", "tsconfig.node.json", ".gitignore",
    ".npmrc", ".nvmrc", ".oxlintrc.json", ".prettierrc.json", ".prettierignore",
}
EXCLUDED = {
    "scripts/prepare_assets.py", "scripts/prepare_destination_artwork.py",
    "research/finalize_delivery.py", "research/package_delivery.py",
}
TEXT_SUFFIXES = {".ts", ".tsx", ".js", ".mjs", ".py", ".json", ".md", ".html", ".yaml", ".yml", ".txt", ".css"}
TOKEN_PATTERN = re.compile(r"\b(?:[ps]k\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}|gh[pousr]_[A-Za-z0-9]{30,}|AKIA[A-Z0-9]{16})\b|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----")


def selected_files():
    for name in sorted(ROOT_FILES):
        yield WORKSPACE / name, Path(name)
    for path in sorted((WORKSPACE / ".github").rglob("*")):
        if path.is_file():
            yield path, path.relative_to(WORKSPACE)
    for path in sorted(APP.rglob("*")):
        if not path.is_file():
            continue
        rel = path.relative_to(APP)
        if rel.as_posix() in ROOT_FILES:
            continue
        if any(part in {"node_modules", ".git", "dist", ".cache", "__pycache__", "masters"} for part in rel.parts):
            continue
        if rel.as_posix() in EXCLUDED:
            continue
        if rel.parts[0] not in APP_FOLDERS and rel.as_posix() not in APP_FILES:
            continue
        if path.name.startswith(".env"):
            continue
        if path.name.endswith((".local", ".log", ".pyc", ".tsbuildinfo", ".zip")):
            continue
        yield path, rel


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", default="JACS-Destinos-repositorio", help="New folder under the workspace")
    args = parser.parse_args()
    destination = (WORKSPACE / args.output).resolve()
    if destination.parent != WORKSPACE or destination.name in APP_FOLDERS or destination.name == ".github":
        raise SystemExit("The output must be a new folder directly under the project root.")
    archive_path = destination.with_suffix(".zip")
    if destination.exists() or archive_path.exists():
        raise SystemExit("Output already exists; choose another --output. Existing files are never overwritten.")

    records = []
    files = list(selected_files())
    for source, relative in files:
        data = source.read_bytes()
        if len(data) >= 100 * 1024 * 1024:
            raise SystemExit(f"File exceeds the GitHub limit: {relative}")
        if source.suffix in TEXT_SUFFIXES or source.name == ".env.example":
            text = data.decode("utf-8-sig")
            if TOKEN_PATTERN.search(text):
                raise SystemExit(f"Credential-shaped value found; review {relative} (value not printed).")
        records.append({"file": relative.as_posix(), "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()})

    destination.mkdir(parents=True)
    for source, relative in files:
        target = destination / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)
    report = {
        "files": len(records), "totalBytes": sum(item["bytes"] for item in records),
        "largestFile": max(records, key=lambda item: item["bytes"]),
        "gitHistoryIncluded": False, "localEnvironmentIncluded": False,
        "credentialPatternMatches": 0, "manifest": records,
    }
    (destination / "PREPARACION.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    with ZipFile(archive_path, "w", ZIP_DEFLATED, compresslevel=6) as archive:
        for path in sorted(destination.rglob("*")):
            if path.is_file():
                archive.write(path, Path(destination.name) / path.relative_to(destination))
    with ZipFile(archive_path) as archive:
        assert archive.testzip() is None
    print(json.dumps({key: value for key, value in report.items() if key != "manifest"}, ensure_ascii=False))
    print(f"Created: {destination.name} and {archive_path.name}")


if __name__ == "__main__":
    main()
