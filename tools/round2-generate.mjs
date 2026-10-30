// 한사연 캐릭터 5안 (Round 2) 생성 — gpt-6-astra + image_generation
//
// 사용:
//   node tools/round2-generate.mjs base <key|all>   색 중립 원안 생성 (텍스트 전용)
//   node tools/round2-generate.mjs ks   <key|all>   원안 PNG를 입력으로 한사연 팔레트 재채색
//
// key: deomdeom | joyak | duri | bokjuim | salpi
// OPENAI_API_KEY 환경변수 필요. 키는 이 파일에 저장하지 않는다.

import fs from 'node:fs';
import path from 'node:path';

const MODEL = 'gpt-6-astra';
const OUT_DIR = path.resolve('assets/character/round2');
const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error('OPENAI_API_KEY 없음'); process.exit(1); }

// ─── 공통 지시문 ──────────────────────────────────────────────────────────

const BASE_STYLE = `
STYLE: flat vector illustration. Clean, even outlines in dark slate grey #3F4A57 — never black. Centered on a pure white background with generous margin. No text, no logo, no watermark, no signature, no background scenery, no extra objects beyond what is described.

COLOR — IMPORTANT: this is a FORM study, so keep it almost colorless. Use only white, light warm grey, mid grey and the dark slate outline. Do NOT use orange, green, blue, red, or any saturated color anywhere.

DIGNITY: this mascot represents a national association of Korean government social-welfare caseworkers. Warm but composed — not babyish, not cartoonishly cute. A calm closed-mouth expression that only lifts at the corners. Never a wide open grin, never teeth, never eyebrows, never eyelashes. Flat and geometric: no 3D shading, no gloss, no drop shadow, no texture, no outer glow.

DO NOT include paper stacks, towering document files, or anything that reads as a bureaucrat buried in paperwork. Do not include flags, badges of state, or anything that reads as a political symbol.`;

const RECOLOR_RULES = `
RECOLOR ONLY. This is the exact same character. Do not redesign it. Do not change the pose, the proportions, the facial expression, the number of elements, or the silhouette. Redraw it identically and change ONLY the colors.

Use ONLY this palette:
  ORANGE family (gradient, lighter at top -> deeper at bottom): #FFDA00 -> #FCB315 -> #F8991C
  GREEN family  (gradient, lighter at top -> deeper at bottom): #BFD72F -> #AED136 -> #95C93D
  MEETING GREEN: #54B947
  NAVY: #004B88
  NEUTRAL GREY (minor support only): #939598
  White, for the background and small highlights.

RULES:
- Every outline and every dark detail is NAVY #004B88. No black and no dark grey outlines anywhere.
- The orange family and the green family must each occupy a clear, substantial area of the character, and they must TOUCH. At the contact zone described below, use MEETING GREEN #54B947 as a distinct band or wedge that is visibly different from the greens beside it. This contact detail is required.
- Keep the vertical gradient direction inside each family: lighter above, deeper below.
- Flat vector only: no 3D shading, no gloss, no drop shadow, no texture, no outer glow.
- Pure white background, generous margin, no text, no logo, no extra objects.`;

// ─── 5안 정의 ────────────────────────────────────────────────────────────

