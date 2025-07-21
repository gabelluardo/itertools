import { assertEquals } from "@std/assert";
import { dropwhile } from "../mod.ts";

Deno.test("dropwhile() with numbers - drop while less than 5", () => {
  const result = [...dropwhile((x) => x < 5, [1, 4, 6, 3, 8])];
  assertEquals(result, [6, 3, 8]);
});

Deno.test("dropwhile() with strings - drop while length less than 4", () => {
  const result = [
    ...dropwhile((x) => x.length < 4, ["a", "bb", "ccc", "dddd", "ee"]),
  ];
  assertEquals(result, ["dddd", "ee"]);
});

Deno.test("dropwhile() with all elements matching predicate", () => {
  const result = [...dropwhile((x) => x < 10, [1, 2, 3, 4, 5])];
  assertEquals(result, []);
});

Deno.test("dropwhile() with no elements matching predicate", () => {
  const result = [...dropwhile((x) => x < 0, [1, 2, 3, 4, 5])];
  assertEquals(result, [1, 2, 3, 4, 5]);
});

Deno.test("dropwhile() with empty iterable", () => {
  const result = [...dropwhile((x) => x > 0, [])];
  assertEquals(result, []);
});

Deno.test("dropwhile() with single element matching predicate", () => {
  const result = [...dropwhile((x) => x < 5, [3])];
  assertEquals(result, []);
});

Deno.test("dropwhile() with single element not matching predicate", () => {
  const result = [...dropwhile((x) => x < 5, [7])];
  assertEquals(result, [7]);
});

Deno.test("dropwhile() with boolean values", () => {
  const result = [
    ...dropwhile((x) => x === false, [false, false, true, false, true]),
  ];
  assertEquals(result, [true, false, true]);
});

Deno.test("dropwhile() with complex objects", () => {
  const objects = [
    { value: 1, active: false },
    { value: 2, active: false },
    { value: 3, active: true },
    { value: 4, active: false },
    { value: 5, active: true },
  ];
  const result = [...dropwhile((obj) => !obj.active, objects)];
  assertEquals(result, [
    { value: 3, active: true },
    { value: 4, active: false },
    { value: 5, active: true },
  ]);
});

Deno.test("dropwhile() with mixed types after predicate becomes false", () => {
  const result = [
    ...dropwhile((x) => typeof x === "number", [1, 2, "hello", 4, "world"]),
  ];
  assertEquals(result, ["hello", 4, "world"]);
});
