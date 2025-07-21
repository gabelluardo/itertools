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

/**
 * Batch data from the iterable into tuples of length n. The last batch may be shorter than n.
 *
 * If strict is true, will raise an Error if the final batch is shorter than n.
 *
 * Loops over the input iterable and accumulates data into array up to size n. The input is consumed lazily, just enough to fill a batch. The result is yielded as soon as the batch is full or when the input iterable is exhausted:
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * const batches = [...batched([1, 2, 3, 4, 5], 2)];
 * // batches: [[1, 2], [3, 4], [5]]
 *
 * const strictBatches = [...batched(['A', 'B', 'C', 'D'], 2, true)];
 * // strictBatches: [['A', 'B'], ['C', 'D']]
 * ```
 *
 * @param iterable - The input iterable to batch
 * @param n - The size of each batch
 * @param strict - If true, raises an error if the final batch is shorter than n
 * @returns A generator that produces batches as arrays
 * @throws {Error} When n is not a positive integer or when strict is true and the final batch is incomplete
 */
export function* batched<T>(
  iterable: Iterable<T>,
  n: number,
  strict = false,
): Generator<T[]> {
  if (Number.isNaN(n) || !Number.isFinite(n) || !Number.isInteger(n) || n < 1) {
    throw new Error("Batch size must be a positive integer");
  }

  const iterator = iterable[Symbol.iterator]();

  while (true) {
    const batch: T[] = [];
    for (let i = 0; i < n; i++) {
      const item = iterator.next();
      if (item.done) break;
      batch.push(item.value);
    }

    if (batch.length === 0) break;

    if (strict && batch.length !== n) {
      throw new Error("batched(): incomplete batch");
    }

    yield batch;
  }
}

/**
 * Creates an iterator that returns elements from the first iterable until it is exhausted,
 * then proceeds to the next iterable, until all the iterables are exhausted.
 *
 * @description
 * Used for treating consecutive sequences as a single sequence.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * const result = [...chain(['ABC', 'DEF'])];
 * // result: ['A', 'B', 'C', 'D', 'E', 'F']
 *
 * const numbers = [...chain([[1, 2], [3, 4], [5]])];
 * // numbers: [1, 2, 3, 4, 5]
 * ```
 *
 * @param iterables - The iterables to chain together
 * @returns A generator that produces elements from all iterables in sequence
 */
export function* chain<T>(
  ...iterables: Iterable<T>[]
): Generator<T> {
  for (const iterable of iterables) {
    yield* iterable;
  }
}

/**
 * Creates an iterator that filters elements from data returning only those that have a corresponding
 * truthy element in selectors.
 *
 * @description
 * The operation is similar to filter() but the filtering criteria comes from another iterable.
 * Stops when either the data or selectors iterables are exhausted.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * const result = [...compress('ABCDEF', [1, 0, 1, 0, 1, 1])];
 * // result: ['A', 'C', 'E', 'F']
 *
 * const numbers = [...compress([1, 2, 3, 4, 5], [true, false, true, false, true])];
 * // numbers: [1, 3, 5]
 * ```
 *
 * @param data - The input iterable to filter
 * @param selectors - The iterable of truthy/falsy values used for filtering
 * @returns A generator that produces filtered elements from data
 */
export function* compress<T>(
  data: Iterable<T>,
  selectors: Iterable<unknown>,
): Generator<T> {
  const dataIterator = data[Symbol.iterator]();
  const selectorsIterator = selectors[Symbol.iterator]();

  while (true) {
    const dataItem = dataIterator.next();
    const selectorItem = selectorsIterator.next();

    if (dataItem.done || selectorItem.done) break;

    if (selectorItem.value) {
      yield dataItem.value;
    }
  }
}

/**
 * Creates an iterator that drops elements from the iterable while the predicate is true;
 * afterwards, returns every element.
 *
 * @description
 * The iterator does not produce any output until the predicate first becomes false,
 * so it may have a lengthy start-up time.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * const result = [...dropwhile(x => x < 5, [1, 4, 6, 3, 8])];
 * // result: [6, 3, 8]
 *
 * const words = [...dropwhile(x => x.length < 4, ['a', 'bb', 'ccc', 'dddd', 'ee'])];
 * // words: ['dddd', 'ee']
 * ```
 *
 * @param predicate - The function that tests each element
 * @param iterable - The input iterable
 * @returns A generator that produces elements after the predicate becomes false
 */
