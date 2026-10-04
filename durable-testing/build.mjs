// Builds Durable Testing into the website's public/ folder, under the path of
// baseUrl (public/durable-testing for https://durableqa.xyz/durable-testing): one HTML page per guide page,
// plus the Markdown twins, rules.md, llms.txt, llms-full.txt, sitemap.xml and the
// Claude skill that agents read. No dependencies: `node durable-testing/build.mjs`.
// The site's package.json runs it before `next dev` and `next build`, and
// next.config.ts gives the output clean URLs and Markdown negotiation.
//
// Sources live in src/pages as pairs: <slug>.md (front matter + the Markdown
// agents get, and the source of every "Rules for agents" list) and <slug>.html
// (the visual page). Set SITE_URL to override baseUrl from site.config.json.

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, "src");
const config = JSON.parse(readFileSync(join(root, "site.config.json"), "utf8"));
const baseUrl = (process.env.SITE_URL || config.baseUrl).replace(/\/+$/, "");
// The guide lives under a path of the site (e.g. /durable-testing) and owns that whole folder
// of public/, which the build clears first. Refuse to build into public/ itself.
const basePath = new URL(baseUrl).pathname.replace(/\/+$/, "");
if (!/^\/[a-z0-9-]+$/.test(basePath)) {
  throw new Error(`baseUrl must end in a single path segment such as /durable-testing, got "${basePath || "/"}"`);
}
const out = join(root, "..", "public", basePath.slice(1));
const today = new Date().toISOString().slice(0, 10);

// ---------- helpers ----------

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function fill(template, values, label) {
  const result = template.replace(/\{\{(\w+)\}\}/g, (whole, key) => {
    if (!(key in values)) throw new Error(`${label}: no value for {{${key}}}`);
    return values[key];
  });
  return result;
}

function parsePage(slug) {
  const raw = readFileSync(join(src, "pages", `${slug}.md`), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n+([\s\S]*)$/);
  if (!m) throw new Error(`${slug}.md: missing front matter`);
  const meta = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(": ");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 2).trim();
  }
  const required = ["title", "description", "order"];
  if (slug !== "index") required.push("tab_title");
  for (const key of required) {
    if (!meta[key]) throw new Error(`${slug}.md: front matter needs "${key}"`);
  }
  const html = readFileSync(join(src, "pages", `${slug}.html`), "utf8");
  const body = m[2].replaceAll("{{baseUrl}}", baseUrl).trimEnd() + "\n";
  return { slug, meta, order: Number(meta.order), html, body, rules: extractRules(body, slug) };
}

