const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyD596mVxu87ldqhh_vwjk3XbmaZmPHkp7Q';
const genAI = new GoogleGenerativeAI(API_KEY);

const OUTPUT_DIR = path.join(__dirname, 'ad-output-v5');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const VARIATION_SUFFIX = {
  1: '',
  2: ' Use a slightly different light pastel background tone — same layout and all text identical.',
  3: ' Swap the accent color to a soft coral or mint green while keeping the light background and same layout.',
};

const ADS = [
  {
    id: 'ad-v5-01',
    name: 'Start Your MRR Business for Just $14',
    prompt: `Bold Facebook ad creative, 1080x1080 pixels. Light background: soft sky blue or very light lavender, almost white. Top: a bright orange sale ribbon banner with bold white text "🚨 Start Your MRR Business for Just $14! 🚨". Center: large bold dark text showing crossed-out "$47" above, then huge bold orange "$14" price. Below price: bold dark text "400,000 Digital Products with Master Resell Rights". Below that: a row of 4 soft rounded icon badges (light colored backgrounds, dark icons and labels): "📚 Ebooks", "🎥 Faceless Videos", "💰 Money Courses", "🧠 Mindset Courses". Bottom: bright orange rounded button with bold white text "Master Resell Rights — Keep 100% Profits". Overall feel: light, bright, airy. White space is generous. Text is dark for contrast. No dark backgrounds anywhere.`,
  },
  {
    id: 'ad-v5-03',
    name: 'Why MRR Is the Easiest Passive Income in 2025',
    prompt: `Bold Facebook ad creative, 1080x1080 pixels. Light warm white or very light yellow background. Top: large bold dark charcoal text "Why MRR Is the Easiest Passive Income in 2025 👇". Below it, four benefit rows stacked vertically. Each row has a soft orange circle icon on the left with a white emoji inside, and bold dark text on the right. Row 1: money bag icon + "Instant Income — Keep 100% of profits". Row 2: lightning bolt icon + "No Creation Needed — All Done for You". Row 3: fire icon + "400,000 Products for ONLY $14". Row 4: star icon + "Resell Anytime — Passive Income on Autopilot". Bottom: bright orange rounded rectangle button with bold white text "Grab Yours Now — Limited Time Only!". Light, clean, airy. All backgrounds are pale and bright. Text is dark charcoal for readability.`,
  },
  {
    id: 'ad-v5-05',
    name: 'Sarah Foster — Passive Income Reselling',
    prompt: `Warm friendly Facebook ad creative, 1080x1080 pixels. Very light peach or soft warm white background. Top: bold dark text "Hey, I'm Sarah Foster 👋" in large friendly sans-serif. Below it: a light rounded info box with soft border showing "Co-Founder, Kaizen Marketing Agency". Center: bold dark text "Here's How to Earn Passive Income Reselling 400,000 Digital Products" with a bright orange pill badge "$14 — 70% OFF" beside it. Below that: three short bold benefit lines with emojis in dark text: "📚 Ebooks, Coloring Books, Canva Planners & More", "💰 Master Resell Rights — Keep 100% of Every Sale", "⚡ Instant Access — Start Reselling Today". Bottom: bright orange rounded button with white bold text "Grab the Deal Now 😊". Light, warm, personal, airy. No dark backgrounds. Soft shadows on cards.`,
  },
  {
    id: 'ad-v5-06',
    name: '400,000 PLR & MRR Products — Endless Profit',
    prompt: `Bold Facebook ad creative, 1080x1080 pixels. Clean white or very light gray background. Top: large bold dark charcoal text "400,000 PLR & MRR Products" and below it bold orange text "One Payment. Endless Profit." Center section: two columns of product rows, each row has a colorful emoji on the left and bold dark charcoal label on the right. Left column: "📚 Ebooks", "🎨 Coloring Books", "📅 Canva Planners", "🎥 Faceless Videos". Right column: "🏋️ Fitness Courses", "💰 Money Courses", "🧠 Mindset Courses", "🔑 Master Resell Rights". A thin bright orange horizontal divider between the title and the list. Bottom: bright orange full-width rounded bar with bold white text "Keep 100% of Every Sale — Yours for $14 Today". Light clean background throughout. All text dark and readable.`,
  },
  {
    id: 'ad-v5-07',
    name: 'What $14 of MRR Products Is Actually Worth',
    prompt: `Clean value-stack Facebook ad creative, 1080x1080 pixels. Very light mint green or soft light blue background. Top: large bold dark charcoal text "What $14 of MRR Products Is Actually Worth 👇". Center: a vertical value stack with rows — each row shows a product type on the left in bold dark text and a soft orange value badge on the right. Rows: "400,000 Ebooks — $200 value", "Canva Planners — $150 value", "Faceless Videos — $300 value", "Fitness Courses — $400 value", "Money Courses — $500 value", "Mindset Courses — $250 value". Below the stack: a bold orange divider line. Below it: bold dark text "Total Value: $1,800+" with strikethrough, then large bold orange text "YOU PAY: $14 — One Time". Bottom: bright orange rounded button with white bold text "Get Instant Access Now — Start Reselling Today". Light background, clean spacing, high contrast.`,
  },
  {
    id: 'ad-v5-08',
    name: 'People Are Building Passive Income With This',
    prompt: `Warm social proof Facebook ad creative, 1080x1080 pixels. Very light lavender or soft cream-white background. Top: large bold dark charcoal text "People Are Building Passive Income With This 🔥". Center: three white testimonial cards with soft drop shadows, rounded corners. Card 1: five orange stars, bold dark quote "Best $14 I ever spent — selling digital products is now my side income!", name "— Jessica M." in small gray text. Card 2: five orange stars, bold dark quote "Made my $14 back on day one. MRR is a game changer.", name "— Marcus T." Card 3: five orange stars, bold dark quote "400,000 products, instant access, and I keep every dollar I make.", name "— Sarah K.". Below cards: bright orange pill badge with white text "400,000 MRR Products — $14 One-Time". Bottom: bright orange rounded button with white text "Join Thousands of Happy Resellers". Light soft background. Warm, trustworthy, airy.`,
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
  console.log(`\nGenerating ${ADS.length * 3} light-theme MRR creatives (${ADS.length} ads × 3 variations)...\n`);

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
  console.log(`Done! ${generated.length} images saved to ad-output-v5/`);
  console.log(generated.map(f => `  ${f}`).join('\n'));
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
