import { permutationsWithReplacement } from "../mod.ts";

// Small input benchmarks
Deno.bench("permutationsWithReplacement new (small)", {
  group: "permutationsWithReplacement small",
  baseline: true,
}, () => {
  for (const _ of permutationsWithReplacement(Array(5), 3));
});

Deno.bench("permutationsWithReplacement old (small)", {
  group: "permutationsWithReplacement small",
}, () => {
  for (const _ of permutationsWithReplacement1(Array(5), 3));
});

// Medium input benchmarks
Deno.bench("permutationsWithReplacement new (medium)", {
  group: "permutationsWithReplacement medium",
  baseline: true,
}, () => {
  for (const _ of permutationsWithReplacement(Array(6), 5));
});

Deno.bench("permutationsWithReplacement old (medium)", {
  group: "permutationsWithReplacement medium",
}, () => {
  for (const _ of permutationsWithReplacement1(Array(6), 5));
});

// Large input benchmarks
Deno.bench("permutationsWithReplacement new (large)", {
  group: "permutationsWithReplacement large",
  baseline: true,
}, () => {
  for (const _ of permutationsWithReplacement(Array(10), 6));
});

Deno.bench("permutationsWithReplacement old (large)", {
  group: "permutationsWithReplacement large",
}, () => {
  for (const _ of permutationsWithReplacement1(Array(10), 6));
});

function* permutationsWithReplacement1<T>(
  iterable: Iterable<T>,
  r: number,
): Generator<T[]> {
  if (!Number.isInteger(r) || r < 0) {
    throw RangeError("r must be a non-negative integer");
  }
  const pool = [...iterable];
  const n = pool.length;
  if (r === 0) {
    yield [];
    return;
  }
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
        if (indices[i] === n - 1) {
          continue;
        }
        const result: T[] = Array(r);
        for (let j = 0; j < i; j++) {
          result[j] = pool[indices[j]];
        }
        // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
        const index = indices[i] += 1;
        result[i] = pool[index];
        for (let j = i + 1; j < r; j++) {
          indices[j] = 0;
          result[j] = pool[0];
        }
        yield result;
        break loop;
      }
      return;
    }
  }
}
