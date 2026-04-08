const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyD596mVxu87ldqhh_vwjk3XbmaZmPHkp7Q';
const genAI = new GoogleGenerativeAI(API_KEY);

const OUTPUT_DIR = path.join(__dirname, 'ad-output-v3');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const VARIATION_SUFFIX = {
  1: '',
  2: ' Shift the primary visual element slightly left of center. Same colors, same concept.',
  3: ' Add a very faint linen grain texture (5% opacity) over the cream background. Same layout and colors.',
};

// FIXED PROMPTS — no hex codes, no technical labels, no placeholder text
const ADS = [
  {
    id: 'creative-01',
    name: 'What if the $997 course was the scam?',
    prompt: `Flat editorial graphic, 1080x1080 pixels. Soft cream background (off-white, like aged paper). Center of the canvas: a single oversized price tag shape drawn in a clean, editorial line style — dark charcoal outline, no fill. Inside the tag: the number "$997" in large crossed-out serif typography, slightly faded as if struck through with a single diagonal line. Below the price tag, a single thin horizontal rule spanning the full canvas width. Bottom-center of the canvas: a single large bold question mark in dark charcoal, standing alone. Generous empty space around all elements — the canvas feels calm and confrontational at once. No text of any kind. No labels. No website URLs. No brand names. No placeholder words. Just the cream background, the crossed-out price tag, the horizontal rule, and the question mark.`,
  },
  {
    id: 'creative-03',
    name: '$997 vs $14. Same result. Different bank account.',
    prompt: `Clean split-comparison graphic, 1080x1080 pixels. Soft cream background (off-white). A single thin dark charcoal vertical rule runs down the exact center of the canvas from top to bottom. Left half: the number "$997" in very large, bold sans-serif type, dark charcoal, vertically centered in the left half. A small faint label directly below it, too small to read — just a visual weight marker. Right half: the number "$14" in the same very large bold sans-serif type, but in a warm orange-red color, vertically centered in the right half. A small faint label directly below it, too small to read. Top 20% of canvas is empty cream. Bottom 15% is empty cream. No other elements. No additional text. No brand names. No codes. The two large numbers facing each other across the dividing line are the entire image.`,
  },
  {
    id: 'creative-05',
    name: '400,000 products. $14. No creation required.',
    prompt: `Dense product mockup grid, 1080x1080 pixels. Soft cream background (off-white). A tight 6-column by 6-row grid of flat digital product cover mockups — simple ebook covers, course tile graphics, PDF document covers, and template previews — each with flat solid colored backgrounds in varied tones (teal, navy, mustard, terracotta, sage, burgundy) and simple abstract geometric shapes or bold stripes as decoration. No real photography. No human faces. No readable text on individual tiles — just colored covers with shapes. The grid occupies the center 80% of the canvas with a 10% cream border on all sides. Bottom 20% of canvas is a clean solid cream strip. The overall impression is abundance and volume.`,
  },
  {
    id: 'creative-06',
    name: 'Stop waiting to create something. Start selling what already exists.',
    prompt: `Portrait format graphic, 1080x1350 pixels. Soft cream background (off-white). Two vertical zones separated by a thin dark charcoal horizontal rule at the midpoint. Top zone (upper half): a minimal, faint line illustration of a person sitting at an empty blank desk or blank laptop screen — rendered in very light charcoal at low opacity, like a ghost image. The illustration is simple, not detailed, and feels unfinished or stuck. Bottom zone (lower half): a clean, sharp 2-column by 2-row grid of four digital product cover mockups — bold flat colors, geometric designs, no readable text on covers. The four covers are fully opaque and colorful, contrasting with the faint illustration above. No additional text anywhere in the image. No labels. No URLs.`,
  },
  {
    id: 'creative-07',
    name: '$14 in. Sell one product. You\'re already even.',
    prompt: `Clean vertical flow infographic, 1080x1080 pixels. Soft cream background (off-white). Three simple flat icons arranged vertically down the center of the canvas, evenly spaced, connected by thin downward-pointing arrows in orange-red. Top icon: a simple flat wallet or single coin — dark charcoal line style, centered. Middle icon: a clean flat "SOLD" badge or checkmark circle — dark charcoal line style, centered. Bottom icon: a flat stack of coins or a rising bar — dark charcoal line style, centered. The connecting arrows between icons are orange-red, simple and geometric. The three icons and two arrows are the entire image. No text anywhere. No labels. No numbers. No codes. Just the three icons connected by orange arrows on the cream background.`,
  },
  {
    id: 'creative-08',
    name: 'What do you do with the other 399,999 products after your first sale?',
    prompt: `Minimalist typographic impact graphic, 1080x1080 pixels. Soft cream background (off-white). Upper-center of the canvas: a very small orange-red checkmark icon, simple and clean. Below it, taking up the dominant center of the canvas: the number "399,999" in massive, bold sans-serif type, dark charcoal, centered. The contrast between the tiny checkmark and the enormous number is the entire visual idea. Bottom 20% of canvas is empty cream. Top 15% is empty cream. No other elements. No additional text. No labels. No brand names. Just the small checkmark above and the enormous number below on the cream background.`,
  },
  {
    id: 'creative-09',
    name: '400,000 products ÷ $14 = less than a cent per product.',
    prompt: `Mathematical equation poster, 1080x1080 pixels. Soft cream background (off-white) with a very faint grid pattern suggesting a notebook page. Center of canvas: three lines of large typographic math, centered. First line: the words "400,000 products" in large bold sans-serif type, dark charcoal. Second line: the symbol "÷ $14" in even larger bold sans-serif type, warm orange-red color. A clean thin horizontal rule below the second line, spanning about 60% of the canvas width, like an equals bar. Third line: the expression "= $0.000035 per product" in large elegant italic serif type, dark charcoal. The three lines and rule are centered and fill the middle 60% of the canvas vertically. Top 15% and bottom 15% are empty cream. No other text. No labels. No brand names.`,
  },
  {
    id: 'creative-12',
    name: 'Stop researching. Start selling.',
    prompt: `High-contrast two-zone graphic, 1080x1080 pixels. Soft cream background (off-white) on both halves. The canvas is divided exactly in half horizontally by a single bold orange-red horizontal line, 6 pixels thick, spanning the full width. Top half: pure cream — completely empty. Bottom half: pure cream — completely empty. The single bold orange-red line is the only element in the entire image. No text. No icons. No labels. No shapes. Just the cream canvas split by the one orange-red horizontal rule. The image is intentionally stark and minimal — the line feels like a cut, a decision, a before and after.`,
  },
  {
    id: 'creative-15',
    name: 'Less than a coffee. More than 400,000 products.',
    prompt: `Side-by-side flat-lay comparison, 1080x1080 pixels. Soft cream background (off-white). A single thin dark charcoal vertical rule at the center divides the canvas into two halves. Left half (40% of canvas): an overhead view of a single takeaway coffee cup — clean, minimal, no brand markings, sitting on the cream surface. Above the cup: a small clean white rectangular price card floating above it with the number "$6" in simple dark type. Right half (60% of canvas): a loosely stacked pile of flat digital product cover mockups — ebooks, course tiles, templates — slightly overlapping each other, suggesting overflow and abundance. Above the pile: a small clean white rectangular price card with the number "$14" in simple dark type. No other text. No labels. No brand names. Just the coffee on the left and the product pile on the right.`,
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
  console.log(`\nGenerating ${ADS.length * 3} images (${ADS.length} ads × 3 variations)...\n`);

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
  console.log(`Done! ${generated.length} images saved to ad-output-v3/`);
  console.log(generated.map(f => `  ${f}`).join('\n'));
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
