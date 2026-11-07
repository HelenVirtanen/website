/** Соседнее фото по кругу: после последнего — первое, перед первым — последнее. */
export function stepIndex(current: number, delta: number, count: number): number {
  if (count <= 0) return 0;
  return (((current + delta) % count) + count) % count;
}
