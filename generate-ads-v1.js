const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyD596mVxu87ldqhh_vwjk3XbmaZmPHkp7Q';
const genAI = new GoogleGenerativeAI(API_KEY);

const OUTPUT_DIR = path.join(__dirname, 'ad-output-v1');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Variation modifiers — applied to each prompt for V2 and V3
const VARIATION_SUFFIX = {
  1: '',
  2: ' Variation: slightly shift the composition — move the primary visual element to be left-of-center instead of centered. All colors, fonts, and copy remain identical.',
  3: ' Variation: add a very subtle background texture (fine linen or paper grain at 5% opacity over the cream). The layout remains the same but the background has more tactile depth. All colors, fonts, and copy remain identical.',
};

const ADS = [
  {
    id: 'creative-01',
    name: 'The $14 Reality Check — What if the $997 course was the scam?',
    prompt: `Flat design graphic, 1080x1080 pixels. Background color: #faf4f1 (cream/beige) — this is the ONLY background color, DO NOT use orange or any other color as background. Center composition. A single price tag graphic rendered in a clean, editorial style — the price tag shows "$997" in large, slightly faded or crossed-out serif typography (Gilda Display style), in dark charcoal (#1a1a1a). Below it, a clean thin horizontal dividing line. A question mark in bold Space Grotesk at large scale positioned bottom-center of the frame, in dark charcoal. Minimal negative space — 30% of the canvas is empty cream. No lifestyle elements, no people, no stock photography. Flat, editorial, almost confrontational in its simplicity. NO TEXT IN IMAGE — space reserved at top-center (25% of canvas height) and bottom-center for text overlay. Subtle paper texture on background. Clean modern ad aesthetic. The orange-red accent color (#E8581A) is used ONLY on small accents, NEVER as background.`,
  },
  {
    id: 'creative-02',
    name: 'The $14 Reality Check — Stop buying courses. Start buying inventory.',
    prompt: `Bold typographic poster, 1080x1080 pixels. Background: #faf4f1 cream — DO NOT use orange as background. Two visual zones split by a clean thin horizontal rule (#1a1a1a, 1px) running across the full width at the 50% vertical mark. Top half: faint, slightly blurred image of a generic course book cover or digital device with a red X overlay — desaturated, muted, nearly ghost-like at 20% opacity. Bottom half: clean cream area with a bold upward arrow graphic in orange-red (#E8581A), simple geometric style. NO TEXT IN IMAGE — large reserved zones for text overlay top and bottom. The orange-red (#E8581A) appears ONLY on the arrow, not as background. Flat design, subtle paper texture. Editorial and confident.`,
  },
  {
    id: 'creative-03',
    name: 'The $14 Reality Check — $997 vs $14. Same result. Different bank account.',
    prompt: `Clean split-comparison graphic, 1080x1080 pixels. Background: #faf4f1 cream — DO NOT use orange as background. Two columns separated by a thin vertical rule (#1a1a1a, 1px) at center. Left column: large "$997" typography in Space Grotesk Bold at 96pt, #1a1a1a, vertically centered. Faint label below it in 20pt Inter in gray: the course. Right column: large "$14" typography in Space Grotesk Bold at 96pt, #E8581A (orange-red), vertically centered. Faint label below in 20pt Inter in gray: 400,000 products. The orange-red (#E8581A) appears ONLY on the "$14" text, NOT as background. Reserve top 20% of canvas for headline overlay. Clean, minimal, no decorative elements. The numbers are the entire visual. White space is intentional. Slight cream paper texture.`,
  },
  {
    id: 'creative-04',
    name: 'The Inventory Problem — What\'s actually stopping you from selling digital products right now?',
    prompt: `Minimalist typographic ad, 1080x1080, background #faf4f1 cream — DO NOT use orange as background. Center-aligned composition. A single large empty rectangular box outline (2px stroke, #1a1a1a) occupying the center 60% of the canvas — representing a missing product, an empty inventory slot. The box is clean and geometric. Inside the box, a small question mark in #5c5c5c at 48pt, centered. Below the box, a thin horizontal rule. NO TEXT IN IMAGE — reserve top 30% for hook text and bottom 15% for sub-copy. The orange-red (#E8581A) is used ONLY for small accents. Negative space is deliberate and uncomfortable — the empty box should feel like something is missing. Cream paper texture. No lifestyle photography, no people.`,
  },
  {
    id: 'creative-05',
    name: 'The Inventory Problem — 400,000 products. $14. No creation required.',
    prompt: `Dense product mockup grid, 1080x1080, background #faf4f1 cream — DO NOT use orange as background. A tight 6x6 grid of flat-lay digital product mockup thumbnails — ebook covers, course tiles, template previews, PDF covers — arranged in uniform cells with 4px gaps, each cell approximately 160x160px. Products shown in varied colors but all rendered as clean, professional digital mockups. The grid occupies the center 80% of the canvas, leaving 10% cream border on all sides. Bottom 20% of canvas is clear cream — reserved for text overlay. Products look like real digital products — not abstract icons. NO TEXT IN IMAGE — do not render any readable text on the product mockups. Mood: abundance, volume, overwhelming value. The orange-red (#E8581A) is NOT used as background.`,
  },
  {
    id: 'creative-06',
    name: 'The Inventory Problem — Stop waiting to create something. Start selling what already exists.',
    prompt: `Portrait format, 1080x1350, background #faf4f1 cream — DO NOT use orange as background. Two-zone vertical layout. Top zone (60% of canvas): a faint, desaturated minimal line illustration of someone at a blank canvas or empty laptop screen — representing creation paralysis. Rendered in #1a1a1a at 15% opacity. Bottom zone (40% of canvas): a clean, fully opaque flat grid of 4 product mockup thumbnails in a 2x2 arrangement, sharp and colorful, representing ready-made inventory. A thin dividing rule between zones. NO TEXT IN IMAGE — reserve top 15% and the area between zones for text overlay. The orange-red (#E8581A) appears ONLY on the downward arrow between zones, NOT as background.`,
  },
  {
    id: 'creative-07',
    name: 'The $14 Math — $14 in. Sell one product. You\'re already even.',
    prompt: `Clean infographic-style ad, 1080x1080, background #faf4f1 cream — DO NOT use orange as background. Three-step visual flow arranged vertically with connecting arrows. Step 1 (top): a simple flat icon of a wallet or coin — icon in #1a1a1a, clean line style. Arrow pointing down in #E8581A. Step 2 (middle): a flat "sold" badge or checkmark icon — clean line style in #1a1a1a. Arrow pointing down in #E8581A. Step 3 (bottom): a flat icon of coins stacking or a checkmark — clean line style in #1a1a1a. The three icons are evenly spaced, centered horizontally, connected by orange-red (#E8581A) arrows. NO TEXT IN IMAGE — text will be overlaid. The orange-red (#E8581A) appears ONLY on arrows, NOT as background. Minimal, clean, editorial.`,
  },
  {
    id: 'creative-08',
    name: 'The $14 Math — What do you do with the other 399,999 products after your first sale?',
    prompt: `Bold typographic ad with a visual countdown element, 1080x1080, background #faf4f1 cream — DO NOT use orange as background. Center composition. A large, bold number "399,999" in Space Grotesk Bold at 88pt, #1a1a1a, center of canvas — the number commands the entire visual. Above the number: a thin, small checkmark icon in #E8581A with a tiny label area. The massive number contrasts with the tiny checkmark to create the visual argument. Below the large number: a thin rule and small sub-text zone reserved for overlay. NO TEXT IN IMAGE — the numbers are visual elements, text will be overlaid. Clean cream background, paper texture. The orange-red (#E8581A) appears ONLY on the small checkmark icon, NOT as background.`,
  },
  {
    id: 'creative-09',
    name: 'The $14 Math — 400,000 products ÷ $14 = less than a cent per product.',
    prompt: `Math equation poster, 1080x1080, background #faf4f1 cream — DO NOT use orange as background. Center of canvas: a large, clean typographic equation in a modern editorial style. Three lines, centered: Line 1: "400,000 products" in Space Grotesk Bold 64pt #1a1a1a. Line 2: "÷ $14" in Space Grotesk Bold 80pt #E8581A (orange-red — used ONLY for this text element, NOT as background). A clean horizontal rule below line 2. Line 3: "= $0.000035 per product" in Gilda Display Italic 52pt #1a1a1a. Reserve top 15% and bottom 15% for text overlay. A very faint grid pattern (#f0ece8) behind the equation for a subtle notebook feel. The background is ALWAYS #faf4f1 cream.`,
  },
  {
    id: 'creative-10',
    name: 'The $14 Math — Do the math. Then decide.',
    prompt: `Stark, confident typographic ad, 1080x1080, background #faf4f1 cream — DO NOT use orange as background. Ultra-minimal composition. Center of canvas: a clean 3-column data table rendered in a flat editorial style — thin #1a1a1a 1px rules, no decorative borders. Three rows: Row 1 (header): Investment | Products | Profit per sale — in 18pt Inter Medium #5c5c5c. Row 2 (competitor): $997 | "0 (you learn)" | "0% (theirs)" — in 28pt Space Grotesk #1a1a1a. Row 3 (highlighted with subtle #fdf0e8 row background): $14 | 400,000 | "100% (yours)" — in 28pt Space Grotesk #1a1a1a. The orange-red (#E8581A) is NOT used as background, only as very subtle accent if needed. Table occupies center 70% of canvas. Reserve top 20% for headline overlay. Clean and confident.`,
  },
  {
    id: 'creative-11',
    name: 'The Already Entrepreneur — You\'re not missing the skill. You\'re missing the inventory.',
    prompt: `Editorial identity ad, 1080x1080, background #faf4f1 cream — DO NOT use orange as background. Bold two-part typographic layout with a single visual anchor. Center: a clean flat icon of an empty shelf or empty box — minimalist line illustration at 40% canvas width, #1a1a1a at 30% opacity. This sits behind the text zone as a watermark-level visual metaphor. The composition has deliberate emptiness in the top 40% for the hero text overlay. Reserve bottom 25% for sub-copy overlay. Left-aligned composition. The orange-red (#E8581A) appears ONLY on accent elements, NOT as background. Overall feeling: direct, personal, written to one person.`,
  },
  {
    id: 'creative-12',
    name: 'The Already Entrepreneur — Stop researching. Start selling.',
    prompt: `High-contrast typographic ad, 1080x1080, background #faf4f1 cream — DO NOT use orange as background. Two equal horizontal zones divided by a bold, full-width orange-red (#E8581A) horizontal line, 6px thick, at the 50% vertical mark. This line is the ONLY design element — it acts as the cut between two commands. Top zone: pure cream with space reserved for text overlay. Bottom zone: pure cream with space reserved for text overlay. The orange-red (#E8581A) appears ONLY on the single dividing line, NOT as background. NO TEXT IN IMAGE — large reserved space for bold text overlays. Mood: abrupt, decisive, commanding. The background on BOTH zones is #faf4f1 cream.`,
  },
  {
    id: 'creative-13',
    name: 'The Wall of Products — 400,000 digital products. $14.',
    prompt: `Full-bleed product grid, 1080x1080, background #faf4f1 cream — DO NOT use orange as background. A dense, edge-to-edge grid of digital product mockup thumbnails — ebook covers, course tiles, PDF mockups, template previews — arranged in a tight 7x7 grid with 3px cream gaps between cells. Each cell approximately 148x148px. Products vary in color but are all rendered as flat, professional digital product mockups. The grid bleeds to all four edges with no border. A gradient-to-cream fade at top (20% of canvas height) and bottom (15% of canvas height) creates space for text overlay while the grid dominates. The fade reveals the #faf4f1 cream background. Overwhelming abundance. NO TEXT IN IMAGE on individual product tiles.`,
  },
  {
    id: 'creative-14',
    name: 'The Wall of Products — I had to count twice.',
    prompt: `Focused zoom-in product grid, 1080x1080, background #faf4f1 cream — DO NOT use orange as background. A product grid of digital product mockup thumbnails — ebooks, course tiles, templates — with a visual zoom/focus effect: the center 40% of the grid is sharp and detailed, with a radial blur increasing toward the edges, giving a sense of infinite depth and volume. The grid implies it extends beyond the frame on all sides. Center bottom: a clean cream strip (#faf4f1, 25% canvas height) with a sharp edge rising from the grid — reserved for text overlay. The zoom effect feels like looking into a deep inventory vault. Mood: discovery, abundance, slight disbelief. The orange-red (#E8581A) is NOT used as background.`,
  },
  {
    id: 'creative-15',
    name: 'The Wall of Products — Less than a coffee. More than 400,000 products.',
    prompt: `Split comparison flat-lay, 1080x1080, background #faf4f1 cream — DO NOT use orange as background. Two side-by-side compositions on the cream surface. Left side (40% width): an overhead shot of a single takeaway coffee cup — clean, minimal, no brand markings, sitting on the cream background. A small clean white price card floating above it showing "$6". Right side (60% width): a dense stack of flat digital product mockup tiles — ebooks, courses, templates — arranged in a slightly messy overflow pile suggesting abundance. A small floating white card above showing "$14". A thin vertical rule (#1a1a1a, 1px) separates the two halves. The orange-red (#E8581A) is NOT used as background. Mood: casual comparison, obvious winner. NO additional text — price cards are simple white rectangles with clean type.`,
  },
];

