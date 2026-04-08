const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyD596mVxu87ldqhh_vwjk3XbmaZmPHkp7Q';
const genAI = new GoogleGenerativeAI(API_KEY);

const OUTPUT_DIR = path.join(__dirname, 'ad-output-v4');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const VARIATION_SUFFIX = {
  1: '',
  2: ' Use a slightly different background color shade — keep the same layout and all text identical.',
  3: ' Rearrange the product icons into a slightly different grid order. Keep all text and colors identical.',
};

const ADS = [
  {
    id: 'ad-sale-01',
    name: 'HUGE SALE — 70% OFF Hero Banner',
    prompt: `Bold Facebook ad creative, 1080x1080 pixels. Vibrant dark purple-to-navy gradient background. Top section: a bright red or orange sale ribbon banner across the top reading "🚨 HUGE SALE: 70% OFF 🚨" in large bold white text. Center: the price "$14" in massive, bold yellow typography, with a crossed-out "$47" above it in smaller gray text. Below the price: white bold text "400,000 Digital Products" in large sans-serif font. Below that: a tight 3x2 icon grid showing six flat product category icons with white emoji-style icons and small white labels: Ebooks, Canva Planners, Faceless Videos, Fitness Courses, Money Courses, Mindset Courses. Bottom strip: bright orange button shape with white bold text "Master Resell Rights — Keep 100% Profits". Colorful, high-energy, mobile-first design. No borders. Bold drop shadows on the price text.`,
  },
  {
    id: 'ad-sale-02',
    name: 'Product Category Grid — What You Get',
    prompt: `Bold Facebook ad creative, 1080x1080 pixels. Clean white background with a bright orange top bar. Top bar text in white bold: "400,000 Digital Products for $14". Below that, a 3x2 grid of colorful product category cards, each card has a rounded corner box with a bright flat-color background (teal, coral, purple, green, yellow, blue). Each card shows a large white emoji icon centered at top and a bold white label below: Card 1 (teal): book emoji + "Ebooks", Card 2 (coral): palette emoji + "Coloring Books", Card 3 (purple): calendar emoji + "Canva Planners", Card 4 (green): video camera emoji + "Faceless Videos", Card 5 (yellow): dumbbell emoji + "Fitness Courses", Card 6 (blue): money bag emoji + "Money Courses". Bottom of image: bright orange full-width bar with white bold text "Master Resell Rights — Keep 100% of Every Sale". Bright, clean, mobile-optimized. No small text. All text is large and readable.`,
  },
  {
    id: 'ad-sale-03',
    name: 'Why Grab This — Benefit Bullets',
    prompt: `Bold Facebook ad creative, 1080x1080 pixels. Deep navy blue background. Top: bright yellow bold text "Why You Need This 👇" in large sans-serif. Below it, four large benefit rows stacked vertically, each row has a bright yellow circle icon on the left with a white emoji inside, and bold white text on the right. Row 1: money bag icon + "Instant Income — Keep 100% of profits". Row 2: lightning bolt icon + "No Creation Needed — Done for you". Row 3: fire icon + "400,000 Products for ONLY $14". Row 4: star icon + "Perfect for beginners and businesses". Bottom: a bright orange rounded rectangle button with bold white text "Grab Yours Now — Limited Time Only!". High contrast, energetic, emoji-forward. Large readable text throughout. Bold and punchy.`,
  },
  {
    id: 'ad-sale-04',
    name: 'Urgency Countdown — Limited Time Offer',
    prompt: `Bold Facebook ad creative, 1080x1080 pixels. Bright red-to-orange gradient background. Top center: white emoji "⏳" at large scale. Below it: white bold text "LIMITED TIME OFFER" in all caps, large sans-serif. Center: a large white rounded rectangle price box with inside text — crossed-out original price "~~$47~~" in gray small text above, then bold orange text "$14" in very large display size, then below it small bold text "ONE-TIME PAYMENT". Below the price box: three white bold bullet lines with checkmark emojis: "✅ 400,000 Digital Products", "✅ Master Resell Rights Included", "✅ Instant Access After Purchase". Bottom: white bold text "Don't miss this — sale ends soon! 🚨". Urgent, high-energy, warm gradient. Mobile-first. All text large and bold.`,
  },
  {
    id: 'ad-sale-05',
    name: 'Personal Introduction — Sarah Foster',
    prompt: `Warm friendly Facebook ad creative, 1080x1080 pixels. Soft cream or warm peach background. Top: bold dark text "Hey, I'm Sarah Foster 👋" in large friendly sans-serif. Below it: a clean rounded info box with light background and bold text inside: "Co-Founder, Kaizen Marketing Agency". Center section: bold dark text "I've put together 400,000 digital products for you" followed by a bright orange price pill badge showing "$14 — 70% OFF". Below that: three short bold benefit lines with emojis: "📚 Ebooks, Planners, Courses & More", "💰 Master Resell Rights — Keep 100%", "⚡ Instant Access — No waiting". Bottom: a bold orange rounded button with white text "Grab the Deal Now 😊". Warm, personal, approachable. Feels like a friend sharing a deal, not a corporate ad.`,
  },
  {
    id: 'ad-sale-06',
    name: 'Product Showcase — Dense Category List',
    prompt: `Bold Facebook ad creative, 1080x1080 pixels. Dark charcoal or dark navy background. Top: large bright yellow text "400,000 Products. One Price." with the "$14" in oversized bright orange below it. Center section: two columns of product category rows, each row has a colorful emoji on the left and bold white text label on the right. Left column: "📚 Ebooks", "🎨 Coloring Books", "📅 Canva Planners", "🎥 Faceless Videos". Right column: "🏋️ Fitness Courses", "💰 Money Courses", "🧠 Mindset Courses", "🔑 Master Resell Rights". A thin bright orange horizontal divider separates the title from the list. Bottom strip: bright orange full-width bar with bold white text "Keep 100% of Every Sale — Yours Today". High contrast, list-driven, product-forward. Every item clearly readable.`,
  },
  {
    id: 'ad-sale-07',
    name: 'Value Stack — Price Comparison',
    prompt: `Bold Facebook ad creative, 1080x1080 pixels. Clean white background. Top: large bold dark text "What You Get for $14 👇". Center: a vertical value stack — a series of bold rows each showing a product type on the left and a strikethrough value price on the right, suggesting massive savings. Example rows in bold dark text with a bright orange value badge: "400 Ebooks — $200 value", "Canva Planners — $150 value", "Faceless Videos — $300 value", "Fitness Courses — $400 value", "Money Courses — $500 value". Below the stack: a bold orange divider line. Below divider: large bold text "Total Value: $1,500+" in dark text with strikethrough, then below it massive bold orange text "YOU PAY: $14". Bottom: bright orange rounded button with white bold text "Get Instant Access Now". Clean, value-driven, irresistible math layout.`,
  },
  {
    id: 'ad-sale-08',
    name: 'Social Proof Style — Testimonial Format',
    prompt: `Warm Facebook ad creative, 1080x1080 pixels. Light lavender or soft blue-gray background. Top section: large bold text "People Are Loving This 🔥" in dark charcoal. Center: two or three white rounded testimonial card boxes stacked with soft drop shadows. Each card has: a yellow star rating row (5 stars) at top, then bold dark quote text like "Best $14 I ever spent — got 400,000 products instantly!" or "I made back my $14 on the first day of selling." with a name below in smaller gray text like "— Jessica M." or "— Marcus T.". Below the cards: a bold orange pill badge with white text "400,000 Products — $14 One-Time". Bottom: bright orange rounded button with white text "Join Thousands of Happy Sellers". Trustworthy, warm, social proof-driven.`,
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
  console.log(`\nGenerating ${ADS.length * 3} competitor-style images (${ADS.length} ads × 3 variations)...\n`);

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
  console.log(`Done! ${generated.length} images saved to ad-output-v4/`);
  console.log(generated.map(f => `  ${f}`).join('\n'));
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
