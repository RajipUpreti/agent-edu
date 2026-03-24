const FALLBACK_API_URL = "http://localhost:3001";

export function getApiBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_API_URL ?? FALLBACK_API_URL;
  return raw.replace(/\/$/, "");
}
