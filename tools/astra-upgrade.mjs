// gpt-6-astra + image_generation 으로 품싹 캐릭터 이미지 업그레이드
// 사용: node astra-upgrade.mjs <입력PNG> <출력PNG> [모델]
import fs from 'node:fs';

const [, , inPath, outPath, modelArg] = process.argv;
const MODEL = modelArg || 'gpt-6-astra';
const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error('OPENAI_API_KEY 없음'); process.exit(1); }

const PROMPT = `Redraw this Korean public-institution mascot as a polished, production-quality FLAT VECTOR illustration. Keep it recognizably the same character — this is a refinement pass, not a redesign.

These structural rules are non-negotiable and carry the client's brand meaning:
1. EXACTLY TWO cotyledon leaves, clearly ASYMMETRIC. The left leaf is long and arcs upward and over the left side of the head like an awning. The right leaf is roughly half that length and folds down onto the character's own right shoulder. Never three leaves. Never make them symmetric.
2. Two arms grow from the sides of the body, curve outward and down, and INTERLOCK at the bottom center, enclosing a CLOSED EMPTY SPACE between the lower body and the arms. That empty space must be fully transparent/white — the background shows through it. Do not fill it with any color, object, or shading.
3. The point where the two arms overlap at the bottom is colored #54B947, visibly distinct from the surrounding green.
4. All outlines are navy #004B88. Never black.
5. A small notebook sits at the right waist: orange #F8991C cover with yellow #FFDA00 pages peeking out below, tied by a short navy cord.
6. NO legs and NO feet. The arms' lower ends sit in a small flat grey soil mound (#939598, soft and low).
7. Face: two navy oval eyes with a small white highlight in the upper right of each, a calm closed-mouth smile that only lifts at the corners — never a wide open grin, never teeth, never eyebrows or eyelashes. Soft orange cheek circles at low opacity.
8. Head-to-body proportion roughly 1 : 1.25. Round head, body tapering slightly downward.

Palette — use only these: #BFD72F, #AED136, #95C93D, #54B947, #F8991C, #FFDA00, #004B88, #939598.

What to improve: cleaner and more confident curves, more graceful leaf silhouettes, better weight balance between head, body and arms, more even outline thickness, a subtle vertical gradient on the body only. Keep it flat and geometric — no 3D shading, no gloss, no drop shadows, no texture, no outer glow.

Output: the character centered on a pure white background, generous margin, no text, no logo, no extra objects.`;

const b64 = fs.readFileSync(inPath).toString('base64');

const body = {
  model: MODEL,
  input: [{
    role: 'user',
    content: [
      { type: 'input_text', text: PROMPT },
      { type: 'input_image', image_url: `data:image/png;base64,${b64}` }
    ]
  }],
  tools: [{ type: 'image_generation', size: '1024x1024', background: 'opaque' }]
};

const res = await fetch('https://api.openai.com/v1/responses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
  body: JSON.stringify(body)
});

const text = await res.text();
if (!res.ok) {
  console.error(`HTTP ${res.status}`);
  console.error(text.slice(0, 1500));
  process.exit(2);
}

const json = JSON.parse(text);
const calls = (json.output || []).filter(o => o.type === 'image_generation_call');
if (!calls.length) {
  console.error('이미지 출력 없음. output 타입:', (json.output || []).map(o => o.type).join(', '));
  console.error(JSON.stringify(json).slice(0, 1500));
  process.exit(3);
}
fs.writeFileSync(outPath, Buffer.from(calls[0].result, 'base64'));
console.log(`저장: ${outPath} (${fs.statSync(outPath).size} bytes, 모델 ${MODEL})`);
if (json.usage) console.log('usage:', JSON.stringify(json.usage));