const CONCEPTS = {
  deomdeom: {
    n: '01', name: '덤덤이',
    base: `Draw a single standing mascot character.

FORM: a large round head on a small simple body, no neck. Head-to-body ratio about 1 : 1.1. Short stubby arms hanging relaxed at the sides. Two small rounded feet.

FACE — the whole point of this character is that it is DEADPAN: two small solid dot eyes set slightly wide apart, and a tiny flat horizontal line for a mouth. Absolutely no smile curve. The expression must read as unbothered and unshakeable — calm and steady, never sad, never grumpy, never angry, never blank-scary.

DETAIL: two small rounded ears on the sides of the head. The very tip of each ear is a slightly warmer, slightly deeper tone than the rest of the head — this faint blush at the ear tips is the character's ONLY emotional tell, so make it subtle but visible.

A thin lanyard cord hangs around its neck with a small blank rounded-rectangle ID card at chest height. The card is empty — no text.`,
    ks: `PLACEMENT: the head belongs to the ORANGE family, the body belongs to the GREEN family. They touch at the base of the head where head meets body — put MEETING GREEN #54B947 there as a thin collar band all the way around. The ear tips are #F8991C. The dot eyes and the flat line mouth are NAVY. The lanyard cord is NAVY and the ID card is white with a navy edge.`
  },
  joyak: {
    n: '02', name: '조약이',
    base: `Draw a single standing mascot character whose entire body is ONE smooth river pebble.

FORM: the body is a soft, slightly asymmetric oval — wider and heavier at the bottom, worn perfectly round at the edges like a stone polished smooth by decades of water. It is NOT a circle and NOT an egg; it should read unmistakably as a river pebble. Faint concentric grain lines follow the pebble's own contour, suggesting years of wear.

FACE: sits in the upper half of the pebble — two small oval eyes and a calm closed-mouth smile. Two very short arms emerge low on the sides of the pebble.

LEGS — important: the legs are formed by the two strokes of the Chinese character 人 (meaning 'person'): one longer stroke and one shorter stroke, meeting at the top under the pebble and spreading apart at the bottom. They must read simultaneously as a pair of legs standing firmly apart AND as the ideograph 人. Clean straight tapering strokes, not rounded cartoon legs.

GROUND: the mascot stands on top of a small, low cairn of three or four smaller stacked pebbles.`,
    ks: `PLACEMENT: the pebble body belongs to the GREEN family — #BFD72F at the top, #95C93D at the bottom — with its concentric grain lines in a slightly deeper green. The two 人 strokes forming the legs and the small stacked cairn stones beneath belong to the ORANGE family. They touch where the bottom of the pebble meets the top of the 人 strokes — put MEETING GREEN #54B947 there as a wedge. The eyes and mouth are NAVY.`
  },
  duri: {
    n: '03', name: '두리·아름',
    base: `Draw TWO mascot characters side by side in the same style — clearly a matched pair, but not identical.

FORM: both have round heads and simple bodies with no legs; their lower bodies taper into soft rounded bases that rest on the ground.

THE CHAIN OF CARE — this is the whole point and must read instantly at a glance:
- The one on the LEFT is slightly smaller. It is cradling a small bundled rounded shape in both arms, held close against its own chest.
- The one on the RIGHT is slightly taller. BOTH of its arms are wrapped around the LEFT one's shoulders, from behind and around the side, embracing it.
So the right one holds the left one, and the left one holds the bundle: three links, one visible chain.

DETAIL: the RIGHT one has a small sprout with exactly two leaves growing on top of its head, and its eyes are gently closed in a contented way. The LEFT one has a single small leaf on its head, with two small open oval eyes looking forward. Both mouths are calm and closed.`,
    ks: `PLACEMENT: the LEFT mascot (the smaller one holding the bundle) is entirely in the ORANGE family. The RIGHT mascot (the taller one doing the embracing) is entirely in the GREEN family. They touch where the right one's arms wrap across the left one's shoulder — put MEETING GREEN #54B947 along that overlapping arm section. The sprout and the single leaf are in the GREEN family. The bundle held in the left one's arms stays white with a navy outline. All eyes and mouths are NAVY.`
  },
  bokjuim: {
    n: '04', name: '복주임',
    base: `Draw a single standing CHIBI MASCOT designed as a public-service social-welfare caseworker persona.

PROPORTION — THE MOST IMPORTANT RULE: this is a stubby mascot, NOT a realistic human figure. The head alone is about one third of the total height and is as wide as the whole torso. Total height is only about 2.5 head-heights. No visible neck. Tiny simple mitten hands, short stubby legs. If it looks like a normal adult human body, it is wrong.

FORM: simple rounded shapes throughout. A simple neutral short hairstyle; keep the character androgynous and gender-neutral — do not make it read as specifically male or specifically female. Two small oval eyes and a calm closed-mouth smile. Upright, willing posture, caught mid-stride as if heading out the door on a home visit.

CLOTHING: a plain crew-neck top under an open, slightly oversized cardigan with the sleeves pushed up to the forearms. A thin lanyard with a small blank rounded-rectangle ID card at chest height — the card is empty, no text.

CARRYING: a sturdy shoulder satchel worn across one side, flap closed. A rolled document and a small cylindrical thermos bottle stick out of the satchel's side pocket.

FEET: simple flat indoor slippers.

IMPORTANT: this character must read as capable and on its way somewhere, never as overworked, buried, or defeated. Absolutely no stacks of paper, no piles of files, no slumped shoulders, no dark circles under the eyes.`,
    ks: `PLACEMENT: the open cardigan belongs to the GREEN family. The crew-neck top underneath and the shoulder satchel belong to the ORANGE family. They touch at the shoulder where the cardigan meets the satchel strap — put MEETING GREEN #54B947 along that strap section. The thermos bottle is #F8991C. The skin stays a very light warm off-white. The hair, the eyes, the mouth, the slippers, the lanyard and every outline are NAVY #004B88. The ID card is white with a navy edge.`
  },
  salpi: {
    n: '05', name: '살피',
    base: `Draw a single standing mascot based on the Korean Sapsali — a shaggy native Korean dog breed.

FORM: four sturdy short legs planted firmly on the ground, body low and solid, standing in a three-quarter view facing the viewer. A short tail.

COAT — THE MOST IMPORTANT RULE: extremely simplified. The entire coat is built from only about six to eight large, chunky, rounded clumps with clean graphic edges. Absolutely no individual hair strokes, no interior line detail inside the clumps, no soft shading, no gradients, no rendered fur. It must look like a flat sticker or a cut-paper shape, not like an illustrated real dog. If it looks like a drawing of an actual Sapsali, it is wrong — simplify it much further.

PROPORTION: stubby and toy-like. The head is large relative to the body, the four legs are short and thick.

EYES — important: a long shaggy fringe of coat falls down over the eyes, BUT the two eyes are still clearly visible through the fringe as two small attentive dots. It must read as 'sees everything, even from behind the hair' — attentive, not hidden and not sleepy.

EARS — the character's main feature: two large, long, low-set floppy ears hanging down the sides of the head, noticeably oversized relative to the head. They signify listening and should be the first thing the eye lands on.

FACE: a small rounded nose, a calm closed mouth. No visible tongue, no teeth.

DETAIL: a small simple satchel strapped across its back.`,
    ks: `PLACEMENT: the long shaggy coat belongs to the GREEN family — #BFD72F on the top of the head and back, deepening to #95C93D at the belly and legs. The two big floppy ears and the satchel on its back belong to the ORANGE family. They touch where the satchel strap crosses the green coat and where each ear attaches to the head — put MEETING GREEN #54B947 along the strap and as a small wedge at each ear root. The nose, the eyes and every outline are NAVY #004B88.`
  }
};

