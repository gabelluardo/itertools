/**
 * Calculates the length of an iterable, string, array-like or collection.
 * Optimized to use native length/size properties when available.
 *
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(length([1, 2, 3]), 3);
 * assertEquals(length(new Set([1, 2])), 2);
 * assertEquals(length(new Map([['a', 1], ['b', 2]])), 2);
 * assertEquals(length((function*() { yield 1; yield 2; })()), 2);
 * assertEquals(length("hello"), 5);
 * assertEquals(length(null), 0);
 * ```
 */
export function length<T>(iter?: Iterable<T> | string | null): number {
  if (iter == null) {
    return 0;
  }

  if (typeof iter === "string") {
    return iter.length;
  }

  if ("length" in iter) {
    return (iter as { length: number }).length;
  }

  if ("size" in iter) {
    return (iter as { size: number }).size;
  }

  let count = 0;
  for (const _ of iter) {
    count++;
  }

  return count;
}
