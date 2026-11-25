// Render docs/MENU_PLATFORM_DESIGN.md to a review page. Usage: node build_page.cjs <md> <out.html>
const fs = require('fs');
const MarkdownIt = require('markdown-it');
const [, , mdPath, outPath] = process.argv;
const src = fs.readFileSync(mdPath, 'utf8');

const md = new MarkdownIt({ html: false, linkify: false, typographer: false });
const slug = s => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const toc = [];
let title = 'Menu Platform Design';

md.renderer.rules.heading_open = (tokens, i, opts, env, self) => {
  const t = tokens[i];
  const text = tokens[i + 1].content;
  const id = slug(text);
  t.attrSet('id', id);
  if (t.tag === 'h1') title = text;
  if (t.tag === 'h2' || t.tag === 'h3') toc.push({ level: t.tag, text, id });
  return self.renderToken(tokens, i, opts);
};
const defaultFence = md.renderer.rules.fence;
md.renderer.rules.fence = (tokens, i, opts, env, self) => {
  const t = tokens[i];
  const lang = (t.info || '').trim();
  if (lang === 'mermaid') return `<div class="diagram"><pre class="mermaid">${md.utils.escapeHtml(t.content)}</pre></div>`;
  return `<div class="code"><span class="lang">${md.utils.escapeHtml(lang || 'text')}</span><pre><code>${md.utils.escapeHtml(t.content)}</code></pre></div>`;
};
md.renderer.rules.table_open = () => '<div class="table"><table>';
md.renderer.rules.table_close = () => '</table></div>';

let body = md.render(src);
// drop the h1; the page header carries it
body = body.replace(/<h1[^>]*>[\s\S]*?<\/h1>/, '');
// status pill
body = body.replace('<strong>Proposed — awaiting approval.</strong>', '<span class="pill">Proposed — awaiting approval</span>');

const tocHtml = toc.map(e => `<a class="${e.level}" href="#${e.id}">${md.utils.escapeHtml(e.text)}</a>`).join('\n');
const tpl = fs.readFileSync(require('path').join(__dirname, 'page_template.html'), 'utf8');
// Tab / gallery name: the part before a colon; page heading: the full title.
const shortTitle = title.split(':')[0].trim();
const html = tpl
  .replace('<title>{{TITLE}}</title>', `<title>${md.utils.escapeHtml(shortTitle)}</title>`)
  .split('{{TITLE}}').join(md.utils.escapeHtml(title))
  .replace('{{TOC}}', tocHtml)
  .replace('{{BODY}}', body);
fs.writeFileSync(outPath, html);
console.log('ok', toc.length, 'sections');
