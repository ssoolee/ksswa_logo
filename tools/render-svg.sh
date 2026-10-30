#!/usr/bin/env bash
# SVG를 PNG로 렌더링해 육안 검증용 이미지를 만든다.
# 사용법: bash tools/render-svg.sh <input.svg> <output.png> [size] [bg]
#   size : 정사각 픽셀 크기 (기본 512)
#   bg   : 배경색 CSS 값 (기본 white, 다크 검증 시 "#111827")
set -euo pipefail

CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
IN="$1"; OUT="$2"; SIZE="${3:-512}"; BG="${4:-white}"

[ -f "$IN" ] || { echo "입력 SVG 없음: $IN" >&2; exit 1; }

TMPDIR_R="$(mktemp -d)"
trap 'rm -rf "$TMPDIR_R"' EXIT
WRAP="$TMPDIR_R/wrap.html"

{
  printf '<!doctype html><meta charset="utf-8"><style>'
  printf 'html,body{margin:0;padding:0;width:%spx;height:%spx;background:%s;' "$SIZE" "$SIZE" "$BG"
  printf 'display:flex;align-items:center;justify-content:center;overflow:hidden}'
  printf 'svg{width:92%%;height:92%%;display:block}'
  printf '</style>'
  cat "$IN"
} > "$WRAP"

mkdir -p "$(dirname "$OUT")"
: > "$OUT"
OUTABS="$(cd "$(dirname "$OUT")" && pwd)/$(basename "$OUT")"

"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --screenshot="$(cygpath -m "$OUTABS")" \
  --window-size="$SIZE,$SIZE" \
  "file://$(cygpath -m "$WRAP")" >/dev/null 2>&1 || true

[ -s "$OUTABS" ] || { echo "렌더링 실패: $OUT" >&2; exit 1; }
echo "렌더링 완료: $OUT (${SIZE}px, bg=${BG})"
