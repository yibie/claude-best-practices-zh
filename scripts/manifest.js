// Build manifest.json from crawled API pages
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const items = new Map();
for (const f of fs.readdirSync(dataDir).filter((x) => /^page\d+\.json$/.test(x)).sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]))) {
  const d = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
  for (const it of d.items || []) if (!items.has(it._id)) items.set(it._id, it);
}

const typePath = { blogPost: 'articles', guide: 'guides', webinar: 'webinars' };

const list = [...items.values()].map((it, idx) => {
  const host = it.externalUrl ? new URL(it.externalUrl).host : null;
  let url = it.externalUrl || `https://claude.com/resources/${typePath[it._type]}/${it.slug}`;
  let bucket = it._type;
  // no-body resources: recording landing pages / registration pages
  const noBody = it._type === 'webinar' && (!it.excerpt || host === 'anthropic.ondemand.goldcast.io');
  return {
    n: idx + 1,
    id: it._id,
    type: it._type,
    title: it.title,
    slug: it.slug || (it.externalUrl ? it.externalUrl.replace(/\/$/, '').split('/').pop() : it._id),
    url,
    host,
    date: it.date,
    excerpt: it.excerpt || '',
    products: (it.products || []).map((p) => p.name),
    categorySlugs: it.categorySlugs || [],
    readTime: it.readTime || null,
    noBody,
  };
});

fs.writeFileSync(path.join(__dirname, '..', 'manifest.json'), JSON.stringify({ source: 'https://claude.com/resources/best-practices', count: list.length, items: list }, null, 2));
const counts = list.reduce((a, x) => ((a[x.type + (x.noBody ? ':nobody' : '')] = (a[x.type + (x.noBody ? ':nobody' : '')] || 0) + 1), a), {});
console.log('manifest items', list.length, counts);
