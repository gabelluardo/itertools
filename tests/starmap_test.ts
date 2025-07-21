import { assertEquals } from "@std/assert";
import { starmap } from "../mod.ts";

Deno.test("starmap() with Math.pow", () => {
  const result = [...starmap(Math.pow, [[2, 5], [3, 2], [10, 3]])];
  assertEquals(result, [32, 9, 1000]);
});

Deno.test("starmap() with addition function", () => {
  const result = [...starmap((a, b) => a + b, [[1, 2], [3, 4], [5, 6]])];
  assertEquals(result, [3, 7, 11]);
});

Deno.test("starmap() with multiplication function", () => {
  const result = [...starmap((x, y) => x * y, [[2, 3], [4, 5], [6, 7]])];
  assertEquals(result, [6, 20, 42]);
});

Deno.test("starmap() with three arguments", () => {
  const result = [
    ...starmap((a, b, c) => a + b + c, [[1, 2, 3], [4, 5, 6], [7, 8, 9]]),
  ];
  assertEquals(result, [6, 15, 24]);
});

Deno.test("starmap() with string concatenation", () => {
  const result = [
    ...starmap((a, b) => a + b, [["Hello", " World"], ["Foo", " Bar"]]),
  ];
  assertEquals(result, ["Hello World", "Foo Bar"]);
});

Deno.test("starmap() with Math.max", () => {
  const result = [...starmap(Math.max, [[1, 2, 3], [4, 5], [6, 7, 8, 9]])];
  assertEquals(result, [3, 5, 9]);
});

Deno.test("starmap() with Math.min", () => {
  const result = [...starmap(Math.min, [[1, 2, 3], [4, 5], [6, 7, 8, 9]])];
  assertEquals(result, [1, 4, 6]);
});

Deno.test("starmap() with empty iterable", () => {
  const result = [...starmap((a, b) => a + b, [])];
  assertEquals(result, []);
});

Deno.test("starmap() with single tuple", () => {
  const result = [...starmap((a, b) => a * b, [[3, 4]])];
  assertEquals(result, [12]);
});

Deno.test("starmap() with custom object creation", () => {
  const result = [
    ...starmap((name, age) => ({ name, age }), [["Alice", 30], ["Bob", 25]]),
  ];
  assertEquals(result, [{ name: "Alice", age: 30 }, { name: "Bob", age: 25 }]);
});

Deno.test("starmap() with boolean logic", () => {
  const result = [
    ...starmap((a, b) => a && b, [[true, true], [true, false], [false, true]]),
  ];
  assertEquals(result, [true, false, false]);
});

Deno.test("starmap() with array destructuring", () => {
  const result = [
    ...starmap((first, ...rest) => [first, rest.length], [["a", "b", "c"], [
      "x",
      "y",
    ]]),
  ];
  assertEquals(result, [["a", 2], ["x", 1]]);
});
