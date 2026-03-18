import fs from "node:fs";
import path from "node:path";

const messagesDir = path.join(process.cwd(), "src", "app", "i18n", "messages");

function flatten(obj, prefix = "", out = {}) {
  for (const [key, value] of Object.entries(obj ?? {})) {
    const p = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") out[p] = value;
    else if (value && typeof value === "object" && !Array.isArray(value)) flatten(value, p, out);
  }
  return out;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

const basePath = path.join(messagesDir, "en.json");
if (!fs.existsSync(basePath)) {
  console.error(`[i18n-check] Missing base file: ${basePath}`);
  process.exit(1);
}

const base = readJson(basePath);
const baseFlat = flatten(base);
const baseKeys = Object.keys(baseFlat).sort();

const files = fs
  .readdirSync(messagesDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

let hasError = false;

for (const file of files) {
  const locale = file.replace(/\.json$/, "");
  const filePath = path.join(messagesDir, file);
  const obj = readJson(filePath);
  const flat = flatten(obj);

  const missing = baseKeys.filter((k) => !(k in flat));
  const empty = baseKeys.filter((k) => k in flat && String(flat[k] ?? "").trim().length === 0);

  if (missing.length || empty.length) {
    hasError = true;
    console.error(`[i18n-check] ${locale}: missing=${missing.length} empty=${empty.length}`);
    if (missing.length) console.error(missing.map((k) => `  missing: ${k}`).join("\n"));
    if (empty.length) console.error(empty.map((k) => `  empty: ${k}`).join("\n"));
  }
}

if (hasError) process.exit(1);
console.log(`[i18n-check] OK (${files.length} locales, ${baseKeys.length} keys).`);

