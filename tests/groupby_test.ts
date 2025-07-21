import { assertEquals } from "@std/assert";
import { groupby } from "../mod.ts";

Deno.test("groupby() with string - basic grouping", () => {
  const result: [string, string[]][] = [];
  for (const [key, group] of groupby("AAAABBBCCD")) {
    result.push([key, [...group]]);
  }
  assertEquals(result, [
    ["A", ["A", "A", "A", "A"]],
    ["B", ["B", "B", "B"]],
    ["C", ["C", "C"]],
    ["D", ["D"]],
  ]);
});

Deno.test("groupby() with numbers - basic grouping", () => {
  const result: [number, number[]][] = [];
  for (const [key, group] of groupby([1, 1, 2, 2, 2, 3, 3, 1])) {
    result.push([key, [...group]]);
  }
  assertEquals(result, [
    [1, [1, 1]],
    [2, [2, 2, 2]],
    [3, [3, 3]],
    [1, [1]],
  ]);
});

Deno.test("groupby() with custom key function - Math.floor", () => {
  const data = [1.1, 1.2, 2.1, 2.2, 3.1];
  const result: [number, number[]][] = [];
  for (const [key, group] of groupby(data, Math.floor)) {
    result.push([key, [...group]]);
  }
  assertEquals(result, [
    [1, [1.1, 1.2]],
    [2, [2.1, 2.2]],
    [3, [3.1]],
  ]);
});

Deno.test("groupby() with custom key function - string length", () => {
  const words = ["a", "bb", "cc", "ddd", "eee", "f"];
  const result: [number, string[]][] = [];
  for (const [key, group] of groupby(words, (x) => x.length)) {
    result.push([key, [...group]]);
  }
  assertEquals(result, [
    [1, ["a"]],
    [2, ["bb", "cc"]],
    [3, ["ddd", "eee"]],
    [1, ["f"]],
  ]);
});

Deno.test("groupby() with empty iterable", () => {
  const groups = [...groupby([])];
  assertEquals(groups, []);
});

Deno.test("groupby() with single element", () => {
  const result: [number, number[]][] = [];
  for (const [key, group] of groupby([42])) {
    result.push([key, [...group]]);
  }
  assertEquals(result, [[42, [42]]]);
});

Deno.test("groupby() with boolean values", () => {
  const data = [true, true, false, false, false, true];
  const result: [boolean, boolean[]][] = [];
  for (const [key, group] of groupby(data)) {
    result.push([key, [...group]]);
  }
  assertEquals(result, [
    [true, [true, true]],
    [false, [false, false, false]],
    [true, [true]],
  ]);
});

Deno.test("groupby() with objects - grouping by property", () => {
  const people = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 25 },
    { name: "Charlie", age: 30 },
    { name: "David", age: 30 },
    { name: "Eve", age: 25 },
  ];

  const result: [number, string[]][] = [];
  for (const [key, group] of groupby(people, (person) => person.age)) {
    result.push([key, [...group].map((p) => p.name)]);
  }
  assertEquals(result, [
    [25, ["Alice", "Bob"]],
    [30, ["Charlie", "David"]],
    [25, ["Eve"]],
  ]);
});

Deno.test("groupby() - partial consumption of groups", () => {
  const data = "AAAABBBCCD";

  // Consume only the first element of each group
  const firstElements: [string, string][] = [];
  for (const [key, group] of groupby(data)) {
    const iterator = group[Symbol.iterator]();
    firstElements.push([key, iterator.next().value]);
  }

  assertEquals(firstElements, [
    ["A", "A"],
    ["B", "B"],
    ["C", "C"],
    ["D", "D"],
  ]);
});

Deno.test("groupby() - keys only", () => {
  const data = "AAAABBBCCDAABBB";
  const keys: string[] = [];
  for (const [key, group] of groupby(data)) {
    keys.push(key);
    // Consume the group to move to the next one
    for (const _ of group) {
      // Intentionally empty - just consuming the iterator
    }
  }
  assertEquals(keys, ["A", "B", "C", "D", "A", "B"]);
});

Deno.test("groupby() with mixed types using string conversion", () => {
  const data = [1, "1", 2, "2", "2", 3];
  const result: [string, (string | number)[]][] = [];
  for (const [key, group] of groupby(data, String)) {
    result.push([key, [...group]]);
  }
  assertEquals(result, [
    ["1", [1, "1"]],
    ["2", [2, "2", "2"]],
    ["3", [3]],
  ]);
});

Deno.test("groupby() - stress test with large groups", () => {
  const data = Array(1000).fill("A").concat(Array(1000).fill("B"));

  let groupCount = 0;
  let firstGroupSize = 0;
  let secondGroupSize = 0;

  for (const [key, group] of groupby(data)) {
    groupCount++;
    if (groupCount === 1) {
      assertEquals(key, "A");
      for (const _ of group) {
        firstGroupSize++;
      }
    } else if (groupCount === 2) {
      assertEquals(key, "B");
      for (const _ of group) {
        secondGroupSize++;
      }
    }
  }

  assertEquals(groupCount, 2);
  assertEquals(firstGroupSize, 1000);
  assertEquals(secondGroupSize, 1000);
});

Deno.test("groupby() - lazy behavior demonstration", () => {
  let consumedItems = 0;

  function* countingIterable() {
    for (let i = 0; i < 10; i++) {
      consumedItems++;
      yield Math.floor(i / 3);
    }
  }

  const grouped = groupby(countingIterable());
  const firstGroup = grouped[Symbol.iterator]().next().value;

  // At this point, only the first item should have been consumed
  assertEquals(consumedItems, 1);

  if (firstGroup) {
    const [key, group] = firstGroup;
    assertEquals(key, 0);

    // Consume the first group partially
    const groupIterator = group[Symbol.iterator]();
    assertEquals(groupIterator.next().value, 0); // First item already yielded
    assertEquals(groupIterator.next().value, 0); // Second item

    // The implementation may consume one more item to check if the group continues
    assertEquals(consumedItems, 2);
  }
});

Deno.test("groupby() - demonstrates shared iterator behavior", () => {
  const data = "AABBCC";
  const groups = [...groupby(data)];

  // This test shows that once we collect all groups,
  // the individual group iterators become exhausted
  // because they share the underlying iterator

  assertEquals(groups.length, 3);
  assertEquals(groups[0][0], "A");
  assertEquals(groups[1][0], "B");
  assertEquals(groups[2][0], "C");

  // Since the iterator was already consumed when creating the groups array,
  // the group iterators are now exhausted
  assertEquals([...groups[0][1]], []);
  assertEquals([...groups[1][1]], []);
  assertEquals([...groups[2][1]], []);
});
