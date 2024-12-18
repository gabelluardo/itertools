import { assertEquals, assertThrows } from "@std/assert";
import { range } from "./utils.ts";
import { product } from "../mod.ts";

Deno.test("product() r = NaN", () => {
  assertThrows(
    () => [...product(["abc"], Number.NaN)],
    RangeError,
    "repeat argument must be a non-negative integer",
  );
});

Deno.test("product() r = Infinity", () => {
  assertThrows(
    () => [...product(["abc"], Number.POSITIVE_INFINITY)],
    RangeError,
    "repeat argument must be a non-negative integer",
  );
});

Deno.test("product() r = Math.PI", () => {
  assertThrows(
    () => [...product(["abc"], Math.PI)],
    RangeError,
    "repeat argument must be a non-negative integer",
  );
});

Deno.test("product() r = -1", () => {
  assertThrows(
    () => [...product(["abc"], -1)],
    RangeError,
    "repeat argument must be a non-negative integer",
  );
});

Deno.test("product() no iterables", () => {
  const actual = [...product([""])];
  assertEquals(actual, []);
});

Deno.test("product() no iterables", () => {
  const actual = [...product([])];
  assertEquals(actual, []);
});

Deno.test("product() one iterable", () => {
  const actual = [...product(["abc"])];
  const expected = [["a"], ["b"], ["c"]];
  assertEquals(actual, expected);
});

Deno.test("product() iterables of varying length", () => {
  const actual = [...product([[1], [2, 3, 4], [5, 6]])];
  const expected = [
    [1, 2, 5],
    [1, 2, 6],
    [1, 3, 5],
    [1, 3, 6],
    [1, 4, 5],
    [1, 4, 6],
  ];
  assertEquals(actual, expected);
});

Deno.test("product() iterables with empty", () => {
  const actual = [...product([[1, 2, 3], [], [4, 5, 6]])];
  assertEquals(actual, []);
});

Deno.test("product() r = 65_537", () => {
  const actual = [...product([range(65_537)])];
  const expected = Array(65_537).fill(undefined).map((_, i) => [i]);
  assertEquals(actual, expected);
});

Deno.test("product() multiple data types", () => {
  const actual = [...product([range(3), ["a", "b", "c"], [1n]])];
  const expected = [
    [0, "a", 1n],
    [0, "b", 1n],
    [0, "c", 1n],
    [1, "a", 1n],
    [1, "b", 1n],
    [1, "c", 1n],
    [2, "a", 1n],
    [2, "b", 1n],
    [2, "c", 1n],
  ];
  assertEquals(
    actual,
    expected,
  );
});

Deno.test("product() strings", () => {
  const actual = [...product(["ABCD", "xy"])];
  const expected = [
    ["A", "x"],
    ["A", "y"],
    ["B", "x"],
    ["B", "y"],
    ["C", "x"],
    ["C", "y"],
    ["D", "x"],
    ["D", "y"],
  ];

  assertEquals(
    actual,
    expected,
  );
});

Deno.test("product() range(2)", () => {
  const actual = [...product([range(2)], 3)];
  const expected = [
    [0, 0, 0],
    [0, 0, 1],
    [0, 1, 0],
    [0, 1, 1],
    [1, 0, 0],
    [1, 0, 1],
    [1, 1, 0],
    [1, 1, 1],
  ];

  assertEquals(
    actual,
    expected,
  );
});

Deno.test("product() repeat", () => {
  const actual1 = [...product(["A"], 4)];
  const actual2 = [...product(["A", "A", "A", "A"] as string[])];

  assertEquals(actual1, actual2);
});
