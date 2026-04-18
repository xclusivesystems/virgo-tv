const RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(raw: string): boolean {
  if (!raw || typeof raw !== "string") return false;
  const s = raw.trim();
  if (s.length > 254) return false;
  return RE.test(s);
}
