import { assertEquals } from "@std/assert";
import { filterfalse } from "../mod.ts";

Deno.test("filterfalse() with numbers - filter elements not less than 5", () => {
  const result = [...filterfalse([1, 4, 6, 3, 8], (x) => x < 5)];
  assertEquals(result, [6, 8]);
});

Deno.test("filterfalse() with strings - filter elements with length >= 4", () => {
  const result = [
    ...filterfalse(["a", "bb", "ccc", "dddd", "ee"], (x) => x.length < 4),
  ];
  assertEquals(result, ["dddd"]);
});

Deno.test("filterfalse() with all elements matching predicate", () => {
  const result = [...filterfalse([1, 2, 3, 4, 5], (x) => x < 10)];
  assertEquals(result, []);
});

Deno.test("filterfalse() with no elements matching predicate", () => {
  const result = [...filterfalse([1, 2, 3, 4, 5], (x) => x < 0)];
  assertEquals(result, [1, 2, 3, 4, 5]);
});

Deno.test("filterfalse() with empty iterable", () => {
  const result = [...filterfalse([], (x) => x > 0)];
  assertEquals(result, []);
});

Deno.test("filterfalse() with default predicate - filter truthy values", () => {
  const result = [
    ...filterfalse([0, 1, false, true, "", "hello", null, undefined]),
  ];
  assertEquals(result, [0, false, "", null, undefined]);
});

Deno.test("filterfalse() with boolean values", () => {
  const result = [
    ...filterfalse([false, false, true, false, true], (x) => x === true),
  ];
  assertEquals(result, [false, false, false]);
});

Deno.test("filterfalse() with even numbers", () => {
  const result = [...filterfalse([1, 2, 3, 4, 5, 6, 7, 8], (x) => x % 2 === 0)];
  assertEquals(result, [1, 3, 5, 7]);
});

Deno.test("filterfalse() with complex objects", () => {
  const objects = [
    { value: 1, active: false },
    { value: 2, active: true },
    { value: 3, active: false },
    { value: 4, active: true },
  ];

  const result = [...filterfalse(objects, (obj) => obj.active)];
  assertEquals(result, [
    { value: 1, active: false },
    { value: 3, active: false },
  ]);
});

Deno.test("filterfalse() with single element matching predicate", () => {
  const result = [...filterfalse([3], (x) => x < 5)];
  assertEquals(result, []);
});

Deno.test("filterfalse() with single element not matching predicate", () => {
  const result = [...filterfalse([7], (x) => x < 5)];
  assertEquals(result, [7]);
});

Deno.test("filterfalse() with mixed types and default predicate", () => {
  const result = [
    ...filterfalse([0, "hello", false, 42, "", true, null]),
  ];
  assertEquals(result, [0, false, "", null]);
});
