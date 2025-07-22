import { assertEquals, assertThrows } from "@std/assert";
import { add } from "../src/utils/operators.ts";

Deno.test("add() numbers", () => {
  const result = add(5, 3);
  assertEquals(result, 8);
});

Deno.test("add() negative numbers", () => {
  const result = add(-5, 3);
  assertEquals(result, -2);
});

Deno.test("add() decimal numbers", () => {
  const result = add(2.5, 1.5);
  assertEquals(result, 4);
});

Deno.test("add() strings", () => {
  const result = add("hello", " world");
  assertEquals(result, "hello world");
});

Deno.test("add() empty strings", () => {
  const result = add("", "test");
  assertEquals(result, "test");
});

Deno.test("add() bigint", () => {
  const result = add(BigInt(123), BigInt(456));
  assertEquals(result, BigInt(579));
});

Deno.test("add() large bigint", () => {
  const result = add(BigInt("9007199254740991"), BigInt("1"));
  assertEquals(result, BigInt("9007199254740992"));
});

Deno.test("add() booleans - both true", () => {
  const result = add(true, true);
  assertEquals(result, true);
});

Deno.test("add() booleans - one true, one false", () => {
  const result = add(true, false);
  assertEquals(result, true);
});

Deno.test("add() booleans - both false", () => {
  const result = add(false, false);
  assertEquals(result, false);
});

Deno.test("add() arrays of numbers", () => {
  const result = add([1, 2], [3, 4]);
  assertEquals(result, [1, 2, 3, 4]);
});

Deno.test("add() arrays of strings", () => {
  const result = add(["a", "b"], ["c", "d"]);
  assertEquals(result, ["a", "b", "c", "d"]);
});

Deno.test("add() empty arrays", () => {
  const result = add([], [1, 2]);
  assertEquals(result, [1, 2]);
});

Deno.test("add() mixed arrays", () => {
  const result = add([1, "a"], [true, null]);
  assertEquals(result, [1, "a", true, null]);
});

Deno.test("add() throws for unsupported types - object", () => {
  assertThrows(
    () => add({ a: 1 }, { b: 2 }),
    TypeError,
    "Addition operation not supported for the provided types",
  );
});

Deno.test("add() throws for unsupported types - null", () => {
  assertThrows(
    () => add(null, null),
    TypeError,
    "Addition operation not supported for the provided types",
  );
});

Deno.test("add() throws for unsupported types - undefined", () => {
  assertThrows(
    () => add(undefined, undefined),
    TypeError,
    "Addition operation not supported for the provided types",
  );
});
