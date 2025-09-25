export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function hashIdentifier(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
    hash >>>= 0;
  }

  return `h${hash.toString(16)}`;
}

export function redactEmail(email: string): string {
  const normalized = normalizeEmail(email);
  const [local, domain] = normalized.split("@");

  if (!domain) {
    return "redacted";
  }

  if (local.length <= 2) {
    const first = local.at(0) ?? "*";
    return `${first}*@${domain}`;
  }

  const visible = local.slice(0, 2);
  const obscured = "*".repeat(local.length - 2);
  return `${visible}${obscured}@${domain}`;
}

export function getEmailTelemetry(email: string | null | undefined): {
  hasEmail: boolean;
  emailHash?: string;
} {
  if (!email) {
    return { hasEmail: false };
  }

  const normalized = normalizeEmail(email);
  return {
    hasEmail: true,
    emailHash: hashIdentifier(normalized),
  };
}
