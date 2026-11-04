import { chromium } from 'playwright';
const [exe, outDir] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: exe });
const langs = [
  { path: '/gu', file: 'Charmin-Krupali-Kankotri-Gujarati.pdf', date: 'શુભ મુહૂર્ત', rsvp: 'WhatsApp પર જવાબ આપો',
    wa: 'ચિ. ચાર્મિન & ચિ. કૃપાલિ ના શુભ લગ્નમાં અમે જરૂર પધારીશું.' },
  { path: '/', file: 'Charmin-Krupali-Invitation-English.pdf', date: 'The Auspicious Date', rsvp: 'Reply on WhatsApp',
    wa: 'We will be happy to attend the wedding of Charmin & Krupali.' },
];
for (const l of langs) {
  const page = await browser.newPage({ viewport: { width: 480, height: 900 } });
  await page.goto('http://localhost:3100' + l.path, { waitUntil: 'networkidle', timeout: 90000 });
  await page.click('#gate'); await page.waitForTimeout(2800);
  await page.click('.seal');
  const pages = [];
  for (let i = 0; i < 6; i++) { pages.push(await page.locator('.pg.on').evaluate((e) => e.outerHTML)); await page.locator('.nv button').last().click(); }
  await page.evaluate(({ l, pages }) => {
    document.querySelectorAll('#pt, .lang, .nv, .seal, iframe.map, .ct, nextjs-portal').forEach((e) => e.remove());
    document.querySelector('.book').innerHTML = pages.join('');
    const sealH2 = document.querySelector('#ltr').closest('.w').querySelector('h2'); sealH2.textContent = l.date;
    document.querySelector('form').closest('section').remove(); // PDF has no reply section
    const css = document.createElement('style');
    css.textContent = `*{animation:none!important;transition:none!important}.hero{min-height:auto;padding:56px 20px}
      .book{display:grid;gap:14px;place-items:stretch;grid-auto-rows:1fr;background:none;border:0;padding:0;min-height:0}.pg{display:flex;flex-direction:column;justify-content:center;width:100%;background:var(--milk);border:3px double var(--gold);border-radius:18px;padding:22px 18px}
      .letter{margin-top:0}section{padding:44px 20px}a{text-decoration:none}a[href^=tel]{white-space:nowrap}`;
    document.head.append(css);
  }, { l, pages });
  await page.waitForTimeout(600);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.emulateMedia({ media: 'screen' });
  await page.pdf({ path: `${outDir}/${l.file}`, width: '480px', height: `${h + 2}px`, printBackground: true, pageRanges: '1' });
  await page.screenshot({ path: `${outDir}/../pdfprev-${l.path === '/' ? 'en' : 'gu'}.png`, fullPage: true });
  console.log(l.file, 'height', h);
  await page.close();
}
await browser.close();
