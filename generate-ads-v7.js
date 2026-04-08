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
  2: ' Change the background color to a different vibrant tone while keeping the same layout, text, and product mockups.',
  3: ' Use a slightly different product arrangement — shift mockups to the opposite side while keeping all text identical.',
};

const ADS = [

  // ── STYLE A: LIFESTYLE / DEVICE MOCKUP ────────────────────────────────────

  {
    id: 'style-a-01',
    name: 'Lifestyle — Laptop + Tablet on desk showing MRR products',
    prompt: `Photorealistic digital ad, 1080x1080 pixels. Warm cream or beige desk surface. A MacBook laptop and a tablet sit side by side on the desk. Both screens show a Google Drive file browser with yellow folders named: Ebooks, Video Courses, Canva Planners, Coloring Books, Faceless Videos, Mindset Courses, Fitness Courses, Make Money Courses. A small coffee cup sits to the left. Top of image: elegant dark serif bold text "400,000+ DIGITAL PRODUCTS" with a subtitle below "MASTER RESELL RIGHTS" in spaced caps. Bottom right: a round starburst badge in warm orange with bold white text "ONLY $14". The overall look is clean, premium, lifestyle photography style. Warm soft lighting. No people. No dark backgrounds.`,
  },
  {
    id: 'style-a-02',
    name: 'Lifestyle — Phone showing product folders + products scattered',
    prompt: `Photorealistic digital ad, 1080x1080 pixels. Light warm cream background with soft shadows. Center: a smartphone screen showing a file manager or Google Drive with folders named Ebooks, Coloring Books, Canva Planners, Faceless Videos, Fitness Courses. Around the phone, floating slightly: a colorful ebook cover, a printed planner page, and a small coloring book spread open. Top bold dark serif text "START RESELLING DIGITAL PRODUCTS TODAY". Below it smaller text "400,000+ MRR Products — Master Resell Rights Included". Bottom right: an orange starburst badge with bold white text "SALE $14". Lifestyle photography aesthetic. Warm soft lighting. Premium feel.`,
  },

  // ── STYLE B: ENERGETIC BURST ──────────────────────────────────────────────

  {
    id: 'style-b-01',
    name: 'Energetic Burst — Blue, 3D text, floating product mockups',
    prompt: `High-energy digital ad, 1080x1080 pixels. Vivid electric blue radial burst background — bright center fading to deep blue at edges, with diagonal light rays. Top center: bold 3D glossy white text "START YOUR" on one line, then massive 3D glossy yellow text "MRR BUSINESS" on the next line, with a deep blue drop shadow and glow effect. Below that: bold white text "400,000+ PRODUCTS — MASTER RESELL RIGHTS". Center-left: a floating 3D ebook cover mockup titled "Social Media Success Guide" with vibrant cover art. Center: a floating planner page mockup with colorful layout. Center-right: a coloring book open showing intricate designs. Bottom right: a bold yellow price tag shape with dark text "SALE $14". Bottom: bold white text "Keep 100% of Every Sale". Glossy, vibrant, high-impact. No dark edges.`,
  },
  {
    id: 'style-b-02',
    name: 'Energetic Burst — Teal, LEARN & EARN, fitness + money courses',
    prompt: `High-energy digital ad, 1080x1080 pixels. Vibrant teal-to-cyan radial burst background with bright starburst rays from center. Top: massive 3D glossy white and gold text "LEARN" on one line, an ampersand "&" in bold gold, then "EARN" in massive 3D glossy white — all with deep drop shadows and glow. Center-left: a fitness video mockup showing a woman exercising, framed like a video thumbnail. Center: a floating 3D book mockup titled "Make Money Online — Profit Strategies" with bold cover. Center-right: a journal or workbook mockup titled "Mindset Workbook". Below left: bold white text "400,000+ DIGITAL PRODUCTS — MASTER RESELL RIGHTS". Bottom right: a bold yellow tag badge with dark text "SALE $14". Sparkle stars scattered. Energetic and bold.`,
  },
  {
    id: 'style-b-03',
    name: 'Energetic Burst — Purple fire, all devices, coloring book open',
    prompt: `High-energy digital ad, 1080x1080 pixels. Dramatic purple and deep magenta radial burst background with fiery orange and yellow light rays from the center, like an explosion of energy. Top: bold 3D glossy yellow text "400,000+" in huge size, below it bold 3D white text "DIGITAL PRODUCTS". Center: a laptop, a tablet, and a smartphone arranged together — all showing product folder screens. In front of all devices: a large colorful coloring book spread open showing an intricate mandala design. Bottom left floating: a small stack of ebook covers in varied colors. Bottom right: a bold yellow starburst badge with dark text "SALE $14". Bottom full-width: bold 3D white text "MASTER RESELL RIGHTS" with gold glow. Dramatic, cinematic, explosive energy.`,
  },

  // ── STYLE C: BOLD TYPOGRAPHY ──────────────────────────────────────────────

  {
    id: 'style-c-01',
    name: 'Bold Typography — Black bg, green + white, product list',
    prompt: `Bold typographic digital ad, 1080x1080 pixels. Pure black background. Top left: two small gold sparkle star icons. Top center: very large bold white text "400,000+" on one line, below it bold bright green text "DIGITAL PRODUCTS", below that bold white text "MASTER RESELL RIGHTS" in spaced caps with a thin white underline. Center: a vertical list of product categories in bold white underlined text, each on its own line, centered: "E-books", "Coloring Books", "Planners (Canva)", "Faceless Videos", "Fitness Video Courses", "How to Make Money Courses", "Mindset Courses". Bottom right: small gold sparkle star. Clean, bold, high contrast. No imagery, pure text power.`,
  },
  {
    id: 'style-c-02',
    name: 'Bold Typography — Dark navy, gold accents, product list',
    prompt: `Bold typographic digital ad, 1080x1080 pixels. Very deep dark navy blue background. Top: two small gold four-pointed star sparkle icons flanking a center label. Below: very large bold white text "400 000" on one line, then bold gold text "DIGITAL PRODUCTS" on the next line, then smaller white spaced caps "MASTER RESELL RIGHTS" with a thin gold underline. Center: a vertical list of product categories in bold white underlined text, each centered on its own line: "E-books", "Coloring Books", "Planners (Canva)", "Faceless Videos", "Fitness Video Courses", "How to Make Money Courses", "Mindset Courses". Small gold sparkle stars in top corners. Elegant, bold, dark luxury feel.`,
  },

  // ── STYLE D: LUXURY PREMIUM ───────────────────────────────────────────────

  {
    id: 'style-d-01',
    name: 'Luxury Premium — Black + gold, MRR bundle, course grid',
    prompt: `Luxury premium digital ad, 1080x1080 pixels. Black background with subtle dark texture. Top center: small gold text label "10,000+ SELLERS WORLDWIDE" in a thin gold pill border. Below: large elegant white serif headline "What If You Could" then "Sell 400,000+" in bold gold, then "Products As Your Own?" in white. Center: a gold-bordered rounded rectangle with white text "INCLUDES FULL" above, then bold gold uppercase "MASTER RESELL RIGHTS" centered, then small white text "Keep 100% of every sale · No royalties · No restrictions". Below: a row of small gold-bordered pill tags: "E-books", "Coloring Books", "Canva Planners", "Faceless Videos". Below: a 2x3 grid of dark gold-bordered rounded rectangles each with a bold white label: "Fitness Video Courses", "Mindset Courses", "Make Money Courses", "Make Money Courses Vol.2", "How to Make Money", "Mindset & Marketing". Bottom: one line of small gold text "+ And Many More Premium Courses +". Very bottom: a full-width gold rounded button with bold dark text "GET INSTANT ACCESS NOW". Elegant, premium, dark luxury.`,
  },
  {
    id: 'style-d-02',
    name: 'Luxury Premium — Dark with gold, passive income positioning',
    prompt: `Luxury premium digital ad, 1080x1080 pixels. Deep charcoal black background with a very subtle gold gradient glow at the center. Top: small gold spaced text "PASSIVE INCOME STARTS HERE". Center top: large elegant white serif headline "Turn $14 Into a" then bold gold text "Digital Reselling Business" then white text "with 400,000 PLR & MRR Products". Center: a gold-bordered rounded box with bold gold uppercase "MASTER RESELL RIGHTS INCLUDED" and below it three white bullet lines: "· Keep 100% of every sale", "· No monthly fees — one-time payment", "· Instant access — start today". Below: a 2x4 grid of dark gold-bordered small rounded tiles each with a bold white label: "E-books", "Coloring Books", "Canva Planners", "Faceless Videos", "Fitness Courses", "Money Courses", "Mindset Courses", "And More". Very bottom: a full-width gold rounded button with bold dark text "GET YOUR 400,000 PRODUCTS — $14". Gold corner ornaments. Elegant, luxurious, sophisticated.`,
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
  console.log(`\nGenerating ${ADS.length * 3} brand-matched creatives (${ADS.length} ads × 3 variations)...\n`);
  console.log('Styles: A=Lifestyle  B=Energetic Burst  C=Bold Typography  D=Luxury Premium\n');

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
  console.log(`Done! ${generated.length} images saved to ad-output-v7/`);
  console.log(generated.map(f => `  ${f}`).join('\n'));
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
