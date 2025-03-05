import { assertEquals } from "@std/assert";
import { accumulate } from "../mod.ts";
import { add } from "../src/utils/operators.ts";

Deno.test("accumulate() numbers with default addition", () => {
  const result = [...accumulate([1, 2, 3, 4, 5])];
  assertEquals(result, [1, 3, 6, 10, 15]);
});

Deno.test("accumulate() strings with default concatenation", () => {
  const result = [...accumulate(["a", "b", "c"])];
  assertEquals(result, ["a", "ab", "abc"]);
});

Deno.test("accumulate() empty iterables ", () => {
  const result = [...accumulate([])];
  assertEquals(result, []);
});

Deno.test("accumulate() initial value (number)", () => {
  const result = [...accumulate([1, 2, 3], add, 10)];
  assertEquals(result, [10, 11, 13, 16]);
});

Deno.test("accumulate() initial value (string)", () => {
  const result = [...accumulate(["a", "b", "c"], add, "dd")];
  assertEquals(result, ["dd", "dda", "ddab", "ddabc"]);
});

Deno.test("accumulate() custom function (number)", () => {
  const result = [...accumulate([1, 2, 3, 4], (a, b) => a - b)];
  assertEquals(result, [1, -1, -4, -8]);
});

Deno.test("accumulate() custom function (string)", () => {
  const result = [
    ...accumulate(["a", "b", "c"], (a, b) => [a, b].join("-")),
  ];
  assertEquals(result, ["a", "a-b", "a-b-c"]);
});

Deno.test("accumulate() single item iterables", () => {
  const result = [...accumulate([5])];
  assertEquals(result, [5]);
});
