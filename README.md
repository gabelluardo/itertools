# itertools

<!-- [![docs](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/combinatorics/mod.ts) -->

[![Built with the Deno Standard Library](https://img.shields.io/badge/Built_with_std-blue?logo=deno)](https://jsr.io/@std)
[![jsr.io/@gabelluardo/itertools](https://jsr.io/badges/@gabelluardo/itertools)](https://jsr.io/@gabelluardo/itertools)
[![jsr.io/@gabelluardo/itertools score](https://jsr.io/badges/@gabelluardo/itertools/score)](https://jsr.io/@gabelluardo/itertools)
[![codecov](https://codecov.io/github/gabelluardo/itertools/graph/badge.svg?token=9P9T76RVCY)](https://codecov.io/github/gabelluardo/itertools)
[![ci](https://github.com/gabelluardo/itertools/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/gabelluardo/itertools/actions/workflows/ci.yml)

This module provides generators for iterating subsets of an input. It is heavily
inspired by the combinatorial iterators provided by the
[itertools](https://docs.python.org/3/library/itertools.html) package from the
`Python` standard library.

- All generators are importable on their own.
- These implementations do not build up intermediate results in memory.
- All functions iterate subsets lexicographically according to their input
  indices. If the input is sorted the output will be too.
- Likewise, whether the input elements are unique or not does not matter.
- The inputs provided are not modified, however, consumable iterables will be
  consumed.

## Usage

### Simple Combinations

Returns `r-length` subsequences of elements from the input `iterable`. Order of
selection does not matter and elements are chosen without replacement.

```ts
import { assertEquals } from "@std/assert";
import { combinations } from "jsr:@gabelluardo/itertools";

const sequences = [...combinations([1, 2, 3, 4], 2)];

assertEquals(sequences, [
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 3],
  [2, 4],
  [3, 4],
]);
```

### Simple Permutations

Returns successive `r-length` permutations of elements from the `iterable`.

<!-- deno-fmt-ignore -->

```ts
import { assertEquals } from "@std/assert";
import { permutations } from "jsr:@gabelluardo/itertools";

const sequences = [...permutations([1, 2, 3, 4], 2)];

assertEquals(sequences, [
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 1],
  [2, 3],
  [2, 4],
  [3, 1],
  [3, 2],
  [3, 4],
  [4, 1],
  [4, 2],
  [4, 3],
]);
```

### Combinations with Replacement

Returns `r-length` subsequences of elements from the input `iterable` allowing
individual elements to be repeated more than once.

```ts
import { assertEquals } from "@std/assert";
import { combinationsWithReplacement } from "jsr:@gabelluardo/itertools";

const sequences = [...combinationsWithReplacement([1, 2, 3, 4], 2)];

assertEquals(sequences, [
  [1, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 2],
  [2, 3],
  [2, 4],
  [3, 3],
  [3, 4],
  [4, 4],
]);
```

### Permutations with Replacement

Returns successive `r-length` permutations of elements from the `iterable`
allowing individual elements to be repeated more than once.

<!-- deno-fmt-ignore -->

```ts
import { assertEquals } from "@std/assert";
import { permutationsWithReplacement } from "jsr:@gabelluardo/itertools";

const sequences = [...permutationsWithReplacement([1, 2, 3, 4], 2)];

assertEquals(sequences, [
  [1, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 1],
  [2, 2],
  [2, 3],
  [2, 4],
  [3, 1],
  [3, 2],
  [3, 3],
  [3, 4],
  [4, 1],
  [4, 2],
  [4, 3],
  [4, 4],
]);
```

### Cartesian Product

Generates the Cartesian product of input iterables. Roughly equivalent to nested
`for...of` loops, where each loop uses one of the inputs to provide the element
at the corresponding position in the yielded `Array`.

```ts
import { assertEquals } from "@std/assert";
import { product } from "jsr:@gabelluardo/itertools";

const sequences = [
  ...product([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]),
];

assertEquals(sequences, [
  [1, 4, 7],
  [1, 4, 8],
  [1, 4, 9],
  [1, 5, 7],
  [1, 5, 8],
  [1, 5, 9],
  [1, 6, 7],
  [1, 6, 8],
  [1, 6, 9],
  [2, 4, 7],
  [2, 4, 8],
  [2, 4, 9],
  [2, 5, 7],
  [2, 5, 8],
  [2, 5, 9],
  [2, 6, 7],
  [2, 6, 8],
  [2, 6, 9],
  [3, 4, 7],
  [3, 4, 8],
  [3, 4, 9],
  [3, 5, 7],
  [3, 5, 8],
  [3, 5, 9],
  [3, 6, 7],
  [3, 6, 8],
  [3, 6, 9],
]);
```

### Accumulate

Creates an iterator that returns accumulated sums or accumulated results from
custom functions.

The function defaults to addition. The function should accept two arguments, an
accumulated total and a value from the iterable.

If an initial value is provided, the accumulation will start with that value and
the output will have one more element than the input iterable.

```typescript
import { assertEquals } from "@std/assert";
import { accumulate } from "jsr:@gabelluardo/itertools";

const sums = [...accumulate([1, 2, 3, 4])];

assertEquals(sums, [1, 3, 6, 10]);
```

<!-- ### Power Set

The set of all subsets of the given `iterable`. Equivalent to running
`combinations` with `0 <= r <= iterable.length` and flattening the results. The
first subset is the empty set given when `r = 0`.

```ts
import { assertEquals } from "@std/assert";
import { powerSet } from "jsr:@gabelluardo/itertools";

const sequences = [...powerSet([1, 2, 3])];

assertEquals(sequences, [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]);
``` -->
