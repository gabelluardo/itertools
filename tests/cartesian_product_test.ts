// import { assertEquals, assertStrictEquals, range } from "./utils.ts";
// import { cartesianProduct } from "../cartesian_product.ts";

// Deno.test("no iterables", () => {
//   const actual = [...cartesianProduct()];
//   assertEquals(actual, [[]]);
// });

// Deno.test("one iterable", () => {
//   const actual = [...cartesianProduct("abc")];
//   const expected = [["a"], ["b"], ["c"]];
//   assertEquals(actual, expected);
// });

// Deno.test("iterables of varying length", () => {
//   const actual = [...cartesianProduct([1], [2, 3, 4], [5, 6])];
//   const expected = [
//     [1, 2, 5],
//     [1, 2, 6],
//     [1, 3, 5],
//     [1, 3, 6],
//     [1, 4, 5],
//     [1, 4, 6],
//   ];
//   assertEquals(actual, expected);
// });

// Deno.test("iterables with empty", () => {
//   const actual = [...cartesianProduct([1, 2, 3], [], [4, 5, 6])];
//   assertEquals(actual, []);
// });

// Deno.test("r = 65_537", () => {
//   const actual = [...cartesianProduct(range(65_537))];
//   const expected = Array(65_537).fill(undefined).map((_, i) => [i]);
//   assertEquals(actual, expected);
// });

// Deno.test("multiple data types", () => {
//   const actual = [...cartesianProduct(range(3), ["a", "b", "c"], [1n])];
//   const expected = [
//     [0, "a", 1n],
//     [0, "b", 1n],
//     [0, "c", 1n],
//     [1, "a", 1n],
//     [1, "b", 1n],
//     [1, "c", 1n],
//     [2, "a", 1n],
//     [2, "b", 1n],
//     [2, "c", 1n],
//   ];
//   assertEquals(
//     actual,
//     expected,
//   );
// });

// Deno.test("arbitrary amount of data types", () => {
//   // deno-fmt-ignore
//   const actual =