function extractRules(md, slug) {
  const m = md.match(/^## Rules for agents\n([\s\S]*?)(?=^## |(?![\s\S]))/m);
  if (!m) return [];
  const rules = m[1].split("\n").filter((l) => l.startsWith("- ")).map((l) => l.slice(2).trim());
  if (!rules.length) throw new Error(`${slug}.md: "Rules for agents" has no bullets`);
  return rules;
}

// Minimal inline Markdown for rule text: escaping, **bold**, `code`, curly apostrophes.
const inline = (s) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/(\w)'(\w)/g, "$1’$2");

const urlFor = (p) => (p.slug === "index" ? baseUrl : `${baseUrl}/${p.slug}`);
const pathFor = (p) => (p.slug === "index" ? basePath : `${basePath}/${p.slug}`);
const mdPathFor = (p) => `${basePath}/${p.slug}.md`;
const navTitle = (p) => (p.slug === "index" ? "Overview" : p.meta.title);

function lastModified(p) {
  try {
    const d = execFileSync("git", ["log", "-1", "--format=%cs", "--", join(src, "pages", `${p.slug}.md`), join(src, "pages", `${p.slug}.html`)], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return d || today;
  } catch {
    return today;
  }
}

// ---------- load ----------

const pages = readdirSync(join(src, "pages"))
  .filter((f) => f.endsWith(".md"))
  .map((f) => parsePage(f.slice(0, -3)))
  .sort((a, b) => a.order - b.order);

if (pages[0]?.slug !== "index") throw new Error("src/pages/index.md must exist and have order 0");
const guide = pages.filter((p) => p.slug !== "index");
for (const p of pages) p.updated = lastModified(p);

const ruleCount = guide.reduce((n, p) => n + p.rules.length, 0);
const footerFor = (p) =>
  `\n---\n\nSource: ${urlFor(p)} · ${config.siteName}, built by ${config.publisher} (${config.publisherUrl})\n`;

// ---------- agent-facing text ----------

const rulesMd = [
  "# Testing rules for agents",
  "",
  `From the ${config.siteName} by ${config.publisher} (${baseUrl}). Follow these rules when planning, writing, reviewing or reporting on tests.`,
  ...guide.flatMap((p) => ["", `## ${p.meta.title}`, "", ...p.rules.map((r) => `- ${r}`), "", `Why: ${baseUrl}/${p.slug}.md`]),
  "",
].join("\n");

const summary = pages[0].meta.description;

const llmsTxt = [
  `# ${config.siteName}`,
  "",
  `> ${summary} Built by ${config.publisher}.`,
  "",
  "Every page is available as Markdown at the URLs below, or by requesting the page URL with `Accept: text/markdown`.",
  "",
  "## Guide",
  "",
  ...guide.map((p) => `- [${p.meta.title}](${baseUrl}/${p.slug}.md): ${p.meta.description}`),
  "",
  "## For agents",
  "",
  `- [Rules for agents](${baseUrl}/rules.md): all ${ruleCount} rules in one block, for AGENTS.md or CLAUDE.md.`,
  `- [Claude skill](${baseUrl}/skills/durable-testing/SKILL.md): install at ~/.claude/skills/durable-testing/SKILL.md.`,
  "",
  "## Optional",
  "",
  `- [Full guide in one file](${baseUrl}/llms-full.txt)`,
  "",
].join("\n");

const llmsFull = [
  `# ${config.siteName}`,
  "",
  `> ${summary} Built by ${config.publisher} (${config.publisherUrl}).`,
  "",
  guide.map((p) => `${p.body}\nSource: ${urlFor(p)}\n`).join("\n---\n\n"),
].join("\n");

const skillDescription =
  "Software testing fundamentals and rules from Durable Testing by Durable Quality. Use when deciding what to test and why, choosing a test level (unit, integration or end-to-end), planning testing across the SDLC or STLC, writing, reviewing or fixing tests, handling flaky tests, or reporting test results.";

const skillMd = [
  "---",
  "name: durable-testing",
  `description: ${skillDescription}`,
  "---",
  "",
  `# ${config.siteName}`,
  "",
  `Follow these rules whenever you plan, write, review or report on tests. They come from the ${config.siteName} (${baseUrl}), built by ${config.publisher}.`,
  "",
  "## Rules",
  ...guide.flatMap((p) => ["", `### ${p.meta.title}`, "", ...p.rules.map((r) => `- ${r}`)]),
  "",
  "## When you need the reasoning",
  "",
  "Fetch the matching page as Markdown when the user asks about the concept itself, or when it is unclear how a rule applies:",
  "",
  ...guide.map((p) => `- ${baseUrl}/${p.slug}.md: ${p.meta.skill_hint || p.meta.description}`),
  "",
  "When you explain or cite this guidance to a user, link the page you used.",
  "",
].join("\n");

// ---------- HTML ----------

const layout = readFileSync(join(src, "layout.html"), "utf8");
const css = readFileSync(join(src, "assets", "site.css"), "utf8");
const js = readFileSync(join(src, "assets", "site.js"), "utf8");
const version = createHash("sha256").update(css).update(js).digest("hex").slice(0, 10);

const copyIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8.5" y="8.5" width="12" height="12" rx="2.5"/><path d="M15.5 8.5V6a2.5 2.5 0 0 0-2.5-2.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2.5"/></svg>';

function headings(p) {
  const list = [];
  for (const m of p.html.matchAll(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/g)) {
    const id = m[1].match(/\sid="([^"]+)"/);
    if (!id) continue;
    const short = m[1].match(/\sdata-toc="([^"]+)"/);
    list.push({ id: id[1], label: short ? short[1] : m[2].replace(/<[^>]+>/g, "").trim() });
  }
  return list;
}

function navFor(current) {
  return pages
    .map((p, i) => {
      const cur = p === current ? ' aria-current="page"' : "";
      const top = `      <a${i ? ' class="group"' : ""} href="${pathFor(p)}"${cur}>${esc(navTitle(p))}</a>`;
      const subs = headings(p).map((h) => `      <a class="sub" href="${pathFor(p)}#${h.id}">${h.label}</a>`);
      return [top, ...subs].join("\n");
    })
    .join("\n");
}

