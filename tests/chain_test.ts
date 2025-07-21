import { assertEquals } from "@std/assert";
import { chain } from "../mod.ts";

Deno.test("chain() with strings", () => {
  const result = [...chain("ABC", "DEF")];
  assertEquals(result, ["A", "B", "C", "D", "E", "F"]);
});

Deno.test("chain() with arrays of numbers", () => {
  const result = [...chain([1, 2], [3, 4], [5])];
  assertEquals(result, [1, 2, 3, 4, 5]);
});

Deno.test("chain() with empty iterables", () => {
  const result = [...chain([], [], [])];
  assertEquals(result, []);
});

Deno.test("chain() with mixed empty and non-empty iterables", () => {
  const result = [...chain([1, 2], [], [3, 4])];
  assertEquals(result, [1, 2, 3, 4]);
});

Deno.test("chain() with single iterable", () => {
  const result = [...chain([1, 2, 3])];
  assertEquals(result, [1, 2, 3]);
});

Deno.test("chain() with no arguments", () => {
  const result = [...chain()];
  assertEquals(result, []);
});

Deno.test("chain() with different types of iterables", () => {
  const set = new Set(["c", "d"]);
  const result = [...chain(["a", "b"], "ef", set)];
  assertEquals(result, ["a", "b", "e", "f", "c", "d"]);
});

Deno.test("chain() with nested arrays", () => {
  const result = [...chain([[1, 2]], [[3, 4]])];
  assertEquals(result, [[1, 2], [3, 4]]);
});

Deno.test("chain() lazy evaluation", () => {
  function* generator() {
    yield 1;
    yield 2;
  }

  const result = [...chain(generator(), [3, 4])];
  assertEquals(result, [1, 2, 3, 4]);
});

Deno.test("chain() with Map values", () => {
  const map = new Map([["a", 1], ["b", 2]]);
  const result = [...chain([0], map.values(), [3])];
  assertEquals(result, [0, 1, 2, 3]);
});
