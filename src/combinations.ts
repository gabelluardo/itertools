/**
 * Returns `r-length` subsequences of elements from the input `iterable`.
 *
 * @description
 * The length of the output is given by `n!/(r!(n-r)!)` when `0 ≤ r ≤ n`
 * or `zero` when `r > n`.
 *
 * The combination arrays are emitted in lexicographic order according
 * to the order of the input iterable. If the input iterable is sorted,
 * the output will be in sorted order.
 *
 * Elements are treated as unique based on their position, not on their value.
 * If the input elements are unique, there will be no repeated values within
 * each combination.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * const sequences = [...combinations([1, 2, 3, 4], 2)];
 *
 * assertEquals(sequences, [
 *   [1, 2],
 *   [1, 3],
 *   [1, 4],
 *   [2, 3],
 *   [2, 4],
 *   [3, 4],
 * ]);
 * ```
 *
 * @param iterable - The input iterable to generate combinations from
 * @param r - Length of combinations to generate
 * @throws {RangeError} If r is negative or not an integer
 */
export function* combinations<T>(
  iterable: Iterable<T>,
  r: number,
): Generator<T[]> {
  if (!Number.isInteger(r) || r < 0) {
    throw new RangeError("r must be a non-negative integer");
  }

  const pool = Array.from(iterable);
  const n = pool.length;

  if (r > n) {
    return;
  }

  if (r === 0) {
    yield [];
    return;
  }

  const indices = new Uint32Array(r).map((_, index) => index);
  yield pool.slice(0, r);

  while (true) {
    let i: number;
    for (i = r - 1; i >= 0; i--) {
      if (indices[i] !== i + n - r) {
        break;
      }
    }
    if (i < 0) return;

    const result = Array(r);
    for (let j = 0; j < i; j++) {
      result[j] = pool[indices[j]];
    }

    let index = ++indices[i];
    result[i] = pool[index++];
    for (let j = i + 1; j < r; j++, index++) {
      indices[j] = index;
      result[j] = pool[index];
    }

    yield result;
  }
}

/**
 * Returns `r-length` subsequences of elements from the input `iterable` allowing
 * individual elements to be repeated more than once.
 *
 * @description
 * The number of combinations returned is `(n + r - 1)!/(r!(n - 1)!)` when `n > 0`,
 * where `n` is the length of the input `iterable`.
 *
 * The combination arrays are emitted in lexicographic order according
 * to the order of the input iterable. If the input iterable is sorted,
 * the output will be in sorted order.
 *
 * Elements are treated as unique based on their position, not on their value.
 * If the input elements are unique, the generated combinations will also be unique.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * const sequences = [...combinationsWithReplacement([1, 2, 3], 2)];
 *
 * assertEquals(sequences, [
 *   [1, 1],
 *   [1, 2],
 *   [1, 3],
 *   [2, 2],
 *   [2, 3],
 *   [3, 3],
 * ]);
 * ```
 *
 * @param iterable - The input iterable to generate combinations from
 * @param r - Length of combinations to generate
 * @throws {RangeError} If r is negative or not an integer
 */
export function* combinationsWithReplacement<T>(
  iterable: Iterable<T>,
  r: number,
): Generator<T[]> {
  if (!Number.isInteger(r) || r < 0) {
    throw new RangeError("r must be a non-negative integer");
  }

  const pool = Array.from(iterable);
  const n = pool.length;
  if (n === 0 && r > 0) {
    return;
  }

  const indices = new Uint32Array(r).fill(0);
  const result = Array(r).fill(pool[0]);
  yield result.slice();

  while (true) {
    let i: number;
    for (i = r - 1; i >= 0; i--) {
      if (indices[i] !== n - 1) {
        break;
      }
    }
    if (i < 0) return;

    const result = Array(r);
    for (let j = 0; j < i; j++) {
      result[j] = pool[indices[j]];
    }

    const index = indices[i] + 1;
    const element = pool[index];
    for (let j = i; j < r; j++) {
      indices[j] = index;
      result[j] = element;
    }

    yield result;
  }
}