function pagerFor(p) {
  const i = pages.indexOf(p);
  const prev = pages[i - 1];
  const next = pages[i + 1];
  if (!prev && !next) return "";
  const link = (q, cls, label) =>
    q ? `      <a class="${cls}" href="${pathFor(q)}"><small>${label}</small><span>${esc(navTitle(q))}</span></a>` : "";
  return `    <nav class="pager" aria-label="Pages">\n${[link(prev, "prev", "Previous"), link(next, "next", "Next")].filter(Boolean).join("\n")}\n    </nav>`;
}

function jsonLdFor(p) {
  const publisher = { "@type": "Organization", name: config.publisher, url: config.publisherUrl };
  const data =
    p.slug === "index"
      ? {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: config.siteName,
          url: baseUrl,
          description: p.meta.description,
          inLanguage: "en",
          publisher,
        }
      : {
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: p.meta.title,
          description: p.meta.description,
          url: urlFor(p),
          mainEntityOfPage: urlFor(p),
          inLanguage: "en",
          dateModified: p.updated,
          author: publisher,
          publisher,
          isPartOf: { "@type": "WebSite", name: config.siteName, url: baseUrl },
          image: `${baseUrl}/og.png`,
          encoding: { "@type": "MediaObject", encodingFormat: "text/markdown", contentUrl: `${baseUrl}/${p.slug}.md` },
        };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function pageMdFor(p) {
  return p.body + footerFor(p);
}

function htmlFor(p) {
  const rulesHtml = p.rules.length
    ? `<ul>\n${p.rules.map((r) => `      <li>${inline(r)}</li>`).join("\n")}\n    </ul>`
    : "";
  const content = fill(
    p.html,
    { title: esc(p.meta.title), rules: rulesHtml, baseUrl, base: basePath, ruleCount: String(ruleCount), copyIcon },
    `${p.slug}.html`,
  );
  const mdUrl = `${baseUrl}/${p.slug}.md`;
  const ask = `Read ${mdUrl} so I can ask questions about it.`;
  const siteTitle = `Durable Quality: ${config.siteName}`;
  const seoTitle = p.slug === "index" ? siteTitle : `${siteTitle} | ${p.meta.tab_title}`;
  return fill(
    layout,
    {
      seoTitle: esc(seoTitle),
      ogTitle: esc(p.slug === "index" ? config.siteName : p.meta.title),
      ogType: p.slug === "index" ? "website" : "article",
      description: esc(p.meta.description),
      canonical: urlFor(p),
      mdUrl,
      mdPath: mdPathFor(p),
      baseUrl,
      base: basePath,
      jsonLd: jsonLdFor(p),
      version,
      slug: p.slug,
      nav: navFor(p),
      content: content.replace(/^/gm, "      ").replace(/^ +$/gm, ""),
      pager: pagerFor(p),
      claudeUrl: esc(`https://claude.ai/new?q=${encodeURIComponent(ask)}`),
      chatgptUrl: esc(`https://chatgpt.com/?hints=search&q=${encodeURIComponent(ask)}`),
      year: String(new Date().getFullYear()),
      pageMd: pageMdFor(p).trimEnd(),
      rulesMd: rulesMd.trimEnd(),
    },
    "layout.html",
  );
}

// ---------- write ----------

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "assets"), { recursive: true });
mkdirSync(join(out, "skills", "durable-testing"), { recursive: true });

const write = (rel, text) => writeFileSync(join(out, rel), text);

for (const p of pages) {
  write(`${p.slug}.html`, htmlFor(p));
  write(`${p.slug}.md`, pageMdFor(p));
}
write("rules.md", rulesMd);
write("llms.txt", llmsTxt);
write("llms-full.txt", llmsFull);
write("skills/durable-testing/SKILL.md", skillMd);

write(
  "sitemap.xml",
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pages.map((p) => `  <url><loc>${urlFor(p)}</loc><lastmod>${p.updated}</lastmod></url>`),
    "</urlset>",
    "",
  ].join("\n"),
);

write("assets/site.css", css);
write("assets/site.js", js);
// The logo is the supplied artwork, copied as is from the Next app (never redrawn).
cpSync(join(root, "..", "app", "icon.png"), join(out, "assets", "logo.png"));
if (existsSync(join(src, "assets", "og.png"))) cpSync(join(src, "assets", "og.png"), join(out, "og.png"));

console.log(`Built ${pages.length} pages, ${ruleCount} rules, for ${baseUrl} -> public${basePath}/`);
