/**
 * Yields `r` length `Arrays` from the input `iterable`. Order of selection is
 * important and elements are chosen without replacement. If `r` is undefined, then
 * the length of the `iterable` is used.
 *
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * const sequences = [...permutations([1, 2, 3, 4], 2)];
 *
 * assertEquals(sequences, [
 *   [1, 2], [1, 3], [1, 4],
 *   [2, 1], [2, 3], [2, 4],
 *   [3, 1], [3, 2], [3, 4],
 *   [4, 1], [4, 2], [4, 3],
 * ]);
 * ```
 */
export function* permutations<T>(
  iterable: Iterable<T>,
  r?: number,
): Generator<T[]> {
  if (r !== undefined && (!Number.isInteger(r) || r < 0)) {
    throw new RangeError("r must be a non-negative integer");
  }

  const pool = Array.from(iterable);
  const n = pool.length;
  const len = r ?? n;

  if (len > n) {
    return;
  }

  if (len === 0) {
    yield [];
    return;
  }

  const indices = new Uint32Array(n).map((_, index) => index);
  const cycles = new Uint32Array(len).map((_, index) => n - index);

  yield pool.slice(0, len);

  loop: while (true) {
    for (let i = len - 1; i >= 0; i--) {
      cycles[i]--;
      if (cycles[i] === 0) {
        let index = indices[i];
        for (let j = n - 1; j >= i; j--) {
          [indices[j], index] = [index, indices[j]];
        }
        cycles[i] = n - i;
        continue;
      }

      const j = n - cycles[i];
      [indices[i], indices[j]] = [indices[j], indices[i]];

      const result = Array(len);
      for (let i = 0; i < len; i++) {
        result[i] = pool[indices[i]];
      }
      yield result;
      continue loop;
    }
    return;
  }
}

/**
 * Yields `r` length `Arrays` from the input `iterable`. Order of selection is
 * important and elements are chosen with replacement.
 *
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * const sequences = [...permutationsWithReplacement([1, 2, 3, 4], 2)];
 *
 * assertEquals(sequences, [
 *   [1, 1], [1, 2], [1, 3], [1, 4],
 *   [2, 1], [2, 2], [2, 3], [2, 4],
 *   [3, 1], [3, 2], [3, 3], [3, 4],
 *   [4, 1], [4, 2], [4, 3], [4, 4],
 * ]);
 * ```
 */
export function* permutationsWithReplacement<T>(
  iterable: Iterable<T>,
  r?: number,
): Generator<T[]> {
  if (r !== undefined && (!Number.isInteger(r) || r < 0)) {
    throw new RangeError("r must be a non-negative integer");
  }

  const pool = Array.from(iterable);
  const n = pool.length;
  const len = r ?? pool.length;

  if (r === 0) {
    yield [];
    return;
  }

  if (n === 0 && len > 0) {
    return;
  }

  const indices = new Uint32Array(len);
  const result = Array(len).fill(pool[0]);
  yield result.slice();

  while (true) {
    let i = len - 1;
    while (i >= 0 && indices[i] === n - 1) {
      indices[i] = 0;
      result[i] = pool[0];
      i--;
    }

    if (i < 0) break;

    indices[i]++;
    result[i] = pool[indices[i]];

    yield result.slice();
  }
}
