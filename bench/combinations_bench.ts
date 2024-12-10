// import { combinations } from "../mod.ts";

// // Small input benchmarks
// Deno.bench("combinations new (small)", {
//   group: "combinations small",
//   baseline: true,
// }, () => {
//   for (const _ of combinations(Array(5), 3));
// });

// Deno.bench("combinations old (small)", {
//   group: "combinations small",
// }, () => {
//   for (const _ of combinations1(Array(5), 3));
// });

// // Medium input benchmarks
// Deno.bench("combinations new (medium)", {
//   group: "combinations medium",
//   baseline: true,
// }, () => {
//   for (const _ of combinations(Array(14), 11));
// });

// Deno.bench("combinations old (medium)", {
//   group: "combinations medium",
// }, () => {
//   for (const _ of combinations1(Array(14), 11));
// });

// // Large input benchmarks
// Deno.bench("combinations new (large)", {
//   group: "combinations large",
//   baseline: true,
// }, () => {
//   for (const _ of combinations(Array(20), 15));
// });

// Deno.bench("combinations old (large)", {
//   group: "combinations large",
// }, () => {
//   for (const _ of combinations1(Array(20), 15));
// });

// export function* combinations1<T>(
//   iterable: Iterable<T>,
//   r: number,
// ): Generator<T[]> {
//   if (!Number.isInteger(r) || r < 0) {
//     throw RangeError("r must be a non-negative integer");
//   }
//   const pool = [...iterable];
//   const n = pool.length;
//   if (r > n) {
//     return;
//   }
//   const indices = new Uint32Array(r).map((_, index) => index);
//   yield pool.slice(0, r);
//   while (true) {
//     let i: number;
//     // biome-ignore lint/suspicious/noConfusingLabels: <explanation>
//     loop: {
//       for (i = r - 1; i >= 0; i--) {
//         if (indices[i] !== i + n - r) {
//           break loop;
//         }
//       }
//       return;
//     }
//     const result: T[] = Array(r);
//     for (let j = 0; j < i; j++) {
//       result[j] = pool[indices[j]];
//     }
//     // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
//     let index = indices[i] += 1;
//     result[i] = pool[index];
//     for (let j = i + 1; j < r; j++) {
//       indices[j] = index += 1;
//       result[j] = pool[index];
//     }
//     yield result;
//   }
// }
