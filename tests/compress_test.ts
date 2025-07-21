import { assertEquals } from "@std/assert";
import { compress } from "../mod.ts";

Deno.test("compress() with string and numeric selectors", () => {
  const result = [...compress("ABCDEF", [1, 0, 1, 0, 1, 1])];
  assertEquals(result, ["A", "C", "E", "F"]);
});

Deno.test("compress() with arrays and boolean selectors", () => {
  const result = [
    ...compress([1, 2, 3, 4, 5], [true, false, true, false, true]),
  ];
  assertEquals(result, [1, 3, 5]);
});

Deno.test("compress() with all false selectors", () => {
  const result = [...compress([1, 2, 3, 4], [false, false, false, false])];
  assertEquals(result, []);
});

Deno.test("compress() with all true selectors", () => {
  const result = [...compress(["a", "b", "c"], [true, true, true])];
  assertEquals(result, ["a", "b", "c"]);
});

Deno.test("compress() with empty data", () => {
  const result = [...compress([], [true, false, true])];
  assertEquals(result, []);
});

Deno.test("compress() with empty selectors", () => {
  const result = [...compress([1, 2, 3], [])];
  assertEquals(result, []);
});

Deno.test("compress() with both empty", () => {
  const result = [...compress([], [])];
  assertEquals(result, []);
});

Deno.test("compress() with data longer than selectors", () => {
  const result = [...compress([1, 2, 3, 4, 5], [true, false, true])];
  assertEquals(result, [1, 3]);
});

Deno.test("compress() with selectors longer than data", () => {
  const result = [...compress([1, 2, 3], [true, false, true, false, true])];
  assertEquals(result, [1, 3]);
});

Deno.test("compress() with mixed truthy/falsy values", () => {
  const result = [...compress(["a", "b", "c", "d"], [1, 0, "yes", null])];
  assertEquals(result, ["a", "c"]);
});

Deno.test("compress() with objects", () => {
  const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const result = [...compress(data, [true, false, true])];
  assertEquals(result, [{ id: 1 }, { id: 3 }]);
});
