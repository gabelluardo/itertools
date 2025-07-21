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
 * Creates an iterator that returns selected elements from the iterable.
 *
 * @description
 * Works like sequence slicing but does not support negative values for start, stop, or step.
 *
 * If start is zero or undefined, iteration starts at zero. Otherwise, elements from the
 * iterable are skipped until start is reached.
 *
 * If stop is undefined, iteration continues until the input is exhausted. Otherwise,
 * it stops at the specified position. If stop is null, iteration continues until the
 * input is exhausted.
 *
 * If step is undefined, the step defaults to one. Elements are returned consecutively
 * unless step is set higher than one which results in items being skipped.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * // islice('ABCDEFG', 2) → A B
 * const first2 = [...islice('ABCDEFG', 2)];
 * // first2: ['A', 'B']
 *
 * // islice('ABCDEFG', 2, 4) → C D
 * const middle = [...islice('ABCDEFG', 2, 4)];
 * // middle: ['C', 'D']
 *
 * // islice('ABCDEFG', undefined, 3) → A B C
 * const fromStart = [...islice('ABCDEFG', undefined, 3)];
 * // fromStart: ['A', 'B', 'C']
 *
 * // islice('ABCDEFG', 2, null) → C D E F G
 * const fromIndex2 = [...islice('ABCDEFG', 2, null)];
 * // fromIndex2: ['C', 'D', 'E', 'F', 'G']
 *
 * // islice('ABCDEFG', undefined, null, 2) → A C E G
 * const everyOther = [...islice('ABCDEFG', undefined, null, 2)];
 * // everyOther: ['A', 'C', 'E', 'G']
 * ```
 *
 * @param iterable - The input iterable to slice
 * @param start - Starting index (or stop if only one argument provided), undefined defaults to 0
 * @param stop - Stopping index (optional), null means continue to end
 * @param step - Step size (optional, defaults to 1)
 * @returns A generator that produces selected elements from the iterable
 * @throws {Error} When start, stop, or step have invalid values
 */
export function* islice<T>(
  iterable: Iterable<T>,
  start?: number,
  stop?: number | null,
  step?: number,
): Generator<T> {
  // Handle the case where only stop is provided (start defaults to 0)
  if (stop === undefined) {
    stop = start;
    start = 0;
  }

  start = start ?? 0;
  step = step ?? 1;

  if (
    start < 0 || (stop !== undefined && stop !== null && stop < 0) || step <= 0
  ) {
    throw new Error(
      "islice() arguments must be non-negative and step must be positive",
    );
  }

  let index = 0;

  for (const item of iterable) {
    if (stop !== undefined && stop !== null && index >= stop) {
      break;
    }

    if (index >= start && (index - start) % step === 0) {
      yield item;
    }

    index++;
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

/**
 * Creates an iterator that returns successive overlapping pairs taken from the input iterable.
 *
 * @description
 * The number of 2-tuples in the output iterator will be one fewer than the number of
 * inputs. It will be empty if the input iterable has fewer than two elements.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * const pairs = [...pairwise('ABCDEFG')];
 * // pairs: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'E'], ['E', 'F'], ['F', 'G']]
 *
 * const numbers = [...pairwise([1, 2, 3, 4, 5])];
 * // numbers: [[1, 2], [2, 3], [3, 4], [4, 5]]
 * ```
 *
 * @param iterable - The input iterable
 * @returns A generator that produces pairs of consecutive elements
 */
export function* pairwise<T>(
  iterable: Iterable<T>,
): Generator<[T, T]> {
  const iterator = iterable[Symbol.iterator]();

  const first = iterator.next();
  if (first.done) return;

  let a = first.value;

  for (let item = iterator.next(); !item.done; item = iterator.next()) {
    const b = item.value;
    yield [a, b];
    a = b;
  }
}

/**
 * Creates an iterator that computes the function using arguments obtained from the iterable.
 *
 * @description
 * Used instead of Array.prototype.map() when argument parameters have already been "pre-zipped" into tuples.
 * The difference between map() and starmap() parallels the distinction between function(a,b)
 * and function(...args). Each element of the iterable should be a tuple/array that can be
 * spread as arguments to the function.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * const powers = [...starmap(Math.pow, [[2, 5], [3, 2], [10, 3]])];
 * // powers: [32, 9, 1000]
 *
 * const sums = [...starmap((a, b, c) => a + b + c, [[1, 2, 3], [4, 5, 6]])];
 * // sums: [6, 15]
 *
 * const products = [...starmap((x, y) => x * y, [[2, 3], [4, 5], [6, 7]])];
 * // products: [6, 20, 42]
 * ```
 *
 * @param func - The function to apply to each set of arguments
 * @param iterable - The input iterable containing arrays/tuples of arguments
 * @returns A generator that produces the results of applying func to each argument set
 */
export function* starmap<TArgs extends readonly unknown[], TResult>(
  func: (...args: TArgs) => TResult,
  iterable: Iterable<TArgs>,
): Generator<TResult> {
  for (const args of iterable) {
    yield func(...args);
  }
}

/**
 * Creates an iterator that returns elements from the iterable as long as the predicate is true.
 *
 * @description
 * The iterator stops when the predicate first becomes false and doesn't continue further,
 * even if subsequent elements would satisfy the predicate. This is the complement of dropwhile().
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * const result = [...takewhile(x => x < 5, [1, 4, 6, 3, 8])];
 * // result: [1, 4]
 *
 * const words = [...takewhile(x => x.length < 4, ['a', 'bb', 'ccc', 'dddd', 'ee'])];
 * // words: ['a', 'bb', 'ccc']
 * ```
 *
 * @param predicate - The function that tests each element
 * @param iterable - The input iterable
 * @returns A generator that produces elements while the predicate is true
 */
export function* takewhile<T>(
  predicate: (value: T) => boolean,
  iterable: Iterable<T>,
): Generator<T> {
  for (const item of iterable) {
    if (!predicate(item)) {
      break;
    }
    yield item;
  }
}
