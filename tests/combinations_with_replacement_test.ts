import { assertEquals, assertStrictEquals, assertThrows } from "@std/assert";

import { factorial, range } from "./utils.ts";
import { combinationsWithReplacement } from "../mod.ts";

Deno.test("combinationsWithReplacement() r = NaN", () => {
  assertThrows(
    () => [...combinationsWithReplacement("abc", Number.NaN)],
    RangeError,
    "r must be a non-negative integer",
  );
});

Deno.test("combinationsWithReplacement() r = Infinity", () => {
  assertThrows(
    () => [...combinationsWithReplacement("abc", Number.POSITIVE_INFINITY)],
    RangeError,
    "r must be a non-negative integer",
  );
});

Deno.test("combinationsWithReplacement() r = Math.PI", () => {
  assertThrows(
    () => [...combinationsWithReplacement("abc", Math.PI)],
    RangeError,
    "r must be a non-negative integer",
  );
});

Deno.test("combinationsWithReplacement() r = -1", () => {
  assertThrows(
    () => [...combinationsWithReplacement("abc", -1)],
    RangeError,
    "r must be a non-negative integer",
  );
});

Deno.test("combinationsWithReplacement() n = r = 0", () => {
  const actual = [...combinationsWithReplacement("", 0)];
  const expected = [[]];
  assertEquals(actual, expected);
});

Deno.test("combinationsWithReplacement() r = 0", () => {
  const actual = [...combinationsWithReplacement("abc", 0)];
  const expected = [[]];
  assertEquals(actual, expected);
});

Deno.test("combinationsWithReplacement() n = 0", () => {
  const actual = [...combinationsWithReplacement("", 1)];
  assertEquals(actual, []);
});

Deno.test("combinationsWithReplacement() r > n", () => {
  const actual = [...combinationsWithReplacement("abc", 4)];
  const expected = [
    ["a", "a", "a", "a"],
    ["a", "a", "a", "b"],
    ["a", "a", "a", "c"],
    ["a", "a", "b", "b"],
    ["a", "a", "b", "c"],
    ["a", "a", "c", "c"],
    ["a", "b", "b", "b"],
    ["a", "b", "b", "c"],
    ["a", "b", "c", "c"],
    ["a", "c", "c", "c"],
    ["b", "b", "b", "b"],
    ["b", "b", "b", "c"],
    ["b", "b", "c", "c"],
    ["b", "c", "c", "c"],
    ["c", "c", "c", "c"],
  ];
  assertEquals(actual, expected);
});

Deno.test("combinationsWithReplacement() n = r", () => {
  const actual = [...combinationsWithReplacement("abc", 3)];
  const expected = [
    ["a", "a", "a"],
    ["a", "a", "b"],
    ["a", "a", "c"],
    ["a", "b", "b"],
    ["a", "b", "c"],
    ["a", "c", "c"],
    ["b", "b", "b"],
    ["b", "b", "c"],
    ["b", "c", "c"],
    ["c", "c", "c"],
  ];
  assertEquals(actual, expected);
});

Deno.test("combinationsWithReplacement() r < n", () => {
  const actual = [...combinationsWithReplacement([0, 1, 2], 2)];
  const expected = [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 1],
    [1, 2],
    [2, 2],
  ];
  assertEquals(actual, expected);
});

Deno.test("combinationsWithReplacement() r = 65_537", () => {
  const actual = [...combinationsWithReplacement(range(65_537), 1)];
  const expected = Array(65_537).fill(undefined).map((_, i) => [i]);
  assertEquals(actual, expected);
});

for (let n = 0; n < 8; n++) {
  const iterable = range(n);
  for (let r = 0; r < 8; r++) {
    Deno.test(`combinationsWithReplacement() cwr(${n}, ${r})`, () => {
      const actual = [...combinationsWithReplacement(iterable, r)];
      const expectedLength = cwr(n, r);
      assertStrictEquals(actual.length, expectedLength);
    });
  }
}

for (let n = 0; n < 8; n++) {
  const iterable = range(n);
  for (let r = 0; r < 8; r++) {
    Deno.test(`combinationsWithReplacement() combinationsWithReplacement1([${iterable}], ${r})`, () => {
      const actual = [...combinationsWithReplacement(iterable, r)];
      const expected1 = [...combinationsWithReplacement1(iterable, r)];
      assertEquals(actual, expected1);
    });
  }
}

/** Return the number of ways to choose `r` items from `n` items with replacement and without order. */
function cwr(n: number, r: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw RangeError("n must be a non-negative integer");
  }
  if (!Number.isInteger(r) || r < 0) {
    throw RangeError("r must be a non-negative integer");
  }
  if (r > n && n === 0) {
    return 0;
  }
  if (r === 0) {
    return 1;
  }
  return factorial(n + r - 1) / (factorial(r) * factorial(n - 1));
}

/** Equivalent to `combinationsWithReplacement` for testing. */
function* combinationsWithReplacement1<T>(
  iterable: Iterable<T>,
  r: number,
): Generator<T[]> {
  const pool = [...iterable];
  const n = pool.length;
  for (const indices of combinationsWithReplacement(range(n), r)) {
    if (!indices.some((x, i) => indices[i - 1] > x)) {
      yield indices.map((i) => pool[i]);
    }
  }
}
