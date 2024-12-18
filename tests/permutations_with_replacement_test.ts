import { assertEquals, assertStrictEquals, assertThrows } from "@std/assert";

import { range } from "./utils.ts";
import { permutationsWithReplacement } from "../mod.ts";

Deno.test("permutationsWithReplacement() r = NaN", () => {
  assertThrows(
    () => [...permutationsWithReplacement("abc", Number.NaN)],
    RangeError,
    "r must be a non-negative integer",
  );
});

Deno.test("permutationsWithReplacement() r = Infinity", () => {
  assertThrows(
    () => [...permutationsWithReplacement("abc", Number.POSITIVE_INFINITY)],
    RangeError,
    "r must be a non-negative integer",
  );
});

Deno.test("permutationsWithReplacement() r = Math.PI", () => {
  assertThrows(
    () => [...permutationsWithReplacement("abc", Math.PI)],
    RangeError,
    "r must be a non-negative integer",
  );
});

Deno.test("permutationsWithReplacement() r = -1", () => {
  assertThrows(
    () => [...permutationsWithReplacement("abc", -1)],
    RangeError,
    "r must be a non-negative integer",
  );
});

Deno.test("permutationsWithReplacement() n = r = 0", () => {
  const actual = [...permutationsWithReplacement("", 0)];
  const expected = [[]];
  assertEquals(actual, expected);
});

Deno.test("permutationsWithReplacement() r = 0", () => {
  const actual = [...permutationsWithReplacement("abc", 0)];
  const expected = [[]];
  assertEquals(actual, expected);
});

Deno.test("permutationsWithReplacement() n = 0", () => {
  const actual = [...permutationsWithReplacement("", 3)];
  assertEquals(actual, []);
});

Deno.test("permutationsWithReplacement() r > n", () => {
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

Deno.test("permutationsWithReplacement() two equal element", () => {
  const actual = [...permutationsWithReplacement("aba", 2)];
  const expected = [
    ["a", "a"],
    ["a", "b"],
    ["a", "a"],
    ["b", "a"],
    ["b", "b"],
    ["b", "a"],
    ["a", "a"],
    ["a", "b"],
    ["a", "a"],
  ];

  assertEquals(actual, expected);
});

Deno.test("permutationsWithReplacement() n = r", () => {
  const actual = [...permutationsWithReplacement([1, 2, 3], 3)];
  const expected = [
    [1, 1, 1],
    [1, 1, 2],
    [1, 1, 3],
    [1, 2, 1],
    [1, 2, 2],
    [1, 2, 3],
    [1, 3, 1],
    [1, 3, 2],
    [1, 3, 3],
    [2, 1, 1],
    [2, 1, 2],
    [2, 1, 3],
    [2, 2, 1],
    [2, 2, 2],
    [2, 2, 3],
    [2, 3, 1],
    [2, 3, 2],
    [2, 3, 3],
    [3, 1, 1],
    [3, 1, 2],
    [3, 1, 3],
    [3, 2, 1],
    [3, 2, 2],
    [3, 2, 3],
    [3, 3, 1],
    [3, 3, 2],
    [3, 3, 3],
  ];
  assertEquals(actual, expected);
});

Deno.test("permutationsWithReplacement() r = undefined", () => {
  const actual = [...permutationsWithReplacement([1, 2, 3])];
  const expected = [
    [1, 1, 1],
    [1, 1, 2],
    [1, 1, 3],
    [1, 2, 1],
    [1, 2, 2],
    [1, 2, 3],
    [1, 3, 1],
    [1, 3, 2],
    [1, 3, 3],
    [2, 1, 1],
    [2, 1, 2],
    [2, 1, 3],
    [2, 2, 1],
    [2, 2, 2],
    [2, 2, 3],
    [2, 3, 1],
    [2, 3, 2],
    [2, 3, 3],
    [3, 1, 1],
    [3, 1, 2],
    [3, 1, 3],
    [3, 2, 1],
    [3, 2, 2],
    [3, 2, 3],
    [3, 3, 1],
    [3, 3, 2],
    [3, 3, 3],
  ];
  assertEquals(actual, expected);
});

Deno.test("permutationsWithReplacement() r < n", () => {
  const actual = [...permutationsWithReplacement([1, 2, 3], 2)];
  const expected = [
    [1, 1],
    [1, 2],
    [1, 3],
    [2, 1],
    [2, 2],
    [2, 3],
    [3, 1],
    [3, 2],
    [3, 3],
  ];
  assertEquals(actual, expected);
});

Deno.test("permutationsWithReplacement() r = 65_537", () => {
  const actual = [...permutationsWithReplacement(range(65_537), 1)];
  const expected = Array(65_537).fill(undefined).map((_, i) => [i]);
  assertEquals(actual, expected);
});

for (let n = 0; n < 8; n++) {
  const iterable = range(n);
  for (let r = 0; r < 6; r++) {
    Deno.test(`permutationsWithReplacement() pwr(${n}, ${r})`, () => {
      const actual = [...permutationsWithReplacement(iterable, r)];
      const expectedLength = n ** r;
      assertStrictEquals(actual.length, expectedLength);
    });
  }
}

for (let n = 0; n < 8; n++) {
  const iterable = range(n);
  for (let r = 0; r < 6; r++) {
    Deno.test(`permutationsWithReplacement() permutationsWithReplacement1([${iterable}], ${r})`, () => {
      const actual = [...permutationsWithReplacement(iterable, r)];
      const expected1 = [...permutationsWithReplacement1(iterable, r)];
      assertEquals(actual, expected1);
    });
  }
}

/** Equivalent to `permutationsWithReplacement` for testing. */
function* permutationsWithReplacement1<T>(
  iterables: Iterable<T>,
  r: number,
): Generator<T[]> {
  const pool = [...iterables];
  let result: T[][] = [[]];
  for (let i = 0; i < r; i++) {
    result = result.flatMap((x) => pool.map((y) => [...x, y]));
  }
  for (const prod of result) {
    yield prod;
  }
}
