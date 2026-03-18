import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "src", "app");

function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) yield* walk(p);
    else yield p;
  }
}

function toPosix(p) {
  return p.split(path.sep).join("/");
}

function stripQueryHash(href) {
  const idxQ = href.indexOf("?");
  const idxH = href.indexOf("#");
  const idx = idxQ === -1 ? idxH : idxH === -1 ? idxQ : Math.min(idxQ, idxH);
  return idx === -1 ? href : href.slice(0, idx);
}

function normalizeRoute(route) {
  // /pages/studio/artist/[id] -> /pages/studio/artist/:id
  // /pages/foo/[...slug] -> /pages/foo/:slug*
  return route
    .replace(/\[\.\.\.(.+?)\]/g, ":$1*")
    .replace(/\[(.+?)\]/g, ":$1");
}

function matchRoute(linkPath, route) {
  const link = stripQueryHash(linkPath);
  const linkSegs = link.split("/").filter(Boolean);
  const routeSegs = normalizeRoute(route).split("/").filter(Boolean);

  for (let i = 0, j = 0; i < routeSegs.length; i++, j++) {
    const r = routeSegs[i];
    const l = linkSegs[j];

    if (r.startsWith(":") && r.endsWith("*")) {
      // catch-all matches the rest, including empty
      return true;
    }
    if (l == null) return false;
    if (r.startsWith(":")) continue;
    if (r !== l) return false;
  }

  // Exact length match (unless route ended with catch-all, handled above)
  return linkSegs.length === routeSegs.length;
}

function buildRoutes() {
  const routes = [];
  for (const p of walk(APP_DIR)) {
    const base = path.basename(p);
    if (!/^page\.(t|j)sx?$/.test(base)) continue;
    const rel = toPosix(path.relative(APP_DIR, p));

    // App Router route = file path minus /page.tsx
    let route = "/" + rel.replace(/\/page\.(t|j)sx?$/, "");
    routes.push(route);
  }
  return routes;
}

function extractLinks(fileContent) {
  const found = [];

  // <Link href="...">, <a href="...">
  // Keep the parser simple: only string literal hrefs.
  const hrefRe = /<(?:Link|a)\b[^>]*\bhref\s*=\s*(?:"([^"]+)"|'([^']+)')/g;
  let m;
  while ((m = hrefRe.exec(fileContent))) {
    const href = m[1] ?? m[2];
    if (href.includes("${")) continue; // dynamic template inside a string; ignore
    found.push({ kind: "href", href });
  }

  // <Link href={`...`}> and <a href={`...`}>
  const hrefTplRe = /<(?:Link|a)\b[^>]*\bhref\s*=\s*\{\s*`([^`]+)`\s*\}/g;
  while ((m = hrefTplRe.exec(fileContent))) {
    const tpl = m[1];
    const href = tpl.replace(/\$\{[^}]+\}/g, "x");
    found.push({ kind: "href", href });
  }

  // router.push("..."), router.replace("..."), window.location.assign("..."), window.location.href="..."
  const navRe =
    /\b(?:router\.(?:push|replace)|window\.location\.assign)\s*\(\s*(?:"([^"]+)"|'([^']+)')/g;
  while ((m = navRe.exec(fileContent))) {
    const href = m[1] ?? m[2];
    if (href.includes("${")) continue; // dynamic template inside a string; ignore
    found.push({ kind: "nav", href });
  }

  const navTplRe =
    /\b(?:router\.(?:push|replace)|window\.location\.assign)\s*\(\s*`([^`]+)`/g;
  while ((m = navTplRe.exec(fileContent))) {
    const tpl = m[1];
    const href = tpl.replace(/\$\{[^}]+\}/g, "x");
    found.push({ kind: "nav", href });
  }

  const locHrefRe = /\bwindow\.location\.href\s*=\s*(?:"([^"]+)"|'([^']+)')/g;
  while ((m = locHrefRe.exec(fileContent))) {
    const href = m[1] ?? m[2];
    if (href.includes("${")) continue; // dynamic template inside a string; ignore
    found.push({ kind: "nav", href });
  }

  return found;
}

function isExternal(href) {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

function isHashOnly(href) {
  return href === "#" || href.startsWith("#");
}

function main() {
  const routes = buildRoutes();

  const allFiles = [...walk(APP_DIR)].filter((p) => /\.(t|j)sx?$/.test(p));

  const errors = [];
  const warnings = [];

  for (const p of allFiles) {
    const rel = toPosix(path.relative(ROOT, p));
    const content = fs.readFileSync(p, "utf8");
    const links = extractLinks(content);

    for (const { kind, href } of links) {
      if (!href) continue;

      if (isHashOnly(href)) {
        warnings.push({ rel, kind, href, reason: "hash-only href" });
        continue;
      }
      if (isExternal(href)) continue;

      const pathOnly = stripQueryHash(href);

      // Relative internal hrefs are almost always wrong in Next.js App Router.
      if (!pathOnly.startsWith("/")) {
        errors.push({ rel, kind, href, reason: "relative internal href" });
        continue;
      }

      const ok = routes.some((r) => matchRoute(pathOnly, r));
      if (!ok) errors.push({ rel, kind, href, reason: "no matching route" });
    }
  }

  const pad = (s, n) => (s + " ".repeat(n)).slice(0, n);
  const fmt = (x) =>
    `${pad(x.reason, 20)} ${pad(x.kind, 4)} ${x.href}  (${x.rel})`;

  if (errors.length) {
    console.log("ERRORS:");
    for (const e of errors) console.log("  " + fmt(e));
    console.log("");
  }
  if (warnings.length) {
    console.log("WARNINGS:");
    for (const w of warnings) console.log("  " + fmt(w));
    console.log("");
  }

  if (!errors.length && !warnings.length) console.log("OK: no issues found.");

  process.exit(errors.length ? 1 : 0);
}

main();
