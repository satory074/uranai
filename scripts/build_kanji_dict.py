#!/usr/bin/env python3
"""Generate src/lib/kanjiStrokes.data.ts from KANJIDIC2.

Usage:
    uv run python scripts/build_kanji_dict.py

KANJIDIC2 is published by EDRDG under CC BY-SA 4.0
(https://www.edrdg.org/edrdg/licence.html). We extract only factual
stroke-count data; the resulting numbers themselves are not creative
expression and not subject to copyright. The generated file credits
the source in its header comment.
"""

from __future__ import annotations

import gzip
import sys
import urllib.request
from pathlib import Path
from xml.etree import ElementTree as ET

KANJIDIC2_URL = "https://www.edrdg.org/kanjidic/kanjidic2.xml.gz"
SCRIPT_DIR = Path(__file__).resolve().parent
CACHE_DIR = SCRIPT_DIR / "_cache"
CACHE_PATH = CACHE_DIR / "kanjidic2.xml.gz"
OUTPUT_PATH = SCRIPT_DIR.parent / "src" / "lib" / "kanjiStrokes.data.ts"

# 日本の人名で頻出するが KANJIDIC2 に収録されていない異体字の手動オーバーライド。
# 画数は基準字 (右側コメント) と同一の新字体・旧字体の標準画数を採用。
MANUAL_OVERRIDES: dict[str, int] = {
    "髙": 10,  # 高 (はしご高) — 髙橋・髙木 など
    "﨔": 17,  # 槻 の異体字
    "彅": 11,  # 薙 の異体字 (例: 草彅)
    "﨑": 12,  # KANJIDIC2 経由でも引けるが念のため
}


def download_kanjidic2() -> bytes:
    if CACHE_PATH.exists():
        print(f"Using cached {CACHE_PATH}", file=sys.stderr)
        return CACHE_PATH.read_bytes()

    print(f"Downloading {KANJIDIC2_URL}...", file=sys.stderr)
    CACHE_DIR.mkdir(exist_ok=True)
    req = urllib.request.Request(
        KANJIDIC2_URL,
        headers={"User-Agent": "Mozilla/5.0 (uranai-build-script)"},
    )
    with urllib.request.urlopen(req) as resp:  # noqa: S310 — fixed URL
        data = resp.read()
    CACHE_PATH.write_bytes(data)
    print(f"Saved to {CACHE_PATH} ({len(data)} bytes)", file=sys.stderr)
    return data


def is_jis208(jis208: str) -> bool:
    """JIS X 0208 第1水準 (区 16-47) または第2水準 (区 48-84).

    KANJIDIC2 の jis208 コードポイントは "<plane>-<ku>-<ten>" 形式 (例 "1-78-20")。
    plane は常に 1。"""
    parts = jis208.split("-")
    if len(parts) != 3:
        return False
    try:
        ku = int(parts[1])
    except ValueError:
        return False
    return 16 <= ku <= 84


def parse_kanjidic2(xml_bytes: bytes) -> dict[str, int]:
    """Return { kanji: stroke_count } for in-scope characters."""
    print("Parsing KANJIDIC2...", file=sys.stderr)
    decompressed = gzip.decompress(xml_bytes)
    root = ET.fromstring(decompressed)

    result: dict[str, int] = {}
    for character in root.findall("character"):
        literal_el = character.find("literal")
        if literal_el is None or not literal_el.text:
            continue
        kanji = literal_el.text

        misc = character.find("misc")
        if misc is None:
            continue

        # First <stroke_count> is the canonical/primary value.
        stroke_el = misc.find("stroke_count")
        if stroke_el is None or not stroke_el.text:
            continue
        stroke_count = int(stroke_el.text)

        codepoint = character.find("codepoint")
        in_jis208 = False
        in_jis212_or_213 = False
        if codepoint is not None:
            for cp in codepoint.findall("cp_value"):
                cp_type = cp.get("cp_type")
                if cp_type == "jis208" and cp.text and is_jis208(cp.text):
                    in_jis208 = True
                elif cp_type in ("jis212", "jis213") and cp.text:
                    in_jis212_or_213 = True

        # Grade 1-6: 教育漢字, 8: 常用漢字 (中学+), 9-10: 人名用漢字
        grade_el = misc.find("grade")
        grade = int(grade_el.text) if grade_el is not None and grade_el.text else None
        is_joyo = grade is not None and 1 <= grade <= 8
        is_jinmeiyou = grade is not None and 9 <= grade <= 10

        if not (in_jis208 or in_jis212_or_213 or is_joyo or is_jinmeiyou):
            continue

        result[kanji] = stroke_count

    return result


def format_kanji_dict(kanji_strokes: dict[str, int]) -> str:
    """Format as TypeScript Record literal entries (indented), packed onto
    multi-entry lines to keep diff-friendly width."""
    sorted_items = sorted(kanji_strokes.items(), key=lambda kv: kv[0])

    lines: list[str] = []
    buf: list[str] = []
    width = 0
    MAX_WIDTH = 100

    for ch, n in sorted_items:
        entry = f"'{ch}': {n},"
        if buf and width + len(entry) + 1 > MAX_WIDTH:
            lines.append("  " + " ".join(buf))
            buf = []
            width = 0
        buf.append(entry)
        width += len(entry) + 1

    if buf:
        lines.append("  " + " ".join(buf))

    return "\n".join(lines)


def main() -> int:
    xml_bytes = download_kanjidic2()
    kanji_strokes = parse_kanjidic2(xml_bytes)
    print(f"From KANJIDIC2: {len(kanji_strokes)} kanji entries", file=sys.stderr)

    added = 0
    for ch, n in MANUAL_OVERRIDES.items():
        if ch not in kanji_strokes:
            added += 1
        kanji_strokes[ch] = n
    print(f"Added {added} manual override entries", file=sys.stderr)
    print(f"Total: {len(kanji_strokes)} entries", file=sys.stderr)

    formatted = format_kanji_dict(kanji_strokes)

    output = (
        "// AUTO-GENERATED by scripts/build_kanji_dict.py — do not edit by hand.\n"
        "// Source: KANJIDIC2 (EDRDG, CC BY-SA 4.0) — https://www.edrdg.org/kanjidic/\n"
        "// Scope: 常用漢字 (grade 1-8) + 人名用漢字 (grade 9-10)"
        " + JIS X 0208 (第1+第2水準) + JIS X 0212 + JIS X 0213.\n"
        f"// Total entries: {len(kanji_strokes)}\n"
        "\n"
        "export const KANJI: Record<string, number> = {\n"
        f"{formatted}\n"
        "};\n"
    )

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(output, encoding="utf-8")
    print(f"Wrote {OUTPUT_PATH} ({len(output)} bytes)", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
