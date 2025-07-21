import { assertEquals } from "@std/assert";
import { filterfalse } from "../mod.ts";

Deno.test("filterfalse() with numbers - filter elements not less than 5", () => {
  const result = [...filterfalse((x) => x < 5, [1, 4, 6, 3, 8])];
  assertEquals(result, [6, 8]);
});

Deno.test("filterfalse() with strings - filter elements with length >= 4", () => {
  const result = [
    ...filterfalse((x) => x.length < 4, ["a", "bb", "ccc", "dddd", "ee"]),
  ];
  assertEquals(result, ["dddd"]);
});

Deno.test("filterfalse() with all elements matching predicate", () => {
  const result = [...filterfalse((x) => x < 10, [1, 2, 3, 4, 5])];
  assertEquals(result, []);
});

Deno.test("filterfalse() with no elements matching predicate", () => {
  const result = [...filterfalse((x) => x < 0, [1, 2, 3, 4, 5])];
  assertEquals(result, [1, 2, 3, 4, 5]);
});

Deno.test("filterfalse() with empty iterable", () => {
  const result = [...filterfalse((x) => x > 0, [])];
  assertEquals(result, []);
});

Deno.test("filterfalse() with null predicate - filter truthy values", () => {
  const result = [
    ...filterfalse(null, [0, 1, false, true, "", "hello", null, undefined]),
  ];
  assertEquals(result, [0, false, "", null, undefined]);
});

Deno.test("filterfalse() with boolean values", () => {
  const result = [
    ...filterfalse((x) => x === true, [false, false, true, false, true]),
  ];
  assertEquals(result, [false, false, false]);
});

Deno.test("filterfalse() with even numbers", () => {
  const result = [...filterfalse((x) => x % 2 === 0, [1, 2, 3, 4, 5, 6, 7, 8])];
  assertEquals(result, [1, 3, 5, 7]);
});

Deno.test("filterfalse() with complex objects", () => {
  const objects = [
    { value: 1, active: false },
    { value: 2, active: true },
    { value: 3, active: false },
    { value: 4, active: true },
  ];

  const result = [...filterfalse((obj) => obj.active, objects)];
  assertEquals(result, [
    { value: 1, active: false },
    { value: 3, active: false },
  ]);
});

Deno.test("filterfalse() with single element matching predicate", () => {
  const result = [...filterfalse((x) => x < 5, [3])];
  assertEquals(result, []);
});

Deno.test("filterfalse() with single element not matching predicate", () => {
  const result = [...filterfalse((x) => x < 5, [7])];
  assertEquals(result, [7]);
});

Deno.test("filterfalse() with mixed types and null predicate", () => {
  const result = [
    ...filterfalse(null, [0, "hello", false, 42, "", true, null]),
  ];
  assertEquals(result, [0, false, "", null]);
});
