// Render MENU_PLATFORM_DESIGN.md to a review page.
// Usage: node build_page.cjs <md> <out.html> [--standalone]
//   default:      page content only (the Claude artifact viewer adds the document shell and renders diagrams)
//   --standalone: a complete HTML document with diagram rendering, for GitHub Pages or opening locally
const fs = require('fs');
const MarkdownIt = require('markdown-it');
const args = process.argv.slice(2);
const standalone = args.includes('--standalone');
const [mdPath, outPath] = args.filter(a => !a.startsWith('--'));
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
const MERMAID = 'https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.9.1/mermaid.min.js';
// The template's head part (title, fonts, styles) ends where the page wrapper starts.
const split = html.indexOf('<div class="wrap">');
const headPart = html.slice(0, split);
const bodyPart = html.slice(split);
const out = standalone
  ? `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>*,*::before,*::after{box-sizing:border-box}body{margin:0}img{max-width:100%}</style>
${headPart}</head>
<body>
${bodyPart}
<script src="${MERMAID}"></script>
<script>
  mermaid.initialize({
    startOnLoad: true,
    theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default',
    securityLevel: 'strict'
  });
</script>
</body>
</html>
`
  : html;
fs.writeFileSync(outPath, out);
console.log('ok', toc.length, 'sections');
