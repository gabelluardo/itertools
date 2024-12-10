// import { combinationsWithReplacement } from "../mod.ts";

// // Small input benchmarks
// Deno.bench("combinationsWithReplacement new (small)", {
//   group: "combinationsWithReplacement small",
//   baseline: true,
// }, () => {
//   for (const _ of combinationsWithReplacement(Array(5), 3));
// });

// Deno.bench("combinationsWithReplacement old (small)", {
//   group: "combinationsWithReplacement small",
// }, () => {
//   for (const _ of combinationsWithReplacement1(Array(5), 3));
// });

// // Medium input benchmarks
// Deno.bench("combinationsWithReplacement new (medium)", {
//   group: "combinationsWithReplacement medium",
//   baseline: true,
// }, () => {
//   for (const _ of combinationsWithReplacement(Array(14), 11));
// });

// Deno.bench("combinationsWithReplacement old (medium)", {
//   group: "combinationsWithReplacement medium",
// }, () => {
//   for (const _ of combinationsWithReplacement1(Array(14), 11));
// });

// // Large input benchmarks
// Deno.bench("combinationsWithReplacement new (large)", {
//   group: "combinationsWithReplacement large",
//   baseline: true,
// }, () => {
//   for (const _ of combinationsWithReplacement(Array(20), 15));
// });

// Deno.bench("combinationsWithReplacement old (large)", {
//   group: "combinationsWithReplacement large",
// }, () => {
//   for (const _ of combinationsWithReplacement1(Array(20), 15));
// });

// function* combinationsWithReplacement1<T>(
//   iterable: Iterable<T>,
//   r: number,
// ): Generator<T[]> {
//   if (!Number.isInteger(r) || r < 0) {
//     throw RangeError("r must be a non-negative integer");
//   }
//   const pool = [...iterable];
//   const n = pool.length;
//   if (n === 0 && r > 0) {
//     return;
//   }
//   const indices = new Uint32Array(r);
//   yield Array(r).fill(pool[0]);
//   while (true) {
//     let i: number;
//     // biome-ignore lint/suspicious/noConfusingLabels: <explanation>
//     loop: {
//       for (i = r - 1; i >= 0; i--) {
//         if (indices[i] !== n - 1) {
//           break loop;
//         }
//       }
//       return;
//     }
//     const result: T[] = Array(r);
//     for (let j = 0; j < i; j++) {
//       result[j] = pool[indices[j]];
//     }
//     const index = indices[i] + 1;
//     const element = pool[index];
//     for (let j = i; j < r; j++) {
//       indices[j] = index;
//       result[j] = element;
//     }
//     yield result;
//   }
// }
