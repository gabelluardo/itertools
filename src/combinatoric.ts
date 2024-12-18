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

/**
 * Generates the Cartesian product of input `iterables`.
 *
 * @description
 * Roughly equivalent to nested `for...of` loops, where each loop uses one of the inputs
 * to provide the element at the corresponding position in the yielded `Array`.
 *
 * The nested loops cycle like an odometer, with the rightmost element advancing on every iteration.
 * This pattern creates a lexicographic ordering so that if the input `iterables` are sorted,
 * the product tuples are emitted in sorted order.
 *
 * To compute the product of an iterable with itself, specify the number of repetitions
 * with the optional `repeat` keyword argument. For example, `product(A, repeat=4)` means the same as `product(A, A, A, A)`.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * const sequences = [...product([[1, 2, 3], [4, 5, 6], [7, 8, 9]])];
 *
 * assertEquals(sequences, [
 *   [1, 4, 7], [1, 4, 8], [1, 4, 9],
 *   [1, 5, 7], [1, 5, 8], [1, 5, 9],
 *   [1, 6, 7], [1, 6, 8], [1, 6, 9],
 *   [2, 4, 7], [2, 4, 8], [2, 4, 9],
 *   [2, 5, 7], [2, 5, 8], [2, 5, 9],
 *   [2, 6, 7], [2, 6, 8], [2, 6, 9],
 *   [3, 4, 7], [3, 4, 8], [3, 4, 9],
 *   [3, 5, 7], [3, 5, 8], [3, 5, 9],
 *   [3, 6, 7], [3, 6, 8], [3, 6, 9],
 * ]);
 * ```
 *
 * @param iterables - An array of iterables to compute the Cartesian product of.
 * @param repeat - An optional number of times to repeat the input iterables.
 * @returns A generator yielding tuples representing the Cartesian product.
 * @throws {RangeError} If the repeat argument is not a non-negative integer.
 */
export function* product<T extends unknown[]>(
  iterables: { [K in keyof T]: Iterable<T[K]> },
  repeat?: number,
): Generator<T> {
  if (repeat !== undefined && (!Number.isInteger(repeat) || repeat < 0)) {
    throw new RangeError("repeat argument must be a non-negative integer");
  }

  const basePools = Array.from(iterables, (pool) => [...pool]);

  const pools = repeat
    ? Array(repeat).fill(0).flatMap(() => basePools)
    : basePools;
  const n = pools.length;

  if (n === 0 || pools.some((pool) => pool.length === 0)) {
    return;
  }

  const indices = new Uint32Array(n);
  yield pools.map((pool) => pool[0]) as T;

  loop: while (true) {
    for (let i = n - 1; i >= 0; i--) {
      if (indices[i] === pools[i].length - 1) {
        continue;
      }

      const result = Array(n);
      for (let j = 0; j < i; j++) {
        result[j] = pools[j][indices[j]];
      }

      result[i] = pools[i][++indices[i]];
      for (let j = i + 1; j < n; j++) {
        indices[j] = 0;
        result[j] = pools[j][0];
      }

      yield result as T;
      continue loop;
    }

    return;
  }
}
