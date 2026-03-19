import puppeteer from '/Users/paddymeade/Marketing Agency/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, 'temporary screenshots');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || 'mobile';

const existing = fs.readdirSync(outputDir).filter(f => f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.match(/^screenshot-(\d+)/)?.[1] || '0')).filter(Boolean);
const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;

const filename = `screenshot-${next}-${label}.png`;
const outputPath = path.join(outputDir, filename);

const browser = await puppeteer.launch({
  executablePath: '/Users/paddymeade/.cache/puppeteer/chrome/mac_arm-146.0.7680.76/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 }); // iPhone 14
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: outputPath, fullPage: true });

await browser.close();
console.log(`Mobile screenshot saved: ${outputPath}`);
