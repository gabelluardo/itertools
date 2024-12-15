import { assertEquals } from "@std/assert";
import { cycle, repeat, count } from "../mod.ts";

Deno.test("cycle returns an iterator", () => {
    const cycler = cycle([1, 2, 3]);
    assertEquals(typeof cycler.next, "function");
    assertEquals(typeof cycler[Symbol.iterator], "function");
});

Deno.test("cycle with single element", () => {
    const cycler = cycle([1]);
    assertEquals(cycler.next().value, 1);
    assertEquals(cycler.next().value, 1);
    assertEquals(cycler.next().value, 1);
});

Deno.test("cycle with different data types", () => {
    const cycler = cycle([1, "two", true]);
    assertEquals(cycler.next().value, 1);
    assertEquals(cycler.next().value, "two");
    assertEquals(cycler.next().value, true);
    assertEquals(cycler.next().value, 1);
});

Deno.test("cycle preserves object references", () => {
    const obj = { test: true };
    const cycler = cycle([obj]);
    assertEquals(cycler.next().value, obj);
    assertEquals(cycler.next().value, obj);
});

Deno.test("count generates arithmetic sequence", () => {
  const counter = count();
  assertEquals(counter.next().value, 0);
  assertEquals(counter.next().value, 1);
  assertEquals(counter.next().value, 2);
});

Deno.test("count with start and step", () => {
  const counter = count(10, 2);
  assertEquals(counter.next().value, 10);
  assertEquals(counter.next().value, 12);
  assertEquals(counter.next().value, 14);
});

Deno.test("count with negative step", () => {
    const counter = count(5, -1);
    assertEquals(counter.next().value, 5);
    assertEquals(counter.next().value, 4);
    assertEquals(counter.next().value, 3);
});

Deno.test("count with floating point step", () => {
    const counter = count(0, 0.5);
    assertEquals(counter.next().value, 0);
    assertEquals(counter.next().value, 0.5);
    assertEquals(counter.next().value, 1.0);
});

Deno.test("count with negative start", () => {
    const counter = count(-5);
    assertEquals(counter.next().value, -5);
    assertEquals(counter.next().value, -4);
    assertEquals(counter.next().value, -3);
});

Deno.test("repeat - zero repetitions", () => {
  const repeater = repeat("test", 0);
  assertEquals(repeater.next().done, true);
});

Deno.test("repeat - null value", () => {
  const repeater = repeat(null, 2);
  assertEquals(repeater.next().value, null);
  assertEquals(repeater.next().value, null);
  assertEquals(repeater.next().done, true);
});

Deno.test("repeat - undefined value", () => {
  const repeater = repeat(undefined, 1);
  assertEquals(repeater.next().value, undefined);
  assertEquals(repeater.next().done, true);
});

Deno.test("repeat - boolean value", () => {
  const repeater = repeat(true, 2);
  assertEquals(repeater.next().value, true);
  assertEquals(repeater.next().value, true);
  assertEquals(repeater.next().done, true);
});

Deno.test("repeat - array value", () => {
  const arr = [1, 2, 3];
  const repeater = repeat(arr, 2);
  assertEquals(repeater.next().value, arr);
  assertEquals(repeater.next().value, arr);
  assertEquals(repeater.next().done, true);
});

Deno.test("repeat - negative times", () => {
  const repeater = repeat("test", -1);
  assertEquals(repeater.next().done, true);
});

Deno.test("repeat - using spread operator", () => {
  const repeater = repeat("x", 3);
  assertEquals([...repeater], ["x", "x", "x"]);
});
