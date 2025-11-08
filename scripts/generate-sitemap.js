#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Import blog posts list
const blogPosts = require('../src/utils/blogPosts').blogPosts;

const siteUrl = process.env.SITE_URL || 'https://diaryofanofw.com';

function toKebab(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

const pages = [
  { url: '/', priority: 1.0 },
  { url: '/blog', priority: 0.8 },
  { url: '/connect', priority: 0.7 }
];

blogPosts.forEach(post => {
  const slug = toKebab(post.slug);
  pages.push({ url: `/blog/${slug}`, priority: 0.6, lastmod: new Date().toISOString() });
});

const sitemapItems = pages.map(p => {
  const lastmod = p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : '';
  return `  <url>\n    <loc>${siteUrl}${p.url}</loc>\n    ${lastmod}\n    <priority>${p.priority}</priority>\n  </url>`;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapItems}\n</urlset>`;

const outDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap, 'utf8');
console.log('Sitemap written to public/sitemap.xml');
