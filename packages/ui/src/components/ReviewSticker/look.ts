// FNV-1a: коротко и стабильно между сборками; криптостойкость здесь не нужна.
const FNV_OFFSET = 2166136261;
const FNV_PRIME = 16777619;

export function hashOf(seed: string): number {
  let hash = FNV_OFFSET;
  for (const char of seed) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, FNV_PRIME);
  }
  return hash >>> 0;
}

export interface StickerLook {
  tone: number;
  tilt: number;
}

/** Вид стикера зависит только от имени файла, поэтому новый отзыв не перекрашивает старые. */
export function stickerLook(seed: string, tones: number, tilts: number): StickerLook {
  const hash = hashOf(seed);
  return { tone: hash % tones, tilt: (hash >>> 8) % tilts };
}
