const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');
const TurndownService = require('turndown');
const gfm = require('turndown-plugin-gfm');

const EXE = '/Users/chenyibin/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const ROOT = path.join(__dirname, '..');
const RAW = path.join(ROOT, 'raw');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
const only = process.argv.slice(2);
const CONCURRENCY = Number(process.env.CONC) || 3;

const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' });
td.use(gfm.gfm);
td.keep(['table', 'thead', 'tbody', 'tr', 'th', 'td']);
td.addRule('stripSvg', { filter: ['svg'], replacement: () => '' });
td.addRule('br', { filter: 'br', replacement: () => '  \n' });

function yaml(v) {
  if (v == null) return 'null';
  return JSON.stringify(v);
}

function cleanMd(md) {
  return md
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+$/gm, '')
    .replace(/!\[\]\([^)]*\)/g, '')
    .replace(/\n*(Share|Copy link)\s*\n*/g, '\n')
    .trim();
}

async function extract(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  try { await page.waitForLoadState('networkidle', { timeout: 15000 }); } catch {}
  // lazy images
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, 0));

  const meta = await page.evaluate(() => {
    const g = (s) => document.querySelector(s)?.content || null;
    return {
      title: document.querySelector('h1')?.innerText?.trim() || document.title,
      description: g('meta[name="description"]'),
      author: g('meta[name="author"]'),
      published: g('meta[property="article:published_time"]') || g('meta[name="date"]'),
    };
  });

  // 1) claude.com rich text body
  let html = await page.evaluate(() => {
    const el = document.querySelector('.text-rich-text');
    if (!el) return null;
    const clone = el.cloneNode(true);
    clone.querySelectorAll('script,style,button,svg,form,nav').forEach((n) => n.remove());
    clone.querySelectorAll('img').forEach((im) => {
      const src = im.getAttribute('src') || im.getAttribute('data-src') || '';
      if (src) im.setAttribute('src', new URL(src, location.href).href);
      im.removeAttribute('srcset');
    });
    clone.querySelectorAll('a').forEach((a) => a.setAttribute('href', new URL(a.getAttribute('href') || '', location.href).href));
    return clone.outerHTML;
  });

  // 2) fallback: readability over rendered html
  if (!html || html.length < 500) {
    const dom = new JSDOM(await page.content(), { url });
    const art = new Readability(dom.window.document).parse();
    html = art?.content || null;
  }
  const md = html ? cleanMd(td.turndown(html)) : '';
  return { ...meta, md };
}

async function handle(browser, item) {
  const bucket = item.type === 'blogPost' ? 'articles' : item.type === 'guide' ? 'guides' : 'webinars';
  const dir = path.join(RAW, bucket);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${item.slug}.md`);
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8').length > 600) return 'skip';

  const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  try {
    const r = await extract(page, item.url);
    const fm = [
      '---',
      `title: ${yaml(item.title)}`,
      `source_url: ${yaml(item.url)}`,
      `publisher: ${yaml(item.host || 'claude.com')}`,
      `type: ${yaml(item.type)}`,
      `date: ${yaml(item.date)}`,
      `products: ${JSON.stringify(item.products)}`,
      `read_time: ${yaml(item.readTime)}`,
      `excerpt: ${yaml(item.excerpt)}`,
      `fetched_at: ${yaml(new Date().toISOString().slice(0, 10))}`,
      '---',
      '',
      `# ${item.title}`,
      '',
    ].join('\n');
    const body = r.md || item.excerpt || '_(no article body — external recording/registration page)_';
    fs.writeFileSync(file, fm + body + '\n');
    return `${body.length} chars`;
  } finally {
    await ctx.close().catch(() => {});
  }
}

(async () => {
  let todo = manifest.items.filter((i) => !i.noBody);
  if (only.length) todo = todo.filter((i) => only.includes(String(i.n)) || only.includes(i.slug));
  const browser = await chromium.launch({ executablePath: EXE, headless: true });
  let i = 0;
  const results = { ok: 0, fail: 0, skip: 0 };
  const failures = [];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (i < todo.length) {
        const item = todo[i++];
        try {
          const r = await handle(browser, item);
          if (r === 'skip') results.skip++; else results.ok++;
          console.log(`[${item.n}] ${r} ${item.slug}`);
        } catch (e) {
          results.fail++; failures.push([item.n, item.url, String(e).slice(0, 120)]);
          console.log(`[${item.n}] FAIL ${item.slug}: ${String(e).slice(0, 120)}`);
        }
      }
    }),
  );
  await browser.close();
  fs.writeFileSync(path.join(ROOT, 'fetch-failures.json'), JSON.stringify(failures, null, 2));
  console.log(results);
})();
