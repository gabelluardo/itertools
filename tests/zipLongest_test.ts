import { assertEquals } from "@std/assert";
import { zipLongest } from "../mod.ts";

Deno.test("zipLongest() with basic example from Python docs", () => {
  const result = [...zipLongest(["ABCD", "xy"], "-")];
  assertEquals(result, [["A", "x"], ["B", "y"], ["C", "-"], ["D", "-"]]);
});

Deno.test("zipLongest() with arrays of different lengths", () => {
  const result = [...zipLongest([[1, 2], [3, 4, 5, 6]], 0)];
  assertEquals(result, [[1, 3], [2, 4], [0, 5], [0, 6]]);
});

Deno.test("zipLongest() with three string arrays of different lengths", () => {
  const result = [
    ...zipLongest([["A", "B", "C"], ["1", "2", "3", "4"], ["true", "false"]]),
  ];
  assertEquals(result, [
    ["A", "1", "true"],
    ["B", "2", "false"],
    ["C", "3", undefined],
    [undefined, "4", undefined],
  ]);
});

Deno.test("zipLongest() with equal length iterables", () => {
  const result = [...zipLongest([["A", "B"], ["x", "y"]], "-")];
  assertEquals(result, [["A", "x"], ["B", "y"]]);
});

Deno.test("zipLongest() with empty iterables", () => {
  const result = [...zipLongest([[], []], "fill")];
  assertEquals(result, []);
});

Deno.test("zipLongest() with one empty and one non-empty iterable", () => {
  const result = [...zipLongest([[], [1, 2, 3]], 0)];
  assertEquals(result, [[0, 1], [0, 2], [0, 3]]);
});

Deno.test("zipLongest() with single iterable", () => {
  const result = [...zipLongest([[1, 2, 3]], 0)];
  assertEquals(result, [[1], [2], [3]]);
});

Deno.test("zipLongest() with no iterables", () => {
  const result = [...zipLongest([], "fill")];
  assertEquals(result, []);
});

Deno.test("zipLongest() with string fillvalue", () => {
  const result = [...zipLongest([["a", "b", "c", "d"], ["1", "2"]], "?")];
  assertEquals(result, [["a", "1"], ["b", "2"], ["c", "?"], ["d", "?"]]);
});

Deno.test("zipLongest() with numeric fillvalue", () => {
  const result = [...zipLongest([[10, 20], [1, 2, 3, 4]], -1)];
  assertEquals(result, [[10, 1], [20, 2], [-1, 3], [-1, 4]]);
});

Deno.test("zipLongest() with undefined fillvalue (default)", () => {
  const result = [...zipLongest([["A", "B"], ["x", "y", "z"]])];
  assertEquals(result, [["A", "x"], ["B", "y"], [undefined, "z"]]);
});

Deno.test("zipLongest() with boolean fillvalue", () => {
  const result = [...zipLongest([[true, false], [true, false, true]], false)];
  assertEquals(result, [[true, true], [false, false], [false, true]]);
});

Deno.test("zipLongest() with null fillvalue", () => {
  const result = [...zipLongest([["a"], ["x", "y", "z"]], null)];
  assertEquals(result, [["a", "x"], [null, "y"], [null, "z"]]);
});

Deno.test("zipLongest() with many iterables", () => {
  const result = [...zipLongest([
    [1],
    [2, 3],
    [4, 5, 6],
    [7, 8, 9, 10],
  ], 0)];
  assertEquals(result, [
    [1, 2, 4, 7],
    [0, 3, 5, 8],
    [0, 0, 6, 9],
    [0, 0, 0, 10],
  ]);
});

Deno.test("zipLongest() with iterators (not just arrays)", () => {
  function* gen1() {
    yield 1;
    yield 2;
  }

  function* gen2() {
    yield 10;
    yield 20;
    yield 30;
  }

  const result = [...zipLongest([gen1(), gen2()], 0)];
  assertEquals(result, [[1, 10], [2, 20], [0, 30]]);
});
