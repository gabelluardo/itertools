/**
 * Creates an iterator that yields the same object repeatedly.
 *
 * @description
 * Returns a generator that yields the same object either indefinitely or
 * a specified number of times. If times is specified, the generator will
 * yield exactly that many times before completing.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * const repeater = repeat('x', 3);
 * assertEquals(repeater.next().value, 'x');
 * assertEquals(repeater.next().value, 'x');
 * assertEquals(repeater.next().value, 'x');
 * assertEquals(repeater.next().done, true);
 * ```
 *
 * @param object - The object to repeat
 * @param times - Optional number of times to repeat
 */
export function* repeat<T>(object: T, times?: number): Generator<T> {
  if (times === undefined) {
    while (true) {
      yield object;
    }
  } else {
    for (let i = 0; i < times; i++) {
      yield object;
    }
  }
}

/**
 * Creates an iterator that returns evenly spaced values.
 *
 * @description
 * Generates an arithmetic sequence starting from the given number,
 * incrementing by the specified step size. The sequence continues
 * indefinitely.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * const counter = count(10, 2);
 * assertEquals(counter.next().value, 10);
 * assertEquals(counter.next().value, 12);
 * assertEquals(counter.next().value, 14);
 * ```
 *
 * @param start - Starting number (defaults to 0)
 * @param step - Step size (defaults to 1)
 */
export function* count(start = 0, step = 1): Generator<number> {
  let n = start;
  while (true) {
    yield n;
    n += step;
  }
}

/**
 * Creates an iterator that cycles through elements from an iterable.
 *
 * @description
 * Saves elements from the input iterable and cycles through them indefinitely.
 * Elements are yielded in the same order as they appear in the input.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * const cycler = cycle(['a', 'b', 'c']);
 * assertEquals(cycler.next().value, 'a');
 * assertEquals(cycler.next().value, 'b');
 * assertEquals(cycler.next().value, 'c');
 * assertEquals(cycler.next().value, 'a');
 * ```
 *
 * @param iterable - Input iterable to cycle through
 */
export function* cycle<T>(iterable: Iterable<T>): Generator<T> {
  const saved = [];
  for (const element of iterable) {
    yield element;
    saved.push(element);
  }

  if (saved.length === 0) {
    return;
  }

  while (saved) {
    for (const element of saved) {
      yield element;
    }
  }
}
