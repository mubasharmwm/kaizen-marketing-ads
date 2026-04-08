const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyD596mVxu87ldqhh_vwjk3XbmaZmPHkp7Q';
const genAI = new GoogleGenerativeAI(API_KEY);

const OUTPUT_DIR = path.join(__dirname, 'ad-output-v2');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const VARIATION_SUFFIX = {
  1: '',
  2: ' Shift the primary visual element slightly left of center. Same colors, same concept.',
  3: ' Add a very faint linen grain texture (5% opacity) over the cream background. Same layout and colors.',
};

// FIXED PROMPTS — no technical instructions, no placeholder labels, no hex code mentions
const ADS = [
  {
    id: 'creative-02',
    name: 'Stop buying courses. Start buying inventory.',
    prompt: `Flat graphic poster, 1080x1080 pixels. Soft cream background (off-white, like aged paper). Two equal horizontal zones split by a single thin dark horizontal line across the full width at the midpoint. Top zone: a small, slightly faded image of a generic online course box or digital screen showing the word "COURSE" — with a bold red X drawn over it, like it is crossed out. The course image sits in the center of the top zone. Bottom zone: a bold upward-pointing orange arrow, clean and geometric, centered in the bottom zone. Nothing else in the image. No words, no labels, no codes, no measurements. The background is cream throughout. The only colors are: cream background, dark charcoal for the dividing line, orange-red for the arrow, and muted tones for the crossed-out course image.`,
  },
  {
    id: 'creative-04',
    name: 'What is actually stopping you from selling digital products right now?',
    prompt: `Minimalist graphic, 1080x1080 pixels. Soft cream background (off-white). Dead center of the canvas: a single empty rectangular box drawn with a thin dark charcoal outline, 2px stroke, occupying about 60% of the canvas width and 40% of the canvas height. Inside the box, centered: a single dark question mark. Below the box: one thin horizontal line spanning the full canvas width. Orange-red small dots in each corner of the canvas as subtle accents. Nothing else. No text. No labels. No placeholder words. No measurements. No codes. Just the empty box, the question mark inside it, the horizontal rule below, and the cream background.`,
  },
  {
    id: 'creative-10',
    name: 'Do the math. Then decide.',
    prompt: `Editorial data comparison graphic, 1080x1080 pixels. Soft cream background (off-white). Center of canvas: a clean three-column table with thin dark charcoal 1px ruled lines. The table has three rows. First row (header): three column labels — "Investment", "Products", "Profit per sale" — in small neat sans-serif type. Second row: "$997" in the first column, "0 (you learn)" in the second, "0% (theirs)" in the third — all in dark charcoal. Third row (highlighted with a very faint warm tint behind the row): "$14" in the first column, "400,000" in the second, "100% (yours)" in the third — the third cell text is in orange-red. The table occupies the center 70% of the canvas. Top 20% and bottom 15% are empty cream. No extra text. No labels outside the table. No decorative elements. No unrelated words.`,
  },
  {
    id: 'creative-11',
    name: 'You are not missing the skill. You are missing the inventory.',
    prompt: `Editorial identity graphic, 1080x1080 pixels. Soft cream background (off-white). Left side of canvas: a faint minimalist line drawing of an empty open cardboard box or an empty shelf — simple geometric lines in dark charcoal at about 25% opacity, positioned in the right-center area as a subtle watermark-level background element. The left 60% of the canvas is open and empty — reserved for large text overlay. Bottom 15% is empty. Right side has the faint box illustration only. No text of any kind in the image. No labels. No brand names. No placeholder words. No website URLs. Just the cream background and the faint empty-box illustration on the right side.`,
  },
  {
    id: 'creative-13',
    name: 'Wall of Products — 400000 digital products.',
    prompt: `Dense flat product mockup grid, 1080x1080 pixels. Cream off-white background. A tight 7-column by 7-row grid of flat digital product cover mockups — these look like simple book covers, course tile graphics, and PDF document covers — all with flat colored backgrounds (teal, navy, mustard, terracotta, sage) and simple geometric shapes or abstract patterns on them. No real photography. No human faces. No actual readable text on the tiles — just colored rectangles with abstract shapes. 3px cream gaps between cells. The grid fills the canvas edge to edge. A soft fade-to-cream gradient at the top (covering top 20% of canvas) and bottom (covering bottom 15%) so the cream background shows through at top and bottom. The overall impression is overwhelming volume and abundance.`,
  },
  {
    id: 'creative-14',
    name: 'Wall of Products — I had to count twice.',
    prompt: `Zoomed product grid graphic, 1080x1080 pixels. Cream off-white background. A grid of flat digital product cover mockups — simple book covers, course tiles, PDF covers — with flat colored backgrounds (teal, navy, mustard, terracotta, sage, forest green) and abstract geometric shapes on them. No real photography. No human faces. No actual readable words on individual tiles. The center 40% of the grid is sharp and clear. Moving outward toward the edges, the grid tiles become progressively blurred using a radial blur effect — creating a sense of infinite depth, as if there are far more products than can fit in the frame. The bottom 25% of the canvas is a clean solid cream strip with a sharp straight top edge — empty, reserved for text. The overall mood is discovery and disbelief at the sheer volume.`,
  },
];

async function generateImage(prompt, outputPath, retries = 3) {
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
  console.log(`\nRegenerating ${ADS.length * 3} fixed images...\n`);

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
    console.log(`  Progress: ${done}/${tasks.length}\n`);
    if (i + BATCH_SIZE < tasks.length) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  const generated = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.png'));
  console.log(`Done! ${generated.length} images saved to ad-output-v2/`);
  console.log(generated.map(f => `  ${f}`).join('\n'));
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
