import { permutations } from "../mod.ts";

// Small input benchmarks
Deno.bench("permutations new (small)", {
  group: "permutations small",
  baseline: true,
}, () => {
  for (const _ of permutations(Array(5), 3));
});

Deno.bench("permutations old (small)", {
  group: "permutations small",
}, () => {
  for (const _ of permutations1(Array(5), 3));
});

// Medium input benchmarks
Deno.bench("permutations new (medium)", {
  group: "permutations medium",
  baseline: true,
}, () => {
  for (const _ of permutations(Array(10), 8));
});

Deno.bench("permutations old (medium)", {
  group: "permutations medium",
}, () => {
  for (const _ of permutations1(Array(10), 8));
});

// Large input benchmarks
Deno.bench("permutations new (large)", {
  group: "permutations large",
  baseline: true,
}, () => {
  for (const _ of permutations(Array(11), 10));
});

Deno.bench("permutations old (large)", {
  group: "permutations large",
}, () => {
  for (const _ of permutations1(Array(11), 10));
});

function* permutations1<T>(
  iterable: Iterable<T>,
  r?: number,
): Generator<T[]> {
  const pool = [...iterable];
  const n = pool.length;
  if (r === undefined) {
    // biome-ignore lint/style/noParameterAssign: <explanation>
    r = n;
  } else if (!Number.isInteger(r) || r < 0) {
    throw RangeError("r must be a non-negative integer");
  } else if (r > n) {
    return;
  }
  const cycles = Array(r).fill(0).map((_, index) => n - index);
  const indices = new Uint32Array(n).map((_, index) => index);
  yield pool.slice(0, r);
  while (true) {
    // biome-ignore lint/suspicious/noConfusingLabels: <explanation>
    loop: {
      for (let i = r - 1; i >= 0; i--) {
        cycles[i] -= 1;
        if (cycles[i] === 0) {
          let index = indices[i];
          for (let j = n - 1; j >= i; j--) {
            const temp = index;
            index = indices[j];
            indices[j] = temp;
          }
          cycles[i] = n - i;
        } else {
          const j = n - cycles[i];
          const temp = indices[i];
          indices[i] = indices[j];
          indices[j] = temp;
          const result = Array(r);
          for (i = 0; i < r; i++) {
            result[i] = pool[indices[i]];
          }
          yield result;
          break loop;
        }
      }
      return;
    }
  }
}
