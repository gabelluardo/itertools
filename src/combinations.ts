// This module is browser compatible.

import { length } from "./utils.ts";

/**
 * Yields `r` length `Arrays` from the input `iterable`. Order of selection does
 * not matter and elements are chosen without replacement.
 *
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
 */
export function* combinations<T>(
  iterable: Iterable<T>,
  r: number,
): Generator<T[]> {
  if (!Number.isInteger(r) || r < 0) {
    throw new RangeError("r must be a non-negative integer");
  }

  if (r > length(iterable)) {
    return;
  }

  const result = new Array(r);

  function* generate(
    start: number,
    depth: number,
  ): Generator<T[]> {
    if (depth === r) {
      yield result.slice();
      return;
    }

    let index = 0;
    for (const item of iterable) {
      if (index > start) {
        result[depth] = item;
        yield* generate(index, depth + 1);
      }
      index++;
    }
  }

  yield* generate(-1, 0);
}
// This module is browser compatible.

/**
 * Yields `r` length `Arrays` from the input `iterable`. Order of selection is not
 * important and elements are chosen with replacement.
 *
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * const sequences = [...combinationsWithReplacement([1, 2, 3, 4], 2)];
 *
 * assertEquals(sequences, [
 *   [1, 1],
 *   [1, 2],
 *   [1, 3],
 *   [1, 4],
 *   [2, 2],
 *   [2, 3],
 *   [2, 4],
 *   [3, 3],
 *   [3, 4],
 *   [4, 4],
 * ]);
 * ```
 */
export function* combinationsWithReplacement<T>(
  iterable: Iterable<T>,
  r: number,
): Generator<T[]> {
  if (!Number.isInteger(r) || r < 0) {
    throw new RangeError("r must be a non-negative integer");
  }
  const result = new Array(r);

  function* generate(
    start: number,
    depth: number,
  ): Generator<T[]> {
    if (depth === r) {
      yield result.slice();
      return;
    }

    let index = 0;
    for (const item of iterable) {
      if (index >= start) {
        result[depth] = item;
        yield* generate(index, depth + 1);
      }
      index++;
    }
  }

  yield* generate(0, 0);
}
