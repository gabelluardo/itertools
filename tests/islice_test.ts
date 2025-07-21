import { assertEquals, assertThrows } from "@std/assert";
import { islice } from "../mod.ts";

Deno.test("islice() with stop only - string", () => {
  const result = [...islice("ABCDEFG", 2)];
  assertEquals(result, ["A", "B"]);
});

Deno.test("islice() with stop only - array", () => {
  const result = [...islice([1, 2, 3, 4, 5], 3)];
  assertEquals(result, [1, 2, 3]);
});

Deno.test("islice() with start and stop", () => {
  const result = [...islice("ABCDEFG", 2, 4)];
  assertEquals(result, ["C", "D"]);
});

Deno.test("islice() with start and stop - array", () => {
  const result = [...islice([1, 2, 3, 4, 5, 6, 7], 2, 5)];
  assertEquals(result, [3, 4, 5]);
});

Deno.test("islice() with start, stop undefined", () => {
  const result = [...islice("ABCDEFG", 2, 7)];
  assertEquals(result, ["C", "D", "E", "F", "G"]);
});

Deno.test("islice() with start, stop, step", () => {
  const result = [...islice("ABCDEFG", 0, 7, 2)];
  assertEquals(result, ["A", "C", "E", "G"]);
});

Deno.test("islice() from start to end", () => {
  const result = [...islice("ABCDEFG", 2, null)];
  assertEquals(result, ["C", "D", "E", "F", "G"]);
});

Deno.test("islice() from start to end with step", () => {
  const result = [...islice("ABCDEFG", 0, null, 2)];
  assertEquals(result, ["A", "C", "E", "G"]);
});

Deno.test("islice() with start, stop, step - array", () => {
  const result = [...islice([1, 2, 3, 4, 5, 6, 7, 8], 1, 7, 2)];
  assertEquals(result, [2, 4, 6]);
});

Deno.test("islice() with step larger than range", () => {
  const result = [...islice("ABCDEF", 1, 4, 10)];
  assertEquals(result, ["B"]);
});

Deno.test("islice() empty iterable", () => {
  const result = [...islice([], 3)];
  assertEquals(result, []);
});

Deno.test("islice() empty iterable with start and stop", () => {
  const result = [...islice([], 1, 3)];
  assertEquals(result, []);
});

Deno.test("islice() stop is 0", () => {
  const result = [...islice("ABCDEF", 0)];
  assertEquals(result, []);
});

Deno.test("islice() start equals stop", () => {
  const result = [...islice("ABCDEF", 2, 2)];
  assertEquals(result, []);
});

Deno.test("islice() start greater than iterable length", () => {
  const result = [...islice("ABC", 5, 10)];
  assertEquals(result, []);
});

Deno.test("islice() stop greater than iterable length", () => {
  const result = [...islice("ABC", 1, 10)];
  assertEquals(result, ["B", "C"]);
});

Deno.test("islice() with generators", () => {
  function* gen() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
  }
  const result = [...islice(gen(), 1, 4)];
  assertEquals(result, [2, 3, 4]);
});

Deno.test("islice() negative start throws error", () => {
  assertThrows(
    () => [...islice("ABCDEF", -1, 3)],
    Error,
    "islice() arguments must be non-negative and step must be positive",
  );
});

Deno.test("islice() negative stop throws error", () => {
  assertThrows(
    () => [...islice("ABCDEF", 1, -1)],
    Error,
    "islice() arguments must be non-negative and step must be positive",
  );
});

Deno.test("islice() zero step throws error", () => {
  assertThrows(
    () => [...islice("ABCDEF", 0, 3, 0)],
    Error,
    "islice() arguments must be non-negative and step must be positive",
  );
});

Deno.test("islice() negative step throws error", () => {
  assertThrows(
    () => [...islice("ABCDEF", 0, 3, -1)],
    Error,
    "islice() arguments must be non-negative and step must be positive",
  );
});

Deno.test("islice() single element with step", () => {
  const result = [...islice("ABCDEF", 2, 3, 1)];
  assertEquals(result, ["C"]);
});

Deno.test("islice() with step = 1 is same as no step", () => {
  const result1 = [...islice("ABCDEF", 1, 4)];
  const result2 = [...islice("ABCDEF", 1, 4, 1)];
  assertEquals(result1, result2);
  assertEquals(result1, ["B", "C", "D"]);
});

Deno.test("islice() with start undefined", () => {
  const result = [...islice("ABCDEF", undefined, 3)];
  assertEquals(result, ["A", "B", "C"]);
});

Deno.test("islice() with start undefined and step", () => {
  const result = [...islice("ABCDEF", undefined, 6, 2)];
  assertEquals(result, ["A", "C", "E"]);
});

Deno.test("islice() with start undefined and stop null", () => {
  const result = [...islice("ABCDEF", undefined, undefined, 2)];
  assertEquals(result, ["A", "C", "E"]);
});