// ─── API 호출 ────────────────────────────────────────────────────────────

async function generate(prompt, inputPng) {
  const content = [{ type: 'input_text', text: prompt }];
  if (inputPng) {
    const b64 = fs.readFileSync(inputPng).toString('base64');
    content.push({ type: 'input_image', image_url: `data:image/png;base64,${b64}` });
  }
  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      model: MODEL,
      input: [{ role: 'user', content }],
      tools: [{ type: 'image_generation', size: '1024x1024', background: 'opaque' }]
    })
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} :: ${text.slice(0, 800)}`);
  const json = JSON.parse(text);
  const calls = (json.output || []).filter(o => o.type === 'image_generation_call');
  if (!calls.length) {
    throw new Error(`이미지 출력 없음. output 타입: ${(json.output || []).map(o => o.type).join(', ')}`);
  }
  return { buf: Buffer.from(calls[0].result, 'base64'), usage: json.usage };
}

// ─── 실행 ────────────────────────────────────────────────────────────────

const [, , stage, which] = process.argv;
if (!['base', 'ks'].includes(stage)) {
  console.error('사용: node tools/round2-generate.mjs <base|ks> <key|all>');
  process.exit(1);
}
const keys = (!which || which === 'all') ? Object.keys(CONCEPTS) : [which];
for (const k of keys) {
  if (!CONCEPTS[k]) { console.error(`알 수 없는 key: ${k}`); process.exit(1); }
}
fs.mkdirSync(OUT_DIR, { recursive: true });

for (const k of keys) {
  const c = CONCEPTS[k];
  const basePath = path.join(OUT_DIR, `${c.n}-${c.name}-base.png`);
  const outPath = stage === 'base' ? basePath : path.join(OUT_DIR, `${c.n}-${c.name}-ks.png`);
  let prompt, inputPng = null;
  if (stage === 'base') {
    prompt = `${c.base}\n${BASE_STYLE}`;
  } else {
    if (!fs.existsSync(basePath)) { console.error(`[${k}] 원안 없음: ${basePath}`); continue; }
    prompt = `${RECOLOR_RULES}\n\n${c.ks}`;
    inputPng = basePath;
  }
  try {
    const { buf, usage } = await generate(prompt, inputPng);
    fs.writeFileSync(outPath, buf);
    console.log(`OK  ${c.n} ${c.name} [${stage}] -> ${outPath} (${buf.length} bytes)` +
      (usage ? ` usage=${usage.total_tokens}` : ''));
  } catch (e) {
    console.error(`FAIL ${c.n} ${c.name} [${stage}] :: ${e.message}`);
  }
}
