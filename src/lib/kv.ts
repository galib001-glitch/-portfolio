// Minimal REST client for Upstash Redis / Vercel KV (same REST protocol under
// the hood). Used as the production content store since serverless platforms
// like Vercel have a read-only filesystem at runtime — plain file writes
// don't persist there. Falls back to nothing (caller decides) when the env
// vars aren't set, e.g. in local dev.

const KV_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export function kvAvailable(): boolean {
  return Boolean(KV_URL && KV_TOKEN);
}

async function kvCommand<T = unknown>(command: (string | number)[]): Promise<T | null> {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const res = await fetch(KV_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.result ?? null) as T | null;
  } catch {
    return null;
  }
}

export async function kvGet(key: string): Promise<string | null> {
  return kvCommand<string>(["GET", key]);
}

export async function kvSet(key: string, value: string): Promise<boolean> {
  const result = await kvCommand<string>(["SET", key, value]);
  return result === "OK";
}
