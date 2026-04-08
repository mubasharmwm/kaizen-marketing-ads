const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyD596mVxu87ldqhh_vwjk3XbmaZmPHkp7Q';
const genAI = new GoogleGenerativeAI(API_KEY);

const OUTPUT_DIR = path.join(__dirname, 'ad-output-v7');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const VARIATION_SUFFIX = {
  1: '',
  2: ' Change the background to a slightly different dark tone while keeping the same layout and all text exactly identical.',
  3: ' Add a subtle gold gradient glow at the center while keeping the same layout and all text exactly identical.',
};

const ADS = [
  {
    id: 'style-d-01-fixed',
    name: 'Luxury Premium — Black + gold, MRR bundle, course grid (FIXED)',
    prompt: `Luxury premium digital ad, 1080x1080 pixels. Black background with subtle dark marble texture. Top center: small gold spaced text "10,000+ SELLERS WORLDWIDE" inside a thin gold pill border. Below: large elegant white serif headline text — line 1: "What If You Could", line 2: "Sell 400,000+" in bold gold color, line 3: "Products As Your Own?" in white. Center: a gold-bordered rounded rectangle containing — small white caps text "INCLUDES FULL" at top, then bold gold uppercase text "MASTER RESELL RIGHTS" centered, then small white text on three lines: "Keep 100% of every sale", "No royalties", "No restrictions". Below that rectangle: a single row of four small gold-bordered pill tags with white text: "E-books", "Coloring Books", "Canva Planners", "Faceless Videos". Below: a section label in small gold spaced caps "+ PREMIUM COURSES INCLUDED +". Below that: a 2x3 grid of dark gold-bordered rounded rectangles each containing bold white label text — exactly these six labels: "Fitness Video Courses", "Mindset Courses", "Make Money Courses", "Make Money Courses Vol.2", "How to Make Money", "Mindset and Marketing". Below grid: one line of small gold centered text "+ And Many More Premium Courses +". Very bottom: a full-width gold rounded rectangle button with bold dark text "GET INSTANT ACCESS NOW". No typos. All text exactly as specified.`,
  },
  {
    id: 'style-d-02-fixed',
    name: 'Luxury Premium — Passive income, dark gold (FIXED)',
    prompt: `Luxury premium digital ad, 1080x1080 pixels. Deep charcoal black background with a very subtle gold gradient glow at center. Gold ornamental corner decorations at all four corners. Top center: small gold spaced text "PASSIVE INCOME STARTS HERE". Below: large elegant white serif headline — line 1: "Turn $14 Into a", line 2: "Digital Reselling Business" in bold gold, line 3: "with 400,000 PLR and MRR Products" in white. Center: a gold-bordered rounded rectangle containing — bold gold uppercase text "MASTER RESELL RIGHTS INCLUDED" centered, then three white bullet lines below: "Keep 100% of every sale", "No monthly fees — one-time payment", "Instant access — start reselling today". Below rectangle: a 2x4 grid of dark gold-bordered small rounded tiles each with bold white label text — exactly these eight labels: "E-books", "Coloring Books", "Canva Planners", "Faceless Videos", "Fitness Courses", "Money Courses", "Mindset Courses", "And More". Very bottom: a full-width gold rounded rectangle button with bold dark text "GET YOUR 400,000 PRODUCTS — ONLY $14". No typos. All text exactly as specified.`,
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
  console.log(`\nFixing Style D + generating remaining variations...\n`);

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

  console.log(`Done! Fixed images saved to ad-output-v7/`);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
