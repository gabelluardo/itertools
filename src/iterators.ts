import { add } from "./utils/operators.ts";

/**
 * Creates an iterator that returns accumulated sums or accumulated results from custom functions.
 *
 * @description
 * The function defaults to addition. The function accepts two arguments: an accumulated total and a value from the iterable.
 *
 * If an initial value is provided, the accumulation will start with that value and the output will have one more element than the input iterable.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * const sums = [...accumulate([1, 2, 3, 4])];
 *
 * assertEquals(sums, [1, 3, 6, 10]);
 * ```
 *
 * @param iterable - The input iterable
 * @param func - The function to apply for accumulating values (default: addition)
 * @param initial - Optional initial value to start the accumulation
 * @returns A generator that produces accumulated values
 * @throws {TypeError} When the provided type is not supported in the default function
 */
export function* accumulate<T>(
  iterable: Iterable<T>,
  func: (total: T, element: T) => T = add,
  initial?: T,
): Generator<T> {
  const iterator = iterable[Symbol.iterator]();

  let total: T;
  if (initial !== undefined) {
    total = initial;
  } else {
    const first = iterator.next();
    if (first.done) return;
    total = first.value;
  }

  yield total;

  for (let item = iterator.next(); !item.done; item = iterator.next()) {
    total = func(total, item.value);
    yield total;
  }
}
