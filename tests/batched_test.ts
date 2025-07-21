import { assertEquals, assertThrows } from "@std/assert";
import { batched } from "../mod.ts";

Deno.test("batched() batch size = NaN", () => {
  assertThrows(
    () => Array.from(batched([1, 2, 3], Number.NaN)),
    Error,
    "Batch size must be a positive integer",
  );
});

Deno.test("batched() batch size = Infinity", () => {
  assertThrows(
    () => Array.from(batched([1, 2, 3], Number.POSITIVE_INFINITY)),
    Error,
    "Batch size must be a positive integer",
  );
});

Deno.test("batched() batch size = Math.PI", () => {
  assertThrows(
    () => Array.from(batched([1, 2, 3], Math.PI)),
    Error,
    "Batch size must be a positive integer",
  );
});

Deno.test("batched() batch size = 0", () => {
  assertThrows(
    () => Array.from(batched([1, 2, 3], 0)),
    Error,
    "Batch size must be a positive integer",
  );
});

Deno.test("batched() batch size = -1", () => {
  assertThrows(
    () => Array.from(batched([1, 2, 3], -1)),
    Error,
    "Batch size must be a positive integer",
  );
});

Deno.test("batched() empty array", () => {
  const result = Array.from(batched([], 3));
  assertEquals(result, []);
});

Deno.test("batched() batch size > array length", () => {
  const result = Array.from(batched([1, 2, 3], 5));
  assertEquals(result, [[1, 2, 3]]);
});

Deno.test("batched() even division", () => {
  const result = Array.from(batched([1, 2, 3, 4, 5, 6], 2));
  assertEquals(result, [[1, 2], [3, 4], [5, 6]]);
});

Deno.test("batched() uneven division", () => {
  const result = Array.from(batched([1, 2, 3, 4, 5], 2));
  assertEquals(result, [[1, 2], [3, 4], [5]]);
});

Deno.test("batched() with strings", () => {
  const result = Array.from(batched(["a", "b", "c", "d", "e"], 2));
  assertEquals(result, [["a", "b"], ["c", "d"], ["e"]]);
});

Deno.test("batched() with objects", () => {
  const input = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
  const result = Array.from(batched(input, 2));
  assertEquals(result, [[{ id: 1 }, { id: 2 }], [{ id: 3 }, { id: 4 }]]);
});

Deno.test("batched() single element", () => {
  const result = Array.from(batched([1], 1));
  assertEquals(result, [[1]]);
});

Deno.test("batched() batch size = 1", () => {
  const result = Array.from(batched([1, 2, 3], 1));
  assertEquals(result, [[1], [2], [3]]);
});