export function* dropwhile<T>(
  predicate: (value: T) => boolean,
  iterable: Iterable<T>,
): Generator<T> {
  const iterator = iterable[Symbol.iterator]();

  for (let item = iterator.next(); !item.done; item = iterator.next()) {
    if (!predicate(item.value)) {
      yield item.value;
      break;
    }
  }

  for (let item = iterator.next(); !item.done; item = iterator.next()) {
    yield item.value;
  }
}

/**
 * Creates an iterator that filters elements from the iterable returning only those for which
 * the predicate is false.
 *
 * @description
 * This is the opposite of the built-in filter() function. It returns elements where
 * the predicate returns false. If predicate is null or undefined, it will filter out
 * truthy values and return only falsy values.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * const result = [...filterfalse(x => x < 5, [1, 4, 6, 3, 8])];
 * // result: [6, 8]
 *
 * const withNull = [...filterfalse(null, [0, 1, false, true, '', 'hello'])];
 * // withNull: [0, false, '']
 * ```
 *
 * @param predicate - The function that tests each element, or null for falsy filtering
 * @param iterable - The input iterable
 * @returns A generator that produces elements where the predicate is false
 */
export function* filterfalse<T>(
  predicate: ((value: T) => boolean) | null,
  iterable: Iterable<T>,
): Generator<T> {
  const predicateFunc = predicate ?? ((x: T) => Boolean(x));

  for (const item of iterable) {
    if (!predicateFunc(item)) {
      yield item;
    }
  }
}

/**
 * Creates an iterator that returns consecutive keys and groups from the iterable.
 *
 * @description
 * The key is a function computing a key value for each element. If not specified,
 * key defaults to an identity function and returns the element unchanged.
 * Generally, the iterable needs to already be sorted on the same key function.
 *
 * The operation of groupby() is similar to the uniq filter in Unix. It generates
 * a break or new group every time the value of the key function changes (which is
 * why it is usually necessary to have sorted the data using the same key function).
 *
 * The returned group is itself an iterator that shares the underlying iterable with
 * groupby(). Because the source is shared, when the groupby() object is advanced,
 * the previous group is no longer visible. So, if that data is needed later, it
 * should be stored as a list.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * // Basic grouping
 * const groups = [...groupby('AAAABBBCCD')];
 * // groups: [['A', ['A', 'A', 'A', 'A']], ['B', ['B', 'B', 'B']], ['C', ['C', 'C']], ['D', ['D']]]
 *
 * // Grouping with custom key function
 * const data = [1.1, 1.2, 2.1, 2.2, 3.1];
 * const keyGroups = [...groupby(data, Math.floor)];
 * // keyGroups: [[1, [1.1, 1.2]], [2, [2.1, 2.2]], [3, [3.1]]]
 * ```
 *
 * @param iterable - The input iterable to group
 * @param key - Function to compute a key value for each element (default: identity function)
 * @returns A generator that produces [key, group] pairs
 */
export function* groupby<T, K = T>(
  iterable: Iterable<T>,
  key?: (value: T) => K,
): Generator<[K, Generator<T>]> {
  const keyfunc = key ?? ((x: T) => x as unknown as K);
  const iterator = iterable[Symbol.iterator]();

  let exhausted = false;
  let currValue: T;
  let currKey: K;

  function* _grouper(targetKey: K): Generator<T> {
    yield currValue;

    for (let item = iterator.next(); !item.done; item = iterator.next()) {
      currValue = item.value;
      currKey = keyfunc(currValue);

      if (currKey !== targetKey) {
        return;
      }

      yield currValue;
    }

    exhausted = true;
  }

  const first = iterator.next();
  if (first.done) return;

  currValue = first.value;
  currKey = keyfunc(currValue);

  while (!exhausted) {
    const targetKey = currKey;
    const currGroup = _grouper(targetKey);
    yield [currKey, currGroup];

    // If the key hasn't changed, we need to exhaust the current group
    if (currKey === targetKey) {
      for (const _ of currGroup) {
        // Exhaust the group iterator
      }
    }
  }
}
