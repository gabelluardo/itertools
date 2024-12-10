import { unimplemented } from "@std/assert/unimplemented";

export function product<T extends unknown[]>(
  ..._iterables: { [K in keyof T]: Iterable<T[K]> }
): Generator<T> {
  unimplemented();
}
