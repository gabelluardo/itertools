import { assertEquals, assertThrows } from "@std/assert";
import { tee } from "../mod.ts";

Deno.test("tee() basic usage with default n=2", () => {
  const [iter1, iter2] = tee([1, 2, 3, 4]);

  const result1 = [...iter1];
  const result2 = [...iter2];

  assertEquals(result1, [1, 2, 3, 4]);
  assertEquals(result2, [1, 2, 3, 4]);
});

Deno.test("tee() with custom n=3", () => {
  const [a, b, c] = tee("ABC", 3);

  assertEquals([...a], ["A", "B", "C"]);
  assertEquals([...b], ["A", "B", "C"]);
  assertEquals([...c], ["A", "B", "C"]);
});

Deno.test("tee() with n=0", () => {
  const result = tee([1, 2, 3], 0);
  assertEquals(result, []);
});

Deno.test("tee() with n=1", () => {
  const [iter] = tee([1, 2, 3], 1);
  assertEquals([...iter], [1, 2, 3]);
});

Deno.test("tee() with large n", () => {
  const iterators = tee([1, 2], 5);
  assertEquals(iterators.length, 5);

  for (const iter of iterators) {
    assertEquals([...iter], [1, 2]);
  }
});

Deno.test("tee() with empty iterable", () => {
  const [iter1, iter2] = tee([]);

  assertEquals([...iter1], []);
  assertEquals([...iter2], []);
});

Deno.test("tee() independent iteration", () => {
  const [iter1, iter2] = tee([1, 2, 3, 4, 5]);

  // Advance iter1 partially
  assertEquals(iter1.next().value, 1);
  assertEquals(iter1.next().value, 2);

  // iter2 should still start from beginning
  assertEquals([...iter2], [1, 2, 3, 4, 5]);

  // Continue with iter1
  assertEquals([...iter1], [3, 4, 5]);
});

Deno.test("tee() different iteration speeds", () => {
  const [fast, slow] = tee([1, 2, 3, 4]);

  // Fast iterator consumes all
  const fastResult = [...fast];
  assertEquals(fastResult, [1, 2, 3, 4]);

  // Slow iterator should still work
  const slowResult = [...slow];
  assertEquals(slowResult, [1, 2, 3, 4]);
});

Deno.test("tee() with string iterable", () => {
  const [iter1, iter2] = tee("hello");

  assertEquals([...iter1], ["h", "e", "l", "l", "o"]);
  assertEquals([...iter2], ["h", "e", "l", "l", "o"]);
});

Deno.test("tee() nested calls (flattening)", () => {
  const [iter1] = tee([1, 2, 3], 1);
  const [iter2, iter3] = tee(iter1, 2);

  assertEquals([...iter2], [1, 2, 3]);
  assertEquals([...iter3], [1, 2, 3]);
});

Deno.test("tee() with Set", () => {
  const set = new Set([1, 2, 3]);
  const [iter1, iter2] = tee(set);

  assertEquals([...iter1], [1, 2, 3]);
  assertEquals([...iter2], [1, 2, 3]);
});

Deno.test("tee() with Map values", () => {
  const map = new Map([["a", 1], ["b", 2], ["c", 3]]);
  const [iter1, iter2] = tee(map.values());

  assertEquals([...iter1], [1, 2, 3]);
  assertEquals([...iter2], [1, 2, 3]);
});

Deno.test("tee() error handling - negative n", () => {
  assertThrows(
    () => tee([1, 2, 3], -1),
    Error,
    "n must be non-negative",
  );
});

Deno.test("tee() peekable pattern", () => {
  const [iterator] = tee("abcdef", 1);

  // Move iterator forward
  assertEquals(iterator.next().value, "a");

  // Create a forked iterator to peek ahead
  const [forked] = tee(iterator, 1);
  const peekedValue = forked.next().value;
  assertEquals(peekedValue, "b");

  // Continue moving forward with original iterator
  assertEquals(iterator.next().value, "b");
});

Deno.test("tee() iterators are truly independent", () => {
  const [iter1, iter2, iter3] = tee([10, 20, 30, 40], 3);

  // Different consumption patterns
  assertEquals(iter1.next().value, 10);
  assertEquals(iter2.next().value, 10);
  assertEquals(iter2.next().value, 20);
  assertEquals(iter3.next().value, 10);
  assertEquals(iter1.next().value, 20);
  assertEquals(iter3.next().value, 20);
  assertEquals(iter3.next().value, 30);

  // Complete remaining
  assertEquals([...iter1], [30, 40]);
  assertEquals([...iter2], [30, 40]);
  assertEquals([...iter3], [40]);
});

Deno.test("tee() with generator function", () => {
  function* gen() {
    yield 1;
    yield 2;
    yield 3;
  }

  const [iter1, iter2] = tee(gen());

  assertEquals([...iter1], [1, 2, 3]);
  assertEquals([...iter2], [1, 2, 3]);
});
