/** Перемешанная копия списка (Фишер — Йейтс): все порядки равновероятны, исходный список не меняется. */
export function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let last = result.length - 1; last > 0; last -= 1) {
    const other = Math.floor(random() * (last + 1));
    [result[last], result[other]] = [result[other] as T, result[last] as T];
  }
  return result;
}

/** Сколько раз повторить набор карточек, чтобы в нём было не меньше `minimum`. */
export function loopSetCount(count: number, minimum: number): number {
  return count > 0 ? Math.ceil(minimum / count) : 0;
}
