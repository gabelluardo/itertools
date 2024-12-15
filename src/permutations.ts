/**
 * Returns successive `r-length` permutations of elements from the `iterable`.
 *
 * @description
 * If `r` is not specified, then `r` defaults to the length of the `iterable` and all
 * possible full-length permutations are generated.
 *
 * The length of the output is given by `n!/(n-r)!` when `0 ≤ r ≤ n` or `zero` when `r > n`.
 *
 * The permutation arrays are emitted in lexicographic order according to the order
 * of the input iterable. If the input iterable is sorted, the output will be in
 * sorted order.
 *
 * Elements are treated as unique based on their position, not on their value.
 * If the input elements are unique, there will be no repeated values within
 * a permutation.
 *
 * @example
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
 *
 * @param iterable - The input iterable to generate permutations from
 * @param r - Length of permutations to generate (optional)
 * @throws {RangeError} If r is negative or not an integer
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

  loop: while (n) {
    for (let i = len - 1; i >= 0; i--) {
      cycles[i]--;
      if (cycles[i] === 0) {
        let index = indices[i];
        for (let j = n - 1; j >= i; j--) {
          [indices[j], index] = [index, indices[j]];
        }
        cycles[i] = n - i;
      } else {
        const j = n - cycles[i];
        [indices[i], indices[j]] = [indices[j], indices[i]];

        const result = Array(len);
        for (let i = 0; i < len; i++) {
          result[i] = pool[indices[i]];
        }
        yield result;
        continue loop;
      }
    }
    return;
  }
}

/**
 * Returns successive `r-length` permutations of elements from the `iterable`
 * allowing individual elements to be repeated more than once.
 *
 * @description
 * If `r` is not specified, then `r` defaults to the length of the `iterable` and all
 * possible full-length permutations are generated.
 *
 * The permutation arrays are emitted in lexicographic order according to the order
 * of the input iterable. If the input iterable is sorted, the output will be in
 * sorted order.
 *
 * Elements are treated as unique based on their position, not on their value.
 * If the input elements are unique, there will be no repeated values within
 * a permutation.
 *
 * @example
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
 * @param iterable - The input iterable to generate permutations from
 * @param r - Length of permutations to generate (optional)
 * @throws {RangeError} If r is negative or not an integer
 */
export function* permutationsWithReplacement<T>(
  iterable: Iterable<T>,
  r: number,
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
