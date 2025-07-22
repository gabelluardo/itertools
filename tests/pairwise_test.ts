import { assertEquals } from "@std/assert";
import { pairwise } from "../mod.ts";

Deno.test("pairwise() with string", () => {
  const result = [...pairwise("ABCDEFG")];
  assertEquals(result, [["A", "B"], ["B", "C"], ["C", "D"], ["D", "E"], [
    "E",
    "F",
  ], ["F", "G"]]);
});

Deno.test("pairwise() with numbers", () => {
  const result = [...pairwise([1, 2, 3, 4, 5])];
  assertEquals(result, [[1, 2], [2, 3], [3, 4], [4, 5]]);
});

Deno.test("pairwise() with empty iterable", () => {
  const result = [...pairwise([])];
  assertEquals(result, []);
});

Deno.test("pairwise() with single element", () => {
  const result = [...pairwise([42])];
  assertEquals(result, []);
});

Deno.test("pairwise() with two elements", () => {
  const result = [...pairwise([1, 2])];
  assertEquals(result, [[1, 2]]);
});

Deno.test("pairwise() with mixed types", () => {
  const result = [...pairwise([1, "a", true, null])];
  assertEquals(result, [[1, "a"], ["a", true], [true, null]]);
});

Deno.test("pairwise() with objects", () => {
  const obj1 = { id: 1 };
  const obj2 = { id: 2 };
  const obj3 = { id: 3 };
  const result = [...pairwise([obj1, obj2, obj3])];
  assertEquals(result, [[obj1, obj2], [obj2, obj3]]);
});
