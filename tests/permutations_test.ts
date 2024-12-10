import { assertEquals, assertStrictEquals, assertThrows } from "@std/assert";

import { factorial, range } from "./utils.ts";
import { permutations, permutationsWithReplacement } from "../mod.ts";

Deno.test("r = NaN", () => {
  assertThrows(
    () => [...permutations("abc", Number.NaN)],
    RangeError,
    "r must be a non-negative integer",
  );
});

Deno.test("r = Infinity", () => {
  assertThrows(
    () => [...permutations("abc", Number.POSITIVE_INFINITY)],
    RangeError,
    "r must be a non-negative integer",
  );
});

Deno.test("r = Math.PI", () => {
  assertThrows(
    () => [...permutations("abc", Math.PI)],
    RangeError,
    "r must be a non-negative integer",
  );
});

Deno.test("r = -1", () => {
  assertThrows(
    () => [...permutations("abc", -1)],
    RangeError,
    "r must be a non-negative integer",
  );
});

Deno.test("n = r = 0", () => {
  const actual = [...permutations("", 0)];
  const expected = [[]];
  assertEquals(actual, expected);
});

Deno.test("r = 0", () => {
  const actual = [...permutations("abc", 0)];
  const expected = [[]];
  assertEquals(actual, expected);
});

Deno.test("n = 0", () => {
  const actual = [...permutations("", 1)];
  assertEquals(actual, []);
});

Deno.test("r > n", () => {
  const actual = [...permutations("abc", 4)];
  const expected: Iterable<string[]> = [];
  assertEquals(actual, expected);
});

Deno.test("n = r", () => {
  const actual = [...permutations("abc", 3)];
  const expected = [
    ["a", "b", "c"],
    ["a", "c", "b"],
    ["b", "a", "c"],
    ["b", "c", "a"],
    ["c", "a", "b"],
    ["c", "b", "a"],
  ];
  assertEquals(actual, expected);
});

Deno.test("r = undefined (0)", () => {
  const actual = [...permutations("")];
  assertEquals(actual, [[]]);
});

Deno.test("r = undefined (n)", () => {
  const actual = [...permutations("abc")];
  const expected = [
    ["a", "b", "c"],
    ["a", "c", "b"],
    ["b", "a", "c"],
    ["b", "c", "a"],
    ["c", "a", "b"],
    ["c", "b", "a"],
  ];
  assertEquals(actual, expected);
});

Deno.test("r < n", () => {
  const actual = [...permutations([0, 1, 2, 3], 3)];
  const expected = [
    [0, 1, 2],
    [0, 1, 3],
    [0, 2, 1],
    [0, 2, 3],
    [0, 3, 1],
    [0, 3, 2],
    [1, 0, 2],
    [1, 0, 3],
    [1, 2, 0],
    [1, 2, 3],
    [1, 3, 0],
    [1, 3, 2],
    [2, 0, 1],
    [2, 0, 3],
    [2, 1, 0],
    [2, 1, 3],
    [2, 3, 0],
    [2, 3, 1],
    [3, 0, 1],
    [3, 0, 2],
    [3, 1, 0],
    [3, 1, 2],
    [3, 2, 0],
    [3, 2, 1],
  ];
  assertEquals(actual, expected);
});

Deno.test("permutations with single element", () => {
  const actual = [...permutations("a")];
  const expected = [["a"]];
  assertEquals(actual, expected);
});

Deno.test("permutations with two elements", () => {
  const actual = [...permutations("ab")];
  const expected = [
    ["a", "b"],
    ["b", "a"],
  ];
  assertEquals(actual, expected);
});

Deno.test("permutations with replacement, r = 1", () => {
  const actual = [...permutationsWithReplacement("abc", 1)];
  const expected = [["a"], ["b"], ["c"]];
  assertEquals(actual, expected);
});

Deno.test("permutations with replacement, r = 2", () => {
  const actual = [...permutationsWithReplacement("ab", 2)];
  const expected = [
    ["a", "a"],
    ["a", "b"],
    ["b", "a"],
    ["b", "b"],
  ];
  assertEquals(actual, expected);
});

Deno.test("permutations with replacement, r = 3", () => {
  const actual = [...permutationsWithReplacement("ab", 3)];
  const expected = [
    ["a", "a", "a"],
    ["a", "a", "b"],
    ["a", "b", "a"],
    ["a", "b", "b"],
    ["b", "a", "a"],
    ["b", "a", "b"],
    ["b", "b", "a"],
    ["b", "b", "b"],
  ];
  assertEquals(actual, expected);
});

Deno.test("permutations with repeated elements", () => {
  const actual = [...permutations([1, 1, 2])];

  const expected = [
    [1, 1, 2],
    [1, 2, 1],
    [1, 1, 2],
    [1, 2, 1],
    [2, 1, 1],
    [2, 1, 1],
  ];
  assertEquals(actual, expected);
});

for (let n = 0; n < 8; n++) {
  const iterable = range(n);
  for (let r = 0; r < 8; r++) {
    Deno.test(`perm(${n}, ${r})`, () => {
      const actual = [...permutations(iterable, r)];
      const expectedLength = perm(n, r);
      assertStrictEquals(actual.length, expectedLength);
    });
  }
}

for (let n = 0; n < 8; n++) {
  const iterable = range(n);
  for (let r = 0; r < 8; r++) {
    Deno.test(`permutations1([${iterable}], ${r})`, () => {
      const actual = [...permutations(iterable, r)];
      const expected1 = [...permutations1(iterable, r)];
      assertEquals(actual, expected1);
    });
  }
}

/** Return the number of ways to choose `r` items from `n` items without replacement and with order. */
function perm(n: number, r: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw RangeError("n must be a non-negative integer");
  }
  if (!Number.isInteger(r) || r < 0) {
    throw RangeError("r must be a non-negative integer");
  }
  if (r > n) {
    return 0;
  }
  return factorial(n) / factorial(n - r);
}

/** Equivalent to `permutations` for testing. */
function* permutations1<T>(
  iterable: Iterable<T>,
  r: number,
): Generator<T[]> {
  const pool = [...iterable];
  const n = pool.length;
  for (const indices of permutationsWithReplacement(range(n), r)) {
    if (new Set(indices).size === r) {
      yield indices.map((i) => pool[i]);
    }
  }
}
