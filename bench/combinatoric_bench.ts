import {
  combinations,
  combinationsWithReplacement,
  permutations,
  permutationsWithReplacement,
  product,
} from "../mod.ts";

Deno.bench("combinationsWithReplacement() (small)", () => {
  for (const _ of combinationsWithReplacement(Array(5), 3));
});

Deno.bench("combinationsWithReplacement() (medium)", () => {
  for (const _ of combinationsWithReplacement(Array(6), 5));
});

Deno.bench("combinationsWithReplacement() (large)", () => {
  for (const _ of combinationsWithReplacement(Array(10), 6));
});

Deno.bench("permutationsWithReplacement() (small)", () => {
  for (const _ of permutationsWithReplacement(Array(5), 3));
});

Deno.bench("permutationsWithReplacement() (medium)", () => {
  for (const _ of permutationsWithReplacement(Array(6), 5));
});

Deno.bench("permutationsWithReplacement() (large)", () => {
  for (const _ of permutationsWithReplacement(Array(10), 6));
});

Deno.bench("combinations() (small)", () => {
  for (const _ of combinations(Array(5), 3));
});

Deno.bench("combinations() (medium)", () => {
  for (const _ of combinations(Array(10), 8));
});

Deno.bench("combinations() (large)", () => {
  for (const _ of combinations(Array(11), 10));
});

Deno.bench("permutations() (small)", () => {
  for (const _ of permutations(Array(5), 3));
});

Deno.bench("permutations() (medium)", () => {
  for (const _ of permutations(Array(10), 8));
});

Deno.bench("permutations() (large)", () => {
  for (const _ of permutations(Array(11), 10));
});

Deno.bench("product() (small)", () => {
  for (const _ of product([...Array(3).fill(Array(14))]));
});

Deno.bench("product() (medium)", () => {
  for (const _ of product([...Array(5).fill(Array(10))]));
});

Deno.bench("product() (large)", () => {
  for (const _ of product([...Array(7).fill(Array(10))]));
});
