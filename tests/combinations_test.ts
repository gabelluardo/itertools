import { assertEquals, assertStrictEquals, assertThrows } from "@std/assert";
import { factorial, range } from "./utils.ts";

import { combinations, combinationsWithReplacement } from "../mod.ts";
import { permutations } from "../mod.ts";

Deno.test("combinations() r = NaN", () => {
  assertThrows(
    () => [...combinations("abc", Number.NaN)],
    RangeError,
    "r must be a non-negative integer",
  );
});

Deno.test("combinations() r = Infinity", () => {
  assertThrows(
    () => [...combinations("abc", Number.POSITIVE_INFINITY)],
    RangeError,
    "r must be a non-negative integer",
  );
});

Deno.test("combinations() r = Math.PI", () => {
  assertThrows(
    () => [...combinations("abc", Math.PI)],
    RangeError,
    "r must be a non-negative integer",
  );
});

Deno.test("combinations() r = -1", () => {
  assertThrows(
    () => [...combinations("abc", -1)],
    RangeError,
    "r must be a non-negative integer",
  );
});

Deno.test("combinations() n = r = 0", () => {
  const actual = [...combinations("", 0)];
  const expected = [[]];
  assertEquals(actual, expected);
});

Deno.test("combinations() r = 0", () => {
  const actual = [...combinations("abc", 0)];
  const expected = [[]];
  assertEquals(actual, expected);
});

Deno.test("combinations() n = 0", () => {
  const actual = [...combinations("", 1)];
  assertEquals(actual, []);
});

Deno.test("combinations() r > n", () => {
  const actual = [...combinations("abc", 32)];
  assertEquals(actual, []);
});

Deno.test("combinations() n = r", () => {
  const actual = [...combinations("abc", 3)];
  const expected = [["a", "b", "c"]];
  assertEquals(actual, expected);
});

Deno.test("combinations() r < n", () => {
  const actual = [...combinations([0, 1, 2, 3], 3)];
  const expected = [
    [0, 1, 2],
    [0, 1, 3],
    [0, 2, 3],
    [1, 2, 3],
  ];
  assertEquals(actual, expected);
});

for (let n = 0; n < 8; n++) {
  const iterable = range(n);
  for (let r = 0; r < 8; r++) {
    Deno.test(`combinations() comb(${n}, ${r})`, () => {
      const actual = [...combinations(iterable, r)];
      const expectedLength = comb(n, r);
      assertStrictEquals(actual.length, expectedLength);
    });
  }
}

for (let n = 0; n < 8; n++) {
  const iterable = range(n);
  for (let r = 0; r < 8; r++) {
    Deno.test(`combinations() combinations1([${iterable}], ${r})`, () => {
      const actual = [...combinations(iterable, r)];
      const expected1 = [...combinations1(iterable, r)];
      assertEquals(actual, expected1);
    });
  }
}

for (let n = 0; n < 8; n++) {
  const iterable = range(n);
  for (let r = 0; r < 8; r++) {
    Deno.test(`combinations() combinations2([${iterable}], ${r})`, () => {
      const actual = [...combinations(iterable, r)];
      const expected2 = [...combinations2(iterable, r)];
      assertEquals(actual, expected2);
    });
  }
}

/** Return the number of ways to choose `r` items from `n` items without replacement and without order. */
function comb(n: number, r: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw RangeError("n must be a non-negative integer");
  }
  if (!Number.isInteger(r) || r < 0) {
    throw RangeError("r must be a non-negative integer");
  }
  if (r <= n) {
    return factorial(n) / (factorial(r) * factorial(n - r));
  }
  return 0;
}

/** Equivalent to `combinations` for testing. */
function* combinations1<T>(
  iterable: Iterable<T>,
  r: number,
): Generator<T[]> {
  const pool = [...iterable];
  const n = pool.length;
  for (const indices of permutations(range(n), r)) {
    if (!indices.some((x, i) => indices[i - 1] > x)) {
      yield indices.map((i) => pool[i]);
    }
  }
}

/** Equivalent to `combinations` for testing. */
function* combinations2<T>(
  iterable: Iterable<T>,
  r: number,
): Generator<T[]> {
  const pool = [...iterable];
  const n = pool.length;
  for (const indices of combinationsWithReplacement(range(n), r)) {
    if (new Set(indices).size === r) {
      yield indices.map((i) => pool[i]);
    }
  }
}