async function generateImage(prompt, outputPath, retries = 2) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-image',
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
    },
  });

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const parts = result.response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('image/')) {
          const imageData = Buffer.from(part.inlineData.data, 'base64');
          fs.writeFileSync(outputPath, imageData);
          return true;
        }
      }
      throw new Error('No image data in response');
    } catch (err) {
      if (attempt === retries) throw err;
      console.log(`  Retry ${attempt + 1} for ${path.basename(outputPath)}...`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

async function processBatch(tasks) {
  return Promise.all(tasks.map(async ({ ad, variation, outputPath }) => {
    const label = `${ad.id}-v${variation}`;
    if (fs.existsSync(outputPath)) {
      console.log(`  SKIP ${label} (already exists)`);
      return;
    }
    try {
      const prompt = ad.prompt + VARIATION_SUFFIX[variation];
      await generateImage(prompt, outputPath);
      console.log(`  ✓ ${label}`);
    } catch (err) {
      console.error(`  ✗ ${label}: ${err.message}`);
    }
  }));
}

async function main() {
  console.log(`\nGenerating ${ADS.length * 3} images (${ADS.length} ads × 3 variations)...`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  const tasks = [];
  for (const ad of ADS) {
    for (let v = 1; v <= 3; v++) {
      const outputPath = path.join(OUTPUT_DIR, `${ad.id}-v${v}.png`);
      tasks.push({ ad, variation: v, outputPath });
    }
  }

  const BATCH_SIZE = 4;
  let done = 0;
  for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
    const batch = tasks.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(tasks.length / BATCH_SIZE);
    console.log(`Batch ${batchNum}/${totalBatches}:`);
    await processBatch(batch);
    done += batch.length;
    console.log(`  Progress: ${done}/${tasks.length} images\n`);
    if (i + BATCH_SIZE < tasks.length) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  const generated = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.png'));
  console.log(`\nDone! ${generated.length} images saved to ad-output-v1/`);
  console.log(generated.map(f => `  ${f}`).join('\n'));
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
