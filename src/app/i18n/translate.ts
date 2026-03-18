import type { Messages } from "@/app/i18n/getMessages";

function getFromPath(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== "object") return undefined;
  return path.split(".").reduce<unknown>((acc, part) => {
    if (!acc || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[part];
  }, obj);
}

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) => {
    const v = vars[name];
    return v === undefined || v === null ? match : String(v);
  });
}

export function createTranslator(messages: Messages, fallbackMessages?: Messages) {
  const missing = new Set<string>();

  return (key: string, vars?: Record<string, string | number>) => {
    const raw = getFromPath(messages, key);
    if (typeof raw === "string") return interpolate(raw, vars);

    const fallback = fallbackMessages ? getFromPath(fallbackMessages, key) : undefined;
    if (typeof fallback === "string") return interpolate(fallback, vars);

    if (process.env.NODE_ENV !== "production" && !missing.has(key)) {
      missing.add(key);
      // eslint-disable-next-line no-console
      console.warn(`[i18n] Missing key: ${key}`);
    }

    return key;
  };
}
