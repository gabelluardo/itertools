import { assertEquals } from "@std/assert/equals";
import {
  combinations,
  combinationsWithReplacement,
} from "../src/combinations.ts";

// Small input benchmarks
Deno.bench("combinations new (small)", {
  group: "combinations small",
  baseline: true,
}, () => {
  for (const _ of combinations(Array(5), 3));
});

Deno.bench("combinations old (small)", {
  group: "combinations small",
}, () => {
  for (const _ of combinations1(Array(5), 3));
});

// Medium input benchmarks
Deno.bench("combinations new (medium)", {
  group: "combinations medium",
  baseline: true,
}, () => {
  for (const _ of combinations(Array(14), 11));
});

Deno.bench("combinations old (medium)", {
  group: "combinations medium",
}, () => {
  for (const _ of combinations1(Array(14), 11));
});

// Large input benchmarks
Deno.bench("combinations new (large)", {
  group: "combinations large",
  baseline: true,
}, () => {
  for (const _ of combinations(Array(20), 15));
});

Deno.bench("combinations old (large)", {
  group: "combinations large",
}, () => {
  for (const _ of combinations1(Array(20), 15));
});

// Deno.bench("combinationsWithReplacement new", {
//   group: "combinations with replacement",
//   baseline: true,
// }, () => {
//   for (const _ of combinationsWithReplacement(Array(14), 11));
// });

// Deno.bench("combinationsWithReplacement old", {
//   group: "combinations with replacement",
// }, () => {
//   for (const _ of combinationsWithReplacement1(Array(14), 11));
// });

export function* combinations1<T>(
  iterable: Iterable<T>,
  r: number,
): Generator<T[]> {
  if (!Number.isInteger(r) || r < 0) {
    throw RangeError("r must be a non-negative integer");
  }
  const pool = [...iterable];
  const n = pool.length;
  if (r > n) {
    return;
  }
  const indices = new Uint32Array(r).map((_, index) => index);
  yield pool.slice(0, r);
  while (true) {
    let i: number;
    // biome-ignore lint/suspicious/noConfusingLabels: <explanation>
    loop: {
      for (i = r - 1; i >= 0; i--) {
        if (indices[i] !== i + n - r) {
          break loop;
        }
      }
      return;
    }
    const result: T[] = Array(r);
    for (let j = 0; j < i; j++) {
      result[j] = pool[indices[j]];
    }
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    let index = indices[i] += 1;
    result[i] = pool[index];
    for (let j = i + 1; j < r; j++) {
      indices[j] = index += 1;
      result[j] = pool[index];
    }
    yield result;
  }
}

function* combinationsWithReplacement1<T>(
  iterable: Iterable<T>,
  r: number,
): Generator<T[]> {
  if (!Number.isInteger(r) || r < 0) {
    throw RangeError("r must be a non-negative integer");
  }
  const pool = [...iterable];
  const n = pool.length;
  if (n === 0 && r > 0) {
    return;
  }
  const indices = new Uint32Array(r);
  yield Array(r).fill(pool[0]);
  while (true) {
    let i: number;
    // biome-ignore lint/suspicious/noConfusingLabels: <explanation>
    loop: {
      for (i = r - 1; i >= 0; i--) {
        if (indices[i] !== n - 1) {
          break loop;
        }
      }
      return;
    }
    const result: T[] = Array(r);
    for (let j = 0; j < i; j++) {
      result[j] = pool[indices[j]];
    }
    const index = indices[i] + 1;
    const element = pool[index];
    for (let j = i; j < r; j++) {
      indices[j] = index;
      result[j] = element;
    }
    yield result;
  }
}
