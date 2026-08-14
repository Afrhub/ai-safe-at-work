// RFC 6238 TOTP, because portal.js requires aal2 for every role and a browser test
// cannot read an authenticator app.
//
// ponytail: node:crypto and thirty lines, rather than a dependency this repo has no
// package.json to hold. SHA-1 and a 30-second step are what Supabase enrols.

import { createHmac } from "node:crypto";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Decode(secret) {
  const clean = String(secret).toUpperCase().replace(/=+$/, "").replace(/\s+/g, "");
  let bits = 0;
  let value = 0;
  const out = [];
  for (const ch of clean) {
    const idx = ALPHABET.indexOf(ch);
    if (idx === -1) throw new Error(`not base32: ${JSON.stringify(ch)}`);
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

export function totp(secret, { step = 30, digits = 6, at = Date.now() } = {}) {
  const counter = Math.floor(at / 1000 / step);
  const msg = Buffer.alloc(8);
  msg.writeUInt32BE(Math.floor(counter / 2 ** 32), 0);
  msg.writeUInt32BE(counter >>> 0, 4);
  const hmac = createHmac("sha1", base32Decode(secret)).update(msg).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const bin =
    ((hmac[offset] & 0x7f) << 24) |
    (hmac[offset + 1] << 16) |
    (hmac[offset + 2] << 8) |
    hmac[offset + 3];
  return String(bin % 10 ** digits).padStart(digits, "0");
}

// Supabase rejects a code it has already consumed, so a retake inside the same
// 30-second window must wait for the next one rather than resend the same digits.
export async function nextFreshCode(secret, lastCode) {
  let code = totp(secret);
  while (lastCode && code === lastCode) {
    await new Promise((r) => setTimeout(r, 1000));
    code = totp(secret);
  }
  return code;
}

// Self-check: the RFC 6238 SHA-1 vectors, with their seed re-encoded as base32.
// node tests/lib/totp.mjs
if (import.meta.url === `file://${process.argv[1]}`) {
  const assert = (await import("node:assert/strict")).default;
  const seed = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"; // "12345678901234567890"
  assert.equal(totp(seed, { at: 59_000, digits: 8 }), "94287082");
  assert.equal(totp(seed, { at: 1_111_111_109_000, digits: 8 }), "07081804");
  assert.equal(totp(seed, { at: 1_234_567_890_000, digits: 8 }), "89005924");
  assert.equal(totp(seed, { at: 2_000_000_000_000, digits: 8 }), "69279037");
  console.log("totp: 4 RFC 6238 vectors pass");
}
