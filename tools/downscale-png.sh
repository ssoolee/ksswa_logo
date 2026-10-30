#!/usr/bin/env bash
# PNG를 지정 크기로 줄여 웹 배포용 이미지를 만든다. (Chrome 헤드리스 사용 — 별도 라이브러리 불필요)
# 사용법: bash tools/downscale-png.sh <input.png> <output.png> [size]
#   size : 정사각 픽셀 크기 (기본 560)
set -euo pipefail

CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
IN="$1"; OUT="$2"; SIZE="${3:-560}"

[ -f "$IN" ] || { echo "입력 PNG 없음: $IN" >&2; exit 1; }

TMPDIR_D="$(mktemp -d)"
trap 'rm -rf "$TMPDIR_D"' EXIT

# 한글·특수문자 파일명이 file:// URL에서 깨지지 않도록 임시 디렉터리에 ASCII 이름으로 복사한다.
cp "$IN" "$TMPDIR_D/src.png"
WRAP="$TMPDIR_D/wrap.html"

{
  printf '<!doctype html><meta charset="utf-8"><style>'
  printf 'html,body{margin:0;padding:0;width:%spx;height:%spx;background:#fff;overflow:hidden}' "$SIZE" "$SIZE"
  printf 'img{width:%spx;height:%spx;display:block}' "$SIZE" "$SIZE"
  printf '</style><img src="src.png">'
} > "$WRAP"

mkdir -p "$(dirname "$OUT")"
: > "$OUT"
OUTABS="$(cd "$(dirname "$OUT")" && pwd)/$(basename "$OUT")"

"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --screenshot="$(cygpath -m "$OUTABS")" \
  --window-size="$SIZE,$SIZE" \
  "file://$(cygpath -m "$WRAP")" >/dev/null 2>&1 || true

[ -s "$OUTABS" ] || { echo "축소 실패: $OUT" >&2; exit 1; }
echo "축소 완료: $OUT (${SIZE}px, $(wc -c < "$OUTABS") bytes)"
