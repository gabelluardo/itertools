import { assertEquals } from "@std/assert";
import { takewhile } from "../mod.ts";

Deno.test("takewhile() with numbers - take while less than 5", () => {
  const result = [...takewhile((x) => x < 5, [1, 4, 6, 3, 8])];
  assertEquals(result, [1, 4]);
});

Deno.test("takewhile() with strings - take while length less than 4", () => {
  const result = [
    ...takewhile((x) => x.length < 4, ["a", "bb", "ccc", "dddd", "ee"]),
  ];
  assertEquals(result, ["a", "bb", "ccc"]);
});

Deno.test("takewhile() with all elements matching predicate", () => {
  const result = [...takewhile((x) => x < 10, [1, 2, 3, 4, 5])];
  assertEquals(result, [1, 2, 3, 4, 5]);
});

Deno.test("takewhile() with no elements matching predicate", () => {
  const result = [...takewhile((x) => x < 0, [1, 2, 3, 4, 5])];
  assertEquals(result, []);
});

Deno.test("takewhile() with empty iterable", () => {
  const result = [...takewhile((x) => x > 0, [])];
  assertEquals(result, []);
});

Deno.test("takewhile() with single element matching predicate", () => {
  const result = [...takewhile((x) => x < 5, [3])];
  assertEquals(result, [3]);
});

Deno.test("takewhile() with single element not matching predicate", () => {
  const result = [...takewhile((x) => x < 5, [7])];
  assertEquals(result, []);
});

Deno.test("takewhile() with boolean values", () => {
  const result = [
    ...takewhile((x) => x === false, [false, false, true, false, true]),
  ];
  assertEquals(result, [false, false]);
});

Deno.test("takewhile() with complex objects", () => {
  const objects = [
    { value: 1, active: false },
    { value: 2, active: false },
    { value: 3, active: true },
    { value: 4, active: false },
    { value: 5, active: true },
  ];
  const result = [...takewhile((obj) => !obj.active, objects)];
  assertEquals(result, [
    { value: 1, active: false },
    { value: 2, active: false },
  ]);
});

Deno.test("takewhile() with mixed types before predicate becomes false", () => {
  const result = [
    ...takewhile((x) => typeof x === "number", [1, 2, "hello", 4, "world"]),
  ];
  assertEquals(result, [1, 2]);
});

Deno.test("takewhile() stops at first false and doesn't continue", () => {
  const result = [...takewhile((x) => x !== 3, [1, 2, 3, 1, 2])];
  assertEquals(result, [1, 2]);
});

Deno.test("takewhile() with string iterable", () => {
  const result = [...takewhile((char) => char !== "D", "ABCDEFG")];
  assertEquals(result, ["A", "B", "C"]);
});

Deno.test("takewhile() with generator function", () => {
  function* numbers() {
    yield 1;
    yield 2;
    yield 5;
    yield 3;
    yield 8;
  }

  const result = [...takewhile((x) => x < 5, numbers())];
  assertEquals(result, [1, 2]);
});
