const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyD596mVxu87ldqhh_vwjk3XbmaZmPHkp7Q';
const genAI = new GoogleGenerativeAI(API_KEY);

const OUTPUT_DIR = path.join(__dirname, 'ad-output-v6');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const VARIATION_SUFFIX = {
  1: '',
  2: ' Use a slightly different light pastel background tone — same layout and all text identical.',
  3: ' Swap the accent color to a soft coral or mint green while keeping the light background and same layout.',
};

const ADS = [

  // ── FIXED VERSIONS OF 03, 05, 08 ──────────────────────────────────────────

  {
    id: 'fix-03',
    name: 'Why MRR Is the Easiest Passive Income (fixed)',
    prompt: `Bold Facebook ad creative, 1080x1080 pixels. Light warm white or very light yellow background. Top: large bold dark charcoal text "Why MRR Is the Easiest Passive Income in 2025 👇". Below it, four benefit rows stacked vertically. Each row has a soft orange circle icon on the left with a white emoji inside, and bold dark text on the right. Row 1: money bag icon + "Instant Income — Keep 100% of profits". Row 2: lightning bolt icon + "No Creation Needed — All Done for You". Row 3: fire icon + "400,000 Products for ONLY $14". Row 4: star icon + "Resell Anytime — Passive Income on Autopilot". Bottom: bright orange rounded rectangle button with bold white text "Grab Yours Now — Limited Time Only!". Light, clean, airy. All backgrounds pale and bright. Text is dark charcoal for readability. No typos anywhere.`,
  },
  {
    id: 'fix-05',
    name: 'Passive Income Reselling — No founder name (fixed)',
    prompt: `Warm friendly Facebook ad creative, 1080x1080 pixels. Very light peach or soft warm white background. Top: large bold dark text "Start Earning Passive Income by Reselling Digital Products 💰" in large friendly sans-serif. Center: bold dark text "400,000 Digital Products with Master Resell Rights" with a bright orange pill badge "$14 — 70% OFF" beside it. Below that: five short bold benefit lines with emojis in dark text: "📚 Ebooks, Coloring Books & Canva Planners", "🎥 Faceless Videos & Fitness Courses", "💰 Money & Mindset Courses Included", "🔑 Master Resell Rights — Keep 100% of Every Sale", "⚡ Instant Access — Start Reselling Today". Bottom: bright orange rounded button with white bold text "Grab the Deal Now 😊". Light, warm, airy. No founder name anywhere. Soft shadows on cards.`,
  },
  {
    id: 'fix-08',
    name: 'Social Proof — Passive Income (fixed)',
    prompt: `Warm social proof Facebook ad creative, 1080x1080 pixels. Very light lavender or soft cream-white background. Top: large bold dark charcoal text "People Are Building Passive Income With This 🔥". Center: three white testimonial cards with soft drop shadows, rounded corners, side by side. Card 1: five orange stars, bold dark quote "Best $14 I ever spent — selling digital products is now my side income!", name "— Jessica M." in small gray text. Card 2: five orange stars, bold dark quote "Made my $14 back on day one. MRR is a game changer.", name "— Marcus T." Card 3: five orange stars, bold dark quote "400,000 products, instant access, and I keep every dollar I make.", name "— Sarah K.". Below cards: bright orange pill badge with white text "400,000 MRR Products — $14 One-Time". Bottom: bright orange rounded button with white text "Join Thousands of Happy Resellers". Light soft background. Warm, trustworthy, airy. No duplicate words or letters anywhere.`,
  },

  // ── NEW STYLES ─────────────────────────────────────────────────────────────

  {
    id: 'new-split',
    name: 'Split Layout — Left headline, Right product list',
    prompt: `Facebook ad creative, 1080x1080 pixels. Clean split layout. Left half: very light sky blue background with large bold dark text stacked vertically — "400,000" in huge display size, then "PLR & MRR" in bold orange, then "Products" in bold dark, then a bright orange pill badge "$14 Only" centered below. Right half: clean white background with a bold dark heading "What's Inside:" and a vertical list of product types each on its own row with a colorful emoji and bold dark label: "📚 Ebooks", "🎨 Coloring Books", "📅 Canva Planners", "🎥 Faceless Videos", "🏋️ Fitness Courses", "💰 Money Courses", "🧠 Mindset Courses", "🔑 Resell Rights". A thin orange vertical divider between the two halves. Bottom full-width orange bar: bold white text "Keep 100% of Every Sale — Yours Today". Light, airy, structured.`,
  },
  {
    id: 'new-checklist',
    name: 'Giant Checklist — Everything you get',
    prompt: `Bold checklist Facebook ad creative, 1080x1080 pixels. Very light mint green background. Top: bold dark heading "Everything You Get for $14 ✅". Below it, a large clean checklist — each row has a bright green checkmark circle on the left and bold dark product description on the right: "✅ 400,000 Digital Products — Instant Download", "✅ Ebooks in 50+ Profitable Niches", "✅ Coloring Books — Ready to Sell", "✅ Canva Planners — Fully Customizable", "✅ Faceless Videos — Pre-Made & Ready", "✅ Fitness Video Courses", "✅ How to Make Money Online Courses", "✅ Mindset & Personal Growth Courses", "✅ Master Resell Rights — Keep 100% Profits". Below checklist: bold orange divider line. Bottom: large bold orange text "ONE-TIME PAYMENT: $14" and bright orange rounded button "Get Instant Access Now". Light background, high contrast, very scannable.`,
  },
  {
    id: 'new-product-showcase',
    name: 'Product Showcase — Big colorful category cards',
    prompt: `Vibrant product showcase Facebook ad creative, 1080x1080 pixels. Soft white background. Top: bold dark heading "400,000 Digital Products — Pick Any, Sell Any 🛒" and small bold orange subheading "Master Resell Rights — $14 One-Time". Center: a 4x2 grid of colorful rounded product category cards, each card has a pastel background color, a large emoji centered at top, and a bold dark label below. Card 1 (light blue): 📚 Ebooks. Card 2 (light coral): 🎨 Coloring Books. Card 3 (light purple): 📅 Canva Planners. Card 4 (light yellow): 🎥 Faceless Videos. Card 5 (light green): 🏋️ Fitness Courses. Card 6 (light pink): 💰 Money Courses. Card 7 (light teal): 🧠 Mindset Courses. Card 8 (light orange): 🔑 Resell Rights. Bottom: bright orange full-width bar with bold white text "Start Reselling Today — Keep Every Dollar You Make". Bright, airy, colorful product grid.`,
  },
  {
    id: 'new-bold-type',
    name: 'Bold Typography — Statement ad',
    prompt: `Bold typographic Facebook ad creative, 1080x1080 pixels. Very light warm cream background. Large bold dark statement text stacked center: Line 1 — "You Don't Need to" in medium bold dark, Line 2 — "CREATE" in huge display bold orange, Line 3 — "a Single Product." in medium bold dark. Below a thin orange horizontal rule: Line 4 — "400,000 PLR & MRR Products" in large bold dark, Line 5 — "are Waiting for You to Sell." in medium dark italic. Below another thin rule: a row of five small emoji product labels in bold dark text horizontally: "📚 Ebooks  🎨 Coloring Books  📅 Planners  🎥 Videos  💰 Courses". Bottom: bright orange rounded button with bold white text "Get All 400,000 for $14 — Start Reselling Today". Airy, confident, minimal. Strong typographic hierarchy. Light background throughout.`,
  },
  {
    id: 'new-before-after',
    name: 'Before vs After — Without vs With MRR',
    prompt: `Clean before-and-after comparison Facebook ad creative, 1080x1080 pixels. Light background overall. Top bold dark heading "Your Digital Business — Before vs After 👇". Center: two side-by-side rounded cards with soft drop shadows. Left card (very light red/pink tint background): bold heading "❌ Without MRR" in dark red, then a list of pain points in dark text: "Spending months creating products", "Zero inventory to sell", "Paying $997 for courses", "Starting from scratch", "Watching others profit". Right card (very light green tint background): bold heading "✅ With Our $14 Bundle" in dark green, then a list in dark text: "400,000 products — instant access", "Ebooks, Planners, Videos & Courses", "Master Resell Rights included", "Keep 100% of every sale", "Start reselling TODAY". Bottom center: large bold orange text "$14 One-Time — No Monthly Fees" and bright orange rounded button "Get Instant Access Now". Light, clean, high impact.`,
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
  console.log(`\nGenerating ${ADS.length * 3} creatives (${ADS.length} ads × 3 variations)...\n`);

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
  console.log(`Done! ${generated.length} images saved to ad-output-v6/`);
  console.log(generated.map(f => `  ${f}`).join('\n'));
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
